'use client'

import { useState, useEffect } from 'react'
import { Share, Heart } from 'lucide-react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import { useRouter } from 'next/navigation'
const UniversityCard = ({
  name,
  location,
  collegeId,
  isWishlistPage = false,
  slug,
  collegeImage
}) => {
  const [isInWishlist, setIsInWishlist] = useState(isWishlistPage)
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user.data)

  const router = useRouter()

  useEffect(() => {
    if (user?.id) {
      checkWishlistStatus()
    }
  }, [user])

  const checkWishlistStatus = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/wishlist?user_id=${user.id}`,
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

      const data = await response.json()
      const isInList = data.items.some((item) => item.college.id === collegeId)

      setIsInWishlist(isInList)
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.warning('Please sign in to manage your wishlist', {
        position: 'top-right',
        autoClose: 3000
      })
      return
    }

    setIsLoading(true)
    try {
      const method = isWishlistPage || isInWishlist ? 'DELETE' : 'POST'
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/wishlist`,
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
      setIsInWishlist(!isInWishlist)

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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300'>
      <div
        className='flex justify-between items-start min-h-28 bg-slate-300'
        style={{
          backgroundImage: `url("${collegeImage || 'https://placehold.co/600x400'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className='flex gap-2'>
          {/* <button className='p-2 hover:bg-gray-100 rounded-full'>
            <Share className='w-5 h-5 text-gray-600' />
          </button> */}
          {user && (
            <button
              className='p-2 hover:bg-gray-100 rounded-full'
              onClick={handleWishlistToggle}
              disabled={isLoading}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'
                } ${isLoading ? 'opacity-50' : ''}`}
              />
            </button>
          )}
        </div>
      </div>
      <div className='p-4'>
        <h3 className='font-semibold text-base mb-2'>{name}</h3>
        <p className=' text-sm mb-3 text-gray-400'>{location}</p>
        <div className='flex gap-3 justify-between'>
          <button className='flex-1 py-1.5 px-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-[13px] font-medium text-center'>
            Details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/apply/${slug}`)
            }}
            className='flex-1 py-1.5 px-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 text-[13px] font-medium text-center'
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default UniversityCard
