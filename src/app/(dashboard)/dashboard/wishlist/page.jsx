'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'

const WishlistPage = () => {
  const { setHeading } = usePageHeading()
  const user = useSelector((state) => state.user?.data)
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setHeading('My Wishlist')
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    let isMounted = true

    const loadWishlist = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)
        const res = await authFetch(
          `${process.env.baseUrl}/wishlist?user_id=${user.id}`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load wishlist')
        }

        const data = await res.json()
        if (!isMounted) return
        setWishlist(Array.isArray(data.items) ? data.items : [])
      } catch (err) {
        console.error('Error loading wishlist:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load wishlist')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadWishlist()

    return () => {
      isMounted = false
    }
  }, [user?.id])

  return (
    <div className='p-4'>
      <div className='bg-white rounded-xl shadow p-4'>
        <h2 className='text-lg font-semibold mb-2'>Your Wishlist</h2>
        <p className='text-sm text-gray-600 mb-3'>
          Colleges you&apos;ve saved for later.
        </p>

        {loading && (
          <div className='flex justify-center items-center h-24'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          </div>
        )}

        {!loading && error && (
          <p className='text-sm text-red-600'>Error: {error}</p>
        )}

        {!loading && !error && (
          <>
            {wishlist.length === 0 ? (
              <p className='text-sm text-gray-500'>
                Your wishlist is empty.
              </p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {wishlist.map((item) => {
                  if (item.college) {
                    return (
                      <Link
                        key={item.id}
                        href={`/colleges/${item.college?.slugs || '#'}`}
                        className='block border rounded-lg p-4 hover:shadow-md transition-shadow hover:bg-gray-50'
                      >
                        <div className='flex items-center gap-4'>
                          {item.college?.college_logo ? (
                            <img
                              src={item.college.college_logo}
                              alt={item.college?.name || 'College Logo'}
                              className='w-16 h-16 object-contain rounded'
                            />
                          ) : (
                            <div className='w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0'>
                              <span className='text-gray-400 text-xs'>
                                No Logo
                              </span>
                            </div>
                          )}
                          <div>
                            <p className='font-semibold text-gray-900 line-clamp-2'>
                              {item.college?.name || 'Unnamed College'}
                            </p>
                            {item.college?.address && (
                              <p className='text-sm text-gray-500 mt-1 line-clamp-1'>
                                {[
                                  item.college.address.city,
                                  item.college.address.state
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  } else if (item.consultancy) {
                    // Extract address for consultancy similar to ConsultancyCard logic if needed
                    // But backend returns object or string? Assuming object based on model include
                    // Model include attributes: ["id", "name", "slug", "description", "logo", "address"]
                    
                    let addressText = ''
                    try {
                        const addr = typeof item.consultancy.address === 'string' 
                            ? JSON.parse(item.consultancy.address) 
                            : item.consultancy.address || {}
                        addressText = [addr.street, addr.city].filter(Boolean).join(', ')
                    } catch (e) {}

                    return (
                      <Link
                        key={item.id}
                        href={`/consultancy/${item.consultancy?.slugs || '#'}`}
                        className='block border rounded-lg p-4 hover:shadow-md transition-shadow hover:bg-gray-50'
                      >
                        <div className='flex items-center gap-4'>
                          {item.consultancy?.logo ? (
                            <img
                              src={item.consultancy.logo}
                              alt={item.consultancy?.title || 'Consultancy Logo'}
                              className='w-16 h-16 object-contain rounded'
                            />
                          ) : (
                            <div className='w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0'>
                              <span className='text-gray-400 text-xs'>
                                No Logo
                              </span>
                            </div>
                          )}
                          <div>
                            <p className='font-semibold text-gray-900 line-clamp-2'>
                              {item.consultancy?.title || 'Unnamed Consultancy'}
                            </p>
                            <p className='text-xs text-blue-600 font-medium mb-0.5'>Consultancy</p>
                            {addressText && (
                              <p className='text-sm text-gray-500 line-clamp-1'>
                                {addressText}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default WishlistPage






