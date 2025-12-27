import React from 'react'
import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa'
import { BsGlobe2 } from 'react-icons/bs'

const InfoSection = ({ college }) => {
  const address = college?.collegeAddress || {}
  const contacts = college?.collegeContacts || []
  const hasAddress =
    address.country ||
    address.state ||
    address.city ||
    address.street ||
    address.postal_code
  const hasContact = contacts.length > 0 || college?.website_url

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
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold mb-4 md:mb-5'>
        Contact & Address
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
        {/* Contact Information */}
        {hasContact && (
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 md:p-5'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='flex-shrink-0 w-8 h-8 rounded-full bg-[#30AD8F] bg-opacity-10 flex items-center justify-center'>
                <FaPhoneAlt className='w-4 h-4 text-[#30AD8F]' />
              </div>
              <h3 className='text-sm md:text-base font-semibold text-gray-900'>
                Contact
              </h3>
            </div>

            <div className='space-y-3'>
              {/* Phone Numbers */}
              {contacts.length > 0 && (
                <div className='space-y-2'>
                  {contacts.map((contact, index) => (
                    <a
                      key={index}
                      href={`tel:${contact.contact_number}`}
                      className='flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-[#30AD8F] transition-colors'
                    >
                      <FaPhoneAlt className='w-3.5 h-3.5 text-gray-400 flex-shrink-0' />
                      <span>{contact.contact_number}</span>
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
                  className='flex items-center gap-2 text-sm md:text-base text-gray-700 hover:text-[#30AD8F] transition-colors break-words'
                >
                  <BsGlobe2 className='w-3.5 h-3.5 text-gray-400 flex-shrink-0' />
                  <span className='break-all'>{college.website_url}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Address Information */}
        {hasAddress && (
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 md:p-5'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='flex-shrink-0 w-8 h-8 rounded-full bg-[#30AD8F] bg-opacity-10 flex items-center justify-center'>
                <FaMapMarkerAlt className='w-4 h-4 text-[#30AD8F]' />
              </div>
              <h3 className='text-sm md:text-base font-semibold text-gray-900'>
                Address
              </h3>
            </div>

            <div className='text-sm md:text-base text-gray-700 leading-relaxed'>
              {addressParts.length > 0 ? (
                <p>{addressParts.join(', ')}</p>
              ) : (
                <p className='text-gray-400'>No address available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoSection
