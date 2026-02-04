import React from 'react'
import { Skeleton } from './Skeleton'

const CategoryCardSkeleton = () => {
    return (
        <div className='bg-white border border-gray-100 rounded-2xl p-6 h-64 flex flex-col items-center animate-pulse'>
            <Skeleton className='w-20 h-20 rounded-3xl mb-6' />
            <Skeleton className='h-6 w-3/4 mb-4' />
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-2/3 mb-6' />
            <div className='mt-auto w-full flex justify-center'>
                <Skeleton className='h-4 w-24' />
            </div>
        </div>
    )
}

export default CategoryCardSkeleton
