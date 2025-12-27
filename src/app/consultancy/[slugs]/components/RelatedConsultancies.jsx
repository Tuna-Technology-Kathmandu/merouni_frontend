'use client'

import React, { useEffect, useState } from 'react'
import { getConsultancies } from '../../actions'
import Link from 'next/link'
import Image from 'next/image'

const RelatedConsultancies = ({ consultancy }) => {
  const [consultancies, setConsultancies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getRelatedConsultancies()
  }, [])

  const getRelatedConsultancies = async () => {
    setIsLoading(true)
    try {
      const data = await getConsultancies(1, '')
      const filteredConsultancies =
        data.items?.filter((c) => c.id !== consultancy.id) || []
      setConsultancies(filteredConsultancies.slice(0, 6)) // Show max 6
    } catch (error) {
      console.error('Error fetching consultancies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (consultancies.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col max-w-[1600px] mx-auto mb-20 px-24 max-md:px-6'>
      <h2 className='font-bold text-xl md:text-3xl leading-10 m-4 max-sm:text-center max-sm:leading-7'>
        Consultancies you may like
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-sm:gap-1'>
        {consultancies.map((consultancyItem, index) => {
          const logo = consultancyItem?.logo || ''
          const address = consultancyItem?.address
            ? typeof consultancyItem.address === 'string'
              ? JSON.parse(consultancyItem.address)
              : consultancyItem.address
            : {}
          const addressString = [address?.street, address?.city, address?.state]
            .filter(Boolean)
            .join(', ')

          return (
            <Link href={`/consultancy/${consultancyItem.slugs}`} key={index}>
              <div className='cursor-pointer p-4 max-w-sm mx-auto sm:mx-0 max-sm:p-2'>
                <div className='flex justify-center border-2 rounded-3xl items-center overflow-hidden mb-2 p-4'>
                  {logo ? (
                    <Image
                      src={logo}
                      alt={consultancyItem.title}
                      width={192}
                      height={192}
                      className='w-48 h-48 max-[840px]:h-40 max-sm:h-36 object-contain'
                    />
                  ) : (
                    <div className='w-48 h-48 max-[840px]:h-40 max-sm:h-36 bg-gray-200 flex items-center justify-center'>
                      <span className='text-gray-400 text-sm'>No Logo</span>
                    </div>
                  )}
                </div>
                <div className='px-4 pb-4 flex flex-col'>
                  <h3 className='text-lg font-bold text-center'>
                    {consultancyItem.title}
                  </h3>
                  {addressString && (
                    <p className='text-xs text-gray-700 text-center'>
                      {addressString}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default RelatedConsultancies
