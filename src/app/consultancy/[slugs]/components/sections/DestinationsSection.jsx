import React from 'react'
import { Globe } from 'lucide-react'

const DestinationsSection = ({ consultancy }) => {
  // Parse JSON fields
  const parseJsonField = (field) => {
    if (!field) return null
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch (e) {
        return field
      }
    }
    return field
  }

  const destinations = parseJsonField(consultancy?.destination) || []

  if (destinations.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold flex items-center gap-2'>
        <Globe className='text-[#30AD8F]' size={20} /> Destinations
      </h2>
      {destinations.length > 0 ? (
        <ul className='list-disc list-inside text-gray-800 mt-9 max-[1120px]:mt-6 leading-7 text-xs md:text-sm lg:text-base space-y-2'>
          {destinations.map((d, i) => (
            <li key={i} className='font-medium'>
              {d.city}, {d.country}
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-gray-700 mt-9 max-[1120px]:mt-6 leading-7 text-xs md:text-sm lg:text-base'>
          No destinations available.
        </p>
      )}
    </div>
  )
}

export default DestinationsSection
