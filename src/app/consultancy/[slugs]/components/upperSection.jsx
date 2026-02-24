'use client'

import React from 'react'
import { MapPin, Phone, Globe, MapPinned } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

const parseJsonField = (field) => {
  if (!field) return null
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return field
    }
  }
  return field
}

const ImageSection = ({ consultancy }) => {
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
  const destinations = parseJsonField(consultancy?.destination) || []

  const addressString = [address?.street, address?.city, address?.state, address?.zip]
    .filter(Boolean)
    .join(', ')

  const hasAddress = !!addressString
  const hasContacts = contacts.length > 0 && contacts.some(Boolean)
  const hasWebsite = !!consultancy?.website_url
  const hasDestinations = destinations.length > 0

  return (
    <div className='flex flex-col items-center relative gap-8 md:gap-12 lg:gap-16'>
      {/* Hero image + title bar */}
      <div className='w-full'>
        <div className='w-full relative'>
          <div className='absolute top-6 left-6 md:left-24 z-10'>
            <Link
              href='/consultancy'
              className='inline-flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full text-sm font-medium transition-all shadow-lg border border-white/20'
            >
              <FaArrowLeft className='w-3 h-3' />
              <span>Back to Consultancies</span>
            </Link>
          </div>
          <img
            src={consultancy?.featured_image || '/images/degreeHero.webp'}
            alt={consultancy?.title || 'Consultancy'}
            className='w-full h-auto max-h-[456px] max-xl:max-h-[380px] max-sm:max-h-[300px] object-cover rounded-xl block'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl pointer-events-none' />
        </div>
        <div className='flex flex-row min-h-[80px] md:h-[100px] bg-white items-center p-4 px-4 sm:px-8 md:px-14 lg:px-24 gap-4 sm:gap-6 shadow-sm relative z-10'>
          <div className='flex items-center justify-center rounded-2xl bg-white -translate-y-10 sm:-translate-y-12 md:-translate-y-16 overflow-hidden w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 flex-shrink-0 shadow-xl border-4 border-white transition-transform hover:scale-105 duration-300 relative'>
            {consultancy?.logo ? (
              <Image
                src={consultancy.logo}
                alt=''
                fill
                className='object-cover aspect-square'
              />
            ) : (
              <Image
                src={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(consultancy?.title || 'Consultancy')}`}
                alt=''
                fill
                className='object-cover aspect-square'
              />
            )}
          </div>
          <div className='flex-1 min-w-0 -mt-2'>
            <h1 className='font-semibold text-xl md:text-2xl text-gray-900 truncate'>
              {consultancy?.title || 'Consultancy'}
            </h1>
            {addressString && (
              <div className='flex flex-row items-center gap-1.5 mt-1 text-gray-600'>
                <MapPin className='w-4 h-4 sm:w-5 sm:h-5 text-[#0A6FA7] flex-shrink-0' />
                <p className='text-sm text-gray-600 truncate'>
                  {addressString}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info cards grid (like college) */}
      <div className='px-4 sm:px-8 md:px-12 lg:px-24 w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5'>
          {hasAddress && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#0A6FA7]/20 group'>
              <div className='bg-blue-50 p-3 rounded-2xl mb-4 group-hover:bg-[#0A6FA7]/10 transition-colors duration-300'>
                <MapPin className='w-6 h-6 text-[#0A6FA7]' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Address
              </p>
              <p className='text-sm text-gray-700 line-clamp-2'>
                {addressString}
              </p>
            </div>
          )}

          {hasContacts && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#0A6FA7]/20 group'>
              <div className='bg-orange-50 p-3 rounded-2xl mb-4 group-hover:bg-orange-100 transition-colors duration-300'>
                <Phone className='w-5 h-5 text-orange-500' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Contact
              </p>
              <div className='space-y-1'>
                {contacts.filter(Boolean).slice(0, 2).map((contact, index) => {
                  const isPhone = /^[\d+]/.test(String(contact).trim())
                  if (isPhone) {
                    return (
                      <a
                        key={index}
                        href={`tel:${contact}`}
                        className='block text-sm text-gray-700 hover:text-[#0A6FA7] transition-colors'
                      >
                        {contact}
                      </a>
                    )
                  }
                  return (
                    <span key={index} className='block text-sm text-gray-700'>
                      {contact}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {hasWebsite && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#0A6FA7]/20 group'>
              <div className='bg-sky-50 p-3 rounded-2xl mb-4 group-hover:bg-sky-100 transition-colors duration-300'>
                <Globe className='w-5 h-5 text-sky-500' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Website
              </p>
              <a
                href={consultancy.website_url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-gray-700 hover:text-[#0A6FA7] transition-colors line-clamp-1 break-all'
              >
                {consultancy.website_url.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}

          {hasDestinations && (
            <div className='bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 p-5 flex flex-col items-center justify-center text-center border border-gray-100 hover:border-[#0A6FA7]/20 group'>
              <div className='bg-emerald-50 p-3 rounded-2xl mb-4 group-hover:bg-[#30AD8F]/10 transition-colors duration-300'>
                <MapPinned className='w-6 h-6 text-[#30AD8F]' />
              </div>
              <p className='text-xs uppercase tracking-wider text-gray-500 font-medium mb-1'>
                Destinations
              </p>
              <div className='flex flex-wrap justify-center gap-1.5'>
                {destinations.slice(0, 3).map((d, i) => (
                  <span
                    key={i}
                    className='text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full font-medium'
                  >
                    {typeof d === 'object' && d?.country ? d.country : String(d)}
                  </span>
                ))}
                {destinations.length > 3 && (
                  <span className='text-xs text-gray-500'>+{destinations.length - 3}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageSection
