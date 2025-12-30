import { useEffect, useState } from 'react'

const Banner = () => {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    async function fetchData() {
      try {
        // Use direct fetch instead of server action to avoid SSR issues
        const response = await fetch(
          `${process.env.baseUrl}${process.env.version}/banner?page=1&limit=9999`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          }
        )

        if (response.ok) {
          const data = await response.json()
          setBanners(data.items || [])
        } else {
          console.error('Failed to fetch banners:', response.statusText)
          setBanners([])
        }
      } catch (err) {
        console.error('Error loading banners', err)
        setBanners([])
      }
    }

    fetchData()
  }, [])

  const displayBanners = [1, 2, 3].map((position) =>
    banners.find((banner) => banner.display_position === position)
  )
  return (
    // <div className='min-w-[80px] flex flex-col gap-6  max-[868px]:flex-row max-[868px]:w-full max-[886px]:px-12'>
    //   <img
    //     src='/images/meroUniLarge.gif'
    //     alt='Rotated Banner'
    //     className='absolute top-[170px] w-[400px] h-[80px] -right-36 object-fill rotate-90 z-10 max-[868px]:static max-[868px]:rotate-0 max-[868px]:z-0
    //     max-[886px]:w-1/2 max-[886px]:h-[60px] max-[624px]:h-[40px]
    //     '
    //   />
    //   <img
    //     src='/images/meroUniLarge.gif'
    //     alt='Rotated Banner'
    //     className='absolute top-[600px] w-[400px] h-[80px] -right-36 object-fill rotate-90 z-10 max-[868px]:static max-[868px]:rotate-0 max-[868px]:z-0
    //      max-[886px]:w-1/2 max-[886px]:h-[60px] max-[624px]:h-[40px]
    //     '
    //   />
    // </div>
    <div className='flex flex-col sm:flex-row gap-4 md:gap-3 lg:gap-3 justify-center sm:flex-nowrap xl:flex-nowrap'>
      {displayBanners.map((banner, index) => (
        <div
          key={index}
          className={`w-full sm:w-[350px] lg:w-[340px] xl:w-full rounded-lg overflow-hidden shadow-md ${!banner ? 'bg-gray-100' : ''}`}
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
  )
}
export default Banner
