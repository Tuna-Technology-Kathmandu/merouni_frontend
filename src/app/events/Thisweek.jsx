'use client'
import React, { useRef } from 'react'
import EventCard from '../components/Frontpage/EventCard'
import Link from 'next/link'

const ThisWeek = ({ thisWeekEvents, title, subtitle }) => {
  const fieldsScrollerRef = useRef(null)

  return (
    <div className='md:p-12 bg-gradient-to-r from-blue-50 to-purple-50 py-12'>
      {/* Content Container */}
      <div className='flex flex-col lg:flex-row gap-8 md:gap-24 max-w-7xl mx-auto'>
        {/* Text Content */}
        <div className='flex flex-col gap-4 px-4 md:px-8 lg:w-1/3'>
          <h2 className='font-extrabold text-4xl md:text-5xl text-[#0A6FA7]'>
            {title}
          </h2>
          <p className='font-bold text-sm md:text-base text-gray-600'>
            {subtitle}
          </p>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={fieldsScrollerRef}
          className='flex gap-6 overflow-x-auto scroll-smooth pb-4 px-4 md:px-8 lg:w-2/3'
        >
          {thisWeekEvents?.length > 0 ? (
            thisWeekEvents.map((event, index) => (
              <Link href={`/events/${event.slugs}`} key={index}>
                <div
                  key={index}
                  className='transition-all duration-300 ease-in-out'
                  style={{ minWidth: 'max-content' }}
                >
                  <EventCard event={event} />
                </div>
              </Link>
            ))
          ) : (
            <p className='mx-auto'>No events available.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ThisWeek
