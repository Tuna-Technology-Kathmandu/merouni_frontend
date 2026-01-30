import React from 'react'
import { IoIosGlobe } from 'react-icons/io'
import { PiLineVerticalThin } from 'react-icons/pi'
import { FaPhoneAlt } from 'react-icons/fa'
import { BsGlobe2 } from 'react-icons/bs'
import { MapPin } from 'lucide-react'
import Image from 'next/image'

const ImageSection = ({ consultancy }) => {
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
        <div className='w-full relative'>
          <img
            src={consultancy?.featured_image || '/images/degreeHero.webp'}
            alt='Consultancy Photo'
            className='w-full h-auto max-h-[456px] max-xl:max-h-[380px] max-sm:max-h-[300px] object-contain rounded-xl block'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl pointer-events-none' />
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
    </div>
  )
}

export default ImageSection
