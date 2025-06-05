import React from 'react'

const LatestBlogs = ({ image, title, date, description }) => {
  return (
    <div
      className='relative rounded-xl shadow-lg  min-w-[25rem] max-[1268px]:min-w-[20rem] max-[917px]:min-w-[16rem] h-[16rem]  
    max-md:h-[14.7rem] p-6 mb-8 hover:shadow-2xl transition-shadow duration-300 overflow-hidden m-2 text-white'
    >
      {/* Background Image */}
      <div
        className='absolute inset-0 bg-cover bg-center  rounded-xl'
        style={{
          backgroundImage: `url(${image})`,
          objectFit: 'cover'
        }}
      ></div>
      <div className='absolute inset-0 bg-black bg-opacity-60 rounded-xl'></div>

      {/* Content */}
      <div className='relative z-10 text-left space-y-4 max-[1268px]:space-y-3'>
        {/* Title */}

        <h3 className='text-xl font-bold max-[768px]:text-lg'>{title}</h3>

        {/* Date */}
        <p className='text-sm max-[768px]:text-xs '>{date}</p>
        {/* Description */}
        <p className=' text-sm line-clamp-3 max-md:text-[10px] max-md:leading-[16px]'>
          {description}
        </p>

        {/* Button */}
        <button className='px-4 py-2  max-md:px-3 max-md:py-1 bg-[#387CAE] text-white rounded-md text-sm max-md:text-[13px] hover:bg-[#285c7f] transition'>
          Learn More
        </button>
      </div>

      {/* Decorative Border */}
      <div className='absolute inset-0 rounded-lg border border-gray-300'></div>
    </div>
  )
}

export default LatestBlogs
