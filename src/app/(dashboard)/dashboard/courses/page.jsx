'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
// import { getCourses } from '@/app/action'
import { fetchFaculties } from './action'
import { useDebounce } from 'use-debounce'
import useAdminPermission from '@/hooks/useAdminPermission'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '../../../../ui/shadcn/button'
import { Input } from '../../../../ui/shadcn/input'
import { Label } from '../../../../ui/shadcn/label'
import { Dialog, DialogHeader, DialogTitle } from '../../../../ui/shadcn/dialog'
import { Modal } from '../../../../ui/molecules/Modal'
const CKBlogs = dynamic(() => import('../component/CKBlogs'), {
  ssr: false
})

// Helper component for required label
const RequiredLabel = ({ children, htmlFor }) => (
  <Label htmlFor={htmlFor}>
    {children} <span className='text-red-500'>*</span>
  </Label>
)

// Helper component for form field with error handling
const FormField = ({ label, error, htmlFor, children }) => (
  <div className='space-y-2'>
    {label && <label htmlFor={htmlFor}>{label}</label>}
    {children}
    {error && (
      <p className='text-sm font-medium text-destructive'>{error.message}</p>
    )}
  </div>
)

export default function CourseForm() {
  const { setHeading } = usePageHeading()
  //for faculties search
  const [facSearch, setFacSearch] = useState('')
  const [debouncedFac] = useDebounce(facSearch, 300)
  const [faculties, setFaculties] = useState([])
  const [loadFac, setLoadFac] = useState(false)
  const [showFacDrop, setShowFacDrop] = useState(false)
  const [hasSelectedFac, setHasSelectedFac] = useState(false)

  const author_id = useSelector((state) => state.user.data.id)
  const [isOpen, setIsOpen] = useState(false)
  const [courses, setCourses] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewCourseData, setViewCourseData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      title: '',
      code: '',
      duration: '',
      authorId: author_id,
      description: '',
      facultyId: '',
      credits: '',
      syllabus: []
    }
  })

  const { requireAdmin } = useAdminPermission()

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  useEffect(() => {
    setHeading('Course Management')
    fetchCourses()
    fetchFaculties()
    return () => setHeading(null)
  }, [setHeading])

  // Handle query parameter to open add form
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('add') === 'true') {
      setIsOpen(true)
      setEditing(false)
      reset()
      setFacSearch('')
      setHasSelectedFac(false)
    }
  }, [reset])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const fetchCourses = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/course?page=${page}`
      )
      const data = await response.json()
      setCourses(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      toast.error('Failed to fetch courses', error)
    } finally {
      setTableLoading(false)
    }
  }

  //for faculties
  useEffect(() => {
    if (hasSelectedFac) return

    const getFaculties = async () => {
      setLoadFac(true)
      try {
        const facultyList = await fetchFaculties(debouncedFac)
        setFaculties(facultyList)
        setShowFacDrop(true)
        setLoadFac(false)
      } catch (error) {
        console.error('Error fetching Facultiews:', error)
      }
    }
    if (debouncedFac !== '') {
      getFaculties()
    } else {
      setShowFacDrop(false)
    }
  }, [debouncedFac])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const url = `${process.env.baseUrl}/course`
      const method = 'POST'

      // Convert syllabus to array if it's a string
      if (typeof data.syllabus === 'string') {
        data.syllabus = data.syllabus.split(',').map((item) => item.trim())
      }

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
          ? 'Course updated successfully!'
          : 'Course created successfully!'
      )
      setEditing(false)
      reset()
      setFacSearch('')
      setHasSelectedFac(false)
      fetchCourses()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save course')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (slug) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(
        `${process.env.baseUrl}/course/${slug}`
      )
      const course = await response.json()

      // Set form values
      setValue('id', course.id)
      setValue('title', course.title)
      setValue('code', course.code)
      setValue('duration', course.duration)
      setValue('description', course.description)
      setValue('facultyId', course.coursefaculty.id)
      setFacSearch(course.coursefaculty.title)

      if (course.coursefaculty) {
        const faculty = faculties.find(
          (f) => f.title === course.coursefaculty.title
        )
        if (faculty) {
          setValue('facultyId', faculty.id)
        }
      }

      setValue('credits', course.credits)
      setValue('syllabus', JSON.parse(course.syllabus))
    } catch (error) {
      console.error('Error in handleEdit:', error)
      toast.error('Failed to fetch course details')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditing(false)
    reset()
    setFacSearch('')
    setHasSelectedFac(false)
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

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/course?id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      await response.json()
      toast.success('Course deleted successfully')
      await fetchCourses()
    } catch (error) {
      toast.error('Failed to delete course')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const response = await authFetch(
        `${process.env.baseUrl}/course/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch course details')
      }
      const data = await response.json()
      setViewCourseData(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load course details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewCourseData(null)
  }

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title'
    },
    {
      header: 'Code',
      accessorKey: 'code'
    },
    {
      header: 'Duration',
      accessorKey: 'duration'
    },
    {
      header: 'Credits',
      accessorKey: 'credits'
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleView(row.original.slugs)}
            className='p-1 text-purple-600 hover:text-purple-800'
            title='View Details'
          >
            <Eye className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleEdit(row.original.slugs)}
            className='p-1 text-blue-600 hover:text-blue-800'
            title='Edit'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
            title='Delete'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]

  const handleSearch = async (query) => {
    if (!query) {
      fetchCourses()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/course?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setCourses(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setCourses([])
      }
    } catch (error) {
      console.error('Error fetching event search results:', error.message)
      setCourses([])
    }
  }

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4 gap-4'>
          {/* Search Bar */}
          <div className='relative w-full max-w-md'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-4 h-4 text-muted-foreground' />
            </div>
            <Input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='pl-10 pr-4'
              placeholder='Search courses...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              size='sm'
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                reset()
                setFacSearch('')
                setHasSelectedFac(false)
              }}
            >
              Add Course
            </Button>
          </div>
        </div>
        <ToastContainer />

        {/* Table Section */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={courses}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchCourses(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* Form Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={handleModalClose}
        className='max-w-4xl max-h-[90vh] flex flex-col p-0'
      >
        <div className='px-6 pt-6'>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Course' : 'Add Course'}</DialogTitle>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col flex-1 min-h-0 overflow-hidden'
        >
          <div className='flex-1 overflow-y-auto px-6 space-y-6'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Course Information
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Title Field */}
                <div className='space-y-2'>
                  <RequiredLabel htmlFor='title'>Course Title</RequiredLabel>
                  <Input
                    id='title'
                    placeholder='Enter course title'
                    {...register('title', { required: 'Title is required' })}
                    aria-invalid={errors.title ? 'true' : 'false'}
                    className={
                      errors.title
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {errors.title && (
                    <p className='text-sm font-medium text-destructive'>
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Code Field */}
                <div className='space-y-2'>
                  <RequiredLabel htmlFor='code'>Course Code</RequiredLabel>
                  <Input
                    id='code'
                    placeholder='e.g., CS101'
                    {...register('code', { required: 'Code is required' })}
                    aria-invalid={errors.code ? 'true' : 'false'}
                    className={
                      errors.code
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {errors.code && (
                    <p className='text-sm font-medium text-destructive'>
                      {errors.code.message}
                    </p>
                  )}
                </div>

                {/* Duration Field */}
                <div className='space-y-2'>
                  <RequiredLabel htmlFor='duration'>
                    Duration (months)
                  </RequiredLabel>
                  <Input
                    id='duration'
                    type='number'
                    placeholder='e.g., 6'
                    {...register('duration', {
                      required: 'Duration is required',
                      min: {
                        value: 1,
                        message: 'Duration must be at least 1 month'
                      }
                    })}
                    aria-invalid={errors.duration ? 'true' : 'false'}
                    className={
                      errors.duration
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {errors.duration && (
                    <p className='text-sm font-medium text-destructive'>
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Credits Field */}
                <div className='space-y-2'>
                  <RequiredLabel htmlFor='credits'>Credits</RequiredLabel>
                  <Input
                    id='credits'
                    type='number'
                    placeholder='e.g., 3.0'
                    step='0.1'
                    {...register('credits', {
                      required: 'Credits is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Credits must be positive' }
                    })}
                    aria-invalid={errors.credits ? 'true' : 'false'}
                    className={
                      errors.credits
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {errors.credits && (
                    <p className='text-sm font-medium text-destructive'>
                      {errors.credits.message}
                    </p>
                  )}
                </div>

                {/* Faculty Field */}
                <div className='relative md:col-span-2 space-y-2'>
                  <RequiredLabel htmlFor='faculty-search'>
                    Faculty
                  </RequiredLabel>
                  <div className='relative'>
                    <Input
                      id='faculty-search'
                      type='text'
                      value={facSearch}
                      onChange={(e) => {
                        setFacSearch(e.target.value)
                        setHasSelectedFac(false)
                      }}
                      placeholder='Search and select faculty'
                      aria-invalid={errors.facultyId ? 'true' : 'false'}
                      className={
                        errors.facultyId
                          ? 'border-destructive focus-visible:ring-destructive'
                          : ''
                      }
                    />

                    {/* Hidden input for react-hook-form binding */}
                    <input
                      type='hidden'
                      {...register('facultyId', {
                        required: 'Faculty is required'
                      })}
                    />

                    {/* Dropdown */}
                    {loadFac ? (
                      <div className='absolute z-10 w-full top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2'>
                        <p className='text-muted-foreground text-sm'>
                          Loading...
                        </p>
                      </div>
                    ) : showFacDrop ? (
                      faculties.length > 0 ? (
                        <ul className='absolute z-10 w-full top-full mt-1 bg-white border border-gray-200 rounded-md max-h-60 overflow-y-auto shadow-lg'>
                          {faculties.map((fac) => (
                            <li
                              key={fac.id}
                              className='px-3 py-2 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors'
                              onClick={() => {
                                setValue('facultyId', Number(fac.id))
                                setFacSearch(fac.title)
                                setShowFacDrop(false)
                                setHasSelectedFac(true)
                              }}
                            >
                              {fac.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className='absolute z-10 w-full top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-muted-foreground text-sm'>
                          No faculty found
                        </div>
                      )
                    ) : null}
                  </div>
                  {errors.facultyId && (
                    <p className='text-sm font-medium text-destructive'>
                      {errors.facultyId.message}
                    </p>
                  )}
                </div>

                {/* Syllabus Topics Field */}
                <div className='md:col-span-2 space-y-2'>
                  <Label htmlFor='syllabus'>Syllabus Topics</Label>
                  <textarea
                    id='syllabus'
                    {...register('syllabus')}
                    className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    rows='3'
                    placeholder='Enter topics separated by commas (e.g., Introduction, Fundamentals, Advanced Topics)'
                  />
                  <p className='text-xs text-muted-foreground'>
                    Enter topics separated by commas
                  </p>
                </div>
              </div>
            </div>

            {/* Description Editor */}
            <div className='md:col-span-2 space-y-2 pt-2'>
              <Label>Description</Label>
              <div className='border border-input rounded-md overflow-hidden'>
                <CKBlogs
                  initialData={getValues('description')}
                  onChange={(data) => setValue('description', data)}
                  id='editor1'
                />
              </div>
            </div>
          </div>

          {/* Action Buttons - Sticky Footer */}
          <div className='sticky bottom-0 bg-white border-t pt-4 pb-4 px-6 mt-4 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]'>
            <Button
              type='button'
              onClick={handleModalClose}
              variant='outline'
              size='sm'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={submitting} size='sm'>
              {submitting
                ? 'Processing...'
                : editing
                  ? 'Update Course'
                  : 'Create Course'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setDeleteId(null)
        }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this course? This action cannot be undone.'
      />

      {/* View Course Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title='Course Details'
        className='max-w-3xl'
      >
        {loadingView ? (
          <div className='flex justify-center items-center h-48'>
            Loading...
          </div>
        ) : viewCourseData ? (
          <div className='space-y-4 max-h-[70vh] overflow-y-auto p-2'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {viewCourseData.title}
              </h2>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h3 className='text-lg font-semibold mb-2'>Course Code</h3>
                <p className='text-gray-700'>{viewCourseData.code || 'N/A'}</p>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-2'>Duration</h3>
                <p className='text-gray-700'>
                  {viewCourseData.duration
                    ? `${viewCourseData.duration} months`
                    : 'N/A'}
                </p>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-2'>Credits</h3>
                <p className='text-gray-700'>
                  {viewCourseData.credits || 'N/A'}
                </p>
              </div>

              {viewCourseData.coursefaculty && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Faculty</h3>
                  <p className='text-gray-700'>
                    {viewCourseData.coursefaculty.title || 'N/A'}
                  </p>
                </div>
              )}
            </div>

            {viewCourseData.description && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewCourseData.description
                  }}
                />
              </div>
            )}

            {viewCourseData.syllabus && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Syllabus Topics</h3>
                <div className='text-gray-700'>
                  {(() => {
                    try {
                      const syllabus =
                        typeof viewCourseData.syllabus === 'string'
                          ? JSON.parse(viewCourseData.syllabus)
                          : viewCourseData.syllabus
                      if (Array.isArray(syllabus) && syllabus.length > 0) {
                        return (
                          <ul className='list-disc list-inside space-y-1'>
                            {syllabus.map((topic, index) => (
                              <li key={index}>{topic}</li>
                            ))}
                          </ul>
                        )
                      }
                      return <p>No syllabus topics available</p>
                    } catch (error) {
                      return <p>Unable to parse syllabus</p>
                    }
                  })()}
                </div>
              </div>
            )}

            {viewCourseData.author && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Author</h3>
                <p className='text-gray-700'>
                  {viewCourseData.author.firstName}{' '}
                  {viewCourseData.author.middleName}{' '}
                  {viewCourseData.author.lastName}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className='flex justify-center items-center h-48'>
            <p className='text-gray-500'>No course data available</p>
          </div>
        )}
      </Modal>
    </>
  )
}
