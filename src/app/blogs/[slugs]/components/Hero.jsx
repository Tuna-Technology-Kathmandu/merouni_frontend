import React from 'react'
import { FiMapPin } from 'react-icons/fi'
import Image from 'next/image'

const Hero = ({ news }) => {
  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(event?.title || 'Check out this event!')

    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`
        break
      case 'instagram':
        alert(
          'Instagram does not support direct link sharing. Please share manually.'
        )
        return
      default:
        return
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className='relative'>
      <img
        src={'/images/eventsdesc.png'}
        alt={news.title || 'News'}
        layout='fill'
        objectFit='cover'
        className='w-full h-[50vh] md:h-[70vh]'
      />

      <div className='absolute top-3/4 left-4 md:left-36 transform -translate-y-1/2 text-white text-3xl md:text-4xl font-extrabold max-w-full px-4'>
        <div className='text-4xl md:text-5xl'>{news.title.split(':')[0]}</div>
        <div className='text-5xl md:text-6xl my-2'>
          {news.title.split(':')[1] || ''}
        </div>
        <div className='font-medium text-sm my-6'>
          By - {news.newsAuthor.firstName} {news.newsAuthor.middleName || ''}{' '}
          {news.newsAuthor.lastName}
        </div>
      </div>

      {/* Social share icons remain the same */}
      <div className='fixed md:left-8 right-2 md:right-auto top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col space-y-4 text-[#b0b2c3] z-10'>
        <div className='text-black font-bold text-sm'>Share</div>
        <img
          src='/images/fb.png'
          alt='Facebook'
          className='w-6 cursor-pointer'
          onClick={() => handleShare('facebook')}
        />
        <img
          src='/images/insta.png'
          alt='Instagram'
          className='w-6 cursor-pointer'
          onClick={() => handleShare('instagram')}
        />
        <img
          src='/images/linkedin.png'
          alt='LinkedIn'
          className='w-6 cursor-pointer'
          onClick={() => handleShare('linkedin')}
        />
        <img
          src='/images/twitter.png'
          alt='Twitter'
          className='w-6 cursor-pointer'
          onClick={() => handleShare('twitter')}
        />
      </div>
    </div>
  )
}

export default Hero
