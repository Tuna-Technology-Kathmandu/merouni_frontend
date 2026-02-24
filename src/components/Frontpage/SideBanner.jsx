'use client'
import Link from 'next/link'

const isExpired = (banner) => {
  if (!banner?.date_of_expiry) return false
  return new Date(banner.date_of_expiry) < new Date()
}

const SideBanner = ({ banners = [], loading = false }) => {
  // Get banners for positions 4,5,6,7
  const displayBanners = [4, 5, 6, 7].map((position) => {
    const banner = banners.find((b) => b.display_position === position)
    return (!banner || isExpired(banner)) ? null : banner
  })

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
            className='group relative w-full h-32 md:h-36 rounded-lg shadow-lg bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer'
          >
            <span className='text-gray-500 text-sm bg-white/80 px-3 py-1 rounded-md group-hover:opacity-0 transition-opacity duration-200'>
              Ads place available
            </span>
            <Link
              href='/contact'
              className='absolute inset-0 flex items-center justify-center bg-[#387cae]/90 text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            >
              Contact Us
            </Link>
          </div>
        )
      )}
    </div>
  )
}

export default SideBanner
