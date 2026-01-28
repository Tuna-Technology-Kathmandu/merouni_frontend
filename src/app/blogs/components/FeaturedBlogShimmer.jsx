import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

const FeaturedBlogsShimmer = () => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {[...Array(4)].map((_, index) => (
        <div key={index} className='bg-white rounded-xl overflow-hidden border border-gray-100 p-4'>
          <Skeleton className='h-40 w-full mb-6' />
          <Skeleton className='h-5 w-3/4 mb-3' />
          <Skeleton className='h-4 w-11/12 mb-8' />
          <Skeleton className='h-4 w-1/3' />
        </div>
      ))}
    </div>
  )
}

export default FeaturedBlogsShimmer
