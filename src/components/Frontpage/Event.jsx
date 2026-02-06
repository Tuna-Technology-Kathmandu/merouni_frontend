'use client'
import { getUnexpiredEvents } from '@/app/events/action'
import { Skeleton } from '@/ui/shadcn/Skeleton'
import { formatDate } from '@/utils/date.util'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const Event = () => {
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const eventRef = useRef(null) // Reference for lazy loading

  const getEventDate = (event) => {
    // Try to get date from event_host
    if (event.event_host) {
      try {
        const eventHost =
          typeof event.event_host === 'string'
            ? JSON.parse(event.event_host)
            : event.event_host
        if (eventHost?.start_date) {
          return formatDate(eventHost.start_date)
        }
      } catch (error) {
        // If parsing fails, continue to other options
      }
    }
    // Fallback to createdAt if available
    if (event.createdAt) {
      return formatDate(event.createdAt)
    }
    return 'Date TBA'
  }

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getUnexpiredEvents()
      setEvents(data.items?.slice(0, 3) || [])
    } catch (error) {
      setError('Failed to fetch events')
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
      setHasFetched(true)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && events.length === 0) {
          fetchEvents() // Fetch only when visible
          observer.disconnect() // Stop observing after fetching
        }
      },
      { threshold: 0.1 }
    )

    if (eventRef.current) {
      observer.observe(eventRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (!loading && hasFetched && events.length === 0) {
    return null
  }

  return (
    <div
      ref={eventRef}
      className='bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 md:py-10'
    >
      <div className='container mx-auto px-4 sm:px-6 md:px-8'>
        <h1 className='text-xl font-semibold text-gray-800 mt-4 mb-5 md:mt-5 md:mb-6 text-left pb-2 relative inline-block'>
          Our Events
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0870A8] to-[#31AD8F]'></span>
        </h1>

        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col'
              >
                {/* Image Skeleton */}
                <div className='w-full h-48 md:h-56 bg-gray-100 relative overflow-hidden'>
                  <Skeleton className='w-full h-full' />
                </div>

                {/* Content Skeleton */}
                <div className='p-4 flex flex-col flex-1 gap-3'>
                  <div className='bg-gray-50 rounded-lg'>
                    <Skeleton className='h-6 w-3/4 mb-2' />
                    <Skeleton className='h-6 w-1/2' />
                  </div>
                  <Skeleton className='h-4 w-1/3 mt-auto' />
                </div>
              </div>
            ))}
          </div>
        )}

        {events.length > 0 && !loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 w-full'>
            {events.map((event, index) => (
              <Link
                href={`/events/${event.slugs}`}
                key={event.id || index}
                className='group'
              >
                <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col'>
                  {/* Event Image */}
                  <div className='relative w-full h-48 md:h-56 overflow-hidden bg-gray-100'>
                    <Image
                      src={event.image || '/images/logo.png'}
                      alt={event.title || 'Event Image'}
                      fill
                      className={
                        event.image
                          ? 'object-cover group-hover:scale-105 transition-transform duration-300'
                          : 'object-contain p-4 group-hover:scale-105 transition-transform duration-300'
                      }
                    />
                  </div>

                  {/* Event Content */}
                  <div className='p-4 flex flex-col flex-1'>
                    <h3 className='font-bold text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors'>
                      {event.title || 'Event Title'}
                    </h3>
                    <p className='text-sm text-gray-600 font-medium'>
                      {getEventDate(event)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {error && (
          <div className='flex flex-col items-center justify-center py-8 md:py-10'>
            <p className='text-red-500 text-lg md:text-xl font-medium'>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Event
