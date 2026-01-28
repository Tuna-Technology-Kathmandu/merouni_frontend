import React from 'react'
import { Skeleton } from './Skeleton'

const CardSkeleton = () => {
    return (
        <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse flex flex-col gap-4'>
            <div className='flex items-start gap-4'>
                <Skeleton className='w-12 h-12 rounded-full' />
                <div className='flex flex-col gap-3 w-full'>
                    <Skeleton className='h-5 w-4/5' />
                    <Skeleton className='h-4 w-3/5' />
                </div>
            </div>
            <div className='space-y-3 mt-2'>
                <Skeleton className='h-3 w-full' />
                <Skeleton className='h-3 w-full' />
                <div className='flex gap-2 pt-2'>
                    <Skeleton className='h-3 w-1/2' />
                    <Skeleton className='h-3 w-1/2' />
                </div>
            </div>
            <div className='mt-4'>
                <Skeleton className='h-10 w-full rounded-2xl' />
            </div>
        </div>
    )
}

export { CardSkeleton }
