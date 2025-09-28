import React from 'react'

const RelatedCard = ({ image, title, description }) => {
  return (
    // <div className='relative my-2 bg-white rounded-2xl shadow-md border border-gray-300 w-[270px] max-[1016px]:w-[250px] h-[300px] max-[1016px]:h-[290px]'>
    <div className='relative my-2 bg-white rounded-2xl shadow-md border border-gray-300 h-[300px] max-[914px]:h-auto'>
      <div className='h-[170px] relative'>
        <img
          src={image}
          alt={`${title} logo`}
          className='w-full h-full object-cover rounded-t-2xl'
        />
      </div>

      {/* Content Section */}
      <div className='p-3'>
        {/* Date */}
        {/* <p className='text-gray-600 mb-1 text-[13px]'>{date}</p>
         */}
        {/* Title */}
        <h2 className='text-lg font-bold text-gray-900 mb-2'>{title}</h2>

        {/* Description */}
        <div
          className='text-gray-600 text-[13px] mb-4 max-[1016px]:text-xs'
          style={{ minHeight: '60px' }} // Ensures consistent height
        >
          {description}
        </div>
      </div>
    </div>
  )
}

export default RelatedCard
