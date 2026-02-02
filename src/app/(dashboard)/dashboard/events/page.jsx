'use client'
import { getEvents } from '@/app/action'
import { authFetch } from '@/app/utils/authFetch'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Select } from '@/ui/shadcn/select'
import { DotenvConfig } from '@/config/env.config'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Edit2, Eye, MapPin, Search, Trash2, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Table from '../../../../ui/molecules/Table'
import { Modal } from '../../../../ui/molecules/Modal'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import FileUpload from '../addCollege/FileUpload'
import { fetchCategories } from '../category/action'

const CKBlogs = dynamic(() => import('../component/CKBlogs'), {
  ssr: false
})

export default function EventManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()
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
      college_id: null,
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
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewEventData, setViewEventData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesList = await fetchCategories()
        setCategories(categoriesList.items)
      } catch (error) { }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    setHeading('Events Management')
    loadEvents()
    return () => setHeading(null)
  }, [setHeading])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditing(false)
      setEditingEventId(null)
      reset()
      setUploadedFiles({ image: '' })
      setCollegeSearch('')
      setSelectedColleges([])
      setEditorContent('')
      // Remove query parameter from URL
      router.replace('/dashboard/events', { scroll: false })
    }
  }, [searchParams, router, reset])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const searchCollege = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?q=${query}`
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
    const updatedColleges = selectedColleges.filter((c) => c.id !== collegeId)
    setSelectedColleges(updatedColleges)
    // Update form value - set to null or undefined if no colleges left
    if (updatedColleges.length > 0) {
      setValue('college_id', updatedColleges[0].id)
    } else {
      setValue('college_id', null)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadEvents()
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/event?q=${query}`
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

      // Remove college_id if it's empty, null, or undefined
      if (
        !formData.college_id ||
        formData.college_id === '' ||
        formData.college_id === null
      ) {
        delete formData.college_id
      }

      // Include event ID for update operation
      if (editing) {
        formData.id = editingEventId // Add the event ID to the formData
      }
      // Use the same endpoint for both create and update
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/event`,
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/event/${data.slugs}`,
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
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?q=${eventData.college.slugs}`
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
        } else {
          // No college found, set to null
          setValue('college_id', null)
          setSelectedColleges([])
        }
      } else {
        // Event has no college, set to null
        setValue('college_id', null)
        setSelectedColleges([])
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
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/event?event_id=${deleteId}`,
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

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/event/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch event details')
      }
      const data = await response.json()
      setViewEventData(data.item)
    } catch (err) {
      toast.error(err.message || 'Failed to load event details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewEventData(null)
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
            console.log(eventHost,"YOOYO")
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
            const eventHost = rawValue
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
              onClick={() => handleView(row.original.slugs)}
              className='p-1 text-purple-600 hover:text-purple-800'
              title='View Details'
            >
              <Eye className='w-4 h-4' />
            </button>
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
            <Button
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
            </Button>
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
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='title' className='block mb-2'>
                        Event Title <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='title'
                        {...register('title', {
                          required: 'Title is required'
                        })}
                        placeholder='Event Title'
                      />
                      {errors.title && (
                        <span className='text-red-500 text-sm'>
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor='category_id' className='block mb-2'>
                        Categories <span className='text-red-500'>*</span>
                      </Label>
                      <Select
                        className='w-full'
                        id='category_id'
                        {...register('category_id', { required: true })}
                      >
                        <option value=''>Select Category</option>
                        {categories.map((category) => (
                          <option value={category.id} key={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </Select>
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
                        <Input
                          type='text'
                          disabled={selectedColleges.length > 0}
                          value={collegeSearch}
                          onChange={searchCollege}
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
                      <Label htmlFor='host' className='block mb-2'>
                        Host <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        id='host'
                        {...register('event_host.host', {
                          required: 'Host is required'
                        })}
                        placeholder='Event Host'
                      />
                      {errors.event_host?.host && (
                        <span className='text-red-500 text-sm'>
                          {errors.event_host.host.message}
                        </span>
                      )}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='start_date' className='block mb-2'>
                          Start Date <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          id='start_date'
                          type='date'
                          {...register('event_host.start_date', {
                            required: 'Start date is required'
                          })}
                        />
                        {errors.event_host?.start_date && (
                          <span className='text-red-500 text-sm'>
                            {errors.event_host.start_date.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor='end_date' className='block mb-2'>
                          End Date <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          id='end_date'
                          type='date'
                          {...register('event_host.end_date', {
                            required: 'End date is required'
                          })}
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
                        <Label htmlFor='time' className='block mb-2'>
                          Time <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                          id='time'
                          type='time'
                          {...register('event_host.time', {
                            required: 'Time is required'
                          })}
                          placeholder='Time'
                        />
                        {errors.event_host?.time && (
                          <span className='text-red-500 text-sm'>
                            {errors.event_host.time.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor='map_url' className='block mb-2'>
                          Map Location
                        </Label>
                        <Input
                          id='map_url'
                          type='text'
                          {...register('event_host.map_url')}
                          placeholder='Map URL'
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
                      <Label htmlFor='description' className='block mb-2'>
                        Description
                      </Label>
                      <textarea
                        id='description'
                        {...register('description')}
                        placeholder='Description'
                        className='w-full p-2 border rounded'
                        rows='5'
                      />
                    </div>

                    <div>
                      <Label htmlFor='content' className='block mb-2'>
                        Content
                      </Label>
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
                <Button type='submit' disabled={loading}>
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update Event'
                      : 'Create Event'}
                </Button>
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

      {/* View Event Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title='Event Details'
        className='max-w-3xl'
      >
        {loadingView ? (
          <div className='flex justify-center items-center h-48'>
            Loading...
          </div>
        ) : viewEventData ? (
          <div className='space-y-4 max-h-[70vh] overflow-y-auto p-2'>
            {viewEventData.image && (
              <div className='w-full h-64 rounded-lg overflow-hidden'>
                <img
                  src={viewEventData.image}
                  alt={viewEventData.title}
                  className='w-full h-full object-cover'
                />
              </div>
            )}

            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {viewEventData.title}
              </h2>
              {viewEventData.is_featured === 1 && (
                <span className='px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-2 inline-block'>
                  Featured
                </span>
              )}
            </div>

            {viewEventData.category && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Category</h3>
                <p className='text-gray-700'>{viewEventData.category.title}</p>
              </div>
            )}

            {viewEventData.college && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>College</h3>
                <p className='text-gray-700'>{viewEventData.college.name}</p>
              </div>
            )}

            {viewEventData.author && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Author</h3>
                <p className='text-gray-700'>
                  {viewEventData.author.firstName}{' '}
                  {viewEventData.author.middleName}{' '}
                  {viewEventData.author.lastName}
                </p>
              </div>
            )}

            {viewEventData.event_host && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Event Details</h3>
                <div className='space-y-2'>
                  {(() => {
                    const eventHost = viewEventData.event_host
                    return (
                      <>
                        {eventHost.host && (
                          <p className='text-gray-700'>
                            <span className='font-medium'>Host:</span>{' '}
                            {eventHost.host}
                          </p>
                        )}
                        {eventHost.start_date && (
                          <p className='text-gray-700'>
                            <span className='font-medium'>Start Date:</span>{' '}
                            {eventHost.start_date}
                          </p>
                        )}
                        {eventHost.end_date && (
                          <p className='text-gray-700'>
                            <span className='font-medium'>End Date:</span>{' '}
                            {eventHost.end_date}
                          </p>
                        )}
                        {eventHost.time && (
                          <p className='text-gray-700'>
                            <span className='font-medium'>Time:</span>{' '}
                            {eventHost.time}
                          </p>
                        )}
                        {eventHost.map_url && (
                          <p className='text-gray-700'>
                            <span className='font-medium'>Location:</span>{' '}
                            <a
                              href={eventHost.map_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 hover:underline inline-flex items-center gap-1'
                            >
                              <MapPin className='inline w-4 h-4' /> View Map
                            </a>
                          </p>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {viewEventData.description && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewEventData.description
                  }}
                />
              </div>
            )}

            {viewEventData.content && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Content</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewEventData.content
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <p className='text-center text-gray-500'>No event data available.</p>
        )}
      </Modal>
    </>
  )
}
