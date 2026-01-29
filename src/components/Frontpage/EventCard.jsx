import React from 'react'

const EventCard = ({ event }) => {
  let month = ''
  let day = ''
  try {
    const hostData = event.event_host ? (typeof event.event_host === 'string' ? JSON.parse(event.event_host) : event.event_host) : {}
    const { start_date } = hostData
    if (start_date) {
      const dateObj = new Date(start_date)
      month = dateObj.toLocaleString('en-US', { month: 'short' })
      day = dateObj.getDate()
    }
  } catch (error) {
    console.error('Error parsing event_host:', error)
  }

  const collegeName = event.college?.name || event.institution_name || ''

  return (
    <div className='h-full flex flex-col rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 bg-white transition-all duration-300 overflow-hidden'>
      {/* Top Section: Image */}
      <div className='relative h-[180px] overflow-hidden'>
        <img
          src={event?.image || '/images/events.webp'}
          alt={event.title}
          className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
        />
        {collegeName && (
          <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm'>
            <p className='text-[10px] font-bold text-[#0A6FA7] uppercase tracking-wider'>{collegeName}</p>
          </div>
        )}
      </div>

      <div className='flex items-start gap-4 p-5 flex-1'>
        {/* Date Section */}
        <div className='flex flex-col items-center justify-center min-w-[50px] h-[60px] bg-gray-50 rounded-xl border border-gray-100'>
          <p className='text-[#0A6FA7] text-xs font-bold uppercase'>{month}</p>
          <p className='text-xl font-black text-gray-800 leading-none'>{day}</p>
        </div>

        {/* Info Section */}
        <div className='flex-1 flex flex-col'>
          <h3 className='text-base font-bold text-gray-900 line-clamp-2 leading-tight mb-2 hover:text-[#0A6FA7] transition-colors'>
            {event.title}
          </h3>
          <div
            className='text-gray-500 text-xs line-clamp-3 leading-relaxed'
            dangerouslySetInnerHTML={{
              __html: event.description || ''
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default EventCard
