'use client'

import { getBanner } from '../../[[...home]]/action'
import React, { useState } from 'react'
import { useEffect } from 'react'

const SideBanner = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBanner(1, 4) // Set page & limit here
        setBanners(data.items) // Adjust based on API structure
        console.log('abnenrData', data)
      } catch (err) {
        console.error('Error loading banners', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='flex flex-col gap-4'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className='w-full h-36 rounded-lg shadow-lg animate-pulse bg-slate-300'
          />
        ))}
      </div>
    )
  }
  return (
    <div className='flex flex-col gap-4'>
      {/* Added gap between images */}

      {banners.map((item) => (
        <a
          href={item.website_url}
          target='_blank'
          rel='noopener noreferrer'
          key={item.id}
        >
          <img
            src={item.banner_galleries?.[0]?.url || '/images/meroUniSmall.gif'}
            alt='Admission Image'
            className='w-full h-36 rounded-lg shadow-lg'
          />
        </a>
      ))}
    </div>
  )
}

export default SideBanner

{
  /* <img
src="https://placehold.co/600x400"
alt="Admission Image"
className="w-full h-auto rounded-lg shadow-lg"
/> */
}
