'use client'
import { authFetch } from '@/app/utils/authFetch'
import { THEME_BLUE } from '@/constants/constants'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'
import { Edit, X, GripVertical } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import FileUpload from '../addCollege/FileUpload'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { Label } from '@/ui/shadcn/label'
import { Input } from '@/ui/shadcn/input'

function BannerPositionCard({ position, hasBanner, banner, status, showAlert, onEdit, onDelete }) {
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: position })
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: position,
    disabled: !hasBanner
  })

  return (
    <div
      ref={setDropRef}
      className={`border-2 border-dashed rounded-lg p-4 min-h-[200px] flex flex-col relative transition-all duration-200 ${
        isOver ? 'border-[#387cae] bg-[#387cae]/5 scale-[1.01]' : 'border-gray-300'
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      {/* Header */}
      <div className='flex justify-between items-center mb-3'>
        <div className='flex items-center gap-2'>
          {hasBanner && (
            <span
              ref={setDragRef}
              {...attributes}
              {...listeners}
              className='cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors'
              title='Drag to reorder'
            >
              <GripVertical size={16} />
            </span>
          )}
          <h3 className='text-base font-semibold text-gray-800'>Position {position}</h3>
        </div>
        <button
          onClick={() => onEdit(position)}
          className='px-2.5 py-1 text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-1.5 text-xs shadow-sm'
          style={{ backgroundColor: THEME_BLUE }}
          title={hasBanner ? 'Edit Banner' : 'Create Banner'}
        >
          <Edit size={12} />
        </button>
      </div>

      {hasBanner && banner ? (
        <div className='flex-1 flex flex-col'>
          <div className='mb-3 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 min-h-[8rem]'>
            {banner.banner_image ? (
              <img
                src={banner.banner_image}
                alt={banner.title}
                className='w-full h-32 object-cover'
                onError={(e) => {
                  e.target.onerror = null
                  e.target.style.display = 'none'
                  e.target.nextSibling && (e.target.nextSibling.style.display = 'flex')
                }}
              />
            ) : null}
            <div className='w-full h-32 hidden items-center justify-center bg-gray-100 text-gray-400 text-xs'>
              Image unavailable
            </div>
          </div>

          {showAlert && (
            <span className={`inline-block self-start text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${status === 'Expired!' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
              {status}
            </span>
          )}

          <div className='mb-2'>
            <h4 className='font-medium text-gray-800 text-sm mb-1 line-clamp-1'>{banner.title || 'Untitled Banner'}</h4>
            {banner.website_url && (
              <a href={banner.website_url} target='_blank' rel='noopener noreferrer'
                className='hover:underline text-xs block mb-1 truncate font-medium'
                style={{ color: THEME_BLUE }}
              >
                {banner.website_url}
              </a>
            )}
            {banner.date_of_expiry && (
              <p className={`text-xs ${showAlert ? 'text-red-600' : 'text-gray-500'}`}>
                Expires: {formatDate(banner.date_of_expiry)}
              </p>
            )}
          </div>

          <button
            onClick={() => onDelete(banner.id)}
            className='mt-auto self-end text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50'
            title='Delete banner'
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className='flex-1 flex flex-col items-center justify-center gap-2 text-gray-300'>
          <div className='w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center'>
            <Edit size={14} className='text-gray-300' />
          </div>
          <p className='text-xs text-gray-400 text-center'>No banner — drop here or click edit</p>
        </div>
      )}
    </div>
  )
}

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
  const [activeDragBanner, setActiveDragBanner] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

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
        `${process.env.baseUrl}/banner?filter=all&limit=50`
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

  const handleDragStart = ({ active }) => {
    setIsDragging(true)
    const fromPosition = active.id
    const banner = (bannersByPosition[fromPosition] || [])[0]
    setActiveDragBanner(banner || null)
  }

  const handleDragEnd = async ({ active, over }) => {
    setIsDragging(false)
    setActiveDragBanner(null)
    if (!over || active.id === over.id) return

    const fromPos = active.id
    const toPos = over.id
    const fromBanners = bannersByPosition[fromPos] || []
    const toBanners = bannersByPosition[toPos] || []

    if (fromBanners.length === 0) return

    const fromBanner = fromBanners[0]
    const toBanner = toBanners[0] || null

    try {
      // Update the dragged banner to the new position
      await authFetch(`${process.env.baseUrl}/banner/${fromBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_position: toPos })
      })

      // If the target position had a banner, swap it back to the original position
      if (toBanner) {
        await authFetch(`${process.env.baseUrl}/banner/${toBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_position: fromPos })
        })
      }

      toast.success('Banner position updated!')
      await fetchBannersByPosition()
    } catch (err) {
      toast.error('Failed to update banner position')
    }
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

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          {[1, 2, 3, 4, 5, 6, 7].map((position) => {
            const banners = bannersByPosition[position] || []
            const hasBanner = banners.length > 0
            const banner = hasBanner ? banners[0] : null
            const status = banner ? getExpirationStatus(banner.date_of_expiry) : null
            const showAlert = banner ? isExpiredOrExpiringToday(banner.date_of_expiry) : false

            return <BannerPositionCard
              key={position}
              position={position}
              hasBanner={hasBanner}
              banner={banner}
              status={status}
              showAlert={showAlert}
              onEdit={handlePositionEdit}
              onDelete={(id) => { setDeleteId(id); setIsDialogOpen(true) }}
            />
          })}
        </div>

        <DragOverlay>
          {activeDragBanner ? (
            <div className='border-2 border-[#387cae] rounded-lg p-4 bg-white shadow-2xl opacity-95 w-72'>
              <img
                src={activeDragBanner.banner_image}
                alt={activeDragBanner.title}
                className='w-full h-28 object-cover rounded-md mb-2'
              />
              <p className='font-medium text-gray-800 text-sm truncate'>{activeDragBanner.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog
        isOpen={isOpen}
        closeOnOutsideClick={false}
        onClose={() => {
          setIsOpen(false)
          setEditing(false)
          setEditingId(null)
          resetFormForPosition(activePosition)
        }}
        className='max-w-5xl'
      >
        <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle>
              {editing ? 'Edit Banner' : 'Create Banner'} (Position{' '}
              {activePosition})
            </DialogTitle>
            <DialogClose
              onClick={() => {
                setIsOpen(false)
                setEditing(false)
                setEditingId(null)
                resetFormForPosition(activePosition)
              }}
            />
          </DialogHeader>
          <div className='flex-1 overflow-y-auto p-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col flex-1'>
              <div className='flex-1 space-y-6'>
                <div className='bg-white p-6 rounded-lg shadow-md space-y-4'>
                  <div>
                    <Label required>Banner Title</Label>
                    <Input
                      {...register('title', {
                        required: 'Banner title is required'
                      })}
                      className='w-full p-2 border rounded'
                      placeholder='Enter banner title'
                    />
                    {errors.title && (
                      <span className='text-red-500 text-sm mt-1 block'>
                        {errors.title.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label required>Website URL</Label>
                    <Input
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
                      <span className='text-red-500 text-sm mt-1 block'>
                        {errors.website_url.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label required>Date of Expiry</Label>
                    <Input
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
                      <span className='text-red-500 text-sm mt-1 block'>
                        {errors.date_of_expiry.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <FileUpload
                      label='Banner Image'
                      required={true}
                      onUploadComplete={(url) => {
                        setValue('banner_image', url, { shouldValidate: true })
                      }}
                      defaultPreview={watch('banner_image')}
                    />
                    <input
                      type='hidden'
                      {...register('banner_image', { required: 'Banner image is required' })}
                    />
                    {errors.banner_image && (
                      <span className='text-red-500 text-sm mt-1 block'>
                        {errors.banner_image.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  disabled={loading}
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
        </DialogContent>
      </Dialog>

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
