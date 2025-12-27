'use client'

import React, { useEffect, useState, useRef } from 'react'
import { getColleges } from '../../actions'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const RelatedColleges = ({ college }) => {
  const [colleges, setColleges] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    getRelatedColleges()
  }, [])

  const getRelatedColleges = async () => {
    setIsLoading(true)
    try {
      const data = await getColleges()
      const filteredColleges = data.colleges.filter(
        (c) => c.collegeId !== college._id
      )
      setColleges(filteredColleges)
    } catch (error) {
      console.error('Error fetching colleges:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className='flex flex-col max-w-[1600px] mx-auto mb-10 sm:mb-20 px-4 sm:px-8 md:px-16 lg:px-24'>
      <h2 className='font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl leading-7 sm:leading-10 m-2 sm:m-4 text-center sm:text-left'>
        Colleges you may like
      </h2>
      <div className='relative'>
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block'
          aria-label='Scroll left'
        >
          <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700' />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className='flex overflow-x-auto gap-3 sm:gap-4 px-8 sm:px-12 scroll-smooth no-scrollbar'
        >
          {isLoading ? (
            <div className='flex justify-center items-center w-full py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
            </div>
          ) : (
            colleges.map((college, index) => (
              <Link
                href={`/colleges/${college.slug}`}
                key={index}
                className='flex-shrink-0'
              >
                <div className='cursor-pointer p-2 sm:p-4 w-48 sm:w-56 md:w-64'>
                  <div className='flex justify-center border-2 rounded-2xl sm:rounded-3xl items-center overflow-hidden mb-2 p-2 sm:p-4'>
                    <img
                      src={college.logo}
                      alt={college.name}
                      className='w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover'
                    />
                  </div>
                  <div className='px-2 sm:px-4 pb-2 sm:pb-4 flex flex-col'>
                    <h3 className='text-sm sm:text-base md:text-lg font-bold text-center line-clamp-2'>
                      {college.name}
                    </h3>
                    <p className='text-xs text-gray-700 text-center line-clamp-1 mt-1'>
                      {college.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:block'
          aria-label='Scroll right'
        >
          <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700' />
        </button>
      </div>
    </div>
  )
}

export default RelatedColleges
