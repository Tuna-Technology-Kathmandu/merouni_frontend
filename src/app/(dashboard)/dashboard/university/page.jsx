'use client'
import dynamic from 'next/dynamic'
import { Modal } from '../../../../components/CreateUserModal'
import { useState, useEffect, useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { fetchLevel } from './actions'
import { useDebounce } from 'use-debounce'
import { fetchAllCourse } from './actions'
import useAdminPermission from '@/hooks/useAdminPermission'
import GallerySection from './GallerySection'
import { usePageHeading } from '@/contexts/PageHeadingContext'
const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})

export default function UniversityForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const [isOpen, setIsOpen] = useState(false)
  const [universities, setUniversities] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  //for level search
  const [levelSearch, setLevelSearch] = useState('')
  const [debouncedLevel] = useDebounce(levelSearch, 300)
  const [levels, setLevels] = useState([])
  const [hasSelectedLevel, setHasSelectedLevel] = useState(false)

  //for allcourse
  const [courses, setCourses] = useState([])
  const [courseSearch, setCourseSearch] = useState('')

  const [editing, setEditing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    featured: '',
    gallery: []
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      fullname: '',
      author_id: author_id,
      country: '',
      state: '',
      city: '',
      street: '',
      postal_code: '',
      date_of_establish: '',
      type_of_institute: 'Public',
      description: '',
      contact: {
        faxes: '',
        poboxes: '',
        email: '',
        phone_number: ''
      },
      levels: [],
      // courses:[]
      programs: [],
      members: [
        {
          role: '',
          salutation: '',
          name: '',
          phone: '',
          email: ''
        }
      ],
      assets: {
        featured_image: '',
        videos: ''
      },
      featured_img: '',
      gallery: ['']
    }
  })

  const {
    fields: memberFields,
    append: appendMember,
    remove: removeMember
  } = useFieldArray({ control, name: 'members' })

  // Fetch universities on component mount
  useEffect(() => {
    setHeading('University Management')
    fetchUniversities()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const { requireAdmin } = useAdminPermission()

  const formData = watch()
  console.log('fromData', formData)

  //for courses
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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(courseSearch.toLowerCase())
  )
  const fetchUniversities = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/university?page=${page}`
      )
      const data = await response.json()
      setUniversities(data.items)
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.totalItems
      })
    } catch (error) {
      toast.error('Failed to fetch universities')
    } finally {
      setTableLoading(false)
    }
  }

  //for level searching
  useEffect(() => {
    if (hasSelectedLevel) return

    const getLevels = async () => {
      try {
        const levelList = await fetchLevel(debouncedLevel)
        setLevels(levelList)
      } catch (error) {
        console.error('Error fetching levels:', error)
      }
    }
    getLevels()
  }, [debouncedLevel])

  const onSubmit = async (data) => {
    try {
      // Format the data
      data.assets.featured_image = uploadedFiles.featured
      data.gallery = uploadedFiles.gallery.filter((url) => url)
      data.levels = data.levels.map((l) => parseInt(l))
      data.programs = Array.isArray(data.programs)
        ? data.programs.map((program) => parseInt(program))
        : []

      // Filter out invalid program IDs and verify they exist in available courses
      const validProgramIds = data.programs.filter(
        (id) =>
          !isNaN(id) &&
          id !== null &&
          id !== undefined &&
          courses.some((course) => course.id === id)
      )

      // Optional: Show error if no valid programs selected
      if (validProgramIds.length === 0 && courses.length > 0) {
        toast.error('Please select at least one valid program')
        return
      }

      // Use only validated programs
      data.programs = validProgramIds

      const url = `${process.env.baseUrl}${process.env.version}/university`
      const method = 'POST'
      console.log('before submitting uni', data)
      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      toast.success(
        editing
          ? 'University updated successfully!'
          : 'University created successfully!'
      )
      setEditing(false)
      reset()
      setUploadedFiles({ featured: '', gallery: [] })
      fetchUniversities()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save university')
    }
  }

  const handleEdit = async (slugs) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/university/${slugs}`
      )
      const data = await response.json()
      const university = data
      console.log('university', university)

      // Set basic fields
      setValue('id', university.id)
      setValue('fullname', university.fullname)
      setValue('country', university.country)
      setValue('state', university.state)
      setValue('city', university.city)
      setValue('street', university.street)
      setValue('postal_code', university.postal_code)
      setValue('date_of_establish', university.date_of_establish)
      setValue('type_of_institute', university.type_of_institute)
      setValue('description', university.description)

      // Set contact information
      setValue('contact', university.contact)

      // Set levels
      setValue('levels', university.levels || [])
      university?.levels?.forEach((element) => {
        const checkbox = document.querySelector(
          `input[type="checkbox"][value="${element}"][identity="level"]`
        )
        if (checkbox && !checkbox.checked) {
          checkbox.click()
        }
      })

      // Map program names to their corresponding IDs
      const programIds =
        university.programs
          ?.map((programName) => {
            // Find the course that matches the program name
            const matchingCourse = courses.find(
              (course) => course.title === programName
            )
            return matchingCourse ? matchingCourse.id : null
          })
          .filter((id) => id !== null) || []

      // Set the program IDs in the form
      setValue('programs', programIds)

      // Check the corresponding checkboxes
      programIds.forEach((id) => {
        const checkbox = document.querySelector(
          `input[type="checkbox"][value="${id}"][name="programs"]`
        )
        if (checkbox && !checkbox.checked) {
          checkbox.click()
        }
      })

      // Set members
      setValue('members', university.members)

      //set featured_image that means logo
      setValue('featured_img', university.featured_img || '')

      // Set assets and gallery
      setUploadedFiles({
        featured: university.assets?.featured_image || '',
        gallery: university.gallery || ['']
      })
      setValue('assets.videos', university.assets?.videos || '')
    } catch (error) {
      toast.error('Failed to fetch university details')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id) // Store the ID of the item to delete
      setIsDialogOpen(true) // Open the confirmation dialog
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false) // Close the dialog without deleting
    setDeleteId(null) // Reset the delete ID
  }
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/university?id=${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchUniversities()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false) // Close the dialog
      setDeleteId(null) // Reset the delete ID
    }
  }
  const columns = [
    {
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Name',
      accessorKey: 'fullname',
      cell: ({ row }) => {
        const name = row.original.fullname
        const type = row.original.type_of_institute
        return (
          <div className='flex items-center gap-2'>
            <span>{name}</span>
            {type && (
              <span className='px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                {type}
              </span>
            )}
          </div>
        )
      }
    },
    {
      header: 'Location',
      accessorKey: 'address',
      cell: ({ row }) => {
        const data = row.original
        return `${data.city}, ${data.state}, ${data.country}`
      }
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

  const handleSearch = async (query) => {
    if (!query) {
      fetchUniversities()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/university?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            total: data.totalItems
          })
        }
      } else {
        console.error('Error fetching university:', response.statusText)
        setUniversities([])
      }
    } catch (error) {
      console.error('Error fetching university search results:', error.message)
      setUniversities([])
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (value === '') {
      handleSearch('')
    } else {
      const timeoutId = setTimeout(() => {
        handleSearch(value)
      }, 300)
      setSearchTimeout(timeoutId)
    }
  }

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}
          <div className='relative w-full max-w-md'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-4 h-4 text-gray-500' />
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search universities...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <button
              className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                reset()
                setUploadedFiles({ featured: '', gallery: [] })
              }}
            >
              Add University
            </button>
          </div>
        </div>
        <ToastContainer />

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={editing ? 'Edit University' : 'Add University'}
          className='max-w-5xl'
        >
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                {/* Basic Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Basic Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block mb-2'>University Name *</label>
                      <input
                        {...register('fullname', {
                          required: 'University name is required',
                          minLength: {
                            value: 3,
                            message: 'Name must be at least 3 characters long'
                          }
                        })}
                        className='w-full p-2 border rounded'
                      />
                      {errors.fullname && (
                        <span className='text-red-500'>
                          {errors.fullname.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className='block mb-2'>Type of Institute *</label>
                      <select
                        {...register('type_of_institute', { required: true })}
                        className='w-full p-2 border rounded'
                      >
                        <option value='Public'>Public</option>
                        <option value='Private'>Private</option>
                      </select>
                    </div>

                    <div>
                      <label className='block mb-2'>
                        Date of Establishment *
                      </label>
                      <input
                        type='date'
                        {...register('date_of_establish', { required: true })}
                        className='w-full p-2 border rounded'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block mb-2'>Description</label>

                    <CKUni
                      id='editor-content'
                      initialData={getValues('description')}
                      onChange={(data) => setValue('description', data)}
                    />
                  </div>
                </div>
                {editing ? <input type='hidden' {...register('id')} /> : <></>}

                {/* Address Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Address</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {['country', 'state', 'city', 'street', 'postal_code'].map(
                      (field) => (
                        <div key={field}>
                          <label className='block mb-2 capitalize'>
                            {field.replace('_', ' ')} *
                          </label>
                          <input
                            {...register(field, { required: true })}
                            className='w-full p-2 border rounded'
                          />
                          {errors[field] && (
                            <span className='text-red-500'>
                              This field is required
                            </span>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Contact Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {[
                      { key: 'faxes', label: 'Fax' },
                      { key: 'poboxes', label: 'P.O. Box' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone_number', label: 'Phone Number' }
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className='block mb-2'>{label}</label>
                        <input
                          {...register(`contact.${key}`)}
                          className='w-full p-2 border rounded'
                          type={key === 'email' ? 'email' : 'text'}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Members Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Members</h2>
                    <button
                      type='button'
                      onClick={() =>
                        appendMember({
                          role: '',
                          salutation: '',
                          name: '',
                          phone: '',
                          email: ''
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
                        <label className='block mb-2'>Role</label>
                        <input
                          {...register(`members.${index}.role`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>

                      <div>
                        <label className='block mb-2'>Salutation</label>
                        <input
                          {...register(`members.${index}.salutation`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>

                      <div>
                        <label className='block mb-2'>Name</label>
                        <input
                          {...register(`members.${index}.name`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>

                      <div>
                        <label className='block mb-2'>Phone</label>
                        <input
                          {...register(`members.${index}.phone`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>

                      <div>
                        <label className='block mb-2'>Email</label>
                        <input
                          type='email'
                          {...register(`members.${index}.email`)}
                          className='w-full p-2 border rounded'
                        />
                      </div>

                      {index > 0 && (
                        <button
                          type='button'
                          onClick={() => removeMember(index)}
                          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Media Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Media</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* Logo Upload */}
                    <div>
                      <FileUpload
                        label='Logo'
                        onUploadComplete={(url) => {
                          setValue('featured_img', url) // use outside featured_img
                        }}
                        defaultPreview={getValues('featured_img')}
                      />
                    </div>

                    {/* Featured Image Upload */}
                    <div>
                      <FileUpload
                        label='Featured Image'
                        onUploadComplete={(url) => {
                          setUploadedFiles((prev) => ({
                            ...prev,
                            featured: url
                          }))
                          setValue('assets.featured_image', url)
                        }}
                        defaultPreview={uploadedFiles.featured}
                      />
                    </div>

                    {/* Video URL */}
                    <div>
                      <label className='block mb-2'>Video URL</label>
                      <input
                        {...register('assets.videos')}
                        className='w-full p-2 border rounded'
                        placeholder='Enter video URL'
                      />
                    </div>
                  </div>

                  {/* this below is needed formultiple image */}
                  <GallerySection
                    control={control}
                    setValue={setValue}
                    uploadedFiles={uploadedFiles}
                    setUploadedFiles={setUploadedFiles}
                    getValues={getValues}
                  />
                </div>

                {/* Levels Section */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div>
                    <h2 className='text-xl font-semibold mb-4'>
                      Educational Levels
                    </h2>
                    <input
                      type='text'
                      className='w-full p-2 border rounded'
                      value={levelSearch}
                      onChange={(e) => {
                        setLevelSearch(e.target.value)
                        setHasSelectedLevel(false)
                      }}
                      placeholder='Search levels'
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-7'>
                    {levels.map((level) => (
                      <label key={level.id} className='flex items-center'>
                        <input
                          type='checkbox'
                          identity='level'
                          {...register('levels')}
                          value={level.id}
                          className='mr-2'
                        />
                        {level.title}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Courses Section */}

                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>Programs</h2>
                    <input
                      type='text'
                      placeholder='Search Programs'
                      className='border p-2 rounded w-60'
                      value={courseSearch}
                      onChange={(e) => setCourseSearch(e.target.value)}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-scroll'>
                    {filteredCourses.map((course) => (
                      <label key={course.id} className='flex items-center'>
                        <input
                          type='checkbox'
                          {...register('programs')}
                          value={course.id}
                          className='mr-2'
                        />
                        {course.title}
                      </label>
                    ))}
                    {filteredCourses.length === 0 && (
                      <p className='text-gray-500 col-span-full'>
                        No matching courses found.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
                <button
                  type='submit'
                  disabled={loading}
                  className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
                >
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update University'
                      : 'Create University'}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Table Section */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={universities}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchUniversities(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen} // Manage this state as needed
        onClose={handleDialogClose} // Implement close handler
        onConfirm={handleDeleteConfirm} // Implement confirm handler
        title='Confirm Deletion'
        message='Are you sure you want to delete this university? This action cannot be undone.'
      />
    </>
  )
}
