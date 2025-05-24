import React from 'react'

const Shimmer = ({ width = '100%', height = '20px', borderRadius = '4px' }) => {
  return (
    <div
      style={{ width, height, borderRadius }}
      className='bg-featured-shimmer bg-[length:200%_100%] animate-featured-shimmer'
    />
  )
}

export default Shimmer
