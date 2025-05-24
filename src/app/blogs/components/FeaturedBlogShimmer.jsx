import React from 'react'

const FeaturedBlogsShimmer = () => {
  const shimmerBaseColor = '#e2ece9'
  const shimmerHighlightColor = '#f2f4f6'

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`relative rounded-lg overflow-hidden shadow-lg p-4 animate-pulse`}
          style={{ backgroundColor: shimmerBaseColor }}
        >
          <div // Shimmer Image
            className='mb-4 rounded'
            style={{
              backgroundColor: shimmerHighlightColor,
              width: '100%',
              height: '160px'
            }}
          ></div>
          <div // Shimmer Title
            className='mb-8 rounded'
            style={{
              backgroundColor: shimmerHighlightColor,
              width: '75%',
              height: '16px'
            }}
          ></div>
          <div // Shimmer Description
            className='mb-8 rounded'
            style={{
              backgroundColor: shimmerHighlightColor,
              width: '90%',
              height: '12px'
            }}
          ></div>
          <div // Shimmer Date
            className='rounded'
            style={{
              backgroundColor: shimmerHighlightColor,
              width: '50%',
              height: '12px'
            }}
          ></div>
        </div>
      ))}
    </div>
  )
}

export default FeaturedBlogsShimmer
