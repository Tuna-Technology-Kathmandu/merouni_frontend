'use client'
import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import FileUpload from '../addCollege/FileUpload'
import Table from '../../../../ui/molecules/Table'
import { Search, Globe, MapPin } from 'lucide-react'
import { createColumns } from './columns'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { X } from 'lucide-react'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Modal } from '../../../../ui/molecules/UserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Checkbox } from '@/ui/shadcn/checkbox'
import { Controller } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'

const CKEditor = dynamic(() => import('../component/CKStable'), {
  ssr: false
})

export default function ConsultancyForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [consultancies, setConsultancies] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    featured: '',
    logo: ''
  })
  const [deleteId, setDeleteId] = useState(null)
  const [editId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewConsultancyData, setViewConsultancyData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)
  const [selectedColleges, setSelectedColleges] = useState([])
  const [collegeSearch, setCollegeSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      destination: [],
      address: {
        street: '',
        city: '',
        state: '',
        zip: ''
      },
      description: '',
      contact: ['', ''],
      website_url: '',
      google_map_url: '',
      video_url: '',
      featured_image: '',
      logo: '',
      pinned: 0,
      courses: []
    }
  })
  const {
    fields: destinationFeilds,
    append: appendDestination,
    remove: removeDestination
  } = useFieldArray({ control, name: 'destination' })

  useEffect(() => {
    setHeading('Consultancy Management')
    fetchConsultancies()
    return () => setHeading(null)
  }, [setHeading])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditing(false)
      setEditingId(null)
      reset({
        title: '',
        destination: [],
        address: {
          street: '',
          city: '',
          state: '',
          zip: ''
        },
        description: '',
        contact: ['', ''],
        website_url: '',
        google_map_url: '',
        video_url: '',
        featured_image: '',
        logo: '',
        pinned: 0,
        courses: []
      })
      setUploadedFiles({
        featured: '',
        logo: ''
      })
      // Remove query parameter from URL
      router.replace('/dashboard/consultancy', { scroll: false })
    }
  }, [searchParams, router, reset])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const { requireAdmin } = useAdminPermission()

  const fetchConsultancies = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy?page=${page}`
      )
      const data = await response.json()
      setConsultancies(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      toast.error('Failed to fetch consultancies')
    } finally {
      setTableLoading(false)
    }
  }

  const searchCollege = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/course?q=${query}`
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
      setValue('courses', collegeIds)
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
    setValue('courses', updatedCollegeIds)
  }

  const onSubmit = async (data) => {
    try {
      // Build the payload with all fields - always include all fields explicitly
      const payload = {
        title: data.title?.trim() || '',
        destination: Array.isArray(data.destination)
          ? data.destination
              .map((d) => (typeof d === 'string' ? d : (d?.country ?? '')))
              .filter(Boolean)
          : [],
        address: data.address || {},
        featured_image: uploadedFiles.featured || '',
        logo:
          uploadedFiles.logo && uploadedFiles.logo.trim() !== ''
            ? uploadedFiles.logo.trim()
            : null,
        description:
          data.description && data.description.trim() !== ''
            ? data.description.trim()
            : null,
        contact: Array.isArray(data.contact)
          ? data.contact.filter((c) => c && c.trim() !== '')
          : [],
        website_url:
          data.website_url && data.website_url.trim() !== ''
            ? data.website_url.trim()
            : null,
        google_map_url:
          data.google_map_url && data.google_map_url.trim() !== ''
            ? data.google_map_url.trim()
            : null,
        video_url:
          data.video_url && data.video_url.trim() !== ''
            ? data.video_url.trim()
            : null,
        pinned: data.pinned ? 1 : 0,
        courses: Array.isArray(data.courses)
          ? data.courses
          : data.courses
            ? [data.courses]
            : []
      }

      if (editId) {
        payload.id = editId
      }

      const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy`
      const method = 'POST'
      console.log('consultancy payload', payload)

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      await response.json()

      toast.success(
        editing
          ? 'Consultancy updated successfully!'
          : 'Consultancy created successfully!'
      )
      setEditing(false)
      reset()
      setSelectedColleges([])
      setUploadedFiles({ featured: '', logo: '' })
      setEditingId(null)
      setIsOpen(false)
      fetchConsultancies()
      fetchConsultancies()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save consultancy')
    }
  }

  const handleEdit = async (consultancy) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)
      // const response = await authFetch(
      //   `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy/${slug}`
      // );
      // const data = await response.json();
      // console.log("editdata", editdata);
      // const consultancy = editdata;
      console.log('while edititnc consul', consultancy)
      setEditingId(consultancy.id)
      setValue('title', consultancy.title)
      setValue('description', consultancy.description || '')
      setValue('website_url', consultancy.website_url || '')
      setValue('google_map_url', consultancy.google_map_url || '')
      setValue('video_url', consultancy.video_url || '')
      const parsedDestination = Array.isArray(consultancy.destination)
        ? consultancy.destination
        : typeof consultancy.destination === 'string'
          ? (() => {
              try {
                return JSON.parse(consultancy.destination)
              } catch {
                return []
              }
            })()
          : []
      const destinationForForm = (
        Array.isArray(parsedDestination) ? parsedDestination : []
      ).map((d) =>
        typeof d === 'string' ? { country: d } : { country: d?.country ?? '' }
      )
      setValue(
        'destination',
        destinationForForm.length ? destinationForForm : []
      )
      setValue('address', JSON.parse(consultancy.address))
      const parsedContact = consultancy.contact
        ? typeof consultancy.contact === 'string'
          ? JSON.parse(consultancy.contact)
          : consultancy.contact
        : ['', '']
      setValue(
        'contact',
        parsedContact.length >= 2
          ? parsedContact
          : [...parsedContact, ...Array(2 - parsedContact.length).fill('')]
      )
      setValue('pinned', consultancy.pinned)
      // setValue("courses", consultancy.courses);
      let consultId = consultancy.consultancyCourses.map((c) => c.id)
      setValue('courses', consultId)
      const consultData = consultancy.consultancyCourses.map((c) => ({
        id: c.id,
        title: c.title
      }))
      setSelectedColleges(consultData)
      setValue(
        'courses',
        consultData.map((c) => c.id)
      )

      setUploadedFiles({
        featured: consultancy.featured_image || '',
        logo: consultancy.logo || ''
      })
    } catch (error) {
      toast.error('Failed to fetch consultancy details')
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

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy?id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchConsultancies()
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

      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch consultancy details')
      }

      const data = await response.json()
      setViewConsultancyData(data.consultancy)
    } catch (err) {
      toast.error(err.message || 'Failed to load consultancy details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewConsultancyData(null)
  }

  // Create columns with handlers (must be after handlers are defined)
  const columns = createColumns({
    handleView,
    handleEdit,
    handleDeleteClick
  })

  const handleSearch = async (query) => {
    if (!query) {
      fetchConsultancies()
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setConsultancies(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching consultancy:', response.statusText)
        setConsultancies([])
      }
    } catch (error) {
      console.error('Error fetching consutancy search results:', error.message)
      setConsultancies([])
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
              placeholder='Search consultancies...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setEditingId(null)
                reset()
                setSelectedColleges([])
                setUploadedFiles({ featured: '', logo: '' })
              }}
            >
              Add Consultancy
            </Button>
          </div>
        </div>
        <ToastContainer />

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            setEditing(false)
            setEditingId(null)
            reset()
            setSelectedColleges([])
            setUploadedFiles({ featured: '', logo: '' })
          }}
          title={editing ? 'Edit Consultancy' : 'Add Consultancy'}
          className='max-w-5xl'
        >
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-8 pr-2'>
                {/* Basic info */}
                <div className='space-y-4'>
                  <h3 className='text-sm font-semibold text-gray-900 border-b pb-2'>
                    Basic Information
                  </h3>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='title'
                      className='after:content-["*"] after:ml-0.5 after:text-destructive'
                    >
                      Title
                    </Label>
                    <Input
                      id='title'
                      placeholder='Consultancy name'
                      {...register('title', {
                        required: 'Title is required',
                        minLength: {
                          value: 3,
                          message: 'Title must be at least 3 characters'
                        }
                      })}
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className='text-sm text-destructive'>
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='description'>Description</Label>
                    <CKEditor
                      value={watch('description') || ''}
                      onChange={(data) => setValue('description', data)}
                      id='consultancy-description-editor'
                    />
                  </div>
                </div>

                {/* Destinations */}
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-sm font-semibold text-gray-900 border-b pb-2 flex-1'>
                      Destinations (Countries)
                    </h3>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => appendDestination({ country: '' })}
                      className='shrink-0 ml-4'
                    >
                      <Plus className='w-4 h-4 mr-1' />
                      Add Country
                    </Button>
                  </div>
                  <div className='space-y-3'>
                    {destinationFeilds.map((field, index) => (
                      <div key={field.id} className='flex gap-3 items-end'>
                        <div className='flex-1 space-y-2'>
                          <Label htmlFor={`destination-${index}`}>
                            Country
                          </Label>
                          <Input
                            id={`destination-${index}`}
                            {...register(`destination.${index}.country`)}
                            placeholder=''
                          />
                        </div>
                        {index > 0 && (
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={() => removeDestination(index)}
                            className='shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10'
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div className='space-y-4'>
                  <h3 className='text-sm font-semibold text-gray-900 border-b pb-2'>
                    Address
                  </h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='address.street'>Street</Label>
                      <Input
                        id='address.street'
                        {...register('address.street')}
                        placeholder='Street'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='address.city'>City</Label>
                      <Input
                        id='address.city'
                        {...register('address.city')}
                        placeholder='City'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='address.state'>State</Label>
                      <Input
                        id='address.state'
                        {...register('address.state')}
                        placeholder='State'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='address.zip'>ZIP</Label>
                      <Input
                        id='address.zip'
                        {...register('address.zip')}
                        placeholder='ZIP'
                      />
                    </div>
                  </div>
                </div>

                {/* Courses */}
                <div className='space-y-4'>
                  <h3 className='text-sm font-semibold text-gray-900 border-b pb-2'>
                    Courses
                  </h3>
                  <div className='flex flex-wrap gap-2 mb-3'>
                    {selectedColleges.map((college) => (
                      <span
                        key={college.id}
                        className='inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary'
                      >
                        {college.title}
                        <button
                          type='button'
                          onClick={() => removeCollege(college.id)}
                          className='rounded-full hover:bg-primary/20 p-0.5'
                          aria-label='Remove'
                        >
                          <X className='w-3.5 h-3.5' />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className='relative space-y-2'>
                    <Label htmlFor='course-search'>Search courses</Label>
                    <Input
                      id='course-search'
                      type='text'
                      value={collegeSearch}
                      onChange={searchCollege}
                      placeholder='Type to search and add courses...'
                    />
                    {searchResults.length > 0 && (
                      <ul className='absolute z-10 w-full mt-1 rounded-md border bg-popover shadow-md max-h-60 overflow-auto py-1'>
                        {searchResults.map((college) => (
                          <li key={college.id}>
                            <button
                              type='button'
                              onClick={() => addCollege(college)}
                              className='w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground'
                            >
                              {college.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Contact & URLs */}
                <div className='space-y-4'>
                  <h3 className='text-sm font-semibold text-gray-900 border-b pb-2'>
                    Contact & Links
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='contact.0'>Contact 1</Label>
                      <Input
                        id='contact.0'
                        {...register('contact.0')}
                        placeholder='Phone or email'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='contact.1'>Contact 2</Label>
                      <Input
                        id='contact.1'
                        {...register('contact.1')}
                        placeholder='Phone or email'
                      />
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='website_url'>Website URL</Label>
                    <Input
                      id='website_url'
                      type='url'
                      {...register('website_url')}
                      placeholder='https://example.com'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='google_map_url'>Google Map URL</Label>
                    <Textarea
                      id='google_map_url'
                      {...register('google_map_url')}
                      placeholder='Paste Google Maps embed iframe code'
                      rows={3}
                      className='resize-none'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Paste the iframe code from Google Maps embed
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='video_url'>YouTube Video URL</Label>
                    <Input
                      id='video_url'
                      type='url'
                      {...register('video_url')}
                      placeholder='https://www.youtube.com/watch?v=...'
                    />
                    <p className='text-xs text-muted-foreground'>
                      Enter a YouTube video URL
                    </p>
                  </div>
                </div>

                {/* Pinned & Media */}
                <div className='space-y-4'>
                  <h3 className='text-sm font-semibold text-gray-900 border-b pb-2'>
                    Options & Media
                  </h3>
                  <div className='flex items-center space-x-2'>
                    <Controller
                      name='pinned'
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id='pinned'
                          checked={!!field.value}
                          onCheckedChange={(v) => field.onChange(v ? 1 : 0)}
                        />
                      )}
                    />
                    <Label
                      htmlFor='pinned'
                      className='font-normal cursor-pointer'
                    >
                      Pin this consultancy
                    </Label>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label>Logo</Label>
                      <FileUpload
                        label=''
                        onUploadComplete={(url) => {
                          setUploadedFiles((prev) => ({ ...prev, logo: url }))
                          setValue('logo', url)
                        }}
                        defaultPreview={uploadedFiles.logo}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='after:content-["*"] after:ml-0.5 after:text-destructive'>
                        Featured Image
                      </Label>
                      <FileUpload
                        label=''
                        onUploadComplete={(url) => {
                          setUploadedFiles((prev) => ({
                            ...prev,
                            featured: url
                          }))
                          setValue('featured_image', url)
                        }}
                        defaultPreview={uploadedFiles.featured}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='sticky bottom-0 bg-background border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsOpen(false)
                    setEditing(false)
                    setEditingId(null)
                    reset()
                    setUploadedFiles({ featured: '', logo: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit' disabled={loading}>
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update Consultancy'
                      : 'Create Consultancy'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={consultancies}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchConsultancies(newPage)}
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
        message='Are you sure you want to delete this consultancy? This action cannot be undone.'
      />

      {/* View Consultancy Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title='Consultancy Details'
        className='max-w-4xl max-h-[90vh] overflow-y-auto'
      >
        {loadingView ? (
          <div className='flex items-center justify-center py-8'>
            <div className='text-gray-500'>Loading...</div>
          </div>
        ) : viewConsultancyData ? (
          <div className='space-y-6'>
            {/* Logo and Basic Info */}
            <div className='flex items-start gap-4 border-b pb-4'>
              {viewConsultancyData.logo && (
                <img
                  src={viewConsultancyData.logo}
                  alt={viewConsultancyData.title}
                  className='w-20 h-20 object-contain rounded-lg border'
                />
              )}
              <div className='flex-1'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  {viewConsultancyData.title}
                </h2>
                {viewConsultancyData.website_url && (
                  <div className='mt-2'>
                    <a
                      href={
                        viewConsultancyData.website_url.startsWith('http')
                          ? viewConsultancyData.website_url
                          : `https://${viewConsultancyData.website_url}`
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline inline-flex items-center gap-1'
                    >
                      <Globe className='w-4 h-4' />{' '}
                      {viewConsultancyData.website_url}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {viewConsultancyData.address && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Address</h3>
                <div className='text-gray-700 space-y-1'>
                  {(() => {
                    const address =
                      typeof viewConsultancyData.address === 'string'
                        ? JSON.parse(viewConsultancyData.address)
                        : viewConsultancyData.address || {}
                    return (
                      <>
                        {address.street && <p>{address.street}</p>}
                        <p>
                          {[address.city, address.state, address.zip]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        {viewConsultancyData.google_map_url && (
                          <a
                            href={viewConsultancyData.google_map_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 hover:underline inline-flex items-center gap-1 mt-2'
                          >
                            <MapPin className='w-4 h-4' /> View on Map
                          </a>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {viewConsultancyData.contact && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  Contact Information
                </h3>
                <div className='space-y-1'>
                  {(() => {
                    const contacts =
                      typeof viewConsultancyData.contact === 'string'
                        ? JSON.parse(viewConsultancyData.contact)
                        : Array.isArray(viewConsultancyData.contact)
                          ? viewConsultancyData.contact
                          : []
                    return contacts.map(
                      (contact, index) =>
                        contact && (
                          <p key={index} className='text-gray-700'>
                            {contact}
                          </p>
                        )
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Destinations */}
            {viewConsultancyData.destination && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Destinations</h3>
                <div className='flex flex-wrap gap-2'>
                  {(() => {
                    const destinations =
                      typeof viewConsultancyData.destination === 'string'
                        ? JSON.parse(viewConsultancyData.destination)
                        : viewConsultancyData.destination || []
                    return destinations.map((dest, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                      >
                        {typeof dest === 'string'
                          ? dest
                          : dest?.country || 'N/A'}
                      </span>
                    ))
                  })()}
                </div>
              </div>
            )}

            {/* Courses/Programs */}
            {viewConsultancyData.consultancyCourses &&
              viewConsultancyData.consultancyCourses.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold mb-2'>Courses</h3>
                  <div className='flex flex-wrap gap-2'>
                    {viewConsultancyData.consultancyCourses.map(
                      (course, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                        >
                          {course.title || 'N/A'}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Description */}
            {viewConsultancyData.description && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewConsultancyData.description
                  }}
                />
              </div>
            )}

            {/* Status */}
            <div className='flex gap-4 pt-4 border-t'>
              <div>
                <span className='text-sm font-medium text-gray-700'>
                  Pinned:{' '}
                </span>
                <span className='text-sm text-gray-600'>
                  {viewConsultancyData.pinned === 1 ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
