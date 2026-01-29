import React from 'react'
import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { BsGlobe2 } from 'react-icons/bs'

const InfoSection = ({ college }) => {
  const address = college?.collegeAddress || {}
  const contacts = college?.collegeContacts || []
  const hasAddress =
    !!(address.country ||
      address.state ||
      address.city ||
      address.street ||
      address.postal_code)
  const hasContact = contacts.length > 0 || !!college?.website_url

  if (!hasAddress && !hasContact) {
    return null
  }

  // Build address string
  const addressParts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.postal_code
  ].filter(Boolean)

  return (
    <div className='w-full max-w-4xl'>
      <h2 className='text-xl md:text-2xl font-bold mb-6 text-gray-900'>
        Contact & Address
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6'>
        {/* Contact Information */}
        {hasContact && (
          <div className='bg-white border border-gray-100 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-6 sm:p-8 flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex-shrink-0 w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors'>
                <FaPhoneAlt className='w-4 h-4 text-orange-500' />
              </div>
              <h3 className='text-lg font-bold text-gray-800 group-hover:text-[#0A6FA7] transition-colors'>
                Contact Info
              </h3>
            </div>

            <div className='space-y-4'>
              {/* Phone Numbers */}
              {contacts.length > 0 && (
                <div className='space-y-3'>
                  {contacts.map((contact, index) => (
                    <a
                      key={index}
                      href={`tel:${contact.contact_number}`}
                      className='group flex items-center gap-3 text-gray-500 hover:text-[#0A6FA7] transition-all'
                    >
                      <div className='w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#0A6FA7] transition-colors'></div>
                      <span className='font-semibold text-sm sm:text-base'>{contact.contact_number}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Website */}
              {college?.website_url && (
                <a
                  href={college.website_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='group flex items-center gap-3 text-gray-500 hover:text-[#0A6FA7] transition-all pt-3 border-t border-gray-50'
                >
                  <BsGlobe2 className='w-4 h-4 text-sky-400 group-hover:text-[#0A6FA7]' />
                  <span className='font-semibold text-sm sm:text-base truncate break-all'>
                    {college.website_url.replace(/^https?:\/\//, '')}
                  </span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Address Information */}
        {hasAddress && (
          <div className='bg-white border border-gray-100 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-6 sm:p-8 flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='flex-shrink-0 w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-[#30AD8F]/10 transition-colors'>
                <FaMapMarkerAlt className='w-4 h-4 text-[#30AD8F]' />
              </div>
              <h3 className='text-lg font-bold text-gray-800 group-hover:text-[#30AD8F] transition-colors'>
                Location
              </h3>
            </div>

            <div className='text-gray-500 leading-relaxed'>
              {addressParts.length > 0 ? (
                <p className='font-semibold text-sm sm:text-base'>{addressParts.join(', ')}</p>
              ) : (
                <p className='text-gray-400 italic'>Address details not provided</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoSection
