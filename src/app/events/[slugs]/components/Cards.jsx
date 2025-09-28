import React from 'react'
import Image from 'next/image'

const EventCard = ({ photo, month, day, title, description }) => {
  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...'
    }
    return str
  }

  return (
    <div className='relative my-2 bg-white rounded-2xl shadow-md border border-gray-300 h-[320px] max-[914px]:h-auto'>
      <div className='h-[170px] relative'>
        <img
          src={photo || '/images/events.webp'}
          alt={`${title} logo`}
          className='w-full h-full object-cover rounded-t-2xl'
        />
      </div>

      {/* Content Section */}
      <div className='p-3'>
        {/* Date */}
        <p className=' mb-1 text-[13px] font-medium text-[#0A70A7]'>
          {month} {day}
        </p>

        {/* Title */}
        <h2 className='text-lg font-bold text-gray-900 mb-2'>
          {truncateString(title, 20)}
        </h2>

        {/* Description */}
        <div
          className='text-gray-600 text-[13px] mb-4 max-[1016px]:text-xs'
          style={{ minHeight: '60px' }} // Ensures consistent height
        >
          {truncateString(description, 100)}
        </div>
      </div>
    </div>
  )
}

export default EventCard
