import React, { useState, useEffect } from 'react'
import { X, PlayCircle } from 'lucide-react'

const GallerySection = ({ college }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  const images = college?.collegeGallery?.filter((item) => {
    return item.file_type == 'image'
  }) || []

  const videos = college?.collegeGallery?.filter((item) => {
    return item.file_type == 'video'
  }) || []

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (images.length === 0 && videos.length === 0) {
    return null
  }

  return (
    <div className='bg-white rounded-xl border p-6'>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>Gallery</h2>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className='mb-8'>
          <h3 className='text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider'>Photos</h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {images.map((photo, index) => (
              <div
                className='group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-gray-100'
                onClick={() => setSelectedImage(photo.file_url)}
                key={index}
              >
                <img
                  alt={college?.name || 'College Photo'}
                  src={
                    photo.file_url ||
                    'https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=996'
                  }
                  className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                  loading="lazy"
                />
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300' />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length > 0 && (
        <div>
          <h3 className='text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider'>Videos</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {videos.map((item, index) => (
              <div key={index} className='rounded-lg overflow-hidden bg-gray-100 border'>
                <div className='relative w-full pt-[56.25%]'>
                  <iframe
                    src={item.file_url}
                    title={`Video ${index + 1}`}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    className='absolute top-0 left-0 w-full h-full'
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div
          className='fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className='absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-[110]'
            aria-label='Close gallery'
          >
            <X size={24} />
          </button>

          <div
            className='relative max-w-[90vw] max-h-[90vh] flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt='Full View'
              className='max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl'
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default GallerySection
