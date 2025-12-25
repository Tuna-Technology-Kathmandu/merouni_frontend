'use client'

import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const EventCalendar = () => {
  const [value, onChange] = useState(new Date())

  return (
    <div className='bg-white p-4 rounded-md'>
      <Calendar onChange={onChange} value={value} />
    </div>
  )
}

export default EventCalendar
