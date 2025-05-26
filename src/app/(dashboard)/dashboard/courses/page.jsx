'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Table from '@/app/components/Table'
import { Edit2, Trash2 } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
// import { getCourses } from '@/app/action'
import { fetchFaculties } from './action'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { useDebounce } from 'use-debounce'

export default function CourseForm() {
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

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchCourses()
    fetchFaculties()
  }, [])

  const fetchCourses = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/course?page=${page}`
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
    try {
      const url = `${process.env.baseUrl}${process.env.version}/course`
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
      fetchCourses()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save course')
    }
  }

  const handleEdit = async (slug) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/course/${slug}`
      )
      const course = await response.json()

      // Set form values
      setValue('id', course.id)
      setValue('title', course.title)
      setValue('code', course.code)
      setValue('duration', course.duration)
      setValue('description', course.description)
      setValue('facultyId', course.coursefaculty.id)

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

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/course?id=${deleteId}`,
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
            onClick={() => handleEdit(row.original.slugs)}
            className='p-1 text-blue-600 hover:text-blue-800'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => {
              setDeleteId(row.original.id)
              setIsDialogOpen(true)
            }}
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
      fetchCourses()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/course?q=${query}`
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
      <div className='text-2xl mr-auto p-4 ml-14 font-bold'>
        <div className='text-center'>Course Management</div>
        <div className='flex justify-left mt-2'>
          <button
            className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide form' : 'Show form'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='container mx-auto p-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Course Information</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block mb-2'>Course Title *</label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className='w-full p-2 border rounded'
                  />
                  {errors.title && (
                    <span className='text-red-500'>{errors.title.message}</span>
                  )}
                </div>

                <div>
                  <label className='block mb-2'>Course Code *</label>
                  <input
                    {...register('code', { required: 'Code is required' })}
                    className='w-full p-2 border rounded'
                  />
                  {errors.code && (
                    <span className='text-red-500'>{errors.code.message}</span>
                  )}
                </div>

                <div>
                  <label className='block mb-2'>Duration (months) *</label>
                  <input
                    type='number'
                    {...register('duration', { required: true })}
                    className='w-full p-2 border rounded'
                  />
                </div>

                <div>
                  <label className='block mb-2'>Credits *</label>
                  <input
                    type='number'
                    {...register('credits', { required: true })}
                    className='w-full p-2 border rounded'
                  />
                </div>

                {/* <div>
                  <label className='block mb-2'>Faculty *</label>
                  <select
                    {...register('facultyId', { required: true })}
                    className='w-full p-2 border rounded'
                  >
                    <option value=''>Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.title}
                      </option>
                    ))}
                  </select>
                </div> */}

                <div className='relative'>
                  <label className='block mb-2'>Faculty *</label>

                  <input
                    type='text'
                    className='w-full p-2 border rounded'
                    value={facSearch}
                    onChange={(e) => {
                      setFacSearch(e.target.value)
                      setHasSelectedFac(false)
                    }}
                    placeholder='Search Faculty'
                  />

                  {/* Hidden input for react-hook-form binding */}
                  <input
                    type='hidden'
                    {...register('facultyId', { required: true })}
                  />
                  {loadFac ? (
                    <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                      Loading...
                    </div>
                  ) : showFacDrop ? (
                    faculties.length > 0 ? (
                      <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
                        {faculties.map((fac) => (
                          <li
                            key={fac.id}
                            className='p-2 cursor-pointer hover:bg-gray-100'
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
                      <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                        No faculty found.
                      </div>
                    )
                  ) : null}
                </div>

                <div>
                  <label className='block mb-2'>Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={getValues('description')}
                    config={{
                      licenseKey: process.env.ckeditor
                    }}
                    onChange={(event, editor) => {
                      const content = editor.getData()
                      setValue('description', content)
                    }}
                  />
                </div>

                <div>
                  <label className='block mb-2'>Syllabus Topics</label>
                  <textarea
                    {...register('syllabus')}
                    className='w-full p-2 border rounded'
                    rows='3'
                    placeholder='Enter topics separated by commas'
                  />
                  <p className='text-sm text-gray-500 mt-1'>
                    Enter topics separated by commas
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={loading}
                className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
              >
                {loading
                  ? 'Processing...'
                  : editing
                    ? 'Update Course'
                    : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className='mt-8'>
        <Table
          loading={tableLoading}
          data={courses}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => fetchCourses(newPage)}
          onSearch={handleSearch}
        />
      </div>

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
    </>
  )
}
