import React from 'react'
import he from 'he'

const OverviewSection = ({ college }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Description</h2>
      <p className='text-gray-800 mt-9 max-[1120px]:mt-5 leading-7 max-md:leading-5 text-xs md:text-sm lg:text-base text-justify'>
        {college?.description}
      </p>
      <div
        dangerouslySetInnerHTML={{ __html: he.decode(college?.content) }}
        className='text-gray-800 mt-4 leading-7   text-justify 
             [&>iframe]:w-full 
             [&>iframe]:max-w-[calc(100vw-40px)] 
             [&>iframe]:aspect-video 
             [&>iframe]:h-auto
             [&>iframe]:rounded-lg 
             [&>iframe]:mt-4
             [&>iframe]:mx-auto
             [&>iframe]:block

              [&_table]:w-full
    [&_table]:my-4
    [&_table]:border-collapse
    [&_th]:bg-gray-100
    [&_th]:p-2
    [&_th]:text-left
    [&_th]:border
    [&_th]:border-gray-300
    [&_td]:p-2
    [&_td]:border
    [&_td]:border-gray-300
    [&_tr:nth-child(even)]:bg-gray-50

    [&_h1]:text-2xl
    [&_h1]:font-bold
    [&_h1]:mt-8
    [&_h1]:mb-4
    [&_h2]:text-xl
    [&_h2]:font-bold
    [&_h2]:mt-6
    [&_h2]:mb-3
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
