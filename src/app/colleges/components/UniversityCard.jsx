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
      whileHover={{ y: -8 }}
      onClick={() => router.push(`/colleges/${slug}`)}
      className='group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col h-full'
    >
      <div className='relative h-52 overflow-hidden bg-gray-100'>
        <img
          src={collegeImage || 'https://placehold.co/600x400'}
          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
          alt={name}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'></div>

        <div className='absolute top-4 left-4 flex gap-2'>
          <div className='bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#387CAE] uppercase tracking-wider shadow-sm'>
            {instituteType || 'College'}
          </div>
        </div>

        <div className='absolute top-4 right-4'>
          {user && (
            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className='p-2.5 bg-white/20 backdrop-blur-md hover:bg-white/40 rounded-full transition-all group/heart'
            >
              <Heart
                className={`w-5 h-5 transition-all ${isInWishlist ? 'fill-red-500 text-red-500 scale-110' : 'text-white group-hover/heart:scale-110'
                  }`}
              />
            </button>
          )}
        </div>

        <div className='absolute bottom-4 left-5 right-5'>
          <div className='flex items-center gap-1.5 text-white/90 text-sm font-medium'>
            <MapPin className='w-3.5 h-3.5 text-blue-400' />
            <span className='line-clamp-1'>{location}</span>
          </div>
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <h3 className='font-bold text-lg text-gray-900 mb-4 group-hover:text-[#387CAE] transition-colors leading-tight line-clamp-2 min-h-[3rem]'>
          {name}
        </h3>

        <div className='mt-auto pt-5 flex items-center gap-3 border-t border-gray-50'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/${slug}`)
            }}
            className='flex-1 py-3 px-4 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 transition-colors text-[11px] font-bold flex items-center justify-center gap-2'
          >
            <Info className='w-3.5 h-3.5' />
            DETAILS
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/apply/${slug}`)
            }}
            className='flex-1 py-3 px-4 bg-[#387CAE] text-white rounded-2xl hover:bg-[#2d638c] transition-all text-[11px] font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2'
          >
            <GraduationCap className='w-3.5 h-3.5' />
            APPLY NOW
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default UniversityCard
