import React from 'react'
import { Skeleton } from './Skeleton'

const EventCardSkeleton = () => {
    return (
        <div className='h-full flex flex-col rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden'>
            {/* Top Section: Image */}
            <div className='relative h-[180px] w-full'>
                <Skeleton className='w-full h-full' />
            </div>

            <div className='flex items-start gap-4 p-5 flex-1'>
                {/* Date Section */}
                <Skeleton className='min-w-[50px] h-[60px] rounded-xl' />

                {/* Info Section */}
                <div className='flex-1 flex flex-col gap-2'>
                    <Skeleton className='h-5 w-3/4' />
                    <Skeleton className='h-5 w-1/2' />
                    <div className='mt-2 space-y-1'>
                        <Skeleton className='h-3 w-full' />
                        <Skeleton className='h-3 w-full' />
                        <Skeleton className='h-3 w-2/3' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventCardSkeleton
