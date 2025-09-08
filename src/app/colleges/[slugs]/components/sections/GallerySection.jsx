import React, { useState } from 'react'
import { ImCross } from 'react-icons/im'

const GallerySection = ({ college }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  const images = college?.collegeGallery.filter((item) => {
    return item.file_type == 'image'
  })
  const videos = college?.collegeGallery.filter((item) => {
    return item.file_type == 'video'
  })

  console.log('selectedImage', selectedImage)
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Gallery</h2>

      {images.length > 0 && (
        <div className='grid grid-cols-3 max-[550px]:grid-cols-2  gap-4 mt-12 max-[1120px]:mt-9'>
          {images.map((photo, index) => (
            <div
              className='rounded-md overflow-hidden w-full cursor-pointer'
              onClick={() => setSelectedImage(photo.file_url)}
              key={index}
            >
              <img
                alt='college photo'
                src={
                  photo.file_url ||
                  'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
                }
                key={index}
                className='w-full h-full object-cover hover:scale-105 transition-all duration-300'
              />
            </div>
          ))}
        </div>
      )}

      {/* for videos */}
      {videos.length > 0 && (
        <div className='w-full mt-12 max-[1120px]:mt-9'>
          {videos.map((item, index) => {
            return (
              <div key={index} className='w-full mb-6 relative '>
                <iframe
                  src={item.file_url}
                  title={`YouTube video ${index}`}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className='w-full h-96 max-[1024px]:h-72 rounded '
                ></iframe>
              </div>
            )
          })}
        </div>
      )}
      {selectedImage && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'>
          <button
            onClick={() => setSelectedImage(null)}
            className='cursor-pointer'
          >
            <ImCross className=' cursor-pointer absolute right-3 top-7 z-10 text-white sm:text-lg md:text-2xl lg:text-3xl' />
          </button>

          <img
            src={selectedImage}
            alt='Full View'
            className='w-[90%] h-[50%] md:h-[70%] lg:h-[90%] rounded-lg shadow-lg'
          />
        </div>
      )}
    </div>
  )
}

export default GallerySection
