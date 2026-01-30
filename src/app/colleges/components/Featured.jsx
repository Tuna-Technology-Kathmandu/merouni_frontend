'use client'

import { useEffect, useRef, useState } from 'react'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import FcollegeShimmer from './FCollegeShimmer'
import Fcollege from './Fcollege'

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
      const response = await 
      (true)
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

  // Hide section completely if no data or error
  if (!loading && (error || featuredColleges.length === 0)) {
    return null
  }

  return (
    <div className='flex flex-col px-4 sm:px-8 mt-12 mb-16 max-w-[1600px] mx-auto w-full'>
      <div className='flex items-center justify-between mb-8'>
        <div className='relative'>
          <h2 className='text-3xl font-extrabold text-gray-800'>
            Featured <span className='text-[#0A70A7]'>Colleges</span>
          </h2>
          <div className='absolute -bottom-2 left-0 w-12 h-1 bg-[#0A70A7] rounded-full'></div>
        </div>

        <div className='flex gap-2 hidden sm:flex'>
          <button
            disabled={!canScrollLeft}
            onClick={scrollLeft}
            className={`p-2 rounded-full border transition-all ${canScrollLeft ? 'border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer' : 'border-gray-100 text-gray-300 cursor-default'}`}
          >
            <GoArrowLeft size={20} />
          </button>
          <button
            disabled={!canScrollRight}
            onClick={scrollRight}
            className={`p-2 rounded-full border transition-all ${canScrollRight ? 'border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer' : 'border-gray-100 text-gray-300 cursor-default'}`}
          >
            <GoArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className='relative group'>
        {/* Mobile Scroll Buttons (floated) */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 backdrop-blur-md shadow-lg rounded-full text-gray-700 hover:text-[#0A70A7] transition-all opacity-0 group-hover:opacity-100 sm:hidden'
          >
            <GoArrowLeft size={20} />
          </button>
        )}

        {loading ? (
          <FcollegeShimmer />
        ) : (
          <div
            ref={scrollRef}
            className='flex gap-6 w-full overflow-x-auto scroll-smooth hide-scrollbar pb-4 px-1'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 backdrop-blur-md shadow-lg rounded-full text-gray-700 hover:text-[#0A70A7] transition-all opacity-0 group-hover:opacity-100 sm:hidden'
          >
            <GoArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export default Featured
