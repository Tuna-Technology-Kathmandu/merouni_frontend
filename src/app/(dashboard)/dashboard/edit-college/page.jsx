'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import AdmissionItem from '../addCollege/AdmissionItem'
import GallerySection from '../addCollege/GallerySection'
import VideoSection from '../addCollege/VideoSection'
import {
  fetchAllCourse,
  fetchAllUniversity,
  getUniversityBySlug
} from '../addCollege/actions'
import { Upload } from 'lucide-react'

const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})

const FileUploadWithPreview = ({
  onUploadComplete,
  label,
  defaultPreview = null,
  accept = 'image/*',
  onClear
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(defaultPreview)

  useEffect(() => {
    setPreview(defaultPreview)
  }, [defaultPreview])

  const handleClear = () => {
    setPreview(null)
    if (onClear) onClear()
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }

    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', file.name)
    formData.append('altText', file.name)
    formData.append('description', '')
    formData.append('file', file)
    formData.append('authorId', '1')

    try {
      const response = await axios.post(
        'https://uploads.merouni.com/api/v1/media/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const data = response.data
      if (data.success === false) {
        toast.error(data.message || 'Upload failed.')
        return
      }

      toast.success('File uploaded successfully!')
      onUploadComplete(data.media.url)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error(error.response?.data?.message || 'Upload failed.')
      setPreview(defaultPreview)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <label className='block mb-2'>{label}</label>
      <div className='border-2 border-dashed border-gray-300 rounded-lg p-6'>
        <div className='flex flex-col items-center'>
          {!preview && <Upload className='h-12 w-12 text-gray-400' />}
          <div className='mt-4 text-center'>
            <label className='cursor-pointer'>
              <span className='text-blue-500 hover:text-blue-600'>
                {preview ? 'Change file' : 'Click to upload'}
              </span>
              <input
                type='file'
                className='hidden'
                onChange={handleFileUpload}
                accept={accept}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
        {isUploading && (
          <div className='mt-4 text-center text-sm text-gray-500'>
            Uploading...
          </div>
        )}
        {preview && (
          <div className='mt-4'>
            {accept === 'image/*' ? (
              <img
                src={preview}
                alt='Preview'
                className='mx-auto max-h-40 rounded-lg'
              />
            ) : (
              <div className='text-center'>
                <p className='text-sm text-gray-600'>PDF File Selected</p>
                <a
                  href={preview}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 hover:underline'
                >
                  View File
                </a>
              </div>
            )}
          </div>
        )}
        <div className='flex justify-end'>
          <button
            type='button'
            onClick={handleClear}
            className='bg-red-500 text-white p-2 rounded-md'
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

const EditCollegePage = () => {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [courses, setCourses] = useState([])
  const [allUniversity, setAllUniversity] = useState([])
  const [uniSlug, setUniSlug] = useState('')
  const [collectUni, setCollectUni] = useState([])
  const [collectUniError, setCollectUniError] = useState('')
  const [loadingPrograms, setLoadingPrograms] = useState(false)
  const [courseSearch, setCourseSearch] = useState('')
  const [contentValue, setContentValue] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState({
    logo: '',
    featured: '',
    images: [],
    videos: []
  })

  const author_id = useSelector((state) => state.user.data.id)

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
      college_broucher: '',
      facilities: [
        {
          title: '',
          description: '',
          icon: ''
        }
      ],
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

  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility
  } = useFieldArray({ control, name: 'facilities' })

  useEffect(() => {
    loadCollegeData()
    loadCourses()
    loadUniversities()
  }, [])

  // Fetch university details for programs
  const fetchUniversityDetails = async (slugs) => {
    if (!slugs) return
    setLoadingPrograms(true)
    setCollectUniError('')
    try {
      const universityData = await getUniversityBySlug(slugs)
      const programTitles = universityData?.programs?.map((p) => p.title) || []
      setCollectUni(programTitles)
    } catch (error) {
      console.error('Error fetching university details:', error)
      setCollectUniError('Failed to load programs for this university')
    } finally {
      setLoadingPrograms(false)
    }
  }

  useEffect(() => {
    fetchUniversityDetails(uniSlug)
  }, [uniSlug])

  // Set university_id when allUniversity is loaded and we have college data
  useEffect(() => {
    // This will be handled in loadCollegeData after allUniversity loads
    // But we need to set it if it wasn't set during initial load
    const currentUniId = getValues('university_id')
    if (allUniversity.length > 0 && !currentUniId && uniSlug) {
      // Try to find by slug if we have it
      const university = allUniversity.find((u) => u.slugs === uniSlug)
      if (university) {
        setValue('university_id', Number(university.id), {
          shouldValidate: true,
          shouldDirty: true
        })
      }
    }
  }, [allUniversity, uniSlug])

  // Filter courses based on selected university
  const filteredPrograms = useMemo(() => {
    return courses.filter((course) => collectUni.includes(course.title.trim()))
  }, [courses, collectUni])

  const loadCollegeData = async () => {
    try {
      setLoading(true)
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college/institution/my-college`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      let collegeData = await response.json()
      collegeData = collegeData.item

      if (!collegeData) {
        toast.error('College data not found')
        return
      }

      // Basic Information
      setValue('id', collegeData.id)
      setValue('name', collegeData.name)
      setValue('institute_type', collegeData.institute_type)
      setValue(
        'institute_level',
        JSON.parse(collegeData.institute_level || '[]')
      )
      setValue('description', collegeData.description)
      setValue('content', collegeData.content || '')
      setContentValue(collegeData.content || '')
      setValue('website_url', collegeData.website_url)
      setValue('google_map_url', collegeData.google_map_url)
      setValue('is_featured', collegeData.isFeatured === 1)
      setValue('pinned', collegeData.pinned === 1)

      // Set university_id from university data
      if (collegeData.university) {
        setUniSlug(collegeData.university.slugs)
        // Set university_id directly - will be set after allUniversity loads
        if (allUniversity.length > 0) {
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
        .filter((item) => item.file_type === 'video' && item.file_url)
        .map((vid) => ({
          url: vid.file_url,
          file_type: 'video'
        }))

      setUploadedFiles({
        logo: collegeData.college_logo || '',
        featured: collegeData.featured_img || '',
        images,
        videos
      })

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

      // Facilities
      const facilityData = collegeData.collegeFacility?.length
        ? collegeData.collegeFacility.map((facility) => ({
            title: facility.title || '',
            description: facility.description || '',
            icon: facility.icon || ''
          }))
        : [
            {
              title: '',
              description: '',
              icon: ''
            }
          ]
      setValue('facilities', facilityData)

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

      // College brochure
      if (collegeData.college_broucher) {
        setValue('college_broucher', collegeData.college_broucher)
      }
    } catch (err) {
      console.error('Error loading college data:', err)
      toast.error('Failed to load college data')
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async () => {
    try {
      const data = await fetchAllCourse()
      setCourses(data)
    } catch (err) {
      console.error('Error loading courses:', err)
    }
  }

  const loadUniversities = async () => {
    try {
      const data = await fetchAllUniversity()
      setAllUniversity(data)
    } catch (err) {
      console.error('Error loading universities:', err)
    }
  }

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    console.log('Form errors:', errors)
    try {
      setSubmitting(true)

      // Filter empty admissions
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
      if (data.university_id) {
        data.university_id = parseInt(data.university_id)
      }

      if (data.courses && data.courses.length > 0) {
        data.courses = data.courses.map((course) => parseInt(course))
      } else {
        data.courses = []
      }

      // Set file uploads
      data.college_logo = uploadedFiles.logo
      data.featured_img = uploadedFiles.featured
      data.images = [...uploadedFiles.images, ...uploadedFiles.videos]
      data.college_broucher = data.college_broucher || ''

      // Filter out empty facilities
      data.facilities = data.facilities.filter(
        (facility) =>
          facility.title.trim() !== '' ||
          facility.description.trim() !== '' ||
          facility.icon.trim() !== ''
      )

      // If we have no images after remove button clicked, send empty values
      if (data.images.length === 0) {
        data.images = [
          {
            file_type: '',
            url: ''
          }
        ]
      }

      // Set author_id
      data.author_id = author_id

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college/institution/my-college`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update college')
      }

      toast.success('College updated successfully!')
    } catch (err) {
      console.error('Error updating college:', err)
      toast.error(err.message || 'Failed to update college')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='p-4 flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return (
    <div className='p-4 flex flex-col h-[calc(100vh-120px)]'>
      <h1 className='text-2xl font-bold mb-4'>Edit College Information</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col flex-1 overflow-hidden'
      >
        <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
          {/* Basic Information Section */}
          <div className='bg-white rounded-lg shadow p-6'>
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

              <div>
                <label className='block mb-2'>University *</label>
                <select
                  {...register('university_id', { required: true })}
                  className='w-full p-2 border rounded'
                  onChange={(e) => {
                    const selectedId = Number(e.target.value)
                    setValue('university_id', selectedId, {
                      shouldValidate: true,
                      shouldDirty: true
                    })

                    // Find the selected university to get its slug
                    const selectedUni = allUniversity.find(
                      (u) => u.id === selectedId
                    )
                    if (selectedUni) {
                      setUniSlug(selectedUni.slugs)
                    }
                  }}
                >
                  <option value=''>Select University</option>
                  {allUniversity.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.fullname}
                    </option>
                  ))}
                </select>
                {errors.university_id && (
                  <span className='text-red-500 text-sm'>
                    This field is required
                  </span>
                )}
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
                  initialData={contentValue}
                  onChange={(content) => {
                    setValue('content', content)
                    setContentValue(content)
                  }}
                />
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Programs</h2>
              <div className='w-1/3'>
                <input
                  type='text'
                  placeholder='Search programs...'
                  className='w-full p-2 border rounded'
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto'>
                  {filteredPrograms
                    .filter((program) =>
                      program.title
                        .toLowerCase()
                        .includes(courseSearch.toLowerCase())
                    )
                    .map((course) => {
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

          {/* Media Section */}
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

            <GallerySection
              control={control}
              setValue={setValue}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              getValues={getValues}
            />

            <VideoSection
              control={control}
              setValue={setValue}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              getValues={getValues}
            />

            <div className='md:col-span-2'>
              <FileUploadWithPreview
                label='College Brochure (PDF)'
                onUploadComplete={(url) => {
                  setValue('college_broucher', url)
                }}
                onClear={() => {
                  setValue('college_broucher', '')
                }}
                defaultPreview={getValues('college_broucher')}
                accept='application/pdf'
              />
            </div>
          </div>

          {/* Facilities Section */}
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Facilities</h2>
              <button
                type='button'
                onClick={() =>
                  appendFacility({
                    title: '',
                    description: '',
                    icon: ''
                  })
                }
                className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
              >
                Add Facility
              </button>
            </div>

            {facilityFields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
              >
                <div>
                  <label className='block mb-2'>Title *</label>
                  <input
                    {...register(`facilities.${index}.title`, {
                      required: true
                    })}
                    className='w-full p-2 border rounded'
                  />
                  {errors.facilities?.[index]?.title && (
                    <span className='text-red-500'>This field is required</span>
                  )}
                </div>
                <div>
                  <label className='block mb-2'>Description</label>
                  <textarea
                    {...register(`facilities.${index}.description`)}
                    className='w-full p-2 border rounded'
                  />
                </div>
                <div>
                  <label className='block mb-2'>Icon Image</label>
                  <FileUploadWithPreview
                    onUploadComplete={(url) => {
                      setValue(`facilities.${index}.icon`, url)
                    }}
                    defaultPreview={getValues(`facilities.${index}.icon`)}
                  />
                </div>
                <div className='flex items-end'>
                  <button
                    type='button'
                    onClick={() => {
                      if (facilityFields.length > 1) {
                        removeFacility(index)
                      } else {
                        setValue(`facilities.${index}`, {
                          title: '',
                          description: '',
                          icon: ''
                        })
                      }
                    }}
                    className='bg-red-500 text-white px-4 h-[20%] w-full rounded hover:bg-red-600'
                  >
                    {facilityFields.length > 1 ? 'Remove' : 'Clear'}
                  </button>
                </div>
              </div>
            ))}
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
            <h2 className='text-xl font-semibold mb-4'>Contact Information</h2>
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
        </div>

        {/* Submit Button - Sticky Footer */}
        <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-center z-10 shadow-lg'>
          <button
            type='submit'
            disabled={submitting}
            onClick={(e) => {
              // Debug: log form errors
              if (Object.keys(errors).length > 0) {
                console.log('Form errors:', errors)
                toast.error('Please fix form errors before submitting')
              }
            }}
            className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 cursor-pointer'
          >
            {submitting ? 'Updating...' : 'Update College'}
          </button>
          {Object.keys(errors).length > 0 && (
            <div className='ml-4 text-red-500 text-sm'>
              Please fix form errors
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default EditCollegePage
