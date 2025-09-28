'use client'

const BannerLayout = ({ banners = [], loading = false }) => {
  if (loading) {
    return (
      <div className='flex gap-4 md:gap-3 lg:gap-3 justify-center flex-wrap sm:flex-nowrap xl:flex-nowrap'>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className='w-full sm:w-[350px] lg:w-[340px] xl:w-full h-[48px] md:h-[58px] lg:h-[70px] rounded-lg animate-pulse bg-slate-300'
          ></div>
        ))}
      </div>
    )
  }

  const displayBanners = [1, 2, 3].map((position) =>
    banners.find((banner) => banner.display_position === position)
  )

  return (
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
  )
}

export default BannerLayout
