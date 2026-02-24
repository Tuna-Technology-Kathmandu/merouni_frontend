import { Skeleton } from '../../ui/shadcn/Skeleton'
import Link from 'next/link'

const isExpired = (banner) => {
  if (!banner?.date_of_expiry) return false
  return new Date(banner.date_of_expiry) < new Date()
}

const AdLayout = ({ banners = [], size = '', number = 1, loading = false }) => {
  const displayBanners = [8, 9, 10].map((position) => {
    const banner = banners.find((b) => b.display_position === position)
    return (!banner || isExpired(banner)) ? null : banner
  })

  if (loading) {
    return (
      <div className='mt-2 p-4'>
        <div className='flex gap-4 justify-center'>
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              className='w-full sm:w-[350px] lg:w-[340px] xl:w-full h-[44px] md:h-[58px] lg:h-[70px]'
            />
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
                    banner.banner_image || '/images/meroUniLarge.gif'
                  }
                  onError={(e) => {
                    e.target.src = '/images/meroUniLarge.gif'
                  }}
                  alt={`Banner ${banner.title}`}
                  className='w-full h-[44px] md:h-[58px] lg:h-[70px] object-cover'
                />
              </a>
            ) : (
              <div className='group relative w-full h-[44px] md:h-[58px] lg:h-[70px] flex items-center justify-center text-gray-400 text-xs font-medium bg-gray-50 rounded-lg overflow-hidden cursor-pointer'>
                <span className='group-hover:opacity-0 transition-opacity duration-200'>Ads place available</span>
                <Link
                  href='/contact'
                  className='absolute inset-0 flex items-center justify-center bg-[#387cae]/90 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdLayout
