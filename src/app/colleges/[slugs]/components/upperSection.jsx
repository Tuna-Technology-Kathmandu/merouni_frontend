import React from 'react'
import { IoIosGlobe } from 'react-icons/io'
import { FaUniversity, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { BsGlobe2 } from 'react-icons/bs'
import { Eye } from 'lucide-react'

const ImageSection = ({ college }) => {
  // Get current page URL to share
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out ${college?.name} on our platform`

  const hasAddress =
    college?.collegeAddress?.street || college?.collegeAddress?.city
  const hasContacts =
    college?.collegeContacts && college.collegeContacts.length > 0
  const hasWebsite = !!college?.website_url
  const hasUniversity = !!college?.university?.fullname
  const instituteLevels = JSON.parse(college?.institute_level || '[]')
  const hasInstituteLevel = instituteLevels.length > 0



  return (
    <div className='flex flex-col items-center relative gap-8 md:gap-12 lg:gap-16'>
      {/* College image, name and location */}
      <div className='w-full'>
        <div className='w-full relative'>
          <img
            src={college?.featured_img || '/images/degreeHero.webp'}
            alt='College Photo'
            className='w-full h-auto max-h-[456px] max-xl:max-h-[380px] max-sm:max-h-[300px] object-contain rounded-xl block'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl pointer-events-none' />
        </div>
        <div className='flex flex-row min-h-[80px] md:h-[100px] bg-white items-center p-4 px-4 sm:px-8 md:px-14 lg:px-24 gap-4 sm:gap-6 shadow-sm relative z-10'>
          <div className='flex items-center justify-center rounded-2xl bg-white -translate-y-10 sm:-translate-y-12 md:-translate-y-16 overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex-shrink-0 shadow-xl border-4 border-white transition-transform hover:scale-105 duration-300'>
            <img
              src={
                college?.college_logo ||
                `https://avatar.iran.liara.run/username?username=${college?.name}`
              }
              alt='College Logo'
              className='object-cover w-full h-full rounded-xl aspect-square'
            />
          </div>
          <div className='flex-1 min-w-0 -mt-2'>
            <h1 className='font-semibold text-xl md:text-2xl text-gray-900 truncate'>
              {college?.name}
            </h1>
            {hasAddress && (
              <div className='flex flex-row items-center gap-1.5 mt-1 text-gray-600'>
                <span className='flex-shrink-0'>
                  <IoIosGlobe className='w-4 h-4 sm:w-5 sm:h-5 text-[#30AD8F]' />
                </span>
                <p className='text-sm text-gray-600 truncate'>
                  {college?.collegeAddress?.street}
                  {college?.collegeAddress?.street &&
                  college?.collegeAddress?.city
                    ? ', '
                    : ''}
                  {college?.collegeAddress?.city}
                </p>
              </div>
            )}
          </div>
          {/* View Brochure Button */}
          {college?.college_broucher && (
            <div className='flex-shrink-0'>
              <a
                href={college.college_broucher}
                target='_blank'
                rel='noopener noreferrer'
                className='bg-[#0A6FA7] hover:bg-[#085e8a] text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm font-medium active:scale-95'
              >
                <Eye className='w-4 h-4' />
                <span className='hidden sm:inline'>View Brochure</span>
                <span className='sm:hidden'>Brochure</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* College details section */}
      <div className='px-4 sm:px-8 md:px-12 lg:px-24 w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5'>
          {/* University */}
          {hasUniversity && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F]/20 group'>
              <div className='bg-blue-50 p-3 rounded-2xl mb-4 group-hover:bg-[#0A6FA7]/10 transition-colors duration-300'>
                <FaUniversity className='w-6 h-6 text-[#0A6FA7]' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                University
              </p>
              <p className='text-sm text-gray-700 line-clamp-2'>
                {college?.university?.fullname}
              </p>
            </div>
          )}



          {/* Institute Level */}
          {hasInstituteLevel && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F]/20 group'>
              <div className='bg-indigo-50 p-3 rounded-2xl mb-4 group-hover:bg-indigo-100 transition-colors duration-300'>
                <img
                  src='/images/level.png'
                  alt='level'
                  className='w-6 h-6 grayscale opacity-80'
                />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Levels
              </p>
              <div className='flex flex-wrap justify-center gap-1.5'>
                {instituteLevels.map((level, index) => (
                  <span
                    key={index}
                    className='text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full font-medium'
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {hasContacts && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F]/20 group'>
              <div className='bg-orange-50 p-3 rounded-2xl mb-4 group-hover:bg-orange-100 transition-colors duration-300'>
                <FaPhoneAlt className='w-5 h-5 text-orange-500' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Contact
              </p>
              <div className='space-y-1'>
                {college.collegeContacts.slice(0, 2).map((contact, index) => (
                  <a
                    key={index}
                    href={`tel:${contact?.contact_number || ''}`}
                    className='block text-sm text-gray-700 hover:text-[#0A6FA7] transition-colors'
                  >
                    {contact?.contact_number}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Website */}
          {hasWebsite && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F]/20 group'>
              <div className='bg-sky-50 p-3 rounded-2xl mb-4 group-hover:bg-sky-100 transition-colors duration-300'>
                <BsGlobe2 className='w-5 h-5 text-sky-500' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Website
              </p>
              <a
                href={college.website_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-gray-700 hover:text-[#0A6FA7] transition-colors line-clamp-1 break-all'
              >
                {college.website_url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {/* New Address Card */}
          {hasAddress && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#30AD8F]/20 group'>
              <div className='bg-emerald-50 p-3 rounded-2xl mb-4 group-hover:bg-[#30AD8F]/10 transition-colors duration-300'>
                <FaMapMarkerAlt className='w-5 h-5 text-[#30AD8F]' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Address
              </p>
              <p className='text-sm text-gray-700 line-clamp-2'>
                {[
                  college?.collegeAddress?.street,
                  college?.collegeAddress?.city,
                  college?.collegeAddress?.state,
                  college?.collegeAddress?.country
                ].filter(Boolean).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageSection
