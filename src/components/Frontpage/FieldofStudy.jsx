'use client'
import React, { useEffect, useState } from 'react'
import { ImCross } from 'react-icons/im'

const FieldofStudy = () => {
  const [study, setStudy] = useState([])
  const [selectedStudy, setSelectedStudy] = useState({
    title: '',
    description: ''
  })

  const images = [
    '/images/st1.webp',
    '/images/st2.webp',
    '/images/st3.webp',
    '/images/st4.webp',
    '/images/st5.webp',
    '/images/st6.webp',
    '/images/st7.webp',
    '/images/st8.webp'
  ]

  useEffect(() => {
    getStudy()
  }, [])

  const getStudy = async () => {
    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/faculty?limit=8`
      )
      const data = await response.json()
      setStudy(data?.items)
    } catch (error) {
      console.error('College Search Error:', error)
      toast.error('Failed to search colleges')
    }
  }

  return (
    <div className='bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 md:py-16 relative'>
      <div className='container mx-auto px-8 md:px-12'>
        <h1 className='text-xl font-semibold text-gray-800 my-8 pb-2 relative inline-block'>
          Field of Study
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0870A8] to-[#31AD8F]'></span>
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {study.map((item, index) => (
            <div
              key={item.id}
              onClick={() =>
                setSelectedStudy({
                  title: item?.title || '',
                  description: item?.description || ''
                })
              }
            >
              <div className='relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
                <img
                  src={images[index]}
                  alt={item.title}
                  className='w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105'
                />
                <div className='absolute bottom-0 left-0 right-0 bg-black p-4'>
                  <h2 className='text-lg font-semibold text-white'>
                    {item.title}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedStudy && (selectedStudy.title || selectedStudy.description) && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-7 md:px-14'>
          <div className='w-full h-auto max-h-[500px] bg-white rounded-md p-4 md:p-10 overflow-y-auto'>
            <h1 className='mb-4 font-semibold text-lg md:text-xl'>
              {selectedStudy.title}
            </h1>
            <p className='text-xs sm:text-sm'>{selectedStudy.description}</p>
          </div>
          <button
            onClick={() => setSelectedStudy(null)}
            className='cursor-pointer'
          >
            <ImCross className=' cursor-pointer absolute right-3 top-7 z-10 text-white sm:text-lg md:text-2xl lg:text-3xl' />
          </button>
        </div>
      )}
    </div>
  )
}

export default FieldofStudy
