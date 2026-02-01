'use client'

import React, { useEffect, useState, useRef } from 'react'
import { getConsultancies } from '../../actions'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const RelatedConsultancies = ({ consultancy }) => {
  const [consultancies, setConsultancies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    getRelatedConsultancies()
  }, [])

  const getRelatedConsultancies = async () => {
    setIsLoading(true)
    try {
      const data = await getConsultancies(1, '')
      const filtered = data.items?.filter((c) => c.id !== consultancy.id) || []
      setConsultancies(filtered.slice(0, 12))
    } catch (error) {
      console.error('Error fetching consultancies:', error)
      setConsultancies([])
    } finally {
      setIsLoading(false)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  if (isLoading || consultancies.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col max-w-[1600px] mx-auto mb-10 sm:mb-20 px-4 sm:px-8 md:px-16 lg:px-24'>
      <h2 className='text-lg font-semibold text-gray-900 m-2 sm:m-4 text-center sm:text-left'>
        Consultancies you may like
      </h2>
      <div className='relative'>
        <button
          onClick={scrollLeft}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block border border-gray-100'
          aria-label='Scroll left'
        >
          <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700' />
        </button>

        <div
          ref={scrollContainerRef}
          className='flex overflow-x-auto gap-3 sm:gap-4 px-8 sm:px-12 scroll-smooth no-scrollbar'
        >
          {consultancies.map((item) => {
            const address = item?.address
              ? typeof item.address === 'string'
                ? (() => {
                    try {
                      return JSON.parse(item.address)
                    } catch {
                      return {}
                    }
                  })()
                : item.address || {}
              : {}
            const location = [address?.street, address?.city]
              .filter(Boolean)
              .join(', ')

            return (
              <Link
                href={`/consultancy/${item.slugs}`}
                key={item.id}
                className='flex-shrink-0'
              >
                <div className='cursor-pointer p-2 sm:p-4 w-48 sm:w-56 md:w-64'>
                  <div className='flex justify-center border-2 border-gray-100 rounded-2xl sm:rounded-3xl items-center overflow-hidden mb-2 p-2 sm:p-4 bg-white'>
                    {item?.logo ? (
                      <Image
                        src={item.logo}
                        alt={item.title || ''}
                        width={192}
                        height={192}
                        className='w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain'
                      />
                    ) : (
                      <div className='w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-50 flex items-center justify-center rounded-xl'>
                        <span className='text-gray-400 text-sm'>No logo</span>
                      </div>
                    )}
                  </div>
                  <div className='px-2 sm:px-4 pb-2 sm:pb-4 flex flex-col'>
                    <h3 className='text-sm font-medium text-center line-clamp-2 text-gray-900'>
                      {item.title}
                    </h3>
                    {location && (
                      <p className='text-xs text-gray-500 text-center line-clamp-1 mt-1'>
                        {location}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <button
          onClick={scrollRight}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block border border-gray-100'
          aria-label='Scroll right'
        >
          <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700' />
        </button>
      </div>
    </div>
  )
}

export default RelatedConsultancies
