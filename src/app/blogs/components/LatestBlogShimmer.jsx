import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

const LatestBlogsShimmer = () => {
  return (
    <div className='relative rounded-2xl w-full p-8 mb-8 overflow-hidden bg-gray-50 border border-gray-100'>
      <div className='flex flex-col gap-6'>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-5 w-1/4' />
        <div className='space-y-3'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-2/3' />
        </div>
        <Skeleton className='h-11 w-32 rounded-xl mt-4' />
      </div>
    </div>
  )
}

export default LatestBlogsShimmer
