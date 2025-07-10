import React from 'react'
import { FiMapPin } from 'react-icons/fi'

const Hero = ({ event }) => {
  // Get current page URL to share
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out events happening on our platform`

  // Social share URLs
  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&display=popup&ref=plugin&src=share_button`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${currentUrl}`)}`
  }

  const handleInstagram = () => {
    navigator.clipboard.writeText(`${shareTitle}\n${currentUrl}`)
    alert('Link copied to clipboard! You can now paste it in Instagram')
  }
  return (
    <div className='relative '>
      {' '}
      {/* Prevents horizontal scroll */}
      <img
        src={'/images/eventsdesc.png'}
        alt={event?.title || 'Event'}
        layout='fill'
        objectFit='cover'
        className='w-full h-[50vh] md:h-[70vh]'
      />
      <div className='absolute top-3/4 left-4 md:left-36 transform -translate-y-1/2 text-white text-3xl md:text-4xl font-extrabold max-w-full px-4'>
        <div className='text-4xl md:text-5xl'>{event.title.split(':')[0]}</div>
        <div className='text-5xl md:text-6xl my-2'>
          {event.title.split(':')[1] || ''}
        </div>
        <div className='font-medium text-sm my-6'>
          By - {event.event_host.host}
        </div>
        <div className='font-medium text-sm my-6'>{event.host}</div>
        <div className='flex gap-2 font-medium text-sm my-6'>
          <FiMapPin />
          {/* <div>Map</div> */}
          <a
            href={event?.event_host?.map_url || 'N/A'}
            target='_blank'
            rel='noopener noreferrer'
            className=' hover:underline'
          >
            Map
          </a>
        </div>
      </div>
      {/* Social share icons */}
      <div className='fixed md:left-8 right-2 md:right-auto top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col space-y-4 text-[#b0b2c3] z-10'>
        <div className='text-black font-bold text-sm'>Share</div>
        <div className='flex flex-col gap-4 items-center'>
          {/* Facebook */}
          <a
            href={socialLinks.facebook}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:opacity-80 transition-opacity hover:scale-110'
          >
            <img src='/images/fb.png' alt='Share on Facebook' className='w-6' />
          </a>

          {/* Twitter/X */}
          <a
            href={socialLinks.x}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:opacity-80 transition-opacity hover:scale-110'
          >
            <img src='/images/twitter.png' alt='Share on X' className='w-6' />
          </a>

          {/* LinkedIn */}
          <a
            href={socialLinks.linkedin}
            target='_blank'
            rel='noopener noreferrer'
            className='hover:opacity-80 transition-opacity hover:scale-110'
          >
            <img
              src='/images/linkedin.png'
              alt='Share on LinkedIn'
              className='w-6'
            />
          </a>

          {/* Instagram */}
          <button
            onClick={handleInstagram}
            className='hover:opacity-80 transition-opacity hover:scale-110'
          >
            <img
              src='/images/insta.png'
              alt='Share on Instagram'
              className='w-6'
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hero
