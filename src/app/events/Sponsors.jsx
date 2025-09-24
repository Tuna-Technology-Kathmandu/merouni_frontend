import { useState, useEffect } from 'react'
import Marquee from 'react-fast-marquee'
import { getBanner } from '../[[...home]]/action'

const Sponsors = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBanner(1, 99999999)
        setBanners(data.items)
      } catch (err) {
        console.error('Error loading banners', err)
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
