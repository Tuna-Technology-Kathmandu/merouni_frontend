'use client'
import { authFetch } from '@/app/utils/authFetch'
import { THEME_BLUE } from '@/constants/constants'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'
import { Edit, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import FileUpload from '../addCollege/FileUpload'

export default function BannerForm() {
  const { setHeading } = usePageHeading()
  const [maxPosition, setMaxPosition] = useState(1)
  const [activePosition, setActivePosition] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bannersByPosition, setBannersByPosition] = useState({})

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      website_url: '',
      date_of_expiry: '',
      display_position: 1,
      banner_image: ''
    }
  })

  useEffect(() => {
    setHeading('Banner Management')
    fetchBannersByPosition()
    return () => {
      setHeading(null)
    }
  }, [setHeading])

  const fetchBannersByPosition = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/banner`
      )
      const data = await response.json()
      const grouped = {}
      let highestPosition = 1
      data.items.forEach((banner) => {
        const position = banner.display_position || 1
        if (!grouped[position]) {
          grouped[position] = []
        }
        grouped[position].push(banner)
        if (position > highestPosition) {
          highestPosition = position
        }
      })

      setBannersByPosition(grouped)
      setMaxPosition(highestPosition)
      setActivePosition(
        Object.keys(grouped).length > 0
          ? Math.min(...Object.keys(grouped).map(Number))
          : 1
      )
    } catch (error) {
      toast.error('Failed to fetch banners')
    }
  }

  const { requireAdmin } = useAdminPermission()
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const bannerData = {
        title: data.title,
        website_url: data.website_url,
        date_of_expiry: data.date_of_expiry,
        display_position: Number(data.display_position || activePosition),
        banner_image: data.banner_image,
      }

      const url = `${process.env.baseUrl}/banner`
      const method = editing ? 'PUT' : 'POST'

      await authFetch(editing ? `${url}/${editId}` : url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData)
      })

      toast.success(
        editing
          ? 'Banner updated successfully!'
          : 'Banner created successfully!'
      )

      setEditing(false)
      resetFormForPosition(activePosition)
      fetchBannersByPosition()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save banner')
    } finally {
      setLoading(false)
    }
  }


  const handleEdit = async (banner) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)
      setEditingId(banner.id)
      setActivePosition(banner.display_position)

      reset({
        title: banner.title || banner.Banners?.[0]?.title || '',
        website_url: banner.website_url || banner.Banners?.[0]?.website_url || '',
        date_of_expiry: banner.date_of_expiry
          ? new Date(banner.date_of_expiry).toISOString().split('T')[0]
          : '',
        display_position: banner.display_position || activePosition,
        banner_image: banner.banner_image
      })
    } catch (error) {
      toast.error('Failed to fetch banner details')
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      await authFetch(
        `${process.env.baseUrl}/banner/${deleteId}`,
        { method: 'DELETE' }
      )
      toast.success('Banner deleted successfully')
      await fetchBannersByPosition()
    } catch (error) {
      toast.error('Failed to delete banner')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const resetFormForPosition = (position) => {
    reset({
      title: '',
      website_url: '',
      date_of_expiry: '',
      display_position: position,
      banner_image: ''
    })
    setEditing(false)
    setEditingId(null)
  }

  const isExpiredOrExpiringToday = (dateString) => {
    if (!dateString) return false
    const expiryDate = new Date(dateString)
    const today = new Date()

    // Reset time parts for accurate date comparison
    today.setHours(0, 0, 0, 0)
    expiryDate.setHours(0, 0, 0, 0)

    return expiryDate <= today
  }

  // Helper to get expiration status text
  const getExpirationStatus = (dateString) => {
    if (!dateString) return null
    const expiryDate = new Date(dateString)
    const today = new Date()

    today.setHours(0, 0, 0, 0)
    expiryDate.setHours(0, 0, 0, 0)

    if (expiryDate < today) return 'Expired!'
    if (expiryDate.getTime() === today.getTime()) return 'Expiring Today!'
    return null
  }

  const handlePositionEdit = (position) => {
    const banners = bannersByPosition[position] || []
    if (banners.length > 0) {
      // If there's a banner, edit the first one (or you can handle multiple)
      handleEdit(banners[0])
    } else {
      // If no banner exists, allow creating one for this position
      setActivePosition(position)
      setIsOpen(true)
      resetFormForPosition(position)
      setEditing(false)
      setEditingId(null)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <ToastContainer />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        {[1, 2, 3, 4, 5, 6, 7].map((position) => {
          const banners = bannersByPosition[position] || []
          const hasBanner = banners.length > 0
          const banner = hasBanner ? banners[0] : null
          const status = banner
            ? getExpirationStatus(banner.date_of_expiry)
            : null
          const showAlert = banner
            ? isExpiredOrExpiringToday(banner.date_of_expiry)
            : false

          return (
            <div
              key={position}
              className='border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-[200px] flex flex-col relative'
            >
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold'>Position {position}</h3>
                <button
                  onClick={() => handlePositionEdit(position)}
                  className='px-3 py-1.5 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2 text-sm shadow-sm'
                  style={{ backgroundColor: THEME_BLUE }}
                  title={hasBanner ? 'Edit Banner' : 'Create Banner'}
                >
                  <Edit size={14} />
                  {/* Edit */}
                </button>
              </div>

              {hasBanner && banner ? (
                <div className='flex-1 flex flex-col'>
                  {/* Banner Image */}
                  <div className='mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50'>
                    <img
                      src={banner.banner_image}
                      alt={banner.title}
                      className='w-full h-32 object-cover'
                    />
                  </div>

                  {showAlert && (
                    <span
                      className={`inline-block self-start text-xs font-medium px-2 py-1 rounded-full mb-3 ${status === 'Expired!'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                      {status}
                    </span>
                  )}

                  {/* Banner content */}
                  <div className='mb-2'>
                    <h4 className='font-medium text-gray-800 mb-2'>
                      {banner.title ||
                        banner.Banners?.[0]?.title ||
                        'Untitled Banner'}
                    </h4>

                    {banner.website_url && (
                      <a
                        href={banner.website_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:underline text-sm block mb-2 truncate font-medium'
                        style={{ color: THEME_BLUE }}
                      >
                        {banner.website_url}
                      </a>
                    )}

                    {banner.date_of_expiry && (
                      <p
                        className={`text-sm ${showAlert ? 'text-red-600' : 'text-gray-600'
                          }`}
                      >
                        Expires:{' '}
                        {formatDate(banner.date_of_expiry)}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className='flex-1 flex items-center justify-center'>
                  <p className='text-gray-400 text-center'>
                    No banner for this position
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white p-6 rounded-lg shadow-md max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>
                {editing ? 'Edit Banner' : 'Create Banner'} (Position{' '}
                {activePosition})
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false)
                  setEditing(false)
                  setEditingId(null)
                  resetFormForPosition(activePosition)
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>

              <div className='mb-4'>
                <label className='block mb-2'>Website URL</label>
                <input
                  type='text'
                  {...register('website_url', {
                    required: 'Website URL is required',
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.-]*)*\/?$/,
                      message: 'Enter a valid URL'
                    }
                  })}
                  className='w-full p-2 border rounded'
                  placeholder='Enter website URL'
                />
                {errors.website_url && (
                  <span className='text-red-500'>
                    {errors.website_url.message}
                  </span>
                )}
              </div>

              <div className='mb-4'>
                <label className='block mb-2'>
                  Date of Expiry <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  {...register('date_of_expiry', {
                    required: 'Date of expiry is required',
                    validate: (value) => {
                      const selectedDate = new Date(value)
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return (
                        selectedDate >= today || 'Date must be in the future'
                      )
                    }
                  })}
                  className='w-full p-2 border rounded'
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.date_of_expiry && (
                  <span className='text-red-500'>
                    {errors.date_of_expiry.message}
                  </span>
                )}
              </div>

              <input
                type='hidden'
                {...register('display_position')}
                value={activePosition}
              />

              <div className='space-y-6'>
                <div className='p-4 border rounded-lg space-y-4'>
                  <div>
                    <label className='block mb-2'>
                      Banner Title <span className='text-red-500'>*</span>
                    </label>
                    <input
                      {...register('title', {
                        required: 'Banner title is required'
                      })}
                      className='w-full p-2 border rounded'
                      placeholder='Enter banner title'
                    />
                    {errors.title && (
                      <span className='text-red-500'>
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  <FileUpload
                    label={
                      editing
                        ? 'Banner Image (Change Image)'
                        : 'Banner Image'
                    }
                    onUploadComplete={(url) => {
                      setValue('banner_image', url)
                    }}
                    defaultPreview={watch('banner_image')}
                  />
                </div>

              </div>

              <div className='flex justify-end gap-4 mt-6'>
                <Button
                  type='button'
                  onClick={() => {
                    setIsOpen(false)
                    setEditing(false)
                    setEditingId(null)
                    resetFormForPosition(activePosition)
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={loading}
                  className='text-white hover:opacity-90 px-6 py-2 transition-all shadow-md'
                  style={{ backgroundColor: THEME_BLUE }}
                >
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update Banner'
                      : 'Create Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setDeleteId(null)
        }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this banner? This action cannot be undone.'
      />
    </div>
  )
}
