import React from 'react'

const MediaCard = ({ photo, title, onDelete }) => {
  return (
    <div className='min-w-[300px] max-w-[300px] my-2 bg-white rounded-2xl shadow-md border border-gray-300 relative'>
      <img
        src={photo}
        alt={`${title} logo`}
        className='h-48 w-full object-cover'
      />
      <h3 className='text-lg font-bold text-gray-900 p-2 mb-4'>
        {title.substring(0, 10)}
      </h3>
      {/* Delete Button */}
      <button
        onClick={onDelete}
        className='px-4 py-2 bg-red-500 text-white rounded w-full'
      >
        Delete
      </button>
    </div>
  )
}

export default MediaCard
