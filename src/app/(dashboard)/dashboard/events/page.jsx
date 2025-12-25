'use client'
import dynamic from 'next/dynamic'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getEvents } from '@/app/action'
import { useForm } from 'react-hook-form'
import FileUpload from '../addCollege/FileUpload'
import { MapPin } from 'lucide-react'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { fetchCategories } from '../category/action'
import { X } from 'lucide-react'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Modal } from '../../../../components/CreateUserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
const CKBlogs = dynamic(() => import('../component/CKBlogs'), {
  ssr: false
})

export default function EventManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      category_id: '',
      college_id: '',
      author_id: author_id,
      description: '',
      content: '',
      image: '',
      event_host: {
        start_date: '',
        end_date: '',
        time: '',
        host: '',
        map_url: ''
      },
      is_featured: false
    }
  })

  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    image: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [categories, setCategories] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [selectedColleges, setSelectedColleges] = useState([])
  const [collegeSearch, setCollegeSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [editorContent, setEditorContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesList = await fetchCategories()
        setCategories(categoriesList.items)
      } catch (error) {}
    }
    loadCategories()
  }, [])

  useEffect(() => {
    setHeading('Events Management')
    loadEvents()
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

  const searchCollege = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/college?q=${query}`
      )
      const data = await response.json()
      setSearchResults(data.items || [])
    } catch (error) {
      console.error('College Search Error:', error)
      toast.error('Failed to search colleges')
    }
  }

  // Add function to handle college selection
  const addCollege = (college) => {
    if (!selectedColleges.some((c) => c.id === college.id)) {
      setSelectedColleges((prev) => [...prev, college])
      // Update form value
      const collegeIds = [...selectedColleges, college].map((c) => c.id)
      setValue('college_id', collegeIds[0])
    }
    setCollegeSearch('')
    setSearchResults([])
  }

  // Add function to remove college
  const removeCollege = (collegeId) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== collegeId))
    // Update form value
    const updatedCollegeIds = selectedColleges
      .filter((c) => c.id !== collegeId)
      .map((c) => c.id)
    setValue('college_id', updatedCollegeIds[0])
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadEvents()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/event?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setEvents(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching event search results:', error.message)
      setEvents([])
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
  const initialContentRef = useRef(getValues('description'))

  const loadEvents = async (page = 1) => {
    try {
      const response = await getEvents(page)
      setEvents(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      toast.error('Failed to load events')
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        is_featured: Number(data.is_featured),
        image: uploadedFiles.image
      }
      // Include event ID for update operation
      if (editing) {
        formData.id = editingEventId // Add the event ID to the formData
      }
      // Use the same endpoint for both create and update
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/event`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to process event')
      }

      toast.success(
        editing ? 'Event updated successfully' : 'Event created successfully'
      )
      // Reset form and state
      reset()
      setEditing(false)
      setEditingEventId(null)
      setIsOpen(false)
      setUploadedFiles({ image: '' })
      setCollegeSearch('')
      setSelectedColleges([])
      setEditorContent('')
      loadEvents() // Refresh the event list
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network error occurred'
      toast.error(
        `Failed to ${editing ? 'update' : 'create'} event: ${errorMsg}`
      )
    }
  }

  const handleEdit = async (data) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/event/${data.slugs}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      let eventData = await response.json()
      eventData = eventData.item // Assuming the event data is nested under `item`
      // console.log("Cate:", categories);
      setEditingEventId(eventData.id)

      // Populate form fields with event data
      setValue('title', eventData.title)

      // if (eventData.category?.id) {
      //   setValue("category_id", eventData.category.id);
      // }
      if (eventData.category) {
        const categoryID = categories.find(
          (c) => c.title === eventData.category.title
        )?.id
        if (categoryID) {
          setValue('category_id', categoryID)
        }
      }
      console.log(eventData)

      if (eventData?.college) {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/college?q=${eventData.college.slugs}`
        )
        const collegeData = await response.json()
        const collegeId = collegeData.items[0]?.id

        if (collegeId) {
          setValue('college_id', collegeId)

          const colgData = [
            {
              id: collegeId,
              name: eventData.college.name
            }
          ]
          setSelectedColleges(colgData)
        }
      }

      setValue('description', eventData.description)
      setValue('content', eventData.content)
      setValue('image', eventData.image)
      setUploadedFiles((prev) => ({ ...prev, image: eventData.image }))

      const eventHost = eventData.event_host

      // Populate event_host fields
      setValue('event_host.start_date', eventHost.start_date)
      setValue('event_host.end_date', eventHost.end_date)
      setValue('event_host.time', eventHost.time)
      setValue('event_host.host', eventHost.host)
      setValue('event_host.map_url', eventHost.map_url)

      // Set is_featured checkbox
      setValue('is_featured', eventData.is_featured === 1)

      // Set college search input (if applicable)
      // setCollegeSearch(eventData.college.name);
      // setSelectedCollege(eventData.college);
    } catch (error) {
      console.error('Error fetching event data:', error)
      toast.error('Failed to fetch event data')
    } finally {
      setLoading(false)
    }
  }

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
        `${process.env.baseUrl}${process.env.version}/event?event_id=${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      loadEvents()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const EditorMemo = React.memo(({ initialData, onChange }) => (
    <CKBlogs id='editor1' initialData={initialData} onChange={onChange} />
  ))

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title'
      },
      {
        header: 'Host',
        id: 'host', // provide a unique id instead of a nested accessorKey
        cell: ({ row }) => {
          const rawValue = row.original.event_host
          if (!rawValue) return ''
          try {
            const eventHost = JSON.parse(rawValue)
            return eventHost.host || ''
          } catch (error) {
            console.error('JSON parsing error for host:', error)
            return ''
          }
        }
      },
      {
        header: 'Start Date',
        id: 'start_date',
        cell: ({ row }) => {
          const rawValue = row.original.event_host
          if (!rawValue) return ''
          try {
            const eventHost = JSON.parse(rawValue)
            return eventHost.start_date || ''
          } catch (error) {
            console.error('JSON parsing error for start_date:', error)
            return ''
          }
        }
      },
      {
        header: 'End Date',
        id: 'end_date',
        cell: ({ row }) => {
          const rawValue = row.original.event_host
          if (!rawValue) return ''
          try {
            const eventHost = JSON.parse(rawValue)
            return eventHost.end_date || ''
          } catch (error) {
            console.error('JSON parsing error for end_date:', error)
            return ''
          }
        }
      },
      {
        header: 'Time',
        id: 'time',
        cell: ({ row }) => {
          const rawValue = row.original.event_host
          if (!rawValue) return ''
          try {
            const eventHost = JSON.parse(rawValue)
            return eventHost.time || ''
          } catch (error) {
            console.error('JSON parsing error for time:', error)
            return ''
          }
        }
      },
      {
        header: 'Location',
        id: 'location',
        cell: ({ row }) => {
          const rawValue = row.original.event_host
          if (!rawValue) return 'N/A'
          try {
            const eventHost = JSON.parse(rawValue)
            return eventHost.map_url ? (
              <a
                href={eventHost.map_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline'
              >
                <MapPin className='inline w-4 h-4' /> View Map
              </a>
            ) : (
              'N/A'
            )
          } catch (error) {
            console.error('JSON parsing error for map_url:', error)
            return 'N/A'
          }
        }
      },
      {
        header: 'Featured',
        accessorKey: 'is_featured',
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No')
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2' key={row.original.id}>
            <button
              onClick={() => handleEdit(row.original)}
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
    ],
    [categories]
  )

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
              placeholder='Search events...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <button
              className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setEditingEventId(null)
                reset()
                setUploadedFiles({ image: '' })
                setCollegeSearch('')
                setSelectedColleges([])
                setEditorContent('')
              }}
            >
              Add Event
            </button>
          </div>
        </div>
        <ToastContainer />

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            setEditing(false)
            setEditingEventId(null)
            reset()
            setUploadedFiles({ image: '' })
            setCollegeSearch('')
            setSelectedColleges([])
            setEditorContent('')
          }}
          title={editing ? 'Edit Event' : 'Add Event'}
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
                    Event Information
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <label htmlFor='title' className='block mb-2'>
                        Event Title *
                      </label>
                      <input
                        {...register('title', {
                          required: 'Title is required'
                        })}
                        placeholder='Event Title'
                        className='w-full p-2 border rounded'
                      />
                      {errors.title && (
                        <span className='text-red-500 text-sm'>
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label htmlFor='category_id' className='block mb-2'>
                        Categories *
                      </label>
                      <select
                        {...register('category_id', { required: true })}
                        className='w-full p-2 border rounded'
                      >
                        <option value=''>Select Category</option>
                        {categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className='block mb-2'>College</label>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {selectedColleges.map((college) => (
                          <div
                            key={college.id}
                            className='flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full'
                          >
                            <span>{college.name}</span>
                            <button
                              type='button'
                              onClick={() => removeCollege(college.id)}
                              className='text-blue-600 hover:text-blue-800'
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className='relative'>
                        <input
                          type='text'
                          disabled={selectedColleges.length > 0}
                          value={collegeSearch}
                          onChange={searchCollege}
                          className='w-full p-2 border rounded'
                          placeholder='Search college...'
                        />

                        {searchResults.length > 0 && (
                          <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
                            {searchResults.map((college) => (
                              <div
                                key={college.id}
                                onClick={() => addCollege(college)}
                                className='p-2 hover:bg-gray-100 cursor-pointer'
                              >
                                {college.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Host Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Event Host Information
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <label htmlFor='host' className='block mb-2'>
                        Host *
                      </label>
                      <input
                        {...register('event_host.host', {
                          required: 'Host is required'
                        })}
                        placeholder='Event Host'
                        className='w-full p-2 border rounded'
                      />
                      {errors.event_host?.host && (
                        <span className='text-red-500 text-sm'>
                          {errors.event_host.host.message}
                        </span>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label htmlFor='start_date' className='block mb-2'>
                          Start Date *
                        </label>
                        <input
                          type='date'
                          {...register('event_host.start_date', {
                            required: 'Start date is required'
                          })}
                          className='w-full p-2 border rounded'
                        />
                        {errors.event_host?.start_date && (
                          <span className='text-red-500 text-sm'>
                            {errors.event_host.start_date.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <label htmlFor='end_date' className='block mb-2'>
                          End Date *
                        </label>
                        <input
                          type='date'
                          {...register('event_host.end_date', {
                            required: 'End date is required'
                          })}
                          className='w-full p-2 border rounded'
                        />
                        {errors.event_host?.end_date && (
                          <span className='text-red-500 text-sm'>
                            {errors.event_host.end_date.message}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label htmlFor='time' className='block mb-2'>
                          Time *
                        </label>
                        <input
                          type='time'
                          {...register('event_host.time', {
                            required: 'Time is required'
                          })}
                          className='w-full p-2 border rounded'
                          placeholder='Time'
                        />
                        {errors.event_host?.time && (
                          <span className='text-red-500 text-sm'>
                            {errors.event_host.time.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <label htmlFor='map_url' className='block mb-2'>
                          Map Location
                        </label>
                        <input
                          type='text'
                          {...register('event_host.map_url')}
                          placeholder='Map URL'
                          className='w-full p-2 border rounded'
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description and Content */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Description & Content
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <label htmlFor='description' className='block mb-2'>
                        Description
                      </label>
                      <textarea
                        {...register('description')}
                        placeholder='Description'
                        className='w-full p-2 border rounded'
                        rows='5'
                      />
                    </div>

                    <div>
                      <label htmlFor='content' className='block mb-2'>
                        Content
                      </label>
                      <EditorMemo
                        initialData={getValues('content')}
                        onChange={(data) => setValue('content', data)}
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Media</h2>
                  <FileUpload
                    label='Event Image'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, image: url }))
                    }}
                    defaultPreview={uploadedFiles.image}
                  />
                </div>

                {/* Additional Settings */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Additional Settings
                  </h2>
                  <div className='flex items-center'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        {...register('is_featured')}
                        className='mr-2'
                      />
                      Feature Event
                    </label>
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
                      ? 'Update Event'
                      : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Table Section */}
        <div className='mt-8'>
          <Table
            data={events}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadEvents(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this event? This action cannot be undone.'
      />
    </>
  )
}
