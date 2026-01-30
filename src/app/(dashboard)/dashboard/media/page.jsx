'use client'

import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchMedia } from './action'
import MediaCard from './components/MediaCard'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Modal } from '@/ui/molecules/UserModal'
import { Search, Upload, Image as ImageIcon } from 'lucide-react'

const RequiredLabel = ({ htmlFor, children }) => (
  <Label htmlFor={htmlFor} className='text-sm font-medium'>
    {children} <span className='text-red-500'>*</span>
  </Label>
)

function UploadModal({ isOpen, onClose, onSave, isUploading }) {
  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    // Create preview
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !altText || !description || !file) {
      toast.error('Please fill all the required fields.')
      return
    }

    await onSave({ title, altText, description, file })

    // Reset form
    setTitle('')
    setAltText('')
    setDescription('')
    setFile(null)
    setPreview(null)
    onClose()
  }

  const handleClose = () => {
    setTitle('')
    setAltText('')
    setDescription('')
    setFile(null)
    setPreview(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Upload Media'
      className='max-w-2xl'
    >
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Column - Form Fields */}
          <div className='space-y-4'>
            <div>
              <RequiredLabel htmlFor='title'>Title</RequiredLabel>
              <Input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter media title'
              />
            </div>

            <div>
              <RequiredLabel htmlFor='altText'>Alt Text</RequiredLabel>
              <Input
                id='altText'
                type='text'
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder='Enter alt text for accessibility'
              />
            </div>

            <div>
              <RequiredLabel htmlFor='description'>Description</RequiredLabel>
              <textarea
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Enter media description'
                className='flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                rows='4'
              />
            </div>
          </div>

          {/* Right Column - File Upload & Preview */}
          <div className='space-y-4'>
            <div>
              <RequiredLabel htmlFor='file'>Upload File</RequiredLabel>
              <div className='mt-2'>
                <label
                  htmlFor='file'
                  className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 hover:bg-gray-100'
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt='Preview'
                      className='w-full h-full object-contain rounded-lg'
                    />
                  ) : (
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <Upload className='w-10 h-10 text-gray-400 mb-3' />
                      <p className='text-sm text-gray-600 font-medium'>
                        Click to upload
                      </p>
                      <p className='text-xs text-gray-500 mt-1'>
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                  <input
                    id='file'
                    type='file'
                    onChange={handleFileChange}
                    className='hidden'
                    accept='image/*,video/*'
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-3 pt-4 border-t'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isUploading}>
            {isUploading ? (
              <>
                <Upload className='w-4 h-4 mr-2 animate-spin' />
                Uploading...
              </>
            ) : (
              <>
                <Upload className='w-4 h-4 mr-2' />
                Upload Media
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function MediaPage() {
  const { setHeading } = usePageHeading()
  const [media, setMedia] = useState([])
  const [filteredMedia, setFilteredMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setHeading('Media Library')
  }, [setHeading])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    // Filter media based on search query
    if (searchQuery.trim() === '') {
      setFilteredMedia(media)
    } else {
      const filtered = media.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredMedia(filtered)
    }
  }, [searchQuery, media])

  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMedia()
      setMedia(response.items || [])
      setFilteredMedia(response.items || [])
    } catch (err) {
      console.error('Error loading data:', err)
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSave = async ({ title, altText, description, file }) => {
    if (isUploading) return
    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('altText', altText)
    formData.append('description', description)
    formData.append('file', file)
    formData.append('authorId', '1')

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/media/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Failed to upload media')
      }

      const data = await response.json()
      toast.success('Media uploaded successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to upload media')
      console.error('Error uploading media:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/media/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete media')
      }

      toast.success('Media deleted successfully')
      setMedia((prevMedia) => prevMedia.filter((item) => item._id !== id))
    } catch (err) {
      toast.error('Failed to delete media')
      console.error('Error deleting media:', err)
    }
  }

  return (
    <div className='container mx-auto p-6 max-w-7xl'>
      <ToastContainer position='top-right' />

      {/* Header Section */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Media Library</h1>
          <p className='text-sm text-gray-600 mt-1'>
            Manage your images and media files
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Upload className='w-4 h-4 mr-2' />
          Upload Media
        </Button>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <Input
            type='text'
            placeholder='Search media by title...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className='bg-white rounded-lg shadow-md overflow-hidden animate-pulse'
            >
              <div className='h-48 bg-gray-200'></div>
              <div className='p-4'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-3'></div>
                <div className='h-8 bg-gray-200 rounded'></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        /* Empty State */
        <div className='flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300'>
          <ImageIcon className='w-16 h-16 text-gray-400 mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            {searchQuery ? 'No media found' : 'No media uploaded yet'}
          </h3>
          <p className='text-gray-600 text-center mb-6 max-w-sm'>
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Upload your first media file to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={handleAddClick}>
              <Upload className='w-4 h-4 mr-2' />
              Upload Media
            </Button>
          )}
        </div>
      ) : (
        /* Media Grid */
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredMedia.map((item, index) => (
              <MediaCard
                key={item.id || index}
                photo={item.url}
                title={item.title}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
          </div>

          {/* Results Count */}
          <div className='mt-6 text-sm text-gray-600 text-center'>
            Showing {filteredMedia.length} of {media.length} media file
            {media.length !== 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        isUploading={isUploading}
      />
    </div>
  )
}
