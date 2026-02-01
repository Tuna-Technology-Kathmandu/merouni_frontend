import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { DotenvConfig } from '../../config/env.config'
import { toast } from 'react-toastify'

const FeaturedDegree = () => {
  const [degrees, setDegrees] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDegrees = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/degree?page=1&limit=6`
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch degrees')
      setDegrees(data?.items ?? [])
    } catch (error) {
      console.error('Error fetching degrees:', error)
      toast.error('Failed to load degrees')
      setDegrees([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDegrees()
  }, [])

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 md:py-10'>
      <div className='container mx-auto px-4 sm:px-6 md:px-8'>
        <h1 className='text-xl font-semibold text-gray-800 mt-4 mb-5 md:mt-5 md:mb-6 pb-2 relative inline-block'>
          Find the Right Degree for You
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0870A8] to-[#31AD8F]'></span>
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5'>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className='h-72 rounded-lg bg-gray-200 animate-pulse'
                />
              ))
            : degrees?.map((item) => (
                <Link
                  key={item.id}
                  href={`/degree/${encodeURIComponent(item.slug || '')}`}
                  className='h-72 block bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative'
                >
                  <div className='w-full h-full bg-gray-100'>
                    {item.cover_image ? (
                      <img
                        src={item.cover_image}
                        alt={item.title}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-[#0A6FA7]/10 text-[#0A6FA7] text-4xl font-bold'>
                        {item.short_name?.charAt(0) ||
                          item.title?.charAt(0) ||
                          'D'}
                      </div>
                    )}
                  </div>
                  <div className='absolute bottom-0 left-0 right-0 bg-black/70 p-4'>
                    <h2 className='text-lg font-semibold text-white'>
                      {item.title}
                    </h2>
                    {item.short_name && (
                      <p className='text-sm text-white/80'>{item.short_name}</p>
                    )}
                  </div>
                </Link>
              ))}
          {/* Explore All Button Card */}
          <Link
            href='/degree'
            className='h-72 flex bg-gradient-to-br from-[#0870A8] to-[#31AD8F] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative items-center justify-center'
          >
            <div className='text-center p-6'>
              <h2 className='text-2xl font-bold text-white mb-4'>
                Explore All
              </h2>
              <p className='text-white/90 text-sm mb-6'>
                Discover all available degrees and programs
              </p>
              <div className='inline-flex items-center gap-2 bg-white text-[#0870A8] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'>
                <span>View All</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M14 5l7 7m0 0l-7 7m7-7H3'
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FeaturedDegree
