'use client'
import dynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../../../components/ui/dialog'
import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import Table from '../../../../components/Table'
import { Search } from 'lucide-react'
import { createColumns } from './columns'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { fetchLevel } from './actions'
import { useDebounce } from 'use-debounce'
import { fetchAllCourse } from './actions'
import useAdminPermission from '@/hooks/useAdminPermission'
import GallerySection from './GallerySection'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Select } from '../../../../components/ui/select'
import { Checkbox } from '../../../../components/ui/checkbox'
const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})

// Helper component for required label
const RequiredLabel = ({ children, htmlFor }) => (
  <Label htmlFor={htmlFor}>
    {children} <span className='text-red-500'>*</span>
  </Label>
)

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
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewUniversityData, setViewUniversityData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?page=${page}`
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

      // Ensure programs is always an array
      const programsArray = Array.isArray(data.programs)
        ? data.programs.map((program) => parseInt(program))
        : []

      // Filter out invalid program IDs and verify they exist in available courses
      const validProgramIds = programsArray.filter(
        (id) =>
          !isNaN(id) &&
          id !== null &&
          id !== undefined &&
          courses.some((course) => course.id === id)
      )

      // Always include programs array (even if empty) to ensure it's saved
      data.programs = validProgramIds

      // Ensure contact object is always included
      if (!data.contact) {
        data.contact = {
          faxes: '',
          poboxes: '',
          email: '',
          phone_number: ''
        }
      }

      const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/university`
      const method = 'POST'
      console.log('before submitting uni', data)
      console.log('contact data:', data.contact)
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/university/${slugs}`
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?id=${deleteId}`,
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

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)

      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/university/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch university details')
      }

      const data = await response.json()
      setViewUniversityData(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load university details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewUniversityData(null)
  }

  // Create columns with handlers (must be after handlers are defined)
  const columns = createColumns({
    handleView,
    handleEdit,
    handleDeleteClick
  })

  const handleSearch = async (query) => {
    if (!query) {
      fetchUniversities()
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?q=${query}`
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
            <Input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2'
              placeholder='Search universities...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                reset()
                setUploadedFiles({ featured: '', gallery: [] })
              }}
            >
              Add University
            </Button>
          </div>
        </div>
        <ToastContainer />

        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          className='max-w-5xl'
        >
          <DialogContent className='max-h-[90vh] overflow-hidden flex flex-col'>
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Edit University' : 'Add University'}
              </DialogTitle>
            </DialogHeader>
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
                        <RequiredLabel htmlFor='fullname'>
                          University Name
                        </RequiredLabel>
                        <Input
                          id='fullname'
                          {...register('fullname', {
                            required: 'University name is required',
                            minLength: {
                              value: 3,
                              message: 'Name must be at least 3 characters long'
                            }
                          })}
                        />
                        {errors.fullname && (
                          <span className='text-red-500 text-sm mt-1 block'>
                            {errors.fullname.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <RequiredLabel htmlFor='type_of_institute'>
                          Type of Institute
                        </RequiredLabel>
                        <Select
                          {...register('type_of_institute', { required: true })}
                        >
                          <option value='Public'>Public</option>
                          <option value='Private'>Private</option>
                        </Select>
                      </div>

                      <div>
                        <RequiredLabel htmlFor='date_of_establish'>
                          Date of Establishment
                        </RequiredLabel>
                        <Input
                          id='date_of_establish'
                          type='date'
                          {...register('date_of_establish', { required: true })}
                        />
                        {errors.date_of_establish && (
                          <span className='text-red-500 text-sm mt-1 block'>
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='mt-4'>
                      <Label>Description</Label>

                      <CKUni
                        id='editor-content'
                        initialData={getValues('description')}
                        onChange={(data) => setValue('description', data)}
                      />
                    </div>
                  </div>
                  {editing ? (
                    <input type='hidden' {...register('id')} />
                  ) : (
                    <></>
                  )}

                  {/* Address Section */}
                  <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-xl font-semibold mb-4'>Address</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {[
                        'country',
                        'state',
                        'city',
                        'street',
                        'postal_code'
                      ].map((field) => (
                        <div key={field}>
                          <RequiredLabel htmlFor={field}>
                            {field.replace('_', ' ')}
                          </RequiredLabel>
                          <Input
                            id={field}
                            {...register(field, { required: true })}
                          />
                          {errors[field] && (
                            <span className='text-red-500 text-sm mt-1 block'>
                              This field is required
                            </span>
                          )}
                        </div>
                      ))}
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
                          <Label htmlFor={key}>{label}</Label>
                          <Input
                            id={key}
                            {...register(`contact.${key}`)}
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
                      <Button
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
                        className='bg-green-500 text-white hover:bg-green-600'
                      >
                        Add Member
                      </Button>
                    </div>

                    {memberFields.map((field, index) => (
                      <div
                        key={field.id}
                        className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
                      >
                        <div>
                          <Label htmlFor={`members.${index}.role`}>Role</Label>
                          <Input
                            id={`members.${index}.role`}
                            {...register(`members.${index}.role`)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`members.${index}.salutation`}>
                            Salutation
                          </Label>
                          <Input
                            id={`members.${index}.salutation`}
                            {...register(`members.${index}.salutation`)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`members.${index}.name`}>Name</Label>
                          <Input
                            id={`members.${index}.name`}
                            {...register(`members.${index}.name`)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`members.${index}.phone`}>
                            Phone
                          </Label>
                          <Input
                            id={`members.${index}.phone`}
                            {...register(`members.${index}.phone`)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`members.${index}.email`}>
                            Email
                          </Label>
                          <Input
                            id={`members.${index}.email`}
                            type='email'
                            {...register(`members.${index}.email`)}
                          />
                        </div>

                        {index > 0 && (
                          <Button
                            type='button'
                            onClick={() => removeMember(index)}
                            className='bg-red-500 text-white hover:bg-red-600'
                          >
                            Remove
                          </Button>
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
                        <Label htmlFor='video-url'>Video URL</Label>
                        <Input
                          id='video-url'
                          {...register('assets.videos')}
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
                      <Input
                        type='text'
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
                        <label
                          key={level.id}
                          className='flex items-center gap-2'
                        >
                          <Checkbox
                            checked={formData.levels?.includes(
                              String(level.id)
                            )}
                            onCheckedChange={(checked) => {
                              const currentLevels = formData.levels || []
                              if (checked) {
                                setValue('levels', [
                                  ...currentLevels,
                                  String(level.id)
                                ])
                              } else {
                                setValue(
                                  'levels',
                                  currentLevels.filter(
                                    (id) => id !== String(level.id)
                                  )
                                )
                              }
                              setHasSelectedLevel(checked)
                            }}
                          />
                          <span>{level.title}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Courses Section */}

                  <div className='bg-white p-6 rounded-lg shadow-md'>
                    <div className='flex justify-between items-center mb-4'>
                      <h2 className='text-xl font-semibold'>Programs</h2>
                      <Input
                        type='text'
                        placeholder='Search Programs'
                        className='w-60'
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-scroll'>
                      {filteredCourses.map((course) => (
                        <label
                          key={course.id}
                          className='flex items-center gap-2'
                        >
                          <Checkbox
                            checked={formData.programs?.includes(
                              String(course.id)
                            )}
                            onCheckedChange={(checked) => {
                              const currentPrograms = formData.programs || []
                              if (checked) {
                                setValue('programs', [
                                  ...currentPrograms,
                                  String(course.id)
                                ])
                              } else {
                                setValue(
                                  'programs',
                                  currentPrograms.filter(
                                    (id) => id !== String(course.id)
                                  )
                                )
                              }
                            }}
                          />
                          <span>{course.title}</span>
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
                  <Button
                    type='submit'
                    disabled={loading}
                    className='bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300'
                  >
                    {loading
                      ? 'Processing...'
                      : editing
                        ? 'Update University'
                        : 'Create University'}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>

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

      {/* View University Details Dialog */}
      <Dialog
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        className='max-w-4xl'
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>University Details</DialogTitle>
          </DialogHeader>
          {loadingView ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-gray-500'>Loading...</div>
            </div>
          ) : viewUniversityData ? (
            <div className='space-y-6'>
              {/* Logo and Basic Info */}
              <div className='flex items-start gap-4 border-b pb-4'>
                {viewUniversityData.featured_image && (
                  <img
                    src={viewUniversityData.featured_image}
                    alt={viewUniversityData.fullname}
                    className='w-20 h-20 object-contain rounded-lg border'
                  />
                )}
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold text-gray-800'>
                    {viewUniversityData.fullname}
                  </h2>
                  {viewUniversityData.type_of_institute && (
                    <span className='inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800'>
                      {viewUniversityData.type_of_institute}
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              {(viewUniversityData.city ||
                viewUniversityData.state ||
                viewUniversityData.country) && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Address</h3>
                    <div className='text-gray-700 space-y-1'>
                      {viewUniversityData.street && (
                        <p>{viewUniversityData.street}</p>
                      )}
                      <p>
                        {[
                          viewUniversityData.city,
                          viewUniversityData.state,
                          viewUniversityData.country
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      {viewUniversityData.postal_code && (
                        <p>Postal Code: {viewUniversityData.postal_code}</p>
                      )}
                    </div>
                  </div>
                )}

              {/* Contact Information */}
              {viewUniversityData.contact && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Contact Information
                  </h3>
                  <div className='text-gray-700 space-y-1'>
                    {viewUniversityData.contact.phone_number && (
                      <p>Phone: {viewUniversityData.contact.phone_number}</p>
                    )}
                    {viewUniversityData.contact.email && (
                      <p>Email: {viewUniversityData.contact.email}</p>
                    )}
                    {viewUniversityData.contact.faxes && (
                      <p>Fax: {viewUniversityData.contact.faxes}</p>
                    )}
                    {viewUniversityData.contact.poboxes && (
                      <p>P.O. Box: {viewUniversityData.contact.poboxes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Date of Establishment */}
              {viewUniversityData.date_of_establish && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>
                    Date of Establishment
                  </h3>
                  <p className='text-gray-700'>
                    {new Date(
                      viewUniversityData.date_of_establish
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Programs */}
              {viewUniversityData.programs &&
                viewUniversityData.programs.length > 0 && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Programs</h3>
                    <div className='flex flex-wrap gap-2'>
                      {viewUniversityData.programs.map((program, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                        >
                          {typeof program === 'string'
                            ? program
                            : program.program?.title || 'N/A'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Levels */}
              {viewUniversityData.levels &&
                viewUniversityData.levels.length > 0 && (
                  <div>
                    <h3 className='text-lg font-semibold mb-2'>Levels</h3>
                    <div className='flex flex-wrap gap-2'>
                      {viewUniversityData.levels.map((level, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Description */}
              {viewUniversityData.description && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Description</h3>
                  <div
                    className='text-gray-700 prose max-w-none'
                    dangerouslySetInnerHTML={{
                      __html: viewUniversityData.description
                    }}
                  />
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
