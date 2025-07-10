import React from 'react'

const Hero = ({ news }) => {
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
    <div className='relative'>
      <div className='w-full h-[250px] sm:h-[400px] md:h-[480px]'>
        <img
          src={news.featuredImage || 'https://placehold.co/600x400'}
          alt={news.title || 'News'}
          className='w-full h-full'
        />

        <div className='absolute bg-black/20 w-full h-full inset-0 '></div>
        <div className='absolute left-5 bg-black/70 rounded-md p-3 md:left-10 lg:left-20 bottom-[20%] text-white w-[15rem] min-[433px]:w-[20rem] sm:w-[30rem] lg:w-[50rem] md:w-[40rem] font-bold  px-4'>
          <p className='text-lg leading-1 md:text-3xl lg:text-4xl '>
            {news.title}
          </p>
          <div className='font-medium text-xs my-2'>
            - {news.newsAuthor.firstName} {news.newsAuthor.middleName || ''}{' '}
            {news.newsAuthor.lastName}
          </div>
        </div>
      </div>

      {/* Social share icons remain the same */}
      <div className='space-y-4 z-10 text-[#b0b2c3] fixed left-4 top-[30%] lg:block md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col'>
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
