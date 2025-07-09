'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useForm, useFieldArray } from 'react-hook-form'
import {
  createCollege,
  fetchUniversities,
  fetchAllCourse,
  fetchAllUniversity,
  getUniversityBySlug
} from './actions'
import { useSelector } from 'react-redux'
import FileUpload from './FileUpload'
import Table from '@/app/components/Table'
import { getColleges } from '@/app/action'
import { Edit2, Trash2 } from 'lucide-react'
import { Globe, MapPin } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import AdmissionItem from './AdmissionItem'
import ConfirmationDialog from './ConfirmationDialog'

const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})
import { useDebounce } from 'use-debounce'
import GallerySection from './GallerySection'
import VideoSection from './VideoSection'
import useAdminPermission from '@/core/hooks/useAdminPermission'

export default function CollegeForm() {
  //for university search
  const [uniSearch, setUniSearch] = useState('')
  const [debouncedUni] = useDebounce(uniSearch, 300)
  const [universities, setUniversities] = useState([])
  const [loadUni, setLoadUni] = useState(false)
  const [showUniDrop, setShowUniDrop] = useState(false)
  const [hasSelectedUni, setHasSelectedUni] = useState(false)

  // for programs that is related to selected University
  const [uniSlug, setUniSlug] = useState('')
  const [collectUni, setCollectUni] = useState([])
  const [collectUniError, setCollectUniError] = useState('')

  //show programs only fro selected University;
  const [loadingPrograms, setLoadingPrograms] = useState(false)

  const [allUniversity, setAllUniversity] = useState([])

  //for allcourse
  const [courses, setCourses] = useState([])
  const [courseSearch, setCourseSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [uploadedFiles, setUploadedFiles] = useState({
    logo: '',
    featured: '',
    images: [],
    videos: []
  })
  const [isOpen, setIsOpen] = useState(false)
  const [colleges, setColleges] = useState([])
  const [tableloading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [editing, setEditing] = useState(false)

  const author_id = useSelector((state) => state.user.data.id)

  const { requireAdmin } = useAdminPermission()
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      author_id: author_id,
      institute_type: 'Private',
      institute_level: [],
      courses: [],
      description: '',
      content: '',
      website_url: '',
      google_map_url: '',
      college_logo: '',
      featured_img: '',
      is_featured: false,
      pinned: false,
      images: [],
      address: {
        country: '',
        state: '',
        city: '',
        street: '',
        postal_code: ''
      },
      contacts: ['', ''],
      members: [
        {
          name: '',
          contact_number: '',
          role: '',
          description: ''
        }
      ],
      admissions: [
        {
          course_id: '',
          eligibility_criteria: '',
          admission_process: '',
          fee_details: '',
          description: ''
        }
      ]
    }
  })

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember
  } = useFieldArray({ control, name: 'members' })

  const {
    fields: admissionFields,
    append: appendAdmission,
    remove: removeAdmission
  } = useFieldArray({ control, name: 'admissions' })

  const onSubmit = async (data) => {
    if (!data.courses || data.courses.length === 0) {
      toast.error('Please select at least one program')
      return
    }

    try {
      setSubmitting(true)

      //   this makes empty [] when all clear is done
      data.admissions = data.admissions.filter((admission) => {
        return Object.values(admission).some((val) => {
          if (typeof val === 'string') return val.trim() !== ''
          return val !== null && val !== undefined
        })
      })
      // Convert boolean values to numbers
      data.is_featured = +data.is_featured
      data.pinned = +data.pinned
      // Convert IDs to numbers
      data.university_id = parseInt(data.university_id)

      data.courses = data.courses.map((course) => parseInt(course))

      data.college_logo = uploadedFiles.logo
      data.featured_img = uploadedFiles.featured

      //before sending the image , we combine all selected images and videos
      data.images = [...uploadedFiles.images, ...uploadedFiles.videos]

      //if we have no images after remove button clicked in allimages, we send this empty values
      if (editing && data.images.length === 0) {
        data.images = [
          {
            file_type: '',
            url: ''
          }
        ]
      }

      await createCollege(data)

      // Show success message
      editing
        ? toast.success('College updated successfully!')
        : toast.success('College created successfully!')

      // Reset form and state
      setEditing(false)
      reset()
      setUploadedFiles({
        logo: '',
        featured: '',
        images: [],
        videos: []
      })
      setUniSearch('')
    } catch (error) {
      toast.error(error.message || 'Failed to create college')
    } finally {
      setSubmitting(false)
    }
  }
  //for uni in add college
  useEffect(() => {
    if (hasSelectedUni) return

    const getUniversities = async () => {
      setLoadUni(true)
      try {
        const universityList = await fetchUniversities(debouncedUni)
        setUniversities(universityList)
        setShowUniDrop(true)
        setLoadUni(false)
      } catch (error) {
        console.error('Error fetching universities:', error)
      }
    }
    if (debouncedUni !== '') {
      getUniversities()
    } else {
      setShowUniDrop(false)
    }
  }, [debouncedUni])

  //search college
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
  )
  //for all fetching of college
  useEffect(() => {
    const getCourses = async () => {
      try {
        const courseList = await fetchAllCourse()
        setCourses(courseList)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }

    getCourses()
  }, [])

  console.log('courses', courses)
  console.log('collectUni', collectUni)

  //for all fetching of university
  useEffect(() => {
    const getUniversities = async () => {
      try {
        const uniList = await fetchAllUniversity()
        setAllUniversity(uniList)
      } catch (error) {
        console.error('Error all university:', error)
      }
    }

    getUniversities()
  }, [])

  useEffect(() => {
    const loadColleges = async () => {
      setLoading(true)
      setTableLoading(true)
      try {
        const response = await getColleges()
        setColleges(response.items)
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          total: response.pagination.totalCount
        })
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
        setTableLoading(false)
      }
    }
    loadColleges()
  }, [])

  //columnes
  const columns = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'College Name',
      accessorKey: 'name'
    },
    {
      header: 'Type',
      accessorKey: 'institute_type'
    },
    {
      header: 'Country',
      accessorKey: 'address.country'
    },
    {
      header: 'District',
      accessorKey: 'address.state'
    },
    {
      header: 'City',
      accessorKey: 'address.city'
    },
    {
      header: 'University ID',
      accessorKey: 'university_id'
    },
    {
      header: 'Featured',
      accessorKey: 'isFeatured',
      cell: ({ getValue }) => (getValue() ? 'Yes' : 'No')
    },
    {
      header: 'Pinned',
      accessorKey: 'pinned',
      cell: ({ getValue }) => (getValue() ? 'Yes' : 'No')
    },
    {
      header: 'Courses',
      accessorKey: 'collegeCourses',
      cell: ({ row }) => {
        const courses = row.original.collegeCourses || []
        return (
          <div className='flex flex-wrap gap-1'>
            {courses.map((course) => (
              <span
                key={course.id}
                className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'
              >
                {course.program.title}
              </span>
            ))}
          </div>
        )
      }
    },
    {
      header: 'Website',
      accessorKey: 'website_url',
      cell: ({ getValue }) => {
        const url = getValue()
        return url ? (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            <Globe className='inline w-4 h-4' /> Visit
          </a>
        ) : (
          'N/A'
        )
      }
    },
    {
      header: 'Google Maps',
      accessorKey: 'google_map_url',
      cell: ({ getValue }) => {
        const url = getValue()
        return url ? (
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            <MapPin className='inline w-4 h-4' /> View Map
          </a>
        ) : (
          'N/A'
        )
      }
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ getValue }) => {
        const text = getValue()
        return text?.length > 50 ? text.substring(0, 50) + '...' : text || 'N/A'
      }
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleEdit(row.original.slugs)}
            className='p-1 text-blue-600 hover:text-blue-800'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]

  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      const updatedColleges = await getColleges()
      setColleges(updatedColleges.items)
      setEditing(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false) // Close the dialog without deleting
    setDeleteId(null) // Reset the delete ID
  }
  const handleEdit = async (slug) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      // First reset the form to clear any existing values
      reset()

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      let collegeData = await response.json()
      collegeData = collegeData.item

      // Basic Information
      setValue('id', collegeData.id)
      setValue('name', collegeData.name)
      setValue('institute_type', collegeData.institute_type)
      setValue(
        'institute_level',
        JSON.parse(collegeData.institute_level || '[]')
      )
      setValue('description', collegeData.description)
      setValue('content', collegeData.content)
      setValue('website_url', collegeData.website_url)
      setValue('google_map_url', collegeData.google_map_url)
      setValue('is_featured', collegeData.isFeatured === 1)
      setValue('pinned', collegeData.pinned === 1)

      // Set university_id from university data
      if (collegeData.university) {
        setHasSelectedUni(true)
        setUniSearch(collegeData.university.fullname)
        setUniSlug(collegeData.university.slugs)

        const universityId = allUniversity.find(
          (u) => u.fullname === collegeData.university.fullname
        )?.id

        if (universityId) {
          setValue('university_id', Number(universityId), {
            shouldValidate: true,
            shouldDirty: true
          })
        }
      }

      // Set programs
      const programIds =
        collegeData.collegeCourses
          ?.map((course) => {
            const foundCourse = courses.find(
              (c) => c.title === course.program.title
            )
            return foundCourse?.id
          })
          .filter((id) => id !== undefined) || []

      // Remove duplicates and set values
      const uniqueProgramIds = [...new Set(programIds)]
      setValue('courses', uniqueProgramIds)

      // Address
      if (collegeData.collegeAddress) {
        setValue('address.country', collegeData.collegeAddress.country)
        setValue('address.state', collegeData.collegeAddress.state)
        setValue('address.city', collegeData.collegeAddress.city)
        setValue('address.street', collegeData.collegeAddress.street)
        setValue('address.postal_code', collegeData.collegeAddress.postal_code)
      }

      // Contacts
      const contacts = collegeData.collegeContacts?.map(
        (contact) => contact.contact_number
      ) || ['', '']
      setValue('contacts', contacts)

      // Images
      const galleryItems = collegeData.collegeGallery || []

      const images = galleryItems
        .filter((item) => item.file_type === 'image' && item.file_url)
        .map((img) => ({
          url: img.file_url,
          file_type: 'image'
        }))

      const videos = galleryItems
        .filter((item) => item.file_type === 'video')
        .map((vid) => ({
          url: vid.file_url,
          file_type: 'video'
        }))

      setUploadedFiles({
        logo: collegeData.college_logo || '',
        featured: collegeData.featured_img || '',
        images: images.length === 1 && !images[0].url ? [] : images,
        videos
      })

      setValue('images', [...images, ...videos])

      // Members
      const memberData = collegeData.collegeMembers?.length
        ? collegeData.collegeMembers
        : [
            {
              name: '',
              contact_number: '',
              role: '',
              description: ''
            }
          ]
      setValue('members', memberData)

      // Admissions
      const admissionData = collegeData.collegeAdmissions?.length
        ? collegeData.collegeAdmissions.map((admission) => {
            const courseId = courses.find(
              (c) => c.title === admission.program.title
            )?.id
            return {
              course_id: courseId || '',
              eligibility_criteria: admission.eligibility_criteria || '',
              admission_process: admission.admission_process || '',
              fee_details: admission.fee_details || '',
              description: admission.description || ''
            }
          })
        : [
            {
              course_id: '',
              eligibility_criteria: '',
              admission_process: '',
              fee_details: '',
              description: ''
            }
          ]
      setValue('admissions', admissionData)
    } catch (error) {
      console.error('Error fetching college data:', error)
      toast.error('Failed to fetch college data')
    } finally {
      setLoading(false)
    }
  }

  const loadColleges = async (page = 1) => {
    try {
      const response = await getColleges(null, null, 10, page)

      setColleges(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      toast.error('Failed to load colleges')
      console.error('Error loading colleges:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    console.log('q', query)
    if (!query) {
      // getColleges();
      loadColleges()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setColleges(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setColleges([])
      }
    } catch (error) {
      console.error('Error fetching college search results:', error.message)
      setColleges([])
    }
  }

  //watch form data
  const formData = watch()

  useEffect(() => {
    console.log('Form data:', formData)
  }, [formData]) // Runs every time formData changes

  const fetchUniversityDetails = async (slugs) => {
    try {
      setLoadingPrograms(true)
      setCollectUniError('')
      const universityData = await getUniversityBySlug(slugs)
      setCollectUni(universityData.programs || [])
    } catch (error) {
      setCollectUniError(error.message)
    } finally {
      setLoadingPrograms(false)
    }
  }
  useEffect(() => {
    fetchUniversityDetails(uniSlug)
  }, [uniSlug])

  const filteredPrograms = useMemo(() => {
    return courses.filter((course) => collectUni.includes(course.title.trim()))
  }, [courses, collectUni])

  return (
    <>
      <div className='text-2xl mr-auto p-4 ml-14 font-bold'>
        <ToastContainer />
        <div className='text-center'>College Management</div>
        <div className='flex justify-left mt-2'>
          <button
            className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
            onClick={() => {
              setIsOpen(!isOpen)
            }}
          >
            {isOpen ? `Hide form` : `Show form`}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='container mx-auto p-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block mb-2'>College Name *</label>
                  <input
                    {...register('name', { required: true })}
                    className='w-full p-2 border rounded'
                  />
                  {errors.name && (
                    <span className='text-red-500'>This field is required</span>
                  )}
                </div>

                <div>
                  <label className='block mb-2'>Institute Type *</label>
                  <select
                    {...register('institute_type', { required: true })}
                    className='w-full p-2 border rounded'
                  >
                    <option value='Private'>Private</option>
                    <option value='Public'>Public</option>
                  </select>
                </div>

                <div>
                  <label className='block mb-2'>Institute Level</label>
                  <div className='space-y-2'>
                    {['School', 'College'].map((level) => (
                      <label key={level} className='flex items-center'>
                        <input
                          type='checkbox'
                          {...register('institute_level')}
                          value={level}
                          className='mr-2'
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>

                <div className='relative'>
                  <label className='block mb-2'>University *</label>

                  <input
                    type='text'
                    className='w-full p-2 border rounded'
                    value={uniSearch}
                    onChange={(e) => {
                      setUniSearch(e.target.value)
                      setHasSelectedUni(false)
                    }}
                    placeholder='Search University'
                  />

                  {/* Hidden input for react-hook-form binding */}
                  <input
                    type='hidden'
                    {...register('university_id', { required: true })}
                  />
                  {loadUni ? (
                    <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                      Loading...
                    </div>
                  ) : showUniDrop ? (
                    universities.length > 0 ? (
                      <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
                        {universities.map((uni) => (
                          <li
                            key={uni.id}
                            className='p-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                              setValue('university_id', Number(uni.id))
                              setUniSearch(uni.fullname)
                              setShowUniDrop(false)
                              setHasSelectedUni(true)
                              setUniSlug(uni.slugs)
                            }}
                          >
                            {uni.fullname}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                        No universities found.
                      </div>
                    )
                  ) : null}
                </div>

                <div className='md:col-span-2'>
                  <label className='block mb-2'>Description</label>
                  <textarea
                    {...register('description')}
                    className='w-full p-2 border rounded h-24'
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='block mb-2'>Content</label>

                  <CKUni
                    id='editor-content'
                    initialData={getValues('content')}
                    onChange={(data) => setValue('content', data)}
                  />
                </div>
              </div>
            </div>
            {editing ? <input type='hidden' {...register('id')} /> : <></>}
            {/* Courses Section */}

            {/* Programs Section */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Programs</h2>
              </div>

              {loadingPrograms ? (
                <p>Loading programs...</p>
              ) : collectUniError ? (
                <p className='text-red-500'>{collectUniError}</p>
              ) : (
                <>
                  <div className='text-sm text-gray-500 mb-2'>
                    {getValues('courses')?.length || 0} programs selected
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-scroll'>
                    {filteredPrograms.map((course) => {
                      const isChecked = getValues('courses')?.includes(
                        course.id
                      )
                      return (
                        <label key={course.id} className='flex items-center'>
                          <input
                            type='checkbox'
                            value={course.id}
                            checked={isChecked}
                            onChange={(e) => {
                              const currentCourses = getValues('courses') || []
                              if (e.target.checked) {
                                setValue('courses', [
                                  ...currentCourses,
                                  course.id
                                ])
                              } else {
                                setValue(
                                  'courses',
                                  currentCourses.filter(
                                    (id) => id !== course.id
                                  )
                                )
                              }
                            }}
                            className='mr-2'
                          />
                          {course.title}
                        </label>
                      )
                    })}
                    {filteredPrograms.length === 0 && (
                      <p className='text-gray-500 col-span-full'>
                        {collectUni.length > 0
                          ? 'No matching programs found for the selected university'
                          : 'No Programs Available'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/*author section */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Author Information</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block mb-2'>Author ID *</label>
                  <input
                    {...register('author_id', { required: true })}
                    className='w-full p-2 border rounded '
                    disabled
                  />
                  {errors.author_id && (
                    <span className='text-red-500'>This field is required</span>
                  )}
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Media</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <FileUpload
                    label='College Logo'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, logo: url }))
                      setValue('college_logo', url)
                    }}
                    defaultPreview={uploadedFiles.logo}
                  />
                </div>
                <div>
                  <FileUpload
                    label='Featured Image'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, featured: url }))
                      setValue('featured_img', url)
                    }}
                    defaultPreview={uploadedFiles.featured}
                  />
                </div>
              </div>

              {/* for image only */}
              <GallerySection
                control={control}
                setValue={setValue}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                getValues={getValues}
              />

              {/* for videos only */}

              <VideoSection
                control={control}
                setValue={setValue}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                getValues={getValues}
              />
            </div>

            {/* Members Section */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Members</h2>
                <button
                  type='button'
                  onClick={() =>
                    appendMember({
                      name: '',
                      contact_number: '',
                      role: '',
                      description: ''
                    })
                  }
                  className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                >
                  Add Member
                </button>
              </div>

              {memberFields.map((field, index) => (
                <div
                  key={field.id}
                  className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
                >
                  <div>
                    <label className='block mb-2'>Name</label>
                    <input
                      {...register(`members.${index}.name`)}
                      className='w-full p-2 border rounded'
                    />
                  </div>
                  <div>
                    <label className='block mb-2'>Role</label>
                    <select
                      {...register(`members.${index}.role`)}
                      className='w-full p-2 border rounded'
                    >
                      <option value=''>Select Roles</option>
                      <option value='Principal'>Principal</option>
                      <option value='Professor'>Professor</option>
                      <option value='Lecturer'>Lecturer</option>
                      <option value='Admin'>Admin</option>
                      <option value='Staff'>Staff</option>
                    </select>
                  </div>
                  <div>
                    <label className='block mb-2'>Contact Number</label>
                    <input
                      {...register(`members.${index}.contact_number`)}
                      className='w-full p-2 border rounded'
                    />
                  </div>
                  <div>
                    <label className='block mb-2'>Description</label>
                    <textarea
                      {...register(`members.${index}.description`)}
                      className='w-full p-2 border rounded'
                    />
                  </div>
                  <button
                    type='button'
                    onClick={() => {
                      if (memberFields.length > 1) {
                        removeMember(index)
                      } else {
                        setValue(`members.${index}`, {
                          name: '',
                          contact_number: '',
                          role: '',
                          description: ''
                        })
                      }
                    }}
                    className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                  >
                    {memberFields.length > 1 ? 'Remove' : 'Clear'}
                  </button>
                </div>
              ))}
            </div>

            {/* Admissions Section */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Admissions</h2>
                <button
                  type='button'
                  onClick={() =>
                    appendAdmission({
                      course_id: '',
                      eligibility_criteria: '',
                      admission_process: '',
                      fee_details: '',
                      description: ''
                    })
                  }
                  className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                >
                  Add Admission
                </button>
              </div>

              {admissionFields.map((field, index) => {
                const courseId = getValues(`admissions.${index}.course_id`)
                const courseTitle =
                  courses.find((c) => c.id === courseId)?.title || ''
                return (
                  <AdmissionItem
                    key={field.id}
                    index={index}
                    remove={removeAdmission}
                    register={register}
                    setValue={setValue}
                    getValues={getValues}
                    admissionFields={admissionFields}
                    initialCourseTitle={courseTitle}
                  />
                )
              })}
            </div>

            {/* Address Section */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Address</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {['country', 'state', 'city', 'street', 'postal_code'].map(
                  (field) => (
                    <div key={field}>
                      <label className='block mb-2 capitalize'>
                        {field !== 'state'
                          ? `${field.replace('_', ' ')} *`
                          : 'District'}
                      </label>
                      <input
                        {...register(`address.${field}`)}
                        className='w-full p-2 border rounded'
                      />
                      {errors.address?.[field] && (
                        <span className='text-red-500'>
                          This field is required
                        </span>
                      )}
                    </div>
                  )
                )}
                <div>
                  <label className='block mb-2'>Google Map URL</label>
                  <input
                    {...register('google_map_url')}
                    className='w-full p-2 border rounded'
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>
                Contact Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block mb-2'>Website URL</label>
                  <input
                    {...register('website_url')}
                    className='w-full p-2 border rounded'
                  />
                </div>
                {[0, 1].map((index) => (
                  <div key={index}>
                    <label className='block mb-2'>Contact {index + 1}</label>
                    <input
                      {...register(`contacts.${index}`)}
                      className='w-full p-2 border rounded'
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Featured and Pinned */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>
                Additional Settings
              </h2>
              <div className='space-y-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    {...register('is_featured')}
                    className='mr-2'
                  />
                  Featured College
                </label>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    {...register('pinned')}
                    className='mr-2'
                  />
                  Pinned
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors'
            >
              {submitting
                ? editing
                  ? 'Updating...'
                  : 'Creating...'
                : editing
                  ? 'Update College'
                  : 'Create College'}
            </button>
          </form>
        </div>
      )}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this College? This action cannot be undone.'
      />
      {/*table*/}
      <Table
        loading={tableloading}
        data={colleges}
        columns={columns}
        pagination={pagination}
        onPageChange={(newPage) => loadColleges(newPage)}
        onSearch={handleSearch}
      />
    </>
  )
}
