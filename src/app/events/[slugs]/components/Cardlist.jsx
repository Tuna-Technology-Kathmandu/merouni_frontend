import React from 'react'
import EventCard from '@/components/Frontpage/EventCard'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'

const Cardlist = ({ events }) => {
  if (!events || events.length === 0) return null

  return (
    <div className='bg-gray-50 border-t border-gray-100 mt-0 py-20'>
      <div className='max-w-[1200px] mx-auto px-6'>
        <div className='flex items-center justify-between mb-12'>
          <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-3'>
            <span className='w-1.5 h-8 bg-[#0A6FA7] rounded-full'></span>
            Related Events
          </h2>
          <Link
            href='/events'
            className='group flex items-center gap-2 text-sm font-bold text-[#0A6FA7] hover:text-[#085a87] transition-colors'
          >
            <span>View All Events</span>
            <FaArrowRight className='w-3 h-3 transition-transform group-hover:translate-x-1' />
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {events.slice(0, 4).map((event) => (
            <Link href={`/events/${event.slugs}`} key={event.id} className='group h-full block'>
              <div className='h-full transition-transform duration-300 group-hover:-translate-y-1'>
                <EventCard event={event} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cardlist
