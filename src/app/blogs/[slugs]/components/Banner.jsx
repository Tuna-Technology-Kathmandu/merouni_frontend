import { useEffect, useState } from 'react'

const Banner = () => {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    if (typeof window === 'undefined') return

    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.baseUrl}/banner?page=1&limit=100`,
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
                src={banner.banner_image}
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
export default Banner;