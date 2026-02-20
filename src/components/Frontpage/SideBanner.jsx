'use client'
import React from 'react'

const SideBanner = ({ banners = [], loading = false }) => {
  // Get banners for positions 4,5,6,7
  const displayBanners = [4, 5, 6, 7].map((position) =>
    banners.find((banner) => banner.display_position === position)
  )

  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className='w-full h-32 md:h-36 rounded-lg shadow-lg animate-pulse bg-slate-200'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4'>
      {displayBanners.map((banner, index) =>
        banner ? (
          <a
            href={banner.website_url}
            target='_blank'
            rel='noopener noreferrer'
            key={banner.id}
            className='group relative block overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-[1.02]'
          >
            <img
              src={
                banner.banner_image || '/images/meroUniSmall.gif'
              }
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/images/meroUniSmall.gif'
              }}
              alt={`Banner position ${banner.display_position}`}
              className='w-full h-32 md:h-36 object-cover'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300' />
          </a>
        ) : (
          <div
            key={`empty-${index}`}
            className='w-full h-32 md:h-36 rounded-lg shadow-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm md:text-base p-2 text-center'
          >
            <span className='bg-white/80 px-3 py-1 rounded-md'>
              Ad Space Available
            </span>
          </div>
        )
      )}
    </div>
  )
}

export default SideBanner
