import React, { useState } from 'react'
import ImageLightbox from '@/ui/molecules/image-lightbox'

const ImageGallery = ({ images, title = 'Campus Gallery', universityName }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  if (!images || !Array.isArray(images) || images.length === 0) return null

  return (
    <section className='w-full mb-14 max-md:mb-7'>
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#30AD8F]/5 to-white border border-[#30AD8F]/10 p-10 max-md:p-6 px-[75px] max-md:px-[30px]'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='font-bold text-lg md:text-xl text-gray-900'>
            {title}
          </h2>

          <span className='text-sm font-medium bg-[#30AD8F]/20 text-[#30AD8F] px-4 py-1.5 rounded-full border border-[#30AD8F]/20 shadow-sm'>
            {images.length} Photo{images.length > 1 && 's'}
          </span>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
          {images.map((img, idx) => (
            <div
              key={idx}
              className='group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-white hover:-translate-y-1'
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`${universityName || 'Gallery'} ${idx + 1}`}
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />

              {/* Overlay hint */}
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <span className='bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/30'>
                  View Image
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
        altText={universityName}
      />
    </section>
  )
}

export default ImageGallery
