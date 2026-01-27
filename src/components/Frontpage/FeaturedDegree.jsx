import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DotenvConfig } from '../../config/env.config'

const FeaturedDegree = () => {
  const router = useRouter()
  const [degree, setDegree] = useState([])

  const images = [
    '/images/deg1.webp',
    '/images/deg3.webp',
    '/images/deg2.webp',
    '/images/deg4.webp',
    '/images/deg5.webp',
    '/images/deg6.webp',
    '/images/deg7.webp',
    '/images/deg8.webp'
  ]

  const getdegree = async () => {
    try {
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/program?limit=6`
      )
      const data = await response.json()
      setDegree(data?.items)
    } catch (error) {
      console.error('College Search Error:', error)
      toast.error('Failed to search colleges')
    }
  }
  useEffect(() => {
    getdegree()
  }, [])

  const handleCardClick = (slug) => {
    console.log(slug)
    router.push(`degree/${slug}`)
  }
  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 md:py-16'>
      <div className='container mx-auto px-8 md:px-12'>
        <h1 className='text-xl font-semibold text-gray-800 my-8 pb-2 relative inline-block'>
          Find the Right Degree and College for You
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0870A8] to-[#31AD8F]'></span>
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {degree &&
            degree?.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.slugs)}
                className='h-72 cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-gray-300 relative'
              >
                <img
                  src={images[index]}
                  alt={item.title}
                  className='w-full h-full object-cover'
                />
                <div className='absolute bottom-0 left-0 right-0 bg-black p-4'>
                  <h2 className='text-lg font-semibold text-white'>
                    {item.title}
                  </h2>
                </div>
              </div>
            ))}
          {/* Explore All Button Card */}
          <div
            onClick={() => router.push('/degree')}
            className='h-72 cursor-pointer bg-gradient-to-br from-[#0870A8] to-[#31AD8F] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl relative flex items-center justify-center'
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedDegree
