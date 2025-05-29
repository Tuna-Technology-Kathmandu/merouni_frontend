import React from 'react'
import he from 'he'

const OverviewSection = ({ college }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Description</h2>
      <p className='text-gray-700 mt-9 max-[1120px]:mt-5 leading-7 max-md:leading-5 text-xs md:text-sm lg:text-base text-justify'>
        {college?.description}
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: he.decode(college?.content) }}
        className='text-gray-700 mt-4 leading-7   text-justify 
             [&>iframe]:w-full 
             [&>iframe]:max-w-[calc(100vw-40px)] 
             [&>iframe]:aspect-video 
             [&>iframe]:h-auto
             [&>iframe]:rounded-lg 
             [&>iframe]:mt-4
             [&>iframe]:mx-auto
             [&>iframe]:block
             text-xs md:text-sm lg:text-base
             overflow-x-hidden'
      ></div>

      <h2 className='text-[13px] md:text-[15px] lg:text-[17px] font-bold mt-6'>
        Institution Type
      </h2>
      <p className='text-gray-700 mt-4 text-xs md:text-sm lg:text-base'>
        {college?.institute_type}
      </p>
    </div>
  )
}

export default OverviewSection
