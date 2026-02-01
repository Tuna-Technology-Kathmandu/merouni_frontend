'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { fetchMedias } from './action'
import Loader from '../../../../ui/molecules/Loading'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search, ExternalLink } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { Modal } from '../../../../ui/molecules/Modal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'
import { Button } from '@/ui/shadcn/button'
import FileUpload from '../addCollege/FileUpload'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import Footer from '@/components/Frontpage/Footer'

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

  const [medias, setMedias] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
      },
      {
        header: 'Featured Image',
        accessorKey: 'featured_image',
        cell: ({ getValue }) => (
          getValue() ? (
            <img
              src={getValue()}
              alt='Media'
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
    []
  )

  useEffect(() => {
    setHeading('Video Management')
    loadMedias()
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

  const loadMedias = async (page = 1) => {
    try {
      const response = await fetchMedias(page)
      setMedias(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      // toast.error('Failed to load media')
      console.error('Error loading media:', err)
    } finally {
      setLoading(false)
    }
  }

  const createMedia = async (data) => {
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/media`,
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
      console.error('Error creating media:', error)
      throw error
    }
  }

  const updateMedia = async (data, id) => {
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/media?media_id=${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update media')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating media:', error)
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
        // Update media if in edit mode
        await updateMedia(formattedData, editingId)
        toast.success('Media updated successfully')
      } else {
        // Otherwise, create a new media
        await createMedia(formattedData)
        toast.success('Media created successfully')
      }
      reset() // Clear form
      setEditingId(null)
      setEditing(false)
      setIsOpen(false)
      setUploadedFiles({ featured_image: '' })
      loadMedias()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network error occurred'
      toast.error(
        `Failed to ${editingId ? 'update' : 'create'} media: ${errorMsg}`
      )
      console.error('Error saving media:', err)
    }
  }

  const handleEdit = (media) => {
    setEditingId(media.id)
    setEditing(true)
    setIsOpen(true)
    setValue('title', media.title)
    setValue('yt_video_link', media.yt_video_link || '')
    setValue('description', media.description || '')
    setValue('featured_image', media.featured_image || '')
    setUploadedFiles({ featured_image: media.featured_image || '' })
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/media?media_id=${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      loadMedias()
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
      loadMedias()
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/media?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setMedias(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setMedias([])
      }
    } catch (error) {
      console.error('Error fetching media search results:', error.message)
      setMedias([])
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
        <ToastContainer />

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

                  <div className='space-y-4'>
                    <div>
                      <label className='block mb-2'>
                        Title <span className='text-red-500'>*</span>
                      </label>
                      <input
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
                      <label className='block mb-2'>
                        Youtube Link <span className='text-red-500'>*</span>
                      </label>
                      <input
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
                  </div>
                  <div className='mt-4'>
                    <label className='block mb-2'>
                      Description
                    </label>
                    <textarea
                      placeholder='Video Description'
                      {...register('description')}
                      className='w-full p-2 border rounded min-h-[100px]'
                      rows={4}
                    />
                  </div>
                  <div className='mt-4'>
                    <label className='block mb-2'>Featured Image (Optional)</label>
                    <FileUpload
                      key={uploadedFiles.featured_image}
                      onFilesSelected={(files) => {
                        if (files.length > 0) {
                          setUploadedFiles({ ...uploadedFiles, featured_image: files[0].url })
                          setValue('featured_image', files[0].url)
                        }
                      }}
                      initialFiles={
                        uploadedFiles.featured_image
                          ? [{ url: uploadedFiles.featured_image, name: 'Featured Image' }]
                          : []
                      }
                      multiple={false}
                    />
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
            data={medias}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadMedias(newPage)}
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
        message='Are you sure you want to delete this video? This action cannot be undone.'
      />
    </>
  )
}
