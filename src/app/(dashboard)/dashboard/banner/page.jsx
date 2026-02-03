'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import FileUpload from '../addCollege/FileUpload'
import { Edit, Trash2, Plus, X } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { usePageHeading } from '@/contexts/PageHeadingContext'

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
  const [searchResults, setSearchResults] = useState([])
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [bannersByPosition, setBannersByPosition] = useState({})

  const searchTimeoutRef = useRef(null)
  const dropdownRef = useRef(null)

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
      collegeSearch: '',
      collegeId: '',
      website_url: '',
      date_of_expiry: '',
      display_position: 1,
      bannerImages: [
        {
          title: '',
          gallery: { small: '', medium: '', large: '' },
          is_featured: 1
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bannerImages'
  })

  useEffect(() => {
    setHeading('Banner Management')
    fetchBannersByPosition()
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      setHeading(null)
      document.removeEventListener('mousedown', handleClickOutside)
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
  const searchCollege = async (query) => {
    setValue('collegeSearch', query)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (!query) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setSearchLoading(true)
    setShowDropdown(true)

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await authFetch(
          `${process.env.baseUrl}/college?q=${query}`
        )
        const data = await response.json()
        setSearchResults(data.items || [])
      } catch (error) {
        toast.error('Failed to search colleges')
      } finally {
        setSearchLoading(false)
      }
    }, 300)
  }

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college)
    setValue('collegeId', college.id)
    setValue('collegeSearch', college.name)
    setShowDropdown(false)
  }

  const onSubmit = async (data) => {
    if (!selectedCollege) {
      toast.error('Please select a college first')
      return
    }

    try {
      const bannerData = {
        collegeId: selectedCollege.id,
        website_url: data.website_url,
        date_of_expiry: data.date_of_expiry,
        display_position: activePosition,
        bannerImage: data.bannerImages.map((image) => {
          // Use the same URL for all sizes if only small is provided
          const imageUrl =
            image.gallery.small ||
            image.gallery.medium ||
            image.gallery.large ||
            ''
          return {
            title: image.title,
            gallery: {
              small: image.gallery.small || imageUrl,
              medium: image.gallery.medium || imageUrl,
              large: image.gallery.large || imageUrl
            },
            is_featured: image.is_featured
          }
        })
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
      setSelectedCollege(null)
      fetchBannersByPosition()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save banner')
    }
  }

  const handleEdit = async (banner) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)
      setEditingId(banner.id)
      setActivePosition(banner.display_position)

      // Handle both banner structures: direct banner_galleries or nested Banners
      let bannerImages = []

      if (banner.Banners && banner.Banners.length > 0) {
        // Nested structure: banner.Banners[0].banner_galleries
        bannerImages = banner.Banners.map((b) => ({
          title: b.title,
          website_url: b.website_url,
          gallery: {
            small:
              b.banner_galleries?.find((g) => g.size === 'small')?.url || '',
            medium:
              b.banner_galleries?.find((g) => g.size === 'medium')?.url || '',
            large:
              b.banner_galleries?.find((g) => g.size === 'large')?.url || ''
          },
          is_featured: b.is_featured
        }))
      } else if (
        banner.banner_galleries &&
        banner.banner_galleries.length > 0
      ) {
        // Direct structure: banner.banner_galleries
        bannerImages = [
          {
            title: banner.title || '',
            website_url: banner.website_url || '',
            gallery: {
              small:
                banner.banner_galleries.find((g) => g.size === 'small')?.url ||
                banner.banner_galleries[0]?.url ||
                '',
              medium:
                banner.banner_galleries.find((g) => g.size === 'medium')?.url ||
                banner.banner_galleries[0]?.url ||
                '',
              large:
                banner.banner_galleries.find((g) => g.size === 'large')?.url ||
                banner.banner_galleries[0]?.url ||
                ''
            },
            is_featured: banner.is_featured || 1
          }
        ]
      }

      // Fallback if no images found
      if (bannerImages.length === 0) {
        bannerImages = [
          {
            title: banner.title || '',
            gallery: { small: '', medium: '', large: '' },
            is_featured: 0
          }
        ]
      }

      reset({
        collegeSearch: banner.College?.name || '',
        collegeId: banner.college_id || '',
        website_url: banner.website_url || '',
        date_of_expiry: banner.date_of_expiry
          ? new Date(banner.date_of_expiry).toISOString().split('T')[0]
          : '',
        display_position: banner.display_position || activePosition,
        bannerImages
      })

      if (banner.College) {
        setSelectedCollege({
          id: banner.College.id,
          name: banner.College.name
        })
      }
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

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const resetFormForPosition = (position) => {
    reset({
      collegeSearch: '',
      collegeId: '',
      website_url: '',
      date_of_expiry: '',
      display_position: position,
      bannerImages: [
        {
          title: '',
          gallery: { small: '', medium: '', large: '' },
          is_featured: 1
        }
      ]
    })
    setSelectedCollege(null)
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
                  className='px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm'
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
                      src={
                        banner.banner_galleries?.find((g) => g.size === 'small')
                          ?.url ||
                        banner.Banners?.[0]?.banner_galleries?.find(
                          (g) => g.size === 'small'
                        )?.url ||
                        banner.banner_galleries?.[0]?.url ||
                        banner.Banners?.[0]?.banner_galleries?.[0]?.url ||
                        '/images/meroUniLarge.gif'
                      }
                      onError={(e) => {
                        e.target.src = '/images/meroUniLarge.gif'
                      }}
                      alt={
                        banner.title || banner.Banners?.[0]?.title || 'Banner'
                      }
                      className='w-full h-32 object-cover'
                    />
                  </div>

                  {/* Status indicator (only if expired/expiring) */}
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
                        className='text-blue-600 hover:underline text-sm block mb-2 truncate'
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
                        {new Date(banner.date_of_expiry).toLocaleDateString()}
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
                  setSelectedCollege(null)
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {!editing && (
                <>
                  <div className='relative mb-6' ref={dropdownRef}>
                    <label className='block mb-2'>
                      Search College <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      {...register('collegeSearch', {
                        required: 'College selection is required'
                      })}
                      onChange={(e) => searchCollege(e.target.value)}
                      className='w-full p-2 border rounded'
                      placeholder='Search for a college...'
                    />
                    {errors.collegeSearch && (
                      <span className='text-red-500'>
                        {errors.collegeSearch.message}
                      </span>
                    )}

                    {showDropdown && (
                      <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                        {searchLoading ? (
                          <div className='p-2 text-center text-gray-500'>
                            Loading...
                          </div>
                        ) : searchResults.length > 0 ? (
                          searchResults.map((college) => (
                            <div
                              key={college.id}
                              className='p-2 hover:bg-gray-100 cursor-pointer'
                              onClick={() => handleCollegeSelect(college)}
                            >
                              {college.name}
                            </div>
                          ))
                        ) : (
                          <div className='p-2 text-center text-gray-500'>
                            No colleges found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

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
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className='p-4 border rounded-lg relative'
                  >
                    {!editing && (
                      <button
                        type='button'
                        onClick={() => remove(index)}
                        className='absolute top-2 right-2 text-red-500 hover:text-red-700'
                        disabled={fields.length === 1}
                      >
                        <X className='w-4 h-4' />
                      </button>
                    )}

                    <div className='mb-4'>
                      <label className='block mb-2'>
                        Banner Title <span className='text-red-500'>*</span>
                      </label>
                      <input
                        {...register(`bannerImages.${index}.title`, {
                          required: 'Banner title is required'
                        })}
                        className='w-full p-2 border rounded'
                        placeholder='Enter banner title'
                      />
                      {errors.bannerImages?.[index]?.title && (
                        <span className='text-red-500'>
                          {errors.bannerImages[index].title.message}
                        </span>
                      )}
                    </div>

                    {/* <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      {...register(`bannerImages.${index}.is_featured`)}
                      onChange={(e) =>
                        setValue(
                          `bannerImages.${index}.is_featured`,
                          e.target.checked ? 1 : 0
                        )
                      }
                      checked={watch(`bannerImages.${index}.is_featured`) == 1}
                    />
                    <label className="ml-2">Is Featured?</label>
                  </div> */}

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div>
                        <FileUpload
                          label={
                            editing
                              ? 'Banner Image (Change Image)'
                              : 'Banner Image'
                          }
                          onUploadComplete={(url) => {
                            setValue(`bannerImages.${index}.gallery.small`, url)
                          }}
                          defaultPreview={watch(
                            `bannerImages.${index}.gallery.small`
                          )}
                        />
                      </div>
                      {/* <div>
                      <FileUpload
                        label="Medium Banner Image"
                        onUploadComplete={(url) => {
                          setValue(
                            `bannerImages.${index}.gallery.medium`,
                            url
                          )
                        }}
                        defaultPreview={watch(
                          `bannerImages.${index}.gallery.medium`
                        )}
                      />
                    </div> */}
                      {/* <div>
                      <FileUpload
                        label="Large Banner Image"
                        onUploadComplete={(url) => {
                          setValue(`bannerImages.${index}.gallery.large`, url)
                        }}
                        defaultPreview={watch(
                          `bannerImages.${index}.gallery.large`
                        )}
                      />
                    </div> */}
                    </div>
                  </div>
                ))}

                {/* <button
                type="button"
                onClick={() =>
                  append({
                    title: '',
                    gallery: { small: '', medium: '', large: '' },
                    is_featured: 0
                  })
                }
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" /> Add Another Banner Image
              </button> */}
              </div>

              <div className='flex justify-end gap-4 mt-6'>
                <button
                  type='button'
                  onClick={() => {
                    setIsOpen(false)
                    setEditing(false)
                    setEditingId(null)
                    resetFormForPosition(activePosition)
                    setSelectedCollege(null)
                  }}
                  className='px-6 py-2 border rounded hover:bg-gray-100'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading || (!editing && !selectedCollege)}
                  className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300'
                >
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update Banner'
                      : 'Create Banner'}
                </button>
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
