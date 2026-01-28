'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchDegrees } from '../../actions'

const RelatedCourses = ({ degree }) => {
  const [degrees, setDegrees] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (degree) {
      getDegrees()
    }
  }, [degree])

  const getDegrees = async () => {
    setIsLoading(true)
    try {
      const response = await fetchDegrees()
      const data = response.items

      const filteredDegrees = data.filter((d) => {
        const currentId = String(d.id)
        const degreeId = String(degree?.id)
        return currentId !== degreeId
      })

      setDegrees(filteredDegrees)
    } catch (error) {
      console.error('Error fetching degrees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className='text-center py-10'>Loading...</div>
  }

  if (!degrees || degrees.length === 0) {
    return null // Don't show the section if there are no related degrees
  }

  return (
    <div className='flex flex-col max-w-[1150px] mx-auto mb-20 px-4 my-16'>
      <h2 className='font-bold text-2xl md:text-3xl leading-10 mb-6 md:mb-9 text-center md:text-left'>
        Other Degrees You Might Like
      </h2>

      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {degrees.map((degree, index) => (
          <Link href={`/degree/${degree.slugs}`} key={degree.id || index}>
            <div className='cursor-pointer group bg-white border rounded-2xl shadow-sm hover:scale-105 transition p-6 flex flex-col justify-between h-full'>
              {/* Placeholder top section */}
              <div className='flex justify-center items-center mb-4'>
                <div className='w-20 h-20 rounded-full bg-[#0A6FA7] flex items-center justify-center text-white font-bold text-xl'>
                  {degree.title?.charAt(0) || 'D'}
                </div>
              </div>

              {/* Content */}
              <div className='flex flex-col flex-grow text-center'>
                <h3 className='text-lg font-semibold text-gray-800 group-hover:text-[#0A6FA7] transition'>
                  {degree.title}
                </h3>
                <p className='text-sm text-gray-500 mt-1'>
                  Duration: {degree.duration}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedCourses
