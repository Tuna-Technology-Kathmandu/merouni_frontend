'use client'

import React, { useEffect, useState } from 'react'
import { getSchools } from '../../actions'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

const RelatedSchool = ({ school }) => {
  const [schools, setSchools] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getRelatedSchool()
  }, [])

  const getRelatedSchool = async () => {
    setIsLoading(true)
    try {
      const data = await getSchools()
      const filteredSchools = data.schools.filter(
        (c) => c.schoolId !== college._id
      )
      setSchools(filteredSchools.slice(0, 3))
    } catch (error) {
      console.error('Error fetching colleges:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return null
  if (schools.length === 0) return null

  return (
    <section className='px-4 sm:px-8 md:px-12 lg:px-24 mb-20'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-1 h-6 bg-[#30AD8F] rounded-full'></div>
        <h2 className='font-bold text-xl md:text-2xl text-gray-900'>
          Schools you may like
        </h2>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {schools.map((item, index) => (
          <Link href={`/schools/${item.slug}`} key={index} className='group'>
            <div className='bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-[#30AD8F]/20 flex flex-col h-full'>
              <div className='aspect-[4/3] relative overflow-hidden bg-gray-50 flex items-center justify-center p-8'>
                <img
                  src={
                    item?.logo ||
                    `https://avatar.iran.liara.run/username?username=${item?.name}`
                  }
                  alt={item.name}
                  className='max-w-[70%] max-h-[70%] object-contain transition-transform duration-500 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
              </div>

              <div className='p-6 flex flex-col flex-1 gap-2'>
                <h3 className='font-bold text-gray-900 line-clamp-1 group-hover:text-[#0A6FA7] transition-colors'>
                  {item.name}
                </h3>
                {item.location && (
                  <div className='flex items-center gap-1.5 text-gray-500'>
                    <MapPin className='w-3.5 h-3.5 text-[#30AD8F]' />
                    <p className='text-xs font-bold truncate'>
                      {item.location}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedSchool
