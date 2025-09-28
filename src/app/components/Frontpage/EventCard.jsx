import React from 'react'

const EventCard = ({ event }) => {
  console.log('events', event)
  let events = {
    description:
      'This is test. Explore diverse fields of study to find the best fit for your academic and career goals test test test test test test test test test test test'
  }
  // console.log("Month and day in event card:", event_host.start_date, day);
  let month = ''
  let day = ''
  try {
    const { start_date } = JSON.parse(event.event_host)
    const dateObj = new Date(start_date)
    month = dateObj.toLocaleString('en-US', { month: 'short' }) // e.g., "Feb"
    day = dateObj.getDate() // e.g., 15
  } catch (error) {
    console.error('Error parsing event_host:', error)
  }
  return (
    <div className='sm:h-[350px] h-[320px] rounded-2xl  shadow-md border border-gray-300  '>
      {/* <!-- Top Section: Image --> */}
      {/* <div className="flex justify-center mb-4"> */}
      <div className='h-[200px]'>
        <img
          src={event?.image || '/images/events.webp'}
          alt={`${event.title} logo`}
          className='w-full h-full object-cover rounded-t-2xl'
        />
      </div>

      <div className='flex items-start space-x-3 p-1'>
        {/* Month and Day */}
        <div className='flex flex-col items-center '>
          <p className='text-blue-600 text-xl font-bold p-2'>{month}</p>
          <p className='text-lg font-extrabold text-gray-700 p-2'>{day}</p>
        </div>

        {/* Title and Description */}
        <div className='flex-1'>
          <h3 className='text-lg font-bold text-gray-900 p-2'>
            {event.title.slice(0, 15) + '...'}
          </h3>
          <p
            className='text-gray-700 text-sm p-2 '
            dangerouslySetInnerHTML={{
              __html: events?.description.slice(0, 80) + '...' || ''
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default EventCard
