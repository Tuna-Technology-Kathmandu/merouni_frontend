import React from 'react'
import { IoIosGlobe } from 'react-icons/io'
import { PiLineVerticalThin } from 'react-icons/pi'
import { FaUniversity, FaPhoneAlt } from 'react-icons/fa'
import { LiaUniversitySolid } from 'react-icons/lia'
import { BsGlobe2 } from 'react-icons/bs'
import { Eye } from 'lucide-react'

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
    <div className='flex flex-col items-center relative gap-8 md:gap-12 lg:gap-16'>
      {/* College image, name and location */}
      <div className='w-full'>
        <img
          src={college?.featured_img || '/images/degreeHero.webp'}
          alt='College Photo'
          className='h-[15vh] w-full md:h-[200px] object-cover object-top'
        />
        <div className='flex flex-row min-h-[60px] md:h-[70px] bg-[#30AD8F] bg-opacity-5 items-center p-2 px-4 sm:px-8 md:px-14 lg:px-24 gap-2 sm:gap-3'>
          <div className='flex items-center justify-center rounded-full bg-white -translate-y-4 overflow-hidden w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0'>
            <img
              src={
                college?.college_logo ||
                `https://avatar.iran.liara.run/username?username=${college?.name}`
              }
              alt='College Logo'
              className='object-cover w-full h-full rounded-full aspect-square'
            />
          </div>
          <div className='ml-2 sm:ml-3 flex-1 min-w-0'>
            <h2 className='font-bold text-sm sm:text-base md:text-xl lg:text-2xl lg:leading-[30px] truncate'>
              {college?.name}
            </h2>
            <div className='flex flex-row items-center gap-1'>
              <p className='font-semibold text-xs sm:text-sm truncate'>
                {college?.collegeAddress?.street},{' '}
                {college?.collegeAddress?.city}
              </p>
              <span className='flex-shrink-0'>
                <IoIosGlobe size={16} className='sm:w-5 sm:h-5' />
              </span>
            </div>
          </div>
          {/* View Brochure Button */}
          {college?.college_broucher && (
            <div className='flex-shrink-0'>
              <a
                href={college.college_broucher}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-[#0A6FA7] hover:bg-[#085e8a] text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-colors text-xs sm:text-sm font-semibold whitespace-nowrap'
              >
                <Eye className='w-3 h-3 sm:w-4 sm:h-4' />
                <span className='hidden sm:inline'>View Brochure</span>
                <span className='sm:hidden'>Brochure</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* College details section */}
      <div className='px-4 sm:px-8 md:px-12 lg:px-24 w-full'>
        <div className='bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex items-center flex-wrap flex-row justify-between md:justify-around gap-2 sm:gap-4 md:gap-6 lg:gap-10 p-3 sm:p-4 md:p-6 lg:p-7 overflow-x-auto'>
          {/* University */}
          <div className='flex flex-col items-center gap-1 sm:gap-2 text-center flex-shrink-0 min-w-[80px] sm:min-w-0'>
            <FaUniversity
              className='w-5 h-5 sm:w-6 sm:h-7 md:w-7 md:h-8'
              size={30}
            />
            <p className='max-w-[100px] sm:max-w-36 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold line-clamp-2'>
              {college?.university?.fullname || 'N/A'}
            </p>
          </div>

          <div className='items-center hidden lg:block flex-shrink-0'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Institute Type */}
          <div className='flex flex-col items-center gap-1 sm:gap-2 text-center flex-shrink-0 min-w-[60px] sm:min-w-0'>
            <LiaUniversitySolid
              className='w-5 h-5 sm:w-6 sm:h-7 md:w-7 md:h-8'
              size={30}
            />
            <p className='whitespace-nowrap text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold'>
              {college?.institute_type || 'N/A'}
            </p>
          </div>

          <div className='items-center hidden lg:block flex-shrink-0'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Institute Level */}
          <div className='flex flex-col items-center gap-1 sm:gap-2 text-center flex-shrink-0 min-w-[60px] sm:min-w-0'>
            <img
              src='/images/level.png'
              alt='level'
              className='w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10'
            />
            {JSON.parse(college?.institute_level || '[]').map(
              (level, index) => (
                <div key={index}>
                  <p className='max-w-[80px] sm:max-w-36 text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold line-clamp-2'>
                    {level}
                  </p>
                </div>
              )
            )}
          </div>

          <div className='items-center hidden lg:block flex-shrink-0'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Contact */}
          <div className='flex flex-col items-center gap-1 sm:gap-2 text-center flex-shrink-0 min-w-[80px] sm:min-w-0'>
            <FaPhoneAlt
              className='w-4 h-4 sm:w-5 sm:h-6 md:w-6 md:h-7'
              size={25}
            />
            {(college?.collegeContacts || [])
              .slice(0, 2)
              .map((contact, index) => (
                <div key={index} className='flex flex-row'>
                  <p className='text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold line-clamp-1'>
                    {contact?.contact_number || ''}
                  </p>
                </div>
              ))}
          </div>

          <div className='items-center hidden lg:block flex-shrink-0'>
            <PiLineVerticalThin size={60} />
          </div>

          {/* Website */}
          <div className='flex flex-col items-center gap-1 sm:gap-2 text-center flex-shrink-0 min-w-[80px] sm:min-w-0'>
            <BsGlobe2
              className='w-4 h-4 sm:w-5 sm:h-6 md:w-6 md:h-7'
              size={25}
            />
            <a
              href={college.website_url}
              target='_blank'
              rel='noopener noreferrer'
              className='max-w-[100px] sm:max-w-none'
            >
              <p className='whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold line-clamp-1'>
                {college.website_url || 'www.check.com'}
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageSection
