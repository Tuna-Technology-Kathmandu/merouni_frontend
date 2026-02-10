import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'

const FeaturedDegree = () => {
  const [degrees, setDegrees] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDegrees = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.baseUrl}/degree?page=1&limit=6`
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
                <div key={i} className='flex flex-col gap-3'>
                  <div className='aspect-[16/10] rounded-xl bg-gray-200 animate-pulse' />
                  <div className='h-6 w-3/4 bg-gray-200 rounded animate-pulse' />
                  <div className='h-4 w-1/2 bg-gray-200 rounded animate-pulse' />
                </div>
              ))
            : degrees?.map((item) => (
                <Link
                  key={item.id}
                  href={`/degree/${encodeURIComponent(item.slug || '')}`}
                  className='group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl'
                >
                  <div className='aspect-[16/10] w-full overflow-hidden bg-gray-100 relative'>
                    {item.featured_image ? (
                      <img
                        src={item.featured_image}
                        alt={item.title}
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A6FA7]/10 to-[#31AD8F]/10 text-[#0A6FA7] text-4xl font-bold'>
                        {item.short_name?.charAt(0) ||
                          item.title?.charAt(0) ||
                          'D'}
                      </div>
                    )}
                  </div>
                  <div className='p-4 h-[100px] flex flex-col justify-between'>
                    <div>
                      <h2 className='text-md font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#0A6FA7] transition-colors'>
                        {item.title}
                      </h2>
                      {item.short_name && (
                        <p className='text-xs text-gray-500 mt-1.5 font-medium'>
                          {item.short_name}
                        </p>
                      )}
                    </div>
                    {/* View Details Hint */}
                    <div className='mt-2 flex items-center text-xs font-semibold text-[#0A6FA7] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0'>
                      View Details
                      <svg
                        className='w-3 h-3 ml-1'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
          {/* Explore All Button Card */}
          <Link
            href='/degree'
            className='group flex flex-col bg-gradient-to-br from-[#0870A8] to-[#31AD8F] rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative'
          >
            <div className='aspect-[16/10] flex items-center justify-center p-6 text-center text-white'>
              <div className='transform transition-transform duration-500 group-hover:scale-110'>
                <h2 className='text-2xl font-bold mb-2'>Explore All</h2>
                <div className='h-1 w-12 bg-white/40 mx-auto rounded-full'></div>
              </div>
            </div>
            <div className='p-4 bg-white/10 backdrop-blur-sm flex-grow flex flex-col justify-center items-center text-center'>
              <p className='text-white text-xs mb-4 line-clamp-2'>
                Discover all available degrees and programs that fit your career
                goals
              </p>
              <div className='inline-flex items-center gap-2 bg-white text-[#0870A8] px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors shadow-sm'>
                <span>View All Degrees</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
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
