import React from 'react'
import Shimmer from '../../../components/Shimmer'
const LatestBlogsShimmer = () => {
  return (
    <div className='relative rounded-xl w-85 min-w-[25rem] p-6 mb-8 overflow-hidden m-2'>
      {/* Shimmer Background (mimicking image) */}
      <div className='absolute inset-0 rounded-xl bg-featured-shimmer bg-[length:200%_100%] animate-featured-shimmer opacity-50'></div>
      <div className='absolute inset-0 bg-black bg-opacity-60 rounded-xl'></div>{' '}
      {/* Mimic overlay */}
      {/* Content Shimmers */}
      <div className='relative z-10 text-left space-y-4'>
        <div className='h-8 bg-featured-shimmer bg-[length:200%_100%] animate-featured-shimmer rounded w-3/4'></div>{' '}
        {/* Title shimmer */}
        <div className='h-6 bg-featured-shimmer bg-[length:200%_100%] animate-featured-shimmer rounded w-1/2'></div>{' '}
        {/* Date shimmer */}
        <div className='h-12 bg-featured-shimmer bg-[length:200%_100%] animate-featured-shimmer rounded'></div>{' '}
        {/* Description shimmer */}
        <div className='h-10 bg-featured-shimmer bg-[length:200%_100%] animate-featured-shimmer rounded w-1/4'></div>{' '}
        {/* Button shimmer */}
      </div>
      {/* Decorative Border */}
      <div className='absolute inset-0 rounded-lg border border-gray-300'></div>
    </div>
  )
}

export default LatestBlogsShimmer
