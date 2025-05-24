import React from 'react'
import { FiMapPin } from 'react-icons/fi'

const Hero = () => {
  return (
    <div className='relative'>
      <img
        src='/images/eventsdesc.png'
        alt='events desc'
        className='w-full h-[70vh] object-cover'
      />
      <div className='left-36 absolute top-1/2 transform -translate-y-1/2 text-white text-4xl font-extrabold w-[800px]'>
        <div className='text-5xl'>NEXT-GEN AI:</div>
        <div className='text-6xl my-2'>SHAPING TOMORROW</div>
        <div className='font-medium text-sm my-6'>
          By - Junior Entrepreneurship Circle (JEC)
        </div>
        <div className=''>
          <div className='font-medium text-sm my-6'>
            LBEF College, Maitidevi{' '}
          </div>
          <div className='flex gap-2 font-medium text-sm my-6'>
            <div>
              <FiMapPin />
            </div>
            <div>Map</div>
            <img src='' alt='' />
          </div>
        </div>
      </div>
      <div className='space-y-4 text-[#b0b2c3] absolute left-8 top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col'>
        <div className='text-black font-bold text-sm'>Share</div>
        <img src='/images/fb.png' alt='Facebook' className='w-6' />
        <img src='/images/insta.png' alt='Instagram' className='w-6' />
        <img src='/images/linkedin.png' alt='LinkedIn' className='w-6' />
        <img src='/images/twitter.png' alt='Twitter' className='w-6' />
      </div>
    </div>
  )
}

export default Hero
