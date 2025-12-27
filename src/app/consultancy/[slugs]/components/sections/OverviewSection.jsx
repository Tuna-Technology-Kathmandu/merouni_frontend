import React from 'react'

const OverviewSection = ({ consultancy }) => {
  const description = consultancy?.description || ''

  if (!description) {
    return null
  }

  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>About</h2>

      {/* Description HTML content */}
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className='text-gray-800 mt-9 max-[1120px]:mt-5 leading-7 max-md:leading-5 text-justify text-xs md:text-sm lg:text-base
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
             [&_ol]:list-decimal
             [&_ol]:pl-8 
             [&_ol]:my-4
             [&_ol]:space-y-2
             [&_ul]:list-disc 
             [&_ul]:pl-8 
             [&_ul]:my-4
             [&_ul]:space-y-2
             [&_li]:pl-2
             max-lg:[&_ol]:text-sm
             max-lg:[&_ul]:text-sm
             max-lg:[&_ol]:space-y-1
             max-lg:[&_ul]:space-y-1
             prose max-w-none'
      />
    </div>
  )
}

export default OverviewSection
