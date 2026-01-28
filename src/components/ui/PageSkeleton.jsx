import React from 'react'
import { Skeleton } from './Skeleton'

const PageSkeleton = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <div className='container mx-auto p-6 mt-12 animate-pulse'>
                {/* Title & Header */}
                <div className='flex flex-col items-center mb-10'>
                    <Skeleton className='h-12 w-3/4 md:w-1/2 mb-4' />
                    <Skeleton className='h-8 w-1/4' />
                </div>

                {/* Stats/Meta Row */}
                <div className='flex justify-between items-center mb-12 border-y border-gray-100 py-4'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-5 w-40' />
                </div>

                {/* Content Blocks */}
                <div className='space-y-12 max-w-4xl mx-auto'>
                    <div>
                        <Skeleton className='h-8 w-48 mb-6' />
                        <div className='space-y-4'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-3/4' />
                        </div>
                    </div>

                    <div>
                        <Skeleton className='h-8 w-40 mb-6' />
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <Skeleton className='h-12 w-full rounded-xl' />
                            <Skeleton className='h-12 w-full rounded-xl' />
                            <Skeleton className='h-12 w-full rounded-xl' />
                            <Skeleton className='h-12 w-full rounded-xl' />
                        </div>
                    </div>

                    <div className='pt-8'>
                        <Skeleton className='h-14 w-full rounded-2xl' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PageSkeleton }
