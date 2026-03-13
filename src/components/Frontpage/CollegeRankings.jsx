'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react'

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
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [rankings])

  const fetchRankings = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.baseUrl}/college-ranking?limit=100`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
        }
      )
      if (!response.ok) throw new Error('Failed to fetch rankings')
      const data = await response.json()
      setRankings(data.items || [])
    } catch (error) {
      console.error('Error fetching college rankings:', error)
      setRankings([])
    } finally {
      setLoading(false)
    }
  }

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -360 : 360,
      behavior: 'smooth'
    })
    setTimeout(checkScrollButtons, 150)
  }

  if (loading) {
    return (
      <div className='bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 md:py-10'>
        <div className='container mx-auto px-4 sm:px-6 md:px-8'>
          <div className='h-6 w-48 bg-gray-200 rounded animate-pulse mb-6' />
          <div className='flex gap-4 overflow-hidden'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='flex-shrink-0 w-[320px] md:w-[360px] rounded-md border border-gray-200/80 bg-white p-5'
              >
                <div className='h-5 w-3/4 bg-gray-100 rounded mb-4' />
                <div className='space-y-2'>
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className='h-12 bg-gray-50 rounded-md' />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (rankings.length === 0) {
    return null
  }

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 md:py-10'>
      <div className='container mx-auto px-4 sm:px-6 md:px-8'>
        <div className='mb-10'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>
            Top College Rankings
          </h2>
          <div className='h-1 w-20 mt-2 rounded-full' style={{ backgroundColor: '#387cae' }}></div>
        </div>

        <div className='relative group'>
          {canScrollLeft && (
            <button
              type='button'
              onClick={() => scroll('left')}
              className='absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-md border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 md:opacity-100'
              aria-label='Scroll left'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className='flex gap-4 md:gap-5 overflow-x-auto scroll-smooth pb-2 hide-scrollbar'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {rankings.map((degreeGroup) => {
              if (!degreeGroup?.degree || !degreeGroup?.rankings?.length) {
                return null
              }

              return (
                <div
                  key={degreeGroup.degree.id}
                  className='flex-shrink-0 w-[300px] sm:w-[320px] md:w-[360px] rounded-md border border-gray-200/80 bg-white overflow-hidden hover:border-gray-300 hover:shadow-md transition-all'
                >
                  <div className='px-5 pt-5 pb-3'>
                    <div className='flex items-center gap-2 mb-4'>
                      <div className='p-1.5 rounded-md bg-[#0A6FA7]/10'>
                        <GraduationCap className='w-4 h-4 text-[#0A6FA7]' />
                      </div>
                      <h3 className='text-base font-semibold text-gray-900 line-clamp-2'>
                        {degreeGroup.degree.title || 'Degree'}
                      </h3>
                    </div>

                    <ul className='space-y-1.5'>
                      {degreeGroup.rankings.map((ranking) => {
                        const college = ranking.college
                        if (!college) return null

                        return (
                          <li key={ranking.id}>
                            <Link
                              href={`/colleges/${college.slugs || ''}`}
                              className='flex items-center gap-3 py-2.5 px-3 rounded-md text-left hover:bg-gray-50 transition-colors -mx-1'
                            >
                              <span className='flex-shrink-0 w-7 h-7 rounded-md bg-gray-100 text-xs font-semibold text-gray-600 flex items-center justify-center'>
                                {ranking.rank}
                              </span>
                              {college.college_logo ? (
                                <div className='relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-50'>
                                  <Image
                                    src={college.college_logo}
                                    alt=''
                                    fill
                                    className='object-contain'
                                  />
                                </div>
                              ) : (
                                <div className='w-12 h-12 rounded-md bg-gray-50 flex-shrink-0 flex items-center justify-center text-xs font-medium text-gray-400'>
                                  {college.name?.charAt(0) || '?'}
                                </div>
                              )}
                              <span className='flex-1 min-w-0 text-sm font-medium text-gray-700 truncate'>
                                {college.name || 'College'}
                              </span>
                              <ChevronRight className='w-4 h-4 text-gray-400 flex-shrink-0' />
                            </Link>
                          </li>
                        )
                      })}
                    </ul>

                    <div className='mt-2.5 pt-2 flex items-center justify-end'>
                      <Link
                        href={`/college-rankings/${degreeGroup.degree.slug || ''}`}
                        className='text-xs font-semibold text-[#0A6FA7] hover:text-[#064263] flex items-center transition-colors'
                      >
                        Explore All <ChevronRight className='w-3.5 h-3.5 ml-0.5' />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {canScrollRight && (
            <button
              type='button'
              onClick={() => scroll('right')}
              className='absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/95 shadow-md border border-gray-200/80 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 md:opacity-100'
              aria-label='Scroll right'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollegeRankings
