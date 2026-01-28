import React from 'react'

const LatestBlogs = ({ image, title, date, description }) => {
    return (
        <div
            className='relative rounded-2xl shadow-lg min-w-full h-full p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden text-white group cursor-pointer'
        >
            {/* Background Image */}
            <img
                className='absolute inset-0 bg-cover bg-center w-full h-full rounded-2xl transform group-hover:scale-110 transition-transform duration-700'
                src={image}
                alt={title}
            />

            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-2xl transition-opacity duration-300'></div>

            {/* Content */}
            <div className='relative z-10 flex flex-col h-full justify-end text-left space-y-3 pb-2'>
                {/* Date */}
                <span className='inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium w-fit'>
                    {date}
                </span>

                {/* Title */}
                <h3 className='text-white text-lg font-bold leading-tight group-hover:text-blue-200 transition-colors line-clamp-2'>
                    {title}
                </h3>

                {/* Description */}
                <p className='text-sm text-gray-200 line-clamp-2 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 ease-in-out'>
                    {description}
                </p>

                {/* Button */}
                <div className='pt-2'>
                    <span className='text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all text-[#387CAE]'>
                        Read Article <span className='text-lg'>→</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LatestBlogs
