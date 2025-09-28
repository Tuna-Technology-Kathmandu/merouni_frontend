'use client'
import React, { useRef, useState, useEffect } from 'react'
import { getEvents } from '@/app/[[...home]]/action'
import { useRouter } from 'next/navigation'

const DegreeScroller = () => {
  const router = useRouter()
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const fieldsScrollerRef = useRef(null)
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      console.log('running')
      const response = await getEvents()
      const events = response.items
      setAllEvents(events)
    } catch (error) {
      setError('Failed to load Events')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleCardClick = (slug) => {
    router.push(`/events/${slug}`)
  }
  return (
    <div className='md:p-12 bg-gradient-to-r from-blue-50 to-purple-50 py-12'>
      {/* Content Container */}
      <div className='flex flex-col lg:flex-row gap-8 md:gap-24 max-w-7xl mx-auto'>
        {/* Text Content */}
        <div className='flex flex-col gap-4 px-4 md:px-8 lg:w-1/3'>
          <h2 className='font-extrabold text-4xl md:text-5xl text-[#0A6FA7]'>
            Explore The Events
          </h2>
          <p className='font-bold text-sm md:text-base text-gray-600'>
            Discover upcoming events to find the best fit for your academic and
            career goals. Connect with experts and explore various disciplines.
          </p>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={fieldsScrollerRef}
          className='flex gap-6 overflow-x-auto scroll-smooth pb-4 px-4 md:px-8 lg:w-2/3'
        >
          {allEvents.map((field, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(field.slugs)}
              className='cursor-pointer flex-shrink-0 border-2 border-gray-200 h-[200px] md:h-[250px] p-6 rounded-2xl flex flex-col items-start justify-center gap-4 bg-white hover:shadow-lg transition-all transform hover:scale-105 relative overflow-hidden w-[300px]' // Fixed width here
              style={{
                backgroundImage: `url(${field?.image ? field.image.replace(/ /g, '%20') : '/images/events.webp'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Overlay */}
              <div className='absolute inset-0 bg-black/30 z-10'></div>

              {/* Content */}
              <div className='z-20 relative'>
                <div className='font-black text-3xl md:text-4xl text-white mb-1'>
                  {index + 1}
                </div>
                <div className='font-bold text-lg md:text-xl text-white mb-1'>
                  {field.title}
                </div>
                <div
                  className='text-sm md:text-[15px] text-white'
                  dangerouslySetInnerHTML={{
                    __html: field?.description.slice(0, 20) + '...' || ''
                  }}
                ></div>
              </div>

              {/* Arrow Icon */}
              {/* <div className='self-end z-20'>
                <FaArrowCircleRight className='w-8 h-8 md:w-10 md:h-10 text-white hover:text-purple-300 transition-colors' />
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DegreeScroller
