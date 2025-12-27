import React from 'react'
import { IoIosGlobe } from 'react-icons/io'
import { PiLineVerticalThin } from 'react-icons/pi'
import { FaPhoneAlt } from 'react-icons/fa'
import { BsGlobe2 } from 'react-icons/bs'
import { MapPin } from 'lucide-react'
import Image from 'next/image'

const ImageSection = ({ consultancy }) => {
  // Get current page URL to share
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out ${consultancy?.title} on our platform`

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

  // Parse JSON fields
  const parseJsonField = (field) => {
    if (!field) return null
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch (e) {
        return field
      }
    }
    return field
  }

  const address = parseJsonField(consultancy?.address) || {}
  const contacts = consultancy?.contact
    ? typeof consultancy.contact === 'string'
      ? (() => {
          try {
            return JSON.parse(consultancy.contact)
          } catch {
            return []
          }
        })()
      : Array.isArray(consultancy.contact)
        ? consultancy.contact
        : []
    : []

  const addressString = [
    address?.street,
    address?.city,
    address?.state,
    address?.zip
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className='flex flex-col items-center relative gap-16 max-md:gap-12'>
      {/* Consultancy image, name and location */}
      <div className='w-full'>
        <div className='h-[25vh] w-full md:h-[400px] relative'>
          <Image
            src={consultancy?.featured_image || '/images/degreeHero.webp'}
            alt='Consultancy Photo'
            fill
            className='object-cover'
            priority
          />
        </div>
        <div className='flex flex-row lg:h-[95px] bg-[#30AD8F] bg-opacity-5 items-center p-0 px-8 sm:px-14 md:px-24'>
          <div className='flex items-center justify-center rounded-full bg-white -translate-y-8 overflow-hidden w-24 h-24 md:w-32 md:h-32 relative'>
            {consultancy?.logo ? (
              <Image
                src={consultancy.logo}
                alt='Consultancy Logo'
                fill
                className='object-cover rounded-full'
              />
            ) : (
              <Image
                src={`https://avatar.iran.liara.run/username?username=${consultancy?.title || 'Consultancy'}`}
                alt='Consultancy Logo'
                fill
                className='object-cover rounded-full'
              />
            )}
          </div>
          <div className='ml-4'>
            <h2 className='font-bold text-lg lg:text-4xl lg:leading-[50px]'>
              {consultancy?.title}
            </h2>
            {addressString && (
              <div className='flex flex-row'>
                <p className='font-semibold text-sm lg:text-lg'>
                  {addressString}
                </p>
                <span>
                  <IoIosGlobe size={25} />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Consultancy details section */}
      <div className='sm:px-24 px-12 w-full'>
        {(addressString ||
          (contacts.length > 0 && contacts.some((c) => c)) ||
          consultancy?.website_url) && (
          <div className='bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex items-center justify-center md:flex-wrap flex-col md:flex-row sm:justify-between md:justify-around md:gap-10 items-left w-full l:w-[80%] gap-6 lg:gap-6 p-7'>
            {/* Address */}
            {addressString && (
              <>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <MapPin size={30} className='text-[#30AD8F]' />
                  <p className='md:max-w-48 sm:text-base text-xs font-semibold'>
                    {addressString}
                  </p>
                </div>

                {((contacts.length > 0 && contacts.some((c) => c)) ||
                  consultancy?.website_url) && (
                  <div className='items-center hidden xl:block'>
                    <PiLineVerticalThin size={60} />
                  </div>
                )}
              </>
            )}

            {/* Contact */}
            {contacts.length > 0 && contacts.some((c) => c) && (
              <>
                <div className='flex flex-col items-center gap-2 text-center'>
                  <FaPhoneAlt size={25} />
                  {contacts.map(
                    (contact, index) =>
                      contact && (
                        <div key={index} className='flex flex-row'>
                          <p className='sm:text-base text-xs font-semibold'>
                            {contact}
                          </p>
                        </div>
                      )
                  )}
                </div>

                {consultancy?.website_url && (
                  <div className='items-center hidden xl:block'>
                    <PiLineVerticalThin size={60} />
                  </div>
                )}
              </>
            )}

            {/* Website */}
            {consultancy?.website_url && (
              <div className='flex flex-col items-center gap-2 text-center'>
                <BsGlobe2 size={25} />
                <a
                  href={consultancy.website_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <p className='whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer sm:text-base text-xs font-semibold max-w-48 break-all'>
                    {consultancy.website_url}
                  </p>
                </a>
              </div>
            )}
          </div>
        )}
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

          {/* Instagram */}
          <button
            onClick={handleInstagramShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on Instagram'
          >
            <img src='/images/insta.png' alt='Instagram' className='w-6' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageSection
