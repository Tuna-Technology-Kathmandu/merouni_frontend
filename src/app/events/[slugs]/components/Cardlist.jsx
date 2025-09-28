import React from 'react'
import EventCard from './Cards' // Import the EventCard component
import Link from 'next/link'
const Cardlist = ({ events }) => {
  console.log(events)

  return (
    <div className=' px-16 max-sm:px-9 max-w-[1600px] mx-auto bg-[#E7E7E7] p-8 mt-20 rounded-md '>
      <div className='max-w-full md:max-w-[1600px] md:mx-auto'>
        <h1 className='text-2xl text-center font-bold mb-7'>
          Other Events You make Like
        </h1>
        <div className='w-full grid grid-cols-4 gap-7 max-[1265px]:grid-cols-3 max-[795px]:grid-cols-2 max-[513px]:grid-cols-1 '>
          {events.map((event) => {
            const eventHost = JSON.parse(event.event_host)
            const startDate = new Date(eventHost.start_date)

            return (
              <Link href={`/events/${event.slugs}`} key={event.id}>
                <EventCard
                  key={event.id}
                  photo={event.image} // Use the event image or fallback
                  month={startDate.toLocaleString('default', { month: 'long' })} // Get the month in text
                  day={startDate.getDate()} // Get the day of the month
                  title={event.title}
                  description={event.description}
                />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Cardlist
