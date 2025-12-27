import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

const ContactNow = ({ consultancy }) => {
  return (
    <div className='bg-[#30AD8F] bg-opacity-50 w-full h-[150px] flex flex-col items-center justify-center mb-10'>
      <p className='text-lg md:text-2xl font-semibold m-4'>
        Ready to start your journey? Get in touch with us today!
      </p>
      {consultancy?.website_url && (
        <div className='flex flex-row items-center bg-[#0A6FA7] text-white rounded-lg p-2 cursor-pointer'>
          <a
            href={consultancy.website_url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center'
          >
            Visit Website
            <FaArrowRight className='ml-2' />
          </a>
        </div>
      )}
    </div>
  )
}

export default ContactNow
