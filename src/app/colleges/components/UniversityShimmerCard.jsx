import React from 'react'

const UniversityCardShimmer = () => {
  return (
    <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg animate-pulse'>
      <div className='flex justify-between items-start mb-4'>
        <div className='w-12 h-12 bg-gray-300 rounded-full'></div>
        <div className='flex gap-2'>
          <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
          <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
        </div>
      </div>

      <div className='h-8 bg-gray-300 rounded w-3/4 mb-2'></div>
      <div className='h-6 bg-gray-300 rounded w-full mb-4'></div>
      <div className='flex gap-3'>
        <div className='flex-1 py-2 px-4 bg-gray-300 rounded-2xl'></div>
        <div className='flex-1 py-2 px-4 bg-gray-300 rounded-2xl'></div>
      </div>
    </div>
  )
}

export default UniversityCardShimmer
