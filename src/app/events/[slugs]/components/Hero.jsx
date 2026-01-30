import React from 'react'
import { FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa'
import Link from 'next/link'
import { formatDate } from '@/utils/date.util'

const Hero = ({ event }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = event?.title || 'Check out this event on Mero Uni'

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank', 'width=600,height=400')
  }

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    alert('Link copied to clipboard!')
  }

 

  return (
    <div className='max-w-[1000px] mx-auto px-6 pt-12 lg:pt-16'>
      {/* Navigation */}
      <div className='mb-8'>
        <Link
          href='/events'
          className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors'
        >
          <FaArrowLeft className='w-3 h-3' />
          <span>Back</span>
        </Link>
      </div>

      <div className='flex flex-col gap-8'>
        <div className='w-full'>
          <h1 className='text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-6 tracking-tight'>
            {event?.title}
          </h1>

          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-8'>
            <div className='flex items-center gap-4'>
              <div className='flex flex-col'>
                <span className='text-xs text-gray-400 font-medium'>Published on</span>
                <span className='text-sm font-medium text-gray-900'>{formatDate(event?.createdAt)}</span>
              </div>
              <div className='h-8 w-[1px] bg-gray-100' />
              <div className='flex flex-col'>
                <span className='text-xs text-gray-400 font-medium'>ID</span>
                <span className='text-sm font-medium text-gray-900'>#{event?.id ? String(event.id).slice(-6).toUpperCase() : 'N/A'}</span>
              </div>
            </div>

            {/* Minimal Share Buttons */}
            <div className='flex items-center gap-4'>
              <button
                onClick={handleFacebookShare}
                className='text-gray-400 hover:text-[#1877F2] transition-colors'
                title='Share on Facebook'
              >
                <FaFacebook size={20} />
              </button>
              <button
                onClick={handleTwitterShare}
                className='text-gray-400 hover:text-[#1DA1F2] transition-colors'
                title='Share on Twitter'
              >
                <FaTwitter size={20} />
              </button>
              <button
                onClick={handleLinkedInShare}
                className='text-gray-400 hover:text-[#0A66C2] transition-colors'
                title='Share on LinkedIn'
              >
                <FaLinkedin size={20} />
              </button>
              <button
                onClick={handleCopyLink}
                className='text-gray-400 hover:text-gray-900 transition-colors'
                title='Copy Link'
              >
                <FaLink size={18} />
              </button>
            </div>
          </div>
        </div>

        {event?.image && (
          <div className='w-full aspect-[21/9] rounded-2xl overflow-hidden bg-gray-50'>
            <img
              src={event?.image}
              alt={event?.title}
              className='w-full h-full object-cover'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
