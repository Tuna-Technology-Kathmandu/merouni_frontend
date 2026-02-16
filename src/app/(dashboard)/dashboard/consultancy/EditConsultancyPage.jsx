'use client'
import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Checkbox } from '@/ui/shadcn/checkbox'
import { Plus, Trash2, X } from 'lucide-react'
import FileUpload from '@/app/(dashboard)/dashboard/addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'

const CKEditor = dynamic(
  () => import('@/ui/molecules/ck-editor/CKStable'),
  {
    ssr: false
  }
)

export default function EditConsultancyPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    featured: '',
    logo: ''
  })
  const [collegeSearch, setCollegeSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedColleges, setSelectedColleges] = useState([])
  const author_id = useSelector((state) => state.user.data.id)

  const {
    register,
    handleSubmit,
    control,
    setValue,
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
    loadConsultancyData()
  }, [])

  const loadConsultancyData = async () => {
    try {
      setLoading(true)
      const response = await authFetch(
        `${process.env.baseUrl}/consultancy/me`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch consultancy data')
      }

      const responseData = await response.json()
      const consultancy = responseData.consultancy || responseData.item || responseData

      if (!consultancy) {
        toast.info('No consultancy profile found. Please create one.')
        setLoading(false)
        return
      }

      setValue('title', consultancy.title)
      setValue('description', consultancy.description || '')
      setValue('website_url', consultancy.website_url || '')
      setValue('google_map_url', consultancy.google_map_url || '')
      setValue('video_url', consultancy.video_url || '')

      // Parse Destination
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

      // Parse Address
      try {
        const address =
          typeof consultancy.address === 'string'
            ? JSON.parse(consultancy.address)
            : consultancy.address || {}
        setValue('address', address)
      } catch (e) {
        setValue('address', { street: '', city: '', state: '', zip: '' })
      }

      // Parse Contact
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

      // Handle Courses/Colleges
      if (consultancy.consultancyCourses) {
        const consultData = consultancy.consultancyCourses.map((c) => ({
          id: c.program?.id || c.id, // Adaptation depending on API response structure
          title: c.program?.title || c.title
        }))
        setSelectedColleges(consultData)
        setValue(
          'courses',
          consultData.map((c) => c.id)
        )
      } else {
        setSelectedColleges([])
        setValue('courses', [])
      }

      setUploadedFiles({
        featured: consultancy.featured_image || '',
        logo: consultancy.logo || ''
      })
      setValue('featured_image', consultancy.featured_image || '')
      setValue('logo', consultancy.logo || '')
      setValue('id', consultancy.id) // Store ID for update

    } catch (error) {
      console.error('Error loading consultancy data:', error)
      toast.error('Failed to load consultancy info')
    } finally {
      setLoading(false)
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
        `${process.env.baseUrl}/course?q=${query}`
      )
      const data = await response.json()
      setSearchResults(data.items || [])
    } catch (error) {
      console.error('College Search Error:', error)
      toast.error('Failed to search colleges')
    }
  }

  const addCollege = (college) => {
    if (!selectedColleges.some((c) => c.id === college.id)) {
      const newColleges = [...selectedColleges, college]
      setSelectedColleges(newColleges)
      setValue('courses', newColleges.map((c) => c.id))
    }
    setCollegeSearch('')
    setSearchResults([])
  }

  const removeCollege = (collegeId) => {
    const newColleges = selectedColleges.filter((c) => c.id !== collegeId)
    setSelectedColleges(newColleges)
    setValue('courses', newColleges.map((c) => c.id))
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const payload = {
        title: data.title?.trim() || '',
        destination: Array.isArray(data.destination)
          ? data.destination
            .map((d) => (typeof d === 'string' ? d : d?.country ?? ''))
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

      // If we have an ID (edit mode), include it
      if (data.id) {
        payload.id = data.id
      }

      // If no ID but we have author_id, we might need it for creation? 
      // Typically backend handles this based on auth token.

      // Use my-consultancy endpoint for update as well if possible, 
      // otherwise fallback to general endpoint with ID.
      // Assuming PUT to /consultancy/my-consultancy updates the user's consultancy.

      const url = `${process.env.baseUrl}/consultancy`

      const response = await authFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save consultancy')
      }

      await response.json()
      toast.success('Consultancy info updated successfully!')

    } catch (error) {
      console.error('Submit Error:', error)
      toast.error(error.message || 'Failed to save consultancy')
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
      <h1 className='text-2xl font-bold mb-4'>Edit Consultancy Information</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col flex-1 overflow-hidden'
      >
        <div className='flex-1 overflow-y-auto space-y-8 pr-2 bg-white p-6 rounded-lg shadow'>
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

        <div className='bg-background border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
          <Button type='submit' disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
