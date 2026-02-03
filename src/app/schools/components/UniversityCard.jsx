import { useState, useEffect } from 'react'
import { Share, Heart } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'

const UniversityCard = ({
  name,
  description,
  collegeId,
  slug,
  isWishlistPage = false
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
        `${process.env.baseUrl}/wishlist?user_id=${user.id}`,
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
        `${process.env.baseUrl}/wishlist`,
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
    <div
      onClick={() => {
        router.push(`/schools/${slug}`)
      }}
      className='bg-white cursor-pointer rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300'
    >
      <div className='flex justify-between items-start mb-4'>
        <img
          src='/images/pu.png'
          alt={`${name} logo`}
          className='w-12 h-12 object-contain'
        />
        <div className='flex gap-2'>
          {user && (
            <button
              className='p-2 hover:bg-gray-100 rounded-full'
              onClick={handleWishlistToggle}
              disabled={isLoading}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${isInWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  } ${isLoading ? 'opacity-50' : ''}`}
              />
            </button>
          )}
        </div>
      </div>

      <h3 className='font-semibold text-lg mb-1'>{name}</h3>
      <p className='text-black text-sm my-4'>
        {description.slice(0, 60) + '...'}
      </p>
      <div className='flex gap-3'>
        <button className='flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium'>
          Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/schools/apply/${slug}`)
          }}
          className='flex-1 py-2 px-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 text-sm font-medium'
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}

export default UniversityCard
