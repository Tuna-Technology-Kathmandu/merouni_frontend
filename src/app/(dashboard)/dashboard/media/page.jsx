'use client'

import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchMedia } from './action'
import MediaCard from './components/MediaCard'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

function Modal({ isOpen, onClose, onSave, isUploading }) {
  const [title, setTitle] = useState('')
  const [altText, setAltText] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title || !altText || !description || !file) {
      toast.error('Please fill all the required fields.')
      return
    }

    // Call the onSave function passed down from the parent (MediaPage)
    await onSave({ title, altText, description, file })
    setTitle('')
    setAltText('')
    setDescription('')
    setFile(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-1/3'>
        <h2 className='text-xl font-bold mb-4'>Add Media</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block'>
              Title <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block'>
              Alt Text <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block'>
              Description <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block'>
              Upload File <span className='text-red-500'>*</span>
            </label>
            <input
              type='file'
              onChange={handleFileChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='px-4 py-2 bg-gray-300 rounded'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded'
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function MediaPage() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false) // State to manage modal visibility
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])
    
  const loadData = async () => {
    try {
      setLoading(true)
      const response = await fetchMedia()
      console.log('Response:', response)
      setNews(response.items)
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddClick = () => {
    setIsModalOpen(true) // Open the modal
  }

  const handleCloseModal = () => {
    setIsModalOpen(false) // Close the modal
  }

  const handleSave = async ({ title, altText, description, file }) => {
    if (isUploading) return
    setIsUploading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('altText', altText)
    formData.append('description', description)
    formData.append('file', file)
    formData.append('authorId', '1') // Set the author

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
      console.log('Media uploaded:', data)
      loadData() // Refresh the media list
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

      // Remove deleted media from the state
      setNews((prevNews) => prevNews.filter((media) => media._id !== id))
    } catch (err) {
      toast.error('Failed to delete media')
      console.error('Error deleting media:', err)
    }
  }

  if (loading) return <p>Loading</p>

  return (
    <div className='p-4 w-4/5 mx-auto'>
      <ToastContainer />
      <h1 className='text-2xl font-bold mb-4'>Media</h1>

      <button
        className='px-4 py-2 bg-blue-500 text-white rounded mb-4'
        onClick={handleAddClick}
      >
        Add
      </button>
      <div className='grid grid-cols-3 gap-4'>
        {news.map((item, index) => (
          <MediaCard
            photo={item.url}
            title={item.title}
            key={index}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  )
}
