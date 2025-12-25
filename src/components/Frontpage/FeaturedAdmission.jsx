'use client'
import React, { useEffect, useState } from 'react'
import { getFeaturedCollege } from '../../app/[[...home]]/action'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const FeaturedAdmission = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const router = useRouter()
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      let items = await getFeaturedCollege()
      setData(items.items)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden animate-pulse'>
      <div className='w-full h-32 sm:h-24 bg-gray-300'></div>
      <div className='p-4'>
        <div className='h-6 bg-gray-300 rounded w-3/4 mb-2'></div>
        <div className='h-4 bg-gray-300 rounded w-1/2 mb-2'></div>
        <div className='h-4 bg-gray-300 rounded w-1/3 mb-4'></div>
        <div className='flex justify-between items-center'>
          <div className='h-4 bg-gray-300 rounded w-1/4'></div>
          <div className='h-10 bg-gray-300 rounded w-24'></div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <h1 className=' text-xl font-semibold text-gray-800 my-8'>Top Picks</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr'>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : data.map((item) => (
              <div
                onClick={() => router.push(`/colleges/${item.slugs}`)}
                key={item.id}
              >
                <div
                  key={item.id}
                  className='bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full'
                >
                  <div className='w-full h-32 sm:h-24 bg-gray-300 flex-shrink-0'>
                    <img
                      src={item.featured_img}
                      alt={item.name}
                      className='w-full h-32 sm:h-24 object-cover'
                    />
                  </div>
                  <div className='p-4 flex flex-col flex-1 min-h-0'>
                    <h2 className='text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]'>
                      {item.name}
                    </h2>
                    <div className=' sm:flex justify-between items-center'>
                      <div>
                        <p className='text-gray-600 text-[15px]'>
                          {item.address.city}, {item.address.country}
                        </p>
                        <p className='text-gray-400 text-[14px]'>
                          {item.university.fullname}
                        </p>
                      </div>
                      <Link href={`/colleges/apply/${item.slugs}`}>
                        <button className='flex items-center mt-3 sm:mt-0 bg-clientBtn text-white text-sm px-3 py-2 rounded-md hover:bg-blue-600 transition duration-300'>
                          Apply Now
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4 ml-2'
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
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </>
  )
}

export default FeaturedAdmission
