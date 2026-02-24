'use client'
import FileUpload from '@/app/(dashboard)/dashboard/colleges/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import { Button } from '@/ui/shadcn/button'
import { Checkbox } from '@/ui/shadcn/checkbox'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import { Textarea } from '@/ui/shadcn/textarea'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { fetchCourses } from './actions'

export default function EditConsultancyPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    featured: '',
    logo: ''
  })
  const [selectedColleges, setSelectedColleges] = useState([])
  const [selectedDestinations, setSelectedDestinations] = useState([])
  const author_id = useSelector((state) => state.user.data?.id)

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
      ).map((d) => {
        const title = typeof d === 'string' ? d : (d?.country || d?.title || '')
        return { id: title, title: title }
      }).filter(d => d.id)

      setSelectedDestinations(destinationForForm)
      setValue(
        'destination',
        destinationForForm.map(d => d.title)
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
        destination: selectedDestinations.map(d => d.title).filter(Boolean),
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
              <TipTapEditor
                value={watch('description') || ''}
                onChange={(data) => setValue('description', data)}
                placeholder="Write about your consultancy..."
              />
            </div>
          </div>

          {/* Destinations */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-gray-900 border-b pb-2 flex-1'>
              Student's Destination (Countries)
            </h3>
            <div className='space-y-3'>
              <SearchSelectCreate
                allowCreate={true}
                onSearch={() => []}
                onCreate={(query) => ({ id: query, title: query })}
                onSelect={(item) => {
                  const current = selectedDestinations || []
                  if (!current.some(d => d.id === item.id)) {
                    const updatedDestinations = [...current, item]
                    setSelectedDestinations(updatedDestinations)
                    setValue('destination', updatedDestinations.map(d => d.title))
                  }
                }}
                onRemove={(item) => {
                  const fresh = selectedDestinations.filter(d => d.id !== item.id)
                  setSelectedDestinations(fresh)
                  setValue('destination', fresh.map(d => d.title))
                }}
                selectedItems={selectedDestinations}
                placeholder="Search or add countries..."
                isMulti={true}
                displayKey="title"
              />
            </div>
          </div>

          {/* Address */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-gray-900 border-b pb-2'>
              Consultancy's Location
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
            <SearchSelectCreate
              onSearch={fetchCourses}
              onSelect={(item) => {
                const current = watch('courses') || []
                if (!current.includes(item.id)) {
                  setValue('courses', [...current, item.id])
                  setSelectedColleges(prev => [...prev, item])
                }
              }}
              onRemove={(item) => {
                const current = watch('courses') || []
                setValue('courses', current.filter(id => id !== item.id))
                setSelectedColleges(prev => prev.filter(c => c.id !== item.id))
              }}
              selectedItems={selectedColleges}
              placeholder="Search and add courses..."
              isMulti={true}
              displayKey="title"
            />
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
