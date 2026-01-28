import React from 'react'

const NewsShimmer = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-12'>
            {[...Array(8)].map((_, index) => (
                <div
                    key={index}
                    className='bg-white rounded-xl shadow-md overflow-hidden h-full animate-pulse'
                >
                    {/* Image Skeleton */}
                    <div className='h-48 w-full bg-gray-200'></div>

                    {/* Content Skeleton */}
                    <div className='p-5'>
                        <div className='h-5 bg-gray-200 rounded mb-3 w-3/4'></div>
                        <div className='space-y-2 mb-4'>
                            <div className='h-4 bg-gray-200 rounded w-full'></div>
                            <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                            <div className='h-4 bg-gray-200 rounded w-4/6'></div>
                        </div>
                        <div className='h-3 bg-gray-200 rounded w-1/3'></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NewsShimmer
