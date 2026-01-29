import React from 'react'
import EventCard from '@/components/Frontpage/EventCard'
import Link from 'next/link'

const Cardlist = ({ events }) => {
  if (!events || events.length === 0) return null

  return (
    <div className='bg-gray-50 border-t border-gray-100 mt-20'>
      <div className='max-w-[1200px] mx-auto px-6 py-20'>
        <div className='flex items-center justify-between mb-10'>
          <h2 className='text-2xl font-black text-gray-900'>Related Events</h2>
          <Link
            href='/events'
            className='text-sm font-bold text-[#0A6FA7] hover:underline'
          >
            View All Events
          </Link>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {events.slice(0, 4).map((event) => (
            <Link href={`/events/${event.slugs}`} key={event.id} className='h-full'>
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cardlist
