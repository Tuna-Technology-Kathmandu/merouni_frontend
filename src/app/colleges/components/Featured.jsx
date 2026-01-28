'use client'

import React, { useRef, useState, useEffect } from 'react'
import FcollegeShimmer from './FCollegeShimmer'
import Fcollege from './Fcollege'
import { GoArrowLeft } from 'react-icons/go'
import { GoArrowRight } from 'react-icons/go'
import { getFilteredPinFeatColleges } from '@/app/action'

const Featured = () => {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [featuredColleges, setFeaturedColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
      setTimeout(checkScrollButtons, 100)
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
      setTimeout(checkScrollButtons, 100)
    }
  }

  const fetchFeaturedColleges = async () => {
    try {
      const response = await getFilteredPinFeatColleges(true)
      setFeaturedColleges(response.items || [])
    } catch (error) {
      setError('Failed to load featured Colleges')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedColleges()
  }, [])

  useEffect(() => {
    // Delay to ensure DOM is fully rendered before checking scroll
    const timeoutId = setTimeout(() => {
      checkScrollButtons()
    }, 100)

    const container = scrollRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        clearTimeout(timeoutId)
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [featuredColleges])

  return (
    <div className='flex flex-col px-8 mt-12 mb-16'>
      <div className='mb-10'>
        <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
          Featured <span className='text-[#0A70A7]'>Colleges</span>
        </h2>
        <div className='w-16 h-1.5 bg-[#0A70A7] mt-3 rounded-full'></div>
      </div>
      <div className='relative'>
        {/* Left Scroll Button - Only show if there are colleges and can scroll left */}
        {!loading && !error && featuredColleges.length > 0 && canScrollLeft && (
          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10'
            aria-label='Scroll left'
          >
            <GoArrowLeft />
          </button>
        )}

        {/* Scrollable Container */}
        {loading ? (
          <FcollegeShimmer />
        ) : error ? (
          <div className='w-full text-center py-10 text-red-500'>{error}</div>
        ) : featuredColleges.length === 0 ? (
          <div className='w-full text-center py-10 text-gray-500'>
            No featured colleges available at the moment.
          </div>
        ) : (
          <div
            ref={scrollRef}
            className='flex gap-4 w-full overflow-x-auto scroll-smooth hide-scrollbar'
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {featuredColleges.map((college, index) => (
              <Fcollege
                description={college.address}
                name={college.name}
                image={college?.featured_img}
                key={college.id || index}
                slug={college.slugs}
              />
            ))}
          </div>
        )}

        {/* Right Scroll Button - Only show if there are colleges and can scroll right */}
        {!loading &&
          !error &&
          featuredColleges.length > 0 &&
          canScrollRight && (
            <button
              onClick={scrollRight}
              className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md z-10'
              aria-label='Scroll right'
            >
              <GoArrowRight />
            </button>
          )}
      </div>
    </div>
  )
}

export default Featured
