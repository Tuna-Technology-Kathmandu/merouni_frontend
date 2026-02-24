'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'

import { Trash2 } from 'lucide-react'

import { Skeleton } from '@/ui/shadcn/Skeleton'

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

  const handleRemove = async (e, item) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm('Are you sure you want to remove this item?')) return

    try {
      const body = { user_id: user.id }
      if (item.college) {
        body.college_id = item.college.id
      } else if (item.consultancy) {
        body.consultancy_id = item.consultancy.id
      }

      const res = await authFetch(`${process.env.baseUrl}/wishlist`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        setWishlist((prev) => prev.filter((i) => i.id !== item.id))
      } else {
        const errorData = await res.json()
        alert(errorData.message || 'Failed to remove item')
      }
    } catch (err) {
      console.error('Error removing item:', err)
      alert('Failed to remove item')
    }
  }

  return (
    <div className='p-4'>
      <div className='bg-white rounded-xl shadow p-4'>
        <h2 className='text-lg font-semibold mb-2'>Your Wishlist</h2>
        <p className='text-sm text-gray-600 mb-3'>
          Colleges you&apos;ve saved for later.
        </p>

        {loading && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='border rounded-lg p-4'>
                <div className='flex items-center gap-4'>
                  <Skeleton className='w-16 h-16 rounded flex-shrink-0' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-3 w-1/2' />
                  </div>
                </div>
              </div>
            ))}
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
                      <div
                        key={item.id}
                        className='relative border rounded-lg hover:shadow-md transition-shadow hover:bg-gray-50 group'
                      >
                        <Link
                          href={`/colleges/${item.college?.slugs || '#'}`}
                          className='block p-4'
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
                              <p className='font-semibold text-gray-900 line-clamp-2 pr-6'>
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
                        <button
                          onClick={(e) => handleRemove(e, item)}
                          className='absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity'
                          title='Remove from wishlist'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )
                  } else if (item.consultancy) {
                    let addressText = ''
                    try {
                      const addr =
                        typeof item.consultancy.address === 'string'
                          ? JSON.parse(item.consultancy.address)
                          : item.consultancy.address || {}
                      addressText = [addr.street, addr.city]
                        .filter(Boolean)
                        .join(', ')
                    } catch (e) { }

                    return (
                      <div
                        key={item.id}
                        className='relative border rounded-lg hover:shadow-md transition-shadow hover:bg-gray-50 group'
                      >
                        <Link
                          href={`/consultancy/${item.consultancy?.slugs || '#'
                            }`}
                          className='block p-4'
                        >
                          <div className='flex items-center gap-4'>
                            {item.consultancy?.logo ? (
                              <img
                                src={item.consultancy.logo}
                                alt={
                                  item.consultancy?.title || 'Consultancy Logo'
                                }
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
                              <p className='font-semibold text-gray-900 line-clamp-2 pr-6'>
                                {item.consultancy?.title ||
                                  'Unnamed Consultancy'}
                              </p>
                              <p className='text-xs text-blue-600 font-medium mb-0.5'>
                                Consultancy
                              </p>
                              {addressText && (
                                <p className='text-sm text-gray-500 line-clamp-1'>
                                  {addressText}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={(e) => handleRemove(e, item)}
                          className='absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity'
                          title='Remove from wishlist'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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






