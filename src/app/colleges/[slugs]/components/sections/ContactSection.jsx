import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { BsGlobe2 } from 'react-icons/bs'

const ContactSection = ({ college }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Contact</h2>
      <div className='grid grid-cols-2 w-full gap-7 max-[1120px]:gap-5 mt-20 max-[1120px]:mt-16'>
        <div className='w-full min-h-14 bg-[#F5F5F5] relative rounded-md p-5 -z-10'>
          <div className='w-14 h-14 max-[1120px]:w-12 max-[1120px]:h-12 max-md:h-9 max-md:w-9 bg-blue-300 rounded-full absolute left-1/2 -translate-x-1/2 -top-8 max-md:-top-5 flex items-center justify-center'>
            <FaPhoneAlt className='text-white text-xl' />
          </div>
          <ul className='mt-14 text-center max-[1120px]:mt-9  '>
            {college.collegeContacts.map((contact, index) => (
              <li
                key={index}
                className='mt-2 text-xs md:text-[13px] lg:text-[15px] cursor-pointer
              transition-all duration-300 ease-in-out font-medium
              '
              >
                <a
                  href={`tel:${contact.contact_number}`}
                  className='hover:text-[#0A6FA7] cursor-pointer
                     transition-all duration-300 ease-in-out'
                >
                  {contact.contact_number}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className='w-full min-h-14 bg-[#F5F5F5] relative -z-10 rounded-md p-5'>
          <div className='w-14 h-14 max-[1120px]:w-12 max-[1120px]:h-12 max-md:h-9 max-md:w-9 bg-blue-300 rounded-full absolute left-1/2 -translate-x-1/2 -top-8 max-md:-top-5  flex items-center justify-center'>
            <BsGlobe2 className='text-white text-2xl' />
          </div>
          <a
            href={college.website_url || '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-14 max-[1120px]:mt-9 block text-xs font-medium md:text-[13px] lg:text-[15px] break-words text-center hover:text-[#0A6FA7] transition-all duration-300 ease-in-out cursor-pointer'
          >
            {college.website_url || 'N/A'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
