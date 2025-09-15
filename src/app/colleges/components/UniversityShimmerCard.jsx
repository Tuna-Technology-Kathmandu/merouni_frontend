import React from 'react'

const UniversityCardShimmer = () => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg animate-pulse w-full'>
      {/* Image Section */}
      <div className='flex justify-between items-start min-h-28 bg-gray-300'>
        <div className='flex gap-2 p-2'>
          <div className='w-8 h-8 bg-gray-400 rounded-full'></div>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-4'>
        <div className='h-5 bg-gray-300 rounded w-3/4 mb-2'></div>
        <div className='h-4 bg-gray-300 rounded w-1/2 mb-3'></div>

        <div className='flex gap-3 justify-between'>
          <div className='flex-1 py-2 bg-gray-300 rounded-2xl'></div>
          <div className='flex-1 py-2 bg-gray-300 rounded-2xl'></div>
        </div>
      </div>
    </div>
  )
}

export default UniversityCardShimmer
