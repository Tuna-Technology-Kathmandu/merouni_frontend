import { formatDate } from '@/utils/date.util'
import React from 'react'

const Hero = ({ blog }) => {
  // Get current page URL to share
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out blogs on our platform`

  // Social share handlers
  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareTitle)}`,
      'facebook-share-dialog',
      'width=626,height=436'
    )
  }

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
      'twitter-share-dialog',
      'width=550,height=420'
    )
  }

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      'linkedin-share-dialog',
      'width=550,height=420'
    )
  }

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(`${shareTitle}\n${currentUrl}`)
    alert('Link copied to clipboard! You can now paste it in Instagram')
  }
  return (
    <div className='relative px-16 pt-14  max-sm:px-9 max-w-[1600px] mx-auto'>
      <div className='w-full'>
        <h1 className='font-bold text-[28px] max-md:text-[26px] leading-[44px] max-md:leading-[34px]  max-sm:text-[20px] max-sm:leading-[27px] '>
          {blog?.title}
        </h1>

        <div className='mt-2'>
          <p className='font-medium text-[12px] text-black/70'>
            <span>{formatDate(blog?.createdAt)}</span>
          </p>
        </div>
        {blog?.newsAuthor && (
          <div className='font-medium text-[12px] my-2 text-black/70'>
            By {blog?.newsAuthor?.firstName} {blog?.newsAuthor?.middleName || ''}{' '}
            {blog?.newsAuthor?.lastName}
          </div>
        )}

        {blog?.featured_image && (
          <div className='w-full my-12 max-1xl:my-8 max-md:my-5'>
            <img
              src={blog.featured_image}
              alt={blog?.title || 'Blog featured image'}
              className='w-full h-auto max-h-[456px] max-1xl:max-h-[380px] max-sm:max-h-[300px] object-contain rounded-xl'
            />
          </div>
        )}
      </div>

      

      {/* Social share icons remain the same */}
      <div className='space-y-4 z-10 text-[#b0b2c3] fixed right-4 top-[30%] lg:block md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col'>
        <div className='text-black font-bold text-sm'>Share</div>
        <div className='flex flex-col gap-4 items-center'>
          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on Facebook'
          >
            <img src='/images/fb.png' alt='Facebook' className='w-6' />
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on Twitter'
          >
            <img src='/images/twitter.png' alt='Twitter' className='w-6' />
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedInShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on LinkedIn'
          >
            <img src='/images/linkedin.png' alt='LinkedIn' className='w-6' />
          </button>

          {/* WhatsApp */}
          {/* <button
            onClick={handleWhatsAppShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on WhatsApp'
          >
            <img src='/images/whatsapp.png' alt='WhatsApp' className='w-6' />
          </button> */}

          {/* Instagram */}
          <button
            onClick={handleInstagramShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on Instagram'
          >
            <img src='/images/insta.png' alt='Instagram' className='w-6' />
          </button>

          {/* Native Share */}
          {/* <button
            onClick={handleNativeShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share'
          >
            <img src='/images/share.png' alt='Share' className='w-6' />
          </button> */}
        </div>
      </div>
    </div>
  )
}

export default Hero
