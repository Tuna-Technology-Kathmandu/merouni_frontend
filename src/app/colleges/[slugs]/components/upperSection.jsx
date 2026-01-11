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
        <div className='w-full h-[400px] bg-gray-100 flex items-center justify-center'>
          <img
            src={college?.featured_img || '/images/degreeHero.webp'}
            alt='College Photo'
            className='w-full h-full object-cover'
          />
        </div>
        <div className='flex flex-row min-h-[60px] md:h-[70px] bg-[#30AD8F] bg-opacity-5 items-center p-2 px-4 sm:px-8 md:px-14 lg:px-24 gap-2 sm:gap-3'>
          <div className='flex items-center justify-center rounded-full bg-white -translate-y-4 overflow-hidden w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex-shrink-0 shadow-lg border-4 border-white'>
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
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6'>
          {/* University */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F] group'>
            <div className='bg-gradient-to-br from-[#0870A8] to-[#30AD8F] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300'>
              <FaUniversity className='w-6 h-6 md:w-7 md:h-7 text-white' />
            </div>
            <p className='text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors line-clamp-2'>
              {college?.university?.fullname || 'N/A'}
            </p>
          </div>

          {/* Institute Type */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F] group'>
            <div className='bg-gradient-to-br from-[#0870A8] to-[#30AD8F] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300'>
              <LiaUniversitySolid className='w-6 h-6 md:w-7 md:h-7 text-white' />
            </div>
            <p className='text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors whitespace-nowrap'>
              {college?.institute_type || 'N/A'}
            </p>
          </div>

          {/* Institute Level */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F] group'>
            <div className='bg-gradient-to-br from-[#0870A8] to-[#30AD8F] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center'>
              <img
                src='/images/level.png'
                alt='level'
                className='w-6 h-6 md:w-7 md:h-7 filter brightness-0 invert'
              />
            </div>
            <div className='space-y-1'>
              {JSON.parse(college?.institute_level || '[]').map(
                (level, index) => (
                  <p
                    key={index}
                    className='text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors'
                  >
                    {level}
                  </p>
                )
              )}
              {(!college?.institute_level ||
                JSON.parse(college?.institute_level || '[]').length === 0) && (
                <p className='text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors'>
                  N/A
                </p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F] group'>
            <div className='bg-gradient-to-br from-[#0870A8] to-[#30AD8F] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300'>
              <FaPhoneAlt className='w-5 h-5 md:w-6 md:h-6 text-white' />
            </div>
            <div className='space-y-1'>
              {(college?.collegeContacts || [])
                .slice(0, 2)
                .map((contact, index) => (
                  <a
                    key={index}
                    href={`tel:${contact?.contact_number || ''}`}
                    className='block text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors hover:underline'
                  >
                    {contact?.contact_number || 'N/A'}
                  </a>
                ))}
              {(!college?.collegeContacts ||
                college?.collegeContacts.length === 0) && (
                <p className='text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors'>
                  N/A
                </p>
              )}
            </div>
          </div>

          {/* Website */}
          <div className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4 md:p-6 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F] group col-span-2 md:col-span-1'>
            <div className='bg-gradient-to-br from-[#0870A8] to-[#30AD8F] p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300'>
              <BsGlobe2 className='w-5 h-5 md:w-6 md:h-6 text-white' />
            </div>
            {college?.website_url ? (
              <a
                href={college.website_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors hover:underline line-clamp-1 break-all'
              >
                {college.website_url}
              </a>
            ) : (
              <p className='text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0870A8] transition-colors'>
                N/A
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageSection
