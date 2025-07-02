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
      <div className='grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 md:px-20 w-full'>
        {displayBanners.map((banner, index) => (
          <div
            className={`h-[48px] md:h-[58px] ${!banner ? 'bg-gray-100' : ''} lg:h-[70px] ${
              index === 2 ? ' flex justify-center w-full col-span-2' : ''
            }`}
          >
            {banner ? (
              <a
                href={banner.website_url}
                target='_blank'
                rel=''
                className='w-full h-full'
              >
                <img
                  src={
                    banner.banner_galleries.find((g) => g.size === 'small')
                      ?.url || '/images/UTCBanners/UTCLarge.gif'
                  }
                  onError={(e) => {
                    e.target.src = '/images/UTCBanners/UTCLarge.gif'
                  }}
                  alt={`Banner ${banner.title}`}
                  className={`w-full h-full object-fill rounded-lg ${
                    index === 2 ? 'sm:w-[50%] mx-auto' : ''
                  }`}
                />
              </a>
            ) : (
              <div
                className={`h-[48px]  md:h-[58px] flex justify-center items-center lg:h-[70px] ${
                  index === 2 ? 'col-span-2 w-[calc(200%+12px)] ' : ''
                }`}
              >
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
