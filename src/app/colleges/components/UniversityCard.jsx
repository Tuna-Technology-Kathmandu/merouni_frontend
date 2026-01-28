'use client'

import { useState } from 'react'
import { Heart, Info, GraduationCap, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DotenvConfig } from '@/config/env.config'

const UniversityCard = ({
  name,
  location,
  collegeId,
  isWishlistPage = false,
  slug,
  collegeImage,
  wishlistCollegeIds,
  onWishlistUpdate,
  instituteType
}) => {
  const user = useSelector((state) => state.user.data)
  const router = useRouter()

  const isInWishlist = wishlistCollegeIds
    ? wishlistCollegeIds.has(collegeId)
    : isWishlistPage

  const [isLoading, setIsLoading] = useState(false)

  const handleWishlistToggle = async (e) => {
    e.stopPropagation()
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

      if (onWishlistUpdate && wishlistCollegeIds) {
        const newSet = new Set(wishlistCollegeIds)
        if (method === 'DELETE') {
          newSet.delete(collegeId)
        } else {
          newSet.add(collegeId)
        }
        onWishlistUpdate(newSet)
      }

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
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/colleges/${slug}`)}
      className='group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full'
    >
      <div className='relative h-52 overflow-hidden bg-gray-100'>
        <img
          src={collegeImage || 'https://placehold.co/600x400'}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          alt={name}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

        <div className='absolute top-3 left-3 flex gap-2'>
          <div className='bg-white px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#0A70A7] uppercase tracking-wider shadow-sm'>
            {instituteType || 'College'}
          </div>
        </div>

        <div className='absolute top-3 right-3'>
          {user && (
            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className='p-2 bg-white/80 hover:bg-white rounded-full transition-all group/heart shadow-sm'
            >
              <Heart
                className={`w-4 h-4 transition-all ${isInWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-600 group-hover/heart:scale-110'
                  }`}
              />
            </button>
          )}
        </div>

        <div className='absolute bottom-3 left-4 right-4'>
          <div className='flex items-center gap-1 text-white/90 text-xs font-medium'>
            <MapPin className='w-3 h-3 text-blue-400' />
            <span className='line-clamp-1'>{location}</span>
          </div>
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <h3 className='font-bold text-base text-gray-800 mb-4 group-hover:text-[#0A70A7] transition-colors leading-tight line-clamp-2 min-h-[2.5rem]'>
          {name}
        </h3>

        <div className='mt-auto pt-5 flex items-center gap-3 border-t border-gray-100'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/${slug}`)
            }}
            className='flex-1 py-2.5 px-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-[10px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider'
          >
            <Info className='w-3.5 h-3.5' />
            Details
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/apply/${slug}`)
            }}
            className='flex-1 py-2.5 px-3 bg-[#0A70A7] text-white rounded-xl hover:bg-[#085a86] transition-all text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider'
          >
            <GraduationCap className='w-3.5 h-3.5' />
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default UniversityCard
