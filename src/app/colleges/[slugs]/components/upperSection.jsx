import React from 'react'
import { IoIosGlobe } from 'react-icons/io'
import { PiLineVerticalThin } from 'react-icons/pi'
import { FaUniversity, FaPhoneAlt } from 'react-icons/fa'
import { LiaUniversitySolid } from 'react-icons/lia'
import { BsGlobe2 } from 'react-icons/bs'

const ImageSection = ({ college }) => {
  // Get current page URL to share
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out ${college?.name} on our platform`

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

  // const handleWhatsAppShare = () => {
  //   window.open(
  //     `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${currentUrl}`)}`,
  //     'whatsapp-share-dialog',
  //     'width=550,height=420'
  //   )
  // }

  // const handleNativeShare = async () => {
  //   try {
  //     await navigator.share({
  //       title: shareTitle,
  //       text: `Check out ${college?.name}`,
  //       url: currentUrl
  //     })
  //   } catch (err) {
  //     console.log('Native share not supported', err)
  //   }
  // }

  return (
    <div className='flex flex-col items-center relative gap-16 max-md:gap-12'>
      {/* College image, name and location */}
      <div className='w-full'>
        <img
          src={college?.featured_img || '/images/degreeHero.webp'}
          alt='College Photo'
          className='h-[25vh] w-full md:h-[400px] object-cover'
        />
        <div className='flex flex-row lg:h-[95px] bg-[#30AD8F] bg-opacity-5 items-center p-0 px-8 sm:px-14 md:px-24'>
          <div className='flex items-center justify-center rounded-full bg-white -translate-y-8 overflow-hidden w-24 h-24 md:w-32 md:h-32'>
            <img
              src={
                college?.college_logo ||
                `https://avatar.iran.liara.run/username?username=${college?.name}`
              }
              alt='College Logo'
              className='object-cover w-full h-full rounded-full aspect-square'
            />
          </div>
          <div className='ml-4'>
            <h2 className='font-bold text-lg lg:text-4xl lg:leading-[50px]'>
              {college?.name}
            </h2>
            <div className='flex flex-row'>
              <p className='font-semibold text-sm lg:text-lg'>
                {college?.collegeAddress?.street},{' '}
                {college?.collegeAddress?.city}
              </p>
              <span>
                <IoIosGlobe size={25} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* College details section */}
      <div className='sm:px-24 px-12 w-full'>
        <div className='bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex items-center justify-center md:flex-wrap flex-col md:flex-row  sm:justify-between md:justify-around md:gap-10 items-left w-full l:w-[80%] gap-6 lg:gap-6 p-7'>
          {/* University */}
          <div className='flex flex-col items-center gap-2 text-center'>
            <FaUniversity size={30} />
            <p className='md:max-w-36 sm:text-base text-xs font-semibold'>
              {college?.university?.fullname || 'N/A'}
            </p>
          </div>

          <div className='items-center hidden xl:block'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Institute Type */}
          <div className='flex flex-col items-center gap-2 text-center'>
            <LiaUniversitySolid size={30} />
            <p className='whitespace-nowrap sm:text-base text-xs font-semibold'>
              {college?.institute_type || 'N/A'}
            </p>
          </div>

          <div className='items-center hidden xl:block'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Institute Level */}
          <div className='flex flex-col items-center gap-2 text-center'>
            <img src='/images/level.png' alt='level' className='w-10' />
            {JSON.parse(college?.institute_level || '[]').map(
              (level, index) => (
                <div key={index}>
                  <p className='max-w-36 sm:text-base text-xs font-semibold'>
                    {level}
                  </p>
                </div>
              )
            )}
          </div>

          <div className='items-center hidden xl:block'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Contact */}
          <div className='flex flex-col items-center gap-2 text-center'>
            <FaPhoneAlt size={25} />
            {(college?.collegeContacts || []).map((contact, index) => (
              <div key={index} className='flex flex-row'>
                <p className='sm:text-base text-xs font-semibold'>
                  {contact?.contact_number || ''}
                </p>
              </div>
            ))}
          </div>

          <div className='items-center hidden xl:block'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Website */}
          <div className='flex flex-col items-center gap-2 text-center'>
            <BsGlobe2 size={25} />
            <a
              href={college.website_url}
              target='_blank'
              rel='noopener noreferrer'
            >
              <p className='whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer sm:text-base text-xs font-semibold'>
                {college.website_url || 'www.check.com'}
              </p>
            </a>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div className='fixed right-4 top-[30%] lg:block md:-translate-y-1 bg-white p-4 rounded-xl shadow-md z-50'>
        <div className='text-black font-bold text-sm mb-3 text-center'>
          Share
        </div>
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

export default ImageSection
