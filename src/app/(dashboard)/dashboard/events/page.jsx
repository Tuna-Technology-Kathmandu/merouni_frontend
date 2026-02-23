'use client'
import { getEvents } from '@/app/action'
import { authFetch } from '@/app/utils/authFetch'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Edit2, Eye, MapPin, Plus, Trash2 } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import Table from '@/ui/shadcn/DataTable'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import FileUpload from '../addCollege/FileUpload'
import { fetchCategories } from '../category/action'
import SearchInput from '@/ui/molecules/SearchInput'
import { formatDate } from '@/utils/date.util'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'

export default function EventManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

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
  const [tableLoading, setTableLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({ image: '' })
  const [formErrors, setFormErrors] = useState({})
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  })
  const [categories, setCategories] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEventId, setEditingEventId] = useState(null)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewEventData, setViewEventData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesList = await fetchCategories(1, 1000, 'EVENT')
        setCategories(categoriesList.items)
      } catch (error) { }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    setHeading('Events Management')
    loadEvents()
    return () => setHeading(null)
  }, [setHeading, searchParams])

  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      handleAddClick()
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams, router, reset])

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTimeout])

  // SearchSelectCreate-compatible college search — lists all by default, filters on query
  const searchCollege = async (query) => {
    try {
      const url = query && query.length >= 1
        ? `${process.env.baseUrl}/college?q=${query}&limit=50`
        : `${process.env.baseUrl}/college?limit=50`
      const response = await authFetch(url)
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('College Search Error:', error)
      return []
    }
  }

  // SearchSelectCreate-compatible category search
  const searchCategory = async (query) => {
    try {
      const filtered = categories.filter((c) =>
        c.title.toLowerCase().includes((query || '').toLowerCase())
      )
      return filtered
    } catch (error) {
      return categories
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadEvents()
      return
    }
    try {
      const response = await authFetch(`${process.env.baseUrl}/event?q=${query}`)
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
        setEvents([])
      }
    } catch (error) {
      setEvents([])
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    if (value === '') {
      handleSearch('')
    } else {
      const timeoutId = setTimeout(() => handleSearch(value), 300)
      setSearchTimeout(timeoutId)
    }
  }

  const loadEvents = async (page = 1) => {
    try {
      setTableLoading(true)
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', page)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
      const response = await getEvents(page)
      setEvents(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      toast.error('Failed to load events')
    } finally {
      setTableLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingEventId(null)
    reset()
    setUploadedFiles({ image: '' })
    setSelectedCollege(null)
    setSelectedCategory(null)
    setFormErrors({})
  }

  const handleAddClick = () => {
    setIsOpen(true)
    setEditing(false)
    setEditingEventId(null)
    reset()
    setUploadedFiles({ image: '' })
    setSelectedCollege(null)
    setSelectedCategory(null)
    setFormErrors({})
  }

  const onSubmit = async (data) => {
    // Validate description (TipTap returns HTML, check plain text)
    const descPlain = (data.description || '').replace(/<[^>]*>/g, '').trim()
    if (!descPlain) {
      setFormErrors((prev) => ({ ...prev, description: 'Description is required' }))
      return
    }
    setFormErrors({})
    setLoading(true)
    try {
      const formData = {
        ...data,
        is_featured: Number(data.is_featured),
        image: uploadedFiles.image
      }

      if (!formData.college_id || formData.college_id === '' || formData.college_id === null) {
        delete formData.college_id
      }

      if (editing) {
        formData.id = editingEventId
      }

      const response = await authFetch(`${process.env.baseUrl}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const responseData = await response.json()
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to process event')
      }

      toast.success(editing ? 'Event updated successfully' : 'Event created successfully')
      handleCloseModal()
      loadEvents()
    } catch (err) {
      toast.error(`Failed to ${editing ? 'update' : 'create'} event: ${err.message || 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (data) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(`${process.env.baseUrl}/event/${data.slugs}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      let eventData = await response.json()
      eventData = eventData.item
      setEditingEventId(eventData.id)

      setValue('title', eventData.title)

      // Category
      if (eventData.category) {
        const cat = categories.find((c) => c.title === eventData.category.title)
        if (cat) {
          setValue('category_id', cat.id)
          setSelectedCategory(cat)
        }
      }

      // College
      if (eventData?.college) {
        const res = await authFetch(`${process.env.baseUrl}/college?q=${eventData.college.slugs}`)
        const collegeData = await res.json()
        const college = collegeData.items?.[0]
        if (college) {
          setValue('college_id', college.id)
          setSelectedCollege({ id: college.id, name: eventData.college.name })
        } else {
          setValue('college_id', null)
          setSelectedCollege(null)
        }
      } else {
        setValue('college_id', null)
        setSelectedCollege(null)
      }

      setValue('description', eventData.description)
      setValue('content', eventData.content)
      setValue('image', eventData.image)
      setUploadedFiles({ image: eventData.image })

      let eventHost = eventData.event_host
      if (typeof eventHost === 'string') {
        try { eventHost = JSON.parse(eventHost) } catch { eventHost = {} }
      }
      if (eventHost) {
        setValue('event_host.start_date', eventHost.start_date || '')
        setValue('event_host.end_date', eventHost.end_date || '')
        setValue('event_host.time', eventHost.time || '')
        setValue('event_host.host', eventHost.host || '')
        setValue('event_host.map_url', eventHost.map_url || '')
      }

      setValue('is_featured', eventData.is_featured === 1)
    } catch (error) {
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
        `${process.env.baseUrl}/event?event_id=${deleteId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
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

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const response = await authFetch(`${process.env.baseUrl}/event/${slug}`)
      if (!response.ok) throw new Error('Failed to fetch event details')
      const data = await response.json()
      setViewEventData(data.item)
    } catch (err) {
      toast.error(err.message || 'Failed to load event details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const EditorMemo = React.memo(({ initialData, onChange }) => (
    <CKBlogs id='editor1' initialData={initialData} onChange={onChange} />
  ))

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => {
        const { title, image } = row.original
        return (
          <div className='flex items-center gap-3 max-w-xs overflow-hidden'>
            {image ? (
              <div className='w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-gray-100 border'>
                <img src={image} alt='Event' className='w-full h-full object-cover' />
              </div>
            ) : (
              <div className='w-16 h-16 rounded-lg shrink-0 bg-gray-100 border border-dashed flex items-center justify-center text-xs text-gray-400'>
                No img
              </div>
            )}
            <div className='flex-1 min-w-0'>
              <div className='truncate font-medium text-gray-900'>{title}</div>
            </div>
          </div>
        )
      }
    },
    {
      header: 'Host',
      id: 'host',
      cell: ({ row }) => {
        const rawValue = row.original.event_host
        if (!rawValue) return <span className="text-gray-400">—</span>
        try {
          const eventHost = JSON.parse(rawValue)
          return eventHost.host ? (
            <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
              {eventHost.host}
            </span>
          ) : <span className="text-gray-400">—</span>
        } catch { return <span className="text-gray-400">—</span> }
      }
    },
    {
      header: 'Start Date',
      id: 'start_date',
      cell: ({ row }) => {
        const rawValue = row.original.event_host
        if (!rawValue) return '—'
        try {
          const eventHost = JSON.parse(rawValue)
          return formatDate(eventHost.start_date) || '—'
        } catch { return '—' }
      }
    },
    {
      header: 'End Date',
      id: 'end_date',
      cell: ({ row }) => {
        const rawValue = row.original.event_host
        if (!rawValue) return '—'
        try {
          const eventHost = JSON.parse(rawValue)
          return formatDate(eventHost.end_date) || '—'
        } catch { return '—' }
      }
    },
    {
      header: 'Featured',
      accessorKey: 'is_featured',
      cell: ({ getValue }) => getValue() ? (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Yes</span>
      ) : (
        <span className="text-gray-400 text-sm">No</span>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original.slugs)}
            className='hover:bg-blue-50 text-blue-600'
            title="View Details"
          >
            <Eye className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            className='hover:bg-amber-50 text-amber-600'
            title="Edit"
          >
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original.id)}
            className='hover:bg-red-50 text-red-600'
            title="Delete"
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )
    }
  ], [categories])

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer position='top-right' autoClose={3000} />

      {/* Sticky Header */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search events...'
            className='max-w-md w-full'
          />
          <Button
            onClick={handleAddClick}
            className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2'
          >
            <Plus className='w-4 h-4' />
            Add Event
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-xl shadow-sm border overflow-hidden'>
        <Table
          columns={columns}
          data={events}
          pagination={pagination}
          onPageChange={(page) => loadEvents(page)}
          loading={tableLoading}
          showSearch={false}
        />
      </div>

      {/* Add / Edit Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={handleCloseModal}
        closeOnOutsideClick={false}
        className='max-w-5xl'
      >
        <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className='text-lg font-semibold text-gray-900'>
              {editing ? 'Edit Event' : 'Add New Event'}
            </DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form id='event-form' onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

              {/* Basic Information */}
              <section className='space-y-4'>
                <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>Basic Information</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label required>Event Title</Label>
                    <Input
                      {...register('title', { required: 'Title is required' })}
                      placeholder='Enter event title'
                      className={errors.title ? 'border-red-400' : ''}
                    />
                    {errors.title && (
                      <p className='text-xs text-red-500'>{errors.title.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label required>Category</Label>
                    <SearchSelectCreate
                      onSearch={searchCategory}
                      onSelect={(item) => {
                        setSelectedCategory(item)
                        setValue('category_id', item.id)
                      }}
                      onRemove={() => {
                        setSelectedCategory(null)
                        setValue('category_id', '')
                      }}
                      selectedItems={selectedCategory}
                      placeholder='Search or select category...'
                      isMulti={false}
                      displayKey='title'
                    />
                    <input type='hidden' {...register('category_id', { required: 'Category is required' })} />
                    {errors.category_id && (
                      <p className='text-xs text-red-500'>{errors.category_id.message}</p>
                    )}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>Associated College</Label>
                  <SearchSelectCreate
                    onSearch={searchCollege}
                    onSelect={(item) => {
                      setSelectedCollege(item)
                      setValue('college_id', item.id)
                    }}
                    onRemove={() => {
                      setSelectedCollege(null)
                      setValue('college_id', null)
                    }}
                    selectedItems={selectedCollege}
                    placeholder='Search college...'
                    isMulti={false}
                    displayKey='name'
                  />
                </div>
              </section>

              {/* Event Host Information */}
              <section className='space-y-4'>
                <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>Event Host & Schedule</h3>

                <div className='space-y-2'>
                  <Label required>Host</Label>
                  <Input
                    {...register('event_host.host', { required: 'Host is required' })}
                    placeholder='Event host name or organization'
                    className={errors.event_host?.host ? 'border-red-400' : ''}
                  />
                  {errors.event_host?.host && (
                    <p className='text-xs text-red-500'>{errors.event_host.host.message}</p>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label required>Start Date</Label>
                    <Input
                      type='date'
                      {...register('event_host.start_date', { required: 'Start date is required' })}
                      className={errors.event_host?.start_date ? 'border-red-400' : ''}
                    />
                    {errors.event_host?.start_date && (
                      <p className='text-xs text-red-500'>{errors.event_host.start_date.message}</p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label required>End Date</Label>
                    <Input
                      type='date'
                      {...register('event_host.end_date', { required: 'End date is required' })}
                      className={errors.event_host?.end_date ? 'border-red-400' : ''}
                    />
                    {errors.event_host?.end_date && (
                      <p className='text-xs text-red-500'>{errors.event_host.end_date.message}</p>
                    )}
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label>Time</Label>
                    <Input type='time' {...register('event_host.time')} />
                  </div>
                  <div className='space-y-2'>
                    <Label>Map Location URL</Label>
                    <Input
                      {...register('event_host.map_url')}
                      placeholder='Google Maps URL'
                    />
                  </div>
                </div>
              </section>

              {/* Details & Media */}
              <section className='space-y-4'>
                <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>Details & Media</h3>

                <div className='space-y-2'>
                  <Label>Description</Label>
                  <div className={formErrors.description ? 'ring-2 ring-red-400/30 rounded-xl' : ''}>
                    <TipTapEditor
                      value={getValues('description')}
                      onChange={(html) => {
                        setValue('description', html, { shouldDirty: true })
                        const plain = html.replace(/<[^>]*>/g, '').trim()
                        if (plain) setFormErrors((prev) => ({ ...prev, description: '' }))
                      }}
                      placeholder='Write the event description, details, schedule...'
                      height='280px'
                    />
                  </div>
                  {formErrors.description && (
                    <p className='text-xs text-red-500 mt-1'>{formErrors.description}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <FileUpload
                    label='Featured Image (Optional)'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, image: url }))
                      setValue('image', url)
                    }}
                    defaultPreview={uploadedFiles.image}
                  />
                </div>

                <div className='flex items-center gap-3 pt-2'>
                  <input
                    type='checkbox'
                    id='is_featured'
                    {...register('is_featured')}
                    className='w-4 h-4 rounded border-gray-300 text-[#387cae] focus:ring-[#387cae]/20'
                  />
                  <Label htmlFor='is_featured' className='cursor-pointer'>
                    Mark as Featured Event
                  </Label>
                </div>
              </section>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type='submit'
              form='event-form'
              disabled={loading}
              className='bg-[#387cae] hover:bg-[#387cae]/90 text-white'
            >
              {loading ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this event? This action cannot be undone.'
      />

      {/* View Event Modal */}
      <Dialog
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewEventData(null) }}
        className='max-w-4xl'
      >
        <DialogContent className='max-w-4xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className='text-lg font-semibold text-gray-900'>Event Details</DialogTitle>
            <DialogClose onClick={() => { setViewModalOpen(false); setViewEventData(null) }} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            {loadingView ? (
              <div className='flex justify-center items-center h-48 text-gray-400'>Loading...</div>
            ) : viewEventData ? (
              <div className='space-y-6'>
                {viewEventData.image && (
                  <div className='w-full h-56 rounded-xl overflow-hidden border'>
                    <img src={viewEventData.image} alt={viewEventData.title} className='w-full h-full object-cover' />
                  </div>
                )}

                <div className='flex items-start gap-3 flex-wrap'>
                  <h2 className='text-2xl font-bold text-gray-900'>{viewEventData.title}</h2>
                  {viewEventData.is_featured === 1 && (
                    <span className='px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
                      Featured
                    </span>
                  )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {viewEventData.category && (
                    <div className='bg-gray-50 p-3 rounded-xl border'>
                      <p className='text-xs font-bold uppercase tracking-wide text-gray-400 mb-1'>Category</p>
                      <p className='font-medium text-gray-800'>{viewEventData.category.title}</p>
                    </div>
                  )}
                  {viewEventData.college && (
                    <div className='bg-gray-50 p-3 rounded-xl border'>
                      <p className='text-xs font-bold uppercase tracking-wide text-gray-400 mb-1'>College</p>
                      <p className='font-medium text-gray-800'>{viewEventData.college.name}</p>
                    </div>
                  )}
                </div>

                {viewEventData.event_host && (() => {
                  const eventHost = viewEventData.event_host
                  return (
                    <div className='bg-gray-50 p-4 rounded-xl border space-y-2'>
                      <h3 className='text-sm font-bold uppercase tracking-wide text-gray-400 mb-3'>Event Schedule</h3>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                        {eventHost.host && (
                          <div><span className='text-gray-500'>Host:</span> <span className='font-medium text-gray-800'>{eventHost.host}</span></div>
                        )}
                        {eventHost.start_date && (
                          <div><span className='text-gray-500'>Start:</span> <span className='font-medium text-gray-800'>{formatDate(eventHost.start_date)}</span></div>
                        )}
                        {eventHost.end_date && (
                          <div><span className='text-gray-500'>End:</span> <span className='font-medium text-gray-800'>{formatDate(eventHost.end_date)}</span></div>
                        )}
                        {eventHost.time && (
                          <div><span className='text-gray-500'>Time:</span> <span className='font-medium text-gray-800'>{eventHost.time}</span></div>
                        )}
                        {eventHost.map_url && (
                          <div>
                            <a href={eventHost.map_url} target='_blank' rel='noopener noreferrer' className='text-blue-600 hover:underline inline-flex items-center gap-1 text-sm'>
                              <MapPin className='w-3.5 h-3.5' /> View Map
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}

                {viewEventData.description && (
                  <div>
                    <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2'>Description</h3>
                    <div className='text-gray-700 prose prose-sm max-w-none' dangerouslySetInnerHTML={{ __html: viewEventData.description }} />
                  </div>
                )}

                {viewEventData.content && (
                  <div>
                    <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2'>Content</h3>
                    <div className='text-gray-700 prose prose-sm max-w-none' dangerouslySetInnerHTML={{ __html: viewEventData.content }} />
                  </div>
                )}
              </div>
            ) : (
              <p className='text-center text-gray-400 py-12'>No event data available.</p>
            )}
          </div>

          <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end'>
            <Button variant='outline' onClick={() => { setViewModalOpen(false); setViewEventData(null) }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
