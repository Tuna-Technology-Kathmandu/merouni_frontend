import React, { useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { toast } from 'react-toastify'

const MediaCard = ({ photo, title, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    setShowDeleteConfirm(false)
    onDelete()
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(photo)
    toast.success('URL copied to clipboard!')
  }

  return (
    <div className='group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100'>
      {/* Image Container */}
      <div className='relative h-48 w-full overflow-hidden bg-gray-50'>
        <img
          src={photo}
          alt={title}
          className='h-full w-full object-cover cursor-pointer'
          onClick={handleCopyUrl}
          title='Click to copy URL'
        />

        {/* Delete Icon - Top Right */}
        {showDeleteConfirm ? (
          <div className='absolute top-2 right-2 flex gap-1'>
            <button
              onClick={handleDelete}
              className='bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-md shadow-lg transition-colors'
              title='Confirm delete'
            >
              <Trash2 className='w-4 h-4' />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className='bg-white hover:bg-gray-100 text-gray-700 p-1.5 rounded-md shadow-lg transition-colors'
              title='Cancel'
            >
              <X className='w-4 h-4' />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className='absolute top-2 right-2 bg-white/90 hover:bg-red-500 text-gray-700 hover:text-white p-1.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200'
            title='Delete media'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        )}
      </div>

      {/* Title */}
      <div className='p-3'>
        <h3 className='text-sm font-medium text-gray-900 line-clamp-2'>
          {title}
        </h3>
      </div>
    </div>
  )
}

export default MediaCard
