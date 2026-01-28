import React from 'react'
import Image from 'next/image'

const NewsCard = ({ image, title, description, date, slug }) => {
    return (
        <div className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group'>
            {/* Image */}
            <div className='relative h-48 w-full overflow-hidden'>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                />
            </div>

            {/* Content */}
            <div className='p-5 flex flex-col flex-1'>
                <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#0A70A7] transition-colors'>
                    {title}
                </h3>
                <p className='text-sm text-gray-600 mb-4 line-clamp-3 flex-1'>
                    {description}
                </p>
                <div className='flex items-center justify-between text-xs text-gray-500 mt-auto'>
                    <span>{date}</span>
                </div>
            </div>
        </div>
    )
}

export default NewsCard
