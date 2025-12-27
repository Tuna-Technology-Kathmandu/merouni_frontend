'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const CollegeRankings = () => {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    fetchRankings()
  }, [])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1) // -1 for rounding issues
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      // Check on resize as well
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [rankings]) // Re-check when rankings change

  const fetchRankings = async () => {
    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/college-ranking?limit=100`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch rankings')
      }

      const data = await response.json()
      setRankings(data.items || [])
    } catch (error) {
      console.error('Error fetching college rankings:', error)
      setRankings([])
    } finally {
      setLoading(false)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
      // Check after a short delay to allow scroll to complete
      setTimeout(checkScrollButtons, 100)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
      // Check after a short delay to allow scroll to complete
      setTimeout(checkScrollButtons, 100)
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (rankings.length === 0) {
    return null
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 md:py-12'>
      <h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
        Top College Rankings
      </h2>

      <div className='relative'>
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200'
            aria-label='Scroll left'
          >
            <svg
              className='w-6 h-6 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className='flex gap-6 overflow-x-auto scroll-smooth pb-4 hide-scrollbar'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {rankings.map((programGroup) => {
            if (
              !programGroup ||
              !programGroup.program ||
              !programGroup.rankings ||
              programGroup.rankings.length === 0
            ) {
              return null
            }

            return (
              <div
                key={programGroup.program?.id}
                className='bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow flex-shrink-0 w-full md:w-[400px] lg:w-[450px]'
              >
                <div className='mb-4'>
                  <h3 className='text-xl font-semibold text-gray-800'>
                    {programGroup.program?.title || 'Unknown Program'}
                  </h3>
                </div>

                <div className='space-y-2'>
                  {programGroup.rankings.map((ranking) => {
                    const college = ranking.college
                    if (!college) return null

                    return (
                      <Link
                        href={`/colleges/${college.slugs}`}
                        key={ranking.id}
                        className='block'
                      >
                        <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer'>
                          <span className='font-bold text-blue-600 w-8 flex-shrink-0'>
                            #{ranking.rank}
                          </span>
                          <div className='flex-1 flex items-center gap-3 min-w-0'>
                            {college.college_logo && (
                              <div className='relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0'>
                                <Image
                                  src={college.college_logo}
                                  alt={college.name}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                            )}
                            <span className='text-sm font-medium text-gray-700 truncate'>
                              {college.name || 'Unknown College'}
                            </span>
                          </div>
                          <svg
                            className='w-4 h-4 text-gray-400 flex-shrink-0'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5l7 7-7 7'
                            />
                          </svg>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200'
            aria-label='Scroll right'
          >
            <svg
              className='w-6 h-6 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default CollegeRankings
