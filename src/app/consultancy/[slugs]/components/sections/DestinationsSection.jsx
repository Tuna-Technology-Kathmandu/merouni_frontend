'use client'

import React from 'react'
import { Globe } from 'lucide-react'

const parseJsonField = (field) => {
  if (!field) return null
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return field
    }
  }
  return field
}

const DestinationsSection = ({ consultancy }) => {
  const destinations = parseJsonField(consultancy?.destination) || []

  if (destinations.length === 0) {
    return null
  }

  return (
    <div className='max-w-4xl'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2'>
        <Globe className='w-5 h-5 text-[#30AD8F]' />
        Destinations
      </h2>
      <div className='flex flex-wrap gap-2'>
        {destinations.map((d, i) => (
          <span
            key={i}
            className='inline-flex px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700'
          >
            {typeof d === 'object' && d?.country ? d.country : String(d)}
          </span>
        ))}
      </div>
    </div>
  )
}

export default DestinationsSection
