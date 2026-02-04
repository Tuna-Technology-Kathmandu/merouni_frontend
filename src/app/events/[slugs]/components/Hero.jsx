import React from 'react'
import { FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaLink, FaCalendarAlt, FaHashtag } from 'react-icons/fa'
import Link from 'next/link'
import { formatDate } from '@/utils/date.util'

const Hero = ({ event }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = event?.title || 'Check out this event on Mero Uni'

  const handleShare = (platform) => {
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
        break
      default:
        break
    }
    if (url) window.open(url, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    // could add a toast here, but alert is fine for now per original code
    alert('Link copied to clipboard!')
  }

  return (
    <div className='max-w-[1000px] mx-auto px-6 pt-10 lg:pt-14'>
      {/* Navigation */}
      <div className='mb-8'>
        <Link
          href='/events'
          className='group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0A6FA7] transition-all'
        >
          <div className='p-1.5 rounded-full bg-gray-100 group-hover:bg-[#0A6FA7] group-hover:text-white transition-all'>
            <FaArrowLeft className='w-3 h-3' />
          </div>
          <span>Back to Events</span>
        </Link>
      </div>

      <div className='flex flex-col gap-6'>
        {/* Title & Meta */}
        <div className='space-y-6'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight'>
            {event?.title}
          </h1>

          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-8'>
            <div className='flex flex-wrap items-center gap-6 text-sm'>
              <div className='flex items-center gap-2 text-gray-600'>
                <FaCalendarAlt className='text-[#0A6FA7]' />
                <span className='font-medium'>{formatDate(event?.createdAt)}</span>
              </div>
              <div className='w-1 h-1 rounded-full bg-gray-300 hidden sm:block' />
              <div className='flex items-center gap-2 text-gray-600'>
                <FaHashtag className='text-[#0A6FA7]' />
                <span className='font-medium tracking-wide'>
                  ID: {event?.id ? String(event.id).slice(-6).toUpperCase() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className='flex items-center gap-3'>
              <span className='text-xs font-bold text-gray-400 uppercase tracking-wider mr-2'>Share</span>
              <button onClick={() => handleShare('facebook')} className='p-2 rounded-full bg-gray-50 hover:bg-[#1877F2] hover:text-white text-gray-400 transition-all'>
                <FaFacebook size={18} />
              </button>
              <button onClick={() => handleShare('twitter')} className='p-2 rounded-full bg-gray-50 hover:bg-[#1DA1F2] hover:text-white text-gray-400 transition-all'>
                <FaTwitter size={18} />
              </button>
              <button onClick={() => handleShare('linkedin')} className='p-2 rounded-full bg-gray-50 hover:bg-[#0A66C2] hover:text-white text-gray-400 transition-all'>
                <FaLinkedin size={18} />
              </button>
              <button onClick={handleCopyLink} className='p-2 rounded-full bg-gray-50 hover:bg-gray-800 hover:text-white text-gray-400 transition-all'>
                <FaLink size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Image */}
        {event?.image && (
          <div className='w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative group'>
            <img
              src={event?.image}
              alt={event?.title}
              className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]'
            />
            <div className='absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl'></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
