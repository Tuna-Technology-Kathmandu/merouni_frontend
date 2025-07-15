'use client'

import React, { useRef, useState, useEffect } from 'react'
import Fcollege from './Fcollege'
import { GoArrowLeft } from 'react-icons/go'
import { GoArrowRight } from 'react-icons/go'
import { getFilteredPinFeatColleges } from '@/app/action'

const Featured = () => {
  const [featuredColleges, setFeaturedColleges] = useState([])
  const [filteredColleges, setFilteredColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const fetchFeaturedColleges = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getFilteredPinFeatColleges(true)
        if (response && response.items) {
          setFeaturedColleges(response.items)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching featured colleges:', err)
        setError('Failed to load featured colleges. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedColleges()
  }, [])

  useEffect(() => {
    setFilteredColleges(
      featuredColleges.filter((college) => {
        const levels = JSON.parse(college.institute_level || '[]')
        return levels.includes('School')
      })
    )
  }, [featuredColleges])

  return (
    <div className='flex flex-col p-4 py-20'>
      <h2 className='text-2xl font-bold text-gray-800 mb-8'>
        Featured Schools
      </h2>

      {loading && (
        <div className='flex justify-center items-center h-40'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}

      {error && (
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'
          role='alert'
        >
          <span className='block sm:inline'>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className='absolute top-0 right-0 px-4 py-3'
          >
            <svg
              className='fill-current h-6 w-6 text-red-500'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
            </svg>
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className='relative'>
          {/* Left Scroll Button - Only show if there are colleges to scroll through */}
          {filteredColleges.length > 0 && (
            <button
              onClick={scrollLeft}
              className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10'
              aria-label='Scroll left'
            >
              <GoArrowLeft />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className='flex gap-10 overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2'
          >
            {filteredColleges.length > 0
              ? filteredColleges.map((college, index) => (
                  <Fcollege
                    description={college.address}
                    name={college.name}
                    image={college?.featured_img}
                    key={college.id || index} // Better to use college.id if available
                    slug={college.slugs}
                  />
                ))
              : !loading &&
                !error && (
                  <div className='w-full text-center py-10 text-gray-500'>
                    No featured colleges available at the moment.
                  </div>
                )}
          </div>

          {/* Right Scroll Button - Only show if there are colleges to scroll through */}
          {filteredColleges.length > 0 && (
            <button
              onClick={scrollRight}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10'
              aria-label='Scroll right'
            >
              <GoArrowRight />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Featured
