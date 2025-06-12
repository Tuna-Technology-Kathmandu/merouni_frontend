import React from 'react'
import { IoIosGlobe } from 'react-icons/io'
import { PiLineVerticalThin } from 'react-icons/pi'
import { FaUniversity, FaPhoneAlt } from 'react-icons/fa'
import { LiaUniversitySolid } from 'react-icons/lia'
import { BsGlobe2 } from 'react-icons/bs'

const ImageSection = ({ college }) => {
  return (
    <>
      <div className='flex flex-col items-center relative gap-16 max-md:gap-12'>
        {/* college image.names and location in cirlce */}
        <div className='w-full'>
          <img
            src={
              college.featured_img || 'https://dummyimage.com/600x180/000/fff'
            }
            alt='College Photo'
            className='h-[25vh] w-full md:h-[400px] object-cover'
          />
          <div className='flex flex-row lg:h-[95px] bg-[#30AD8F] bg-opacity-5 items-center p-0 px-8 sm:px-14 md:px-24'>
            {/* Logo Container */}
            <div className='flex items-center justify-center rounded-full bg-white -translate-y-8 overflow-hidden w-24 h-24 md:w-32 md:h-32'>
              <img
                src={
                  college.college_logo ||
                  `https://avatar.iran.liara.run/username?username=${college?.name}`
                }
                alt='College Logo'
                className='object-cover w-full h-full rounded-full aspect-square' // Ensures the image is circular
              />
            </div>
            <div className='ml-4'>
              <h2 className='font-bold text-lg lg:text-4xl lg:leading-[50px]'>
                {college?.name}
              </h2>
              <div className='flex flex-row '>
                <p className='font-semibold text-sm lg:text-lg '>
                  {college?.collegeAddress?.street},{' '}
                  {college?.collegeAddress?.city}
                </p>
                <span>
                  <IoIosGlobe size={25} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* college all details */}
        <div className='sm:px-24 px-12  w-full'>
          <div className='bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex items-center justify-center flex-wrap sm:justify-between md:justify-around md:gap-10  items-left w-full l:w-[80%] gap-6 lg:gap-6 p-7 '>
            <div className='flex flex-col items-center gap-2 text-center '>
              <FaUniversity size={30} />
              <p className='max-w-36 sm:text-base text-xs font-semibold'>
                {college?.university?.fullname || 'N/A'}
              </p>
            </div>
            <div className=' items-center hidden xl:block'>
              <PiLineVerticalThin size={60} />
            </div>
            <div className='flex flex-col items-center gap-2 text-center  '>
              <LiaUniversitySolid size={30} />
              <p className='whitespace-nowrap sm:text-base text-xs font-semibold'>
                {college?.institute_type || 'N/A'}
              </p>
            </div>
            <div className='items-center hidden xl:block'>
              <PiLineVerticalThin size={60} />
            </div>
            <div className='flex flex-col items-center gap-2 text-center '>
              <img src='/images/level.png' alt='level' className='w-10' />
              {JSON.parse(college?.institute_level || '[]').map(
                (level, index) => (
                  <div key={index}>
                    <p className='max-w-36 sm:text-base text-xs font-semibold'>
                      {level}
                    </p>
                  </div>
                )
              )}
            </div>
            <div className='items-center hidden xl:block'>
              <PiLineVerticalThin size={60} />
            </div>
            <div className='flex flex-col items-center gap-2 text-center '>
              <FaPhoneAlt size={25} />
              {(college?.collegeContacts || []).map((contact, index) => (
                <div key={index} className='flex flex-row'>
                  <p className='sm:text-base text-xs font-semibold'>
                    {contact?.contact_number || ''}
                  </p>
                </div>
              ))}
            </div>
            <div className='items-center hidden xl:block'>
              <PiLineVerticalThin size={60} />
            </div>
            <div className='flex flex-col items-center gap-2 text-center '>
              {/* <IoMdMail size={25} /> */}
              <BsGlobe2 size={25} />
              <a href={college.website_url} target='_blank'>
                <p className='whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer sm:text-base text-xs font-semibold'>
                  {college.website_url || 'www.check.com'}
                </p>
              </a>
            </div>
          </div>
        </div>
        <div className='space-y-4 text-[#b0b2c3] fixed right-4 top-[30%] lg:block md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col'>
          <div className='text-black font-bold text-sm'>Share</div>
          <img src='/images/fb.png' alt='Facebook' className='w-6 mx-auto' />
          <img
            src='/images/insta.png'
            alt='Instagram'
            className='w-6  mx-auto'
          />
          <img
            src='/images/linkedin.png'
            alt='LinkedIn'
            className='w-6  mx-auto'
          />
          <img
            src='/images/twitter.png'
            alt='Twitter'
            className='w-6  mx-auto'
          />
        </div>
      </div>
    </>
  )
}

export default ImageSection
