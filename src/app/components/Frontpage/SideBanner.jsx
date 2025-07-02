'use client'

const SideBanner = ({ banners = [], loading = false }) => {
  console.log('side', banners)

  // Get banners for positions 4,5,6,7
  const displayBanners = [4, 5, 6, 7].map((position) =>
    banners.find((banner) => banner.display_position === position)
  )

  console.log('4banners', displayBanners)

  if (loading) {
    return (
      <div className='flex flex-col gap-4'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className='w-full h-36 rounded-lg shadow-lg animate-pulse bg-slate-300'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      {displayBanners.map((banner, index) =>
        banner ? (
          <a href={banner.website_url} target='_blank' rel='' key={banner.id}>
            <img
              src={
                banner.banner_galleries?.[0]?.url || '/images/meroUniSmall.gif'
              }
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/images/meroUniSmall.gif'
              }}
              alt={`Banner position ${banner.display_position}`}
              className='w-full h-36 rounded-lg shadow-lg object-cover'
            />
          </a>
        ) : (
          <div
            key={`empty-${index}`}
            className='w-full h-36 rounded-lg shadow-lg bg-gray-100 flex items-center justify-center text-gray-500'
          >
            Contact for Ads
          </div>
        )
      )}
    </div>
  )
}

export default SideBanner
