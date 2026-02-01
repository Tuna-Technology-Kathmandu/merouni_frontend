'use client'

import React from 'react'

const OverviewSection = ({ consultancy }) => {
  const description = consultancy?.description || ''

  if (!description) {
    return null
  }

  return (
    <div className='max-w-4xl'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6'>
        About
      </h2>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className='text-gray-600 leading-relaxed text-justify text-sm md:text-base
          [&>iframe]:w-full [&>iframe]:max-w-[calc(100vw-40px)] [&>iframe]:aspect-video [&>iframe]:h-auto
          [&>iframe]:rounded-2xl [&>iframe]:mt-6 [&>iframe]:mx-auto [&>iframe]:block [&>iframe]:shadow-lg
          [&_table]:min-w-full [&_table]:border-collapse [&_table]:rounded-xl [&_table]:overflow-hidden
          [&_table]:border [&_table]:border-gray-100
          [&_th]:bg-gray-50 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900 [&_th]:border [&_th]:border-gray-200
          [&_td]:p-3 [&_td]:border [&_td]:border-gray-100 [&_tr:nth-child(even)]:bg-gray-50/50
          [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-gray-900
          [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-gray-900
          [&_ol]:pl-8 [&_ol]:my-6 [&_ol]:space-y-3 [&_ol]:list-decimal
          [&_ul]:list-disc [&_ul]:pl-8 [&_ul]:my-6 [&_ul]:space-y-3 [&_li]:pl-2
          prose max-w-none'
      />
    </div>
  )
}

export default OverviewSection
