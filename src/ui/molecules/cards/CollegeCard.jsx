'use client'

import { useState, useEffect } from 'react'
import { Heart, Info, GraduationCap, MapPin } from 'lucide-react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useRouter } from '@bprogress/next/app'

/**
 * Reusable college card. Accepts either a `college` object or flat props.
 * When wishlistCollegeIds + onWishlistUpdate are provided (e.g. colleges page),
 * wishlist is controlled by parent. Otherwise the card manages wishlist internally.
 */
const CollegeCard = ({
  college: collegeProp,
  name: nameProp,
  location: locationProp,
  collegeId: collegeIdProp,
  slug: slugProp,
  collegeImage: collegeImageProp,
  instituteType: instituteTypeProp,
  universityName: universityNameProp,
  wishlistCollegeIds,
  onWishlistUpdate
}) => {
  const router = useRouter()
  const user = useSelector((state) => state.user.data)

  const name = collegeProp?.name ?? nameProp
  const slug = collegeProp?.slugs ?? collegeProp?.slug ?? slugProp
  const collegeId = collegeProp?.id ?? collegeIdProp
  const collegeImage =
    collegeProp?.featured_img ?? collegeProp?.featuredImg ?? collegeImageProp
  const instituteType =
    collegeProp?.institute_type ?? collegeProp?.instituteType ?? instituteTypeProp
  const universityName =
    collegeProp?.university?.fullname ??
    collegeProp?.university?.name ??
    universityNameProp
  const location =
    locationProp ??
    (collegeProp?.address
      ? [collegeProp.address.city, collegeProp.address.state, collegeProp.address.country]
        .filter(Boolean)
        .join(', ')
      : '')

  const isParentControlledWishlist =
    wishlistCollegeIds != null && typeof onWishlistUpdate === 'function'
  const isInWishlistFromParent = wishlistCollegeIds?.has(collegeId)

  const [isInWishlistLocal, setIsInWishlistLocal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isInWishlist = isParentControlledWishlist
    ? isInWishlistFromParent
    : isInWishlistLocal

  useEffect(() => {
    if (!isParentControlledWishlist && user?.id && collegeId) {
      checkWishlistStatus()
    }
  }, [user?.id, collegeId, isParentControlledWishlist])

  const checkWishlistStatus = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/wishlist?user_id=${user.id}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      )
      if (!response.ok) return
      const data = await response.json()
      const inList = (data.items || []).some(
        (item) => item.college?.id === collegeId
      )
      setIsInWishlistLocal(inList)
    } catch {
      setIsInWishlistLocal(false)
    }
  }

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
      const method = isInWishlist ? 'DELETE' : 'POST'
      const response = await authFetch(
        `${process.env.baseUrl}/wishlist`,
        {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ college_id: collegeId, user_id: user.id })
        }
      )
      if (!response.ok) throw new Error('Wishlist request failed')

      if (isParentControlledWishlist && onWishlistUpdate) {
        const newSet = new Set(wishlistCollegeIds)
        if (method === 'DELETE') newSet.delete(collegeId)
        else newSet.add(collegeId)
        onWishlistUpdate(newSet)
      } else {
        setIsInWishlistLocal(!isInWishlist)
      }

      toast.success(
        method === 'DELETE'
          ? 'Successfully removed from wishlist'
          : 'Successfully added to wishlist',
        { position: 'top-right', autoClose: 2000 }
      )
    } catch (err) {
      console.error('Wishlist update error:', err)
      toast.error('Failed to update wishlist. Please try again.', {
        position: 'top-right',
        autoClose: 3000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = () => {
    if (slug) {
      router.push(`/colleges/${slug}`)
    }
  }

  const handleDetails = (e) => {
    e.stopPropagation()
    if (slug) {
      router.push(`/colleges/${slug}`)
    }
  }

  const handleApply = (e) => {
    e.stopPropagation()
    if (slug) {
      router.push(`/colleges/apply/${slug}`)
    }
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className='group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col h-full'
    >
      <div className='relative aspect-[16/10] overflow-hidden bg-gray-100'>
        <img
          src={collegeImage || '/images/logo.png'}
          alt={name || 'College'}
          className='w-full h-full aspect-auto object-cover group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent' />

        <div className='absolute top-3 left-3 flex gap-2'>
          <span className='bg-white px-2.5 py-1 rounded-lg text-xs font-medium text-[#0A70A7] uppercase tracking-wider shadow-sm'>
            {instituteType || 'College'}
          </span>
        </div>

        <div className='absolute top-3 right-3'>
          {user && (
            <button
              type='button'
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className='p-2 bg-white/80 hover:bg-white rounded-full transition-all shadow-sm'
            >
              <Heart
                className={`w-4 h-4 transition-all ${isInWishlist
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600'
                  } ${isLoading ? 'opacity-50' : ''}`}
              />
            </button>
          )}
        </div>

        {location && (
          <div className='absolute bottom-3 left-4 right-4'>
            <div className='flex items-center gap-1 text-white/90 text-xs font-medium'>
              <MapPin className='w-3 h-3 text-blue-400 flex-shrink-0' />
              <span className='line-clamp-1'>{location}</span>
            </div>
          </div>
        )}
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <h3 className='font-semibold text-base text-gray-800 mb-1 group-hover:text-[#0A70A7] transition-colors leading-tight line-clamp-2 min-h-[2.5rem]'>
          {name}
        </h3>
        {universityName && (
          <p className='text-sm text-gray-600 line-clamp-1 mb-2'>
            {universityName}
          </p>
        )}

        <div className='mt-auto pt-5 flex items-center gap-3 border-t border-gray-100'>
          <button
            type='button'
            onClick={handleDetails}
            className='flex-1 py-2.5 px-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-xs font-medium flex items-center justify-center gap-1.5 uppercase tracking-wider'
          >
            <Info className='w-3.5 h-3.5' />
            Details
          </button>
          <button
            type='button'
            onClick={handleApply}
            className='flex-1 py-2.5 px-3 bg-[#0A70A7] text-white rounded-xl hover:bg-[#085a86] transition-all text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider'
          >
            <GraduationCap className='w-3.5 h-3.5' />
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollegeCard
