'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '../../config/env.config'

const FeaturedAdmission = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlistStatus, setWishlistStatus] = useState({})
  const user = useSelector((state) => state.user.data)
  const router = useRouter()
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    fetchItems()
  }, [])

  useEffect(() => {
    if (user?.id && data.length > 0) {
      checkWishlistStatus()
    }
  }, [user, data])

  const checkWishlistStatus = async () => {
    if (!user?.id) return

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/wishlist?user_id=${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`)
      }

      const wishlistData = await response.json()
      const statusMap = {}
      wishlistData.items.forEach((item) => {
        statusMap[item.college.id] = true
      })
      setWishlistStatus(statusMap)
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleWishlistToggle = async (e, collegeId) => {
    e.stopPropagation()

    if (!user) {
      toast.warning('Please sign in to manage your wishlist', {
        position: 'top-right',
        autoClose: 3000
      })
      return
    }

    try {
      const isInWishlist = wishlistStatus[collegeId]
      const method = isInWishlist ? 'DELETE' : 'POST'
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/wishlist`,
        {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ college_id: collegeId, user_id: user.id })
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`)
      }

      setWishlistStatus((prev) => ({
        ...prev,
        [collegeId]: !isInWishlist
      }))

      toast.success(
        method === 'DELETE'
          ? 'Successfully removed from wishlist'
          : 'Successfully added to wishlist',
        {
          position: 'top-right',
          autoClose: 2000
        }
      )
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist. Please try again.', {
        position: 'top-right',
        autoClose: 3000
      })
    }
  }

  const fetchItems = async () => {
    try {
      // Use direct fetch instead of server action to avoid SSR issues and ensure correct API URL
      const apiUrl = `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?pinned=true&page=1&limit=6`

      // Debug: Log API URL in development (remove in production if needed)
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching featured colleges from:', apiUrl)
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (response.ok) {
        const items = await response.json()
        setData(items.items || [])
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch featured colleges:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: apiUrl
        })
        toast.error('Failed to load featured colleges')
        setData([])
      }
    } catch (error) {
      console.error('Error fetching featured colleges:', {
        message: error.message,
        stack: error.stack,
        baseUrl: process.env.baseUrl,
        version: process.env.version
      })
      toast.error('Something went wrong')
      setData([])
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
      <h1 className='text-xl font-semibold text-gray-800 my-8 pb-2 relative inline-block'>
        Top Picks
        <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0870A8] to-[#31AD8F]'></span>
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr'>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
          : data.map((item) => (
            <div
              onClick={() => router.push(`/colleges/${item.slugs}`)}
              key={item.id}
              className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300 cursor-pointer flex flex-col'
            >
              <div
                className='flex justify-between items-start min-h-28 bg-slate-300 relative'
                style={{
                  backgroundImage: `url("${item.featured_img || 'https://placehold.co/600x400'}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {user && (
                  <button
                    className='p-2 hover:bg-gray-100 rounded-full m-2 z-10'
                    onClick={(e) => handleWishlistToggle(e, item.id)}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-200 ${wishlistStatus[item.id]
                          ? 'text-red-500 fill-red-500'
                          : 'text-gray-600'
                        }`}
                    />
                  </button>
                )}
              </div>
              <div className='p-4 flex flex-col h-full'>
                <div className='flex-grow'>
                  <h3 className='font-semibold text-base mb-2 line-clamp-2 min-h-[2.5rem]'>
                    {item.name}
                  </h3>
                  {item.university?.fullname && (
                    <p className='text-sm mb-1 text-gray-600 font-medium line-clamp-1'>
                      {item.university.fullname}
                    </p>
                  )}
                  <p className='text-sm mb-3 text-gray-400 line-clamp-1'>
                    {item.address?.city || ''}, {item.address?.country || ''}
                  </p>
                </div>
                <div className='flex gap-3 justify-between mt-auto'>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/colleges/apply/${item.slugs}`)
                    }}
                    className='flex-1 py-1.5 px-3 text-white rounded-2xl hover:opacity-90 text-[13px] font-medium text-center transition-opacity'
                    style={{ backgroundColor: '#0870A8' }}
                  >
                    Apply Now
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/colleges/${item.slugs}`)
                    }}
                    className='flex-1 py-1.5 px-3 text-white rounded-2xl hover:opacity-90 text-[13px] font-medium text-center flex items-center justify-center gap-1 transition-opacity'
                    style={{ backgroundColor: '#31AD8F' }}
                  >
                    Details
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
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default FeaturedAdmission
