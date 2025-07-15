import Link from 'next/link'
import React from 'react'

const defaultImages = [
  '/images/UTCBanners/UTCLarge.gif',
  '/images/UTCBanners/UTCLarge2.gif',
  '/images/UTCBanners/UTCLarge3.gif'
]
const AdLayout = ({ banners = [], size = '', number = 1, loading = false }) => {
  const fallBackBanners = [
    {
      imageUrl: '/images/UTCBanners/UTCLarge.gif',
      title: 'Mero Uni 1',
      websiteUrl: 'https://merouni.com/'
    },

    {
      imageUrl: '/images/UTCBanners/UTCLarge2.gif',
      title: 'Mero Uni 2',
      websiteUrl: 'https://merouni.com/'
    },
    {
      imageUrl: '/images/UTCBanners/UTCLarge3.gif',
      title: 'Mero Uni 3',
      websiteUrl: 'https://merouni.com/'
    }
  ]

  const displayBanners = [8, 9, 10].map((position) =>
    banners.find((banner) => banner.display_position === position)
  )

  if (loading) {
    return (
      <div className='mt-2 p-4'>
        <div className='grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:px-20 w-full'>
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className={`rounded-lg animate-pulse bg-slate-300 h-[48px] md:h-[58px] lg:h-[70px] 
                  }`}
            ></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='mt-2 p-4'>
      <div className='flex flex-col sm:flex-row gap-4 md:gap-3 lg:gap-3 justify-center sm:flex-nowrap xl:flex-nowrap'>
        {displayBanners.map((banner, index) => (
          <div
            key={index}
            className={`w-full sm:w-[350px] lg:w-[340px] xl:w-full rounded-lg overflow-hidden ${!banner ? 'bg-gray-100' : ''}`}
          >
            {banner ? (
              <a
                href={banner.website_url}
                target='_blank'
                rel=''
                className='block h-full'
              >
                <img
                  src={
                    banner.banner_galleries.find((g) => g.size === 'small')
                      ?.url || '/images/meroUniLarge.gif'
                  }
                  onError={(e) => {
                    e.target.src = '/images/meroUniLarge.gif'
                  }}
                  alt={`Banner ${banner.title}`}
                  className='w-full h-[44px] md:h-[58px] lg:h-[70px] object-cover'
                />
              </a>
            ) : (
              <div className='w-full h-[44px] md:h-[58px] lg:h-[70px] flex items-center justify-center text-gray-500'>
                Contact for Ads
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdLayout
