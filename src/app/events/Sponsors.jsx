import { DotenvConfig } from '@/config/env.config'
import { useState, useEffect } from 'react'
import Marquee from 'react-fast-marquee'

const Sponsors = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    async function fetchData() {
      try {
        // Use direct fetch instead of server action to avoid SSR issues
        const response = await fetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/banner?page=1&limit=100`,
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
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const displayBanners = [1, 2, 3, 4].map((position) =>
    banners.find((banner) => banner.display_position === position)
  )

  return (
    <div className='bg-[#E8E8E8] py-10  lg:py-14 w-full'>
      <Marquee speed={50} gradient={false} pauseOnHover={true}>
        <div className='flex items-center gap-8 px-4'>
          {' '}
          {/* Added gap and padding */}
          {displayBanners.map((banner, index) =>
            banner ? (
              <div key={banner.id} className='flex-shrink-0'>
                {' '}
                {/* Prevent shrinking */}
                <a
                  href={banner.website_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block'
                >
                  <img
                    src={
                      banner.banner_galleries?.[0]?.url ||
                      '/images/meroUniLarge.gif'
                    }
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/images/meroUniLarge.gif'
                    }}
                    alt={`Banner position ${banner.display_position}`}
                    className='h-16 md:h-20 lg:h-36 rounded-lg shadow-lg'
                  />
                </a>
              </div>
            ) : (
              <div
                key={`empty-${index}`}
                className='h-36 w-[300px] flex-shrink-0 rounded-lg shadow-lg bg-gray-100 flex items-center justify-center text-gray-500'
              >
                Contact for Ads
              </div>
            )
          )}
        </div>
      </Marquee>
    </div>
  )
}

export default Sponsors
