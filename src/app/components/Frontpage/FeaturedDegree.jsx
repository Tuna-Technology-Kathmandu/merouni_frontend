import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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
        `${process.env.baseUrl}${process.env.version}/program?limit=8`
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

  console.log('degree', degree)

  const handleCardClick = (slug) => {
    console.log(slug)
    router.push(`degree/${slug}`)
  }
  return (
    <div className='bg-gray-100 py-8'>
      <div className='container mx-auto px-4'>
        <h1 className=' text-xl font-semibold text-gray-800 my-8'>
          Find the Right Degree and College for You
        </h1>{' '}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {degree.map((item, index) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.slugs)}
              className='h-72 cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:border-gray-300'
            >
              <img
                src={images[index]}
                alt={item.title}
                className='w-full h-40 object-cover'
              />
              <div className='p-4'>
                <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                  {item.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedDegree
