'use client'

import React, { useEffect, useState } from 'react'
import { fetchUniversities } from '../../actions'
import Link from 'next/link'

const RelatedUniversities = ({ university }) => {
  const [universities, setUniversities] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (university) {
      // Only fetch if degree prop exists
      getUniversities()
    }
  }, [university]) // Add degree as dependency

  const getUniversities = async () => {
    setIsLoading(true)
    try {
      const response = await fetchUniversities()
      const data = response.items

      const filteredUniversities = data.filter((d) => {
        // Convert both IDs to strings for comparison
        const currentId = String(d.id)
        const universityId = String(university?.id)
        return currentId !== universityId
      })

      setUniversities(filteredUniversities)
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  if (!universities.length){
    return null
  }

  return (
    <div className='flex flex-col w-full max-w-[1150px] mx-auto mb-20 px-4'>
      <h2 className='font-bold text-3xl leading-10 mb-4'>
        Other Universities you might like
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {universities.map((university, index) => (
          <Link href={`/universities/${university?.slugs}`} key={index}>
            <div className='cursor-pointer p-4 w-full'>
              <div className='flex justify-center border-2 rounded-3xl items-center overflow-hidden mb-2 p-4'>
                <img
                  src={
                    university?.assets?.featured_image ||
                    `https://placehold.co/600x400?text=${university.fullname}`
                  }
                  alt={university.fullname}
                  className='w-full h-48 object-cover rounded-2xl'
                />
              </div>
              <div className='px-4 pb-4 flex flex-col'>
                <h3 className='text-lg font-bold text-center'>
                  {university.fullname}
                </h3>
                <p className='text-xs text-gray-700 text-center'>
                  {university.city}, {university.state}, {university.country}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedUniversities
