import React from 'react'
import Image from 'next/image'

const GallerySection = () => {
  const college = {
    collegeGallery: [
      {
        img_url:
          'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
      },
      {
        img_url:
          'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
      },
      {
        img_url:
          'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
      },
      {
        img_url:
          'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
      },
      {
        img_url:
          'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
      },
      {
        img_url:
          'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
      }
    ]
  }
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Gallery</h2>

      <div className='grid grid-cols-3 max-[550px]:grid-cols-2  gap-4 mt-12 max-[1120px]:mt-9'>
        {college?.collegeGallery.map((photo, index) => (
          <div className='rounded-md overflow-hidden w-full'>
            <img
              alt='college photo'
              src={
                photo.img_url ||
                'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
              }
              key={index}
              className='w-full h-full object-cover hover:scale-105 transition-all duration-300'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GallerySection
