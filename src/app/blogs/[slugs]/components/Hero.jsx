import React from 'react'

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
      <div className='w-full h-[250px] sm:h-[400px] md:h-[480px]'>
        <img
          src={news.featuredImage || 'https://placehold.co/600x400'}
          alt={news.title || 'News'}
          className='w-full h-full'
        />

        <div className='absolute bg-black/50 w-full h-full inset-0 '></div>
        <div className='absolute left-5 md:left-10 lg:left-20 bottom-[20%] text-white w-[15rem] min-[433px]:w-[20rem] sm:w-[30rem] lg:w-[50rem] md:w-[40rem] font-bold  px-4'>
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
        <img
          src='/images/fb.png'
          alt='Facebook'
          className='w-6 cursor-pointer mx-auto'
          onClick={() => handleShare('facebook')}
        />
        <img
          src='/images/insta.png'
          alt='Instagram'
          className='w-6 cursor-pointer mx-auto'
          onClick={() => handleShare('instagram')}
        />
        <img
          src='/images/linkedin.png'
          alt='LinkedIn'
          className='w-6 cursor-pointer mx-auto'
          onClick={() => handleShare('linkedin')}
        />
        <img
          src='/images/twitter.png'
          alt='Twitter'
          className='w-6 cursor-pointer mx-auto'
          onClick={() => handleShare('twitter')}
        />
      </div>
    </div>
  )
}

export default Hero
