import React from 'react'
import Image from 'next/image'

const Gallery = ({ college }) => {
  return (
    <div className='flex flex-col max-w-[1600px] mx-auto mb-20 px-24'>
      <h2 className='font-bold text-3xl leading-10 mb-4'>Gallery</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1'>
        {college?.collegeGallery.map((photo, index) => (
          <Image
            alt='college photo'
            src={
              photo.img_url ||
              'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
            }
            key={index}
            width={250}
            height={100}
          />
        ))}
      </div>
    </div>
  )
}

export default Gallery
