'use client'

import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Modal } from '@/ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { formatDate } from '@/utils/date.util'
import { Edit2, ExternalLink, Eye, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loader from '../../../../ui/molecules/Loading'
import Table from '../../../../ui/molecules/Table'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import FileUpload from '../addCollege/FileUpload'
import { fetchVideos } from './action'

export default function VideoManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      yt_video_link: '',
      description: '',
      featured_image: '',
      author: author_id
    }
  })

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // View Modal State
  const [viewingVideo, setViewingVideo] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState({
    featured_image: ''
  })

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title'
      },
      {
        header: 'Youtube Link',
        accessorKey: 'yt_video_link',
        cell: ({ getValue }) => (
          <a
            href={getValue()}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline flex items-center gap-1'
          >
            {getValue()} <ExternalLink className='w-3 h-3' />
          </a>
        )
      },

      {
        header: 'Created At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => formatDate(getValue())
      },
      {
        header: 'Featured Image',
        accessorKey: 'featured_image',
        cell: ({ getValue }) => (
          getValue() ? (
            <img
              src={getValue()}
              alt='Video'
              className='w-10 h-10 object-cover rounded-md'
            />
          ) : 'N/A'
        )
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
              onClick={() => handleView(row.original)}
              className='p-1 text-gray-600 hover:text-gray-900'
              title="View Details"
            >
              <Eye className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className='p-1 text-blue-600 hover:text-blue-800'
              title="Edit"
            >
              <Edit2 className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original.id)}
              className='p-1 text-red-600 hover:text-red-800'
              title="Delete"
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        )
      }
    ],
    []
  )

  useEffect(() => {
    setHeading('Video Management')
    loadVideos()
    return () => setHeading(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const loadVideos = async (page = 1) => {
    try {
      const response = await fetchVideos(page)
      setVideos(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      console.error('Error loading videos:', err)
    } finally {
      setLoading(false)
    }
  }

  const createVideo = async (data) => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/video`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating video:', error)
      throw error
    }
  }

  const updateVideo = async (data, id) => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/video/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update video')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating video:', error)
      throw error
    }
  }

  // Use react-hook-form's handleSubmit to process the form data.
  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      featured_image: uploadedFiles.featured_image
    }
    try {
      if (editingId) {
        // Update video if in edit mode
        await updateVideo(formattedData, editingId)
        toast.success('Video updated successfully')
      } else {
        // Otherwise, create a new video
        await createVideo(formattedData)
        toast.success('Video created successfully')
      }
      reset() // Clear form
      setEditingId(null)
      setEditing(false)
      setIsOpen(false)
      setUploadedFiles({ featured_image: '' })
      loadVideos()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network error occurred'
      toast.error(
        `Failed to ${editingId ? 'update' : 'create'} video: ${errorMsg}`
      )
      console.error('Error saving video:', err)
    }
  }

  const handleView = (video) => {
    setViewingVideo(video)
    setIsViewModalOpen(true)
  }

  const handleEdit = (video) => {
    setEditingId(video.id)
    setEditing(true)
    setIsOpen(true)
    setValue('title', video.title)
    setValue('yt_video_link', video.yt_video_link || '')
    setValue('description', video.description || '')
    setValue('featured_image', video.featured_image || '')
    setUploadedFiles({ featured_image: video.featured_image || '' })
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/video/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      loadVideos()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadVideos()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/video?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setVideos(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setVideos([])
      }
    } catch (error) {
      console.error('Error fetching video search results:', error.message)
      setVideos([])
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

  if (loading)
    return (
      <div className='mx-auto'>
        <Loader />
      </div>
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
              placeholder='Search videos...'
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
                setUploadedFiles({ featured_image: '' })
              }}
            >
              Add Video
            </Button>
          </div>
        </div>

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            setEditing(false)
            setEditingId(null)
            reset()
            setUploadedFiles({ featured_image: '' })
          }}
          title={editing ? 'Edit Video' : 'Add Video'}
          className='max-w-2xl'
        >
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Video Information
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <Label>
                        Title <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='text'
                        placeholder='Video Title'
                        {...register('title', {
                          required: 'Title is required'
                        })}
                        className='w-full p-2 border rounded'
                      />
                      {errors.title && (
                        <span className='text-red-500 text-sm'>
                          {errors.title.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label>
                        Youtube Link <span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        type='url'
                        placeholder='https://youtube.com/...'
                        {...register('yt_video_link', {
                          required: 'Youtube link is required'
                        })}
                        className='w-full p-2 border rounded'
                      />
                      {errors.yt_video_link && (
                        <span className='text-red-500 text-sm'>
                          {errors.yt_video_link.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <Label>Description</Label>
                      <textarea
                        placeholder='Video Description'
                        {...register('description')}
                        className='w-full p-2 border rounded min-h-[100px]'
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label>Featured Image (Optional)</Label>
                      <FileUpload
                        defaultPreview={uploadedFiles.featured_image}
                        onUploadComplete={(url) => {
                          setUploadedFiles((prev) => ({
                            ...prev,
                            featured_image: url
                          }))
                          setValue('featured_image', url)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setIsOpen(false)
                    setEditing(false)
                    setEditingId(null)
                    reset()
                    setUploadedFiles({ featured_image: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editing ? 'Update Video' : 'Create Video'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Table */}
        <div className='mt-8'>
          <Table
            data={videos}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadVideos(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewingVideo(null)
        }}
        title="Video Details"
        className="max-w-2xl"
      >
        <div className="p-6 space-y-6">
          {/* Featured Image */}
          {viewingVideo?.featured_image && (
            <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-6 border border-gray-200">
              <img
                src={viewingVideo.featured_image}
                alt={viewingVideo.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">{viewingVideo?.title}</p>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">YouTube Link</h3>
              <a
                href={viewingVideo?.yt_video_link}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-1 text-blue-600 hover:underline flex items-center gap-1'
              >
                {viewingVideo?.yt_video_link} <ExternalLink className='w-3 h-3' />
              </a>
            </div>



            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <div className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                {viewingVideo?.description || "No description provided."}
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1 text-gray-900">{viewingVideo?.createdAt ? formatDate(viewingVideo.createdAt) : 'N/A'}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t mt-6">
            <Button onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this video? This action cannot be undone.'
      />
    </>
  )
}
