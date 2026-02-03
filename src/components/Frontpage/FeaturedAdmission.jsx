'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CollegeCard from '@/ui/molecules/cards/CollegeCard'

const FeaturedAdmission = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      // Use direct fetch instead of server action to avoid SSR issues and ensure correct API URL
      const apiUrl = `${process.env.baseUrl}/college?pinned=true&page=1&limit=6`

    

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      })

      if (response.ok) {
        const items = await response.json()
        setData(items.items || [])
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch featured colleges:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: apiUrl
        })
        toast.error('Failed to load featured colleges')
        setData([])
      }
    } catch (error) {
      console.error('Error fetching featured colleges:', {
        message: error.message,
        stack: error.stack,
        baseUrl: process.env.baseUrl,
        version: process.env.version
      })
      toast.error('Something went wrong')
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const SkeletonLoader = () => (
    <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse'>
      <div className='w-full h-52 bg-gray-200' />
      <div className='p-6'>
        <div className='h-5 bg-gray-200 rounded w-3/4 mb-4' />
        <div className='h-4 bg-gray-200 rounded w-1/2 mb-4' />
        <div className='flex gap-3 pt-5 border-t border-gray-100'>
          <div className='h-10 bg-gray-200 rounded-xl flex-1' />
          <div className='h-10 bg-gray-200 rounded-xl flex-1' />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <h1 className='text-xl font-semibold text-gray-800 mt-4 mb-5 md:mt-5 md:mb-6 pb-2 relative inline-block'>
        Top Picks
        <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0870A8] to-[#31AD8F]' />
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 auto-rows-fr'>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          : data.map((item) => (
              <CollegeCard key={item.id} college={item} />
            ))}
      </div>
    </>
  )
}

export default FeaturedAdmission
