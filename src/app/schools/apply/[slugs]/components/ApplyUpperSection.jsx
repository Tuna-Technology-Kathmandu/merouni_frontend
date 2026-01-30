import clsx from 'clsx'
import { BsGlobe2 } from 'react-icons/bs'
import { FaPhoneAlt, FaUniversity } from 'react-icons/fa'
import { IoIosGlobe } from 'react-icons/io'
import { LiaUniversitySolid } from 'react-icons/lia'
import { PiLineVerticalThin } from 'react-icons/pi'

const shimmerStyle = 'animate-pulse bg-slate-300'

const ApplyImageSection = ({ college, loading }) => {
  return (
    <>
      <div className='flex flex-col items-center w-full'>
        <div className='w-full'>
          <div className='h-[450px] w-full flex justify-center items-center'>
            {loading ? (
              <div className={clsx(shimmerStyle, 'w-full h-full')} />
            ) : (
              <img
                src={college?.featured_img || '/images/degreeHero.webp'}
                className='object-cover w-full h-full'
                alt='College Photo'
                loading='lazy'
              />
            )}
          </div>
          <div className='flex flex-row bg-[#30AD8F] bg-opacity-5 h-[110px] justify-center items-center p-0 mt-4 sm:mt-0'>
           
            <div className='w-full flex justify-center flex-col items-center'>
              <h2 className='font-bold text-3xl leading-10'>{college?.name}</h2>
              <div className='flex flex-row justify-center'>
                <p className='font-semibold text-lg'>
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
        <div className='sm:px-24 px-12 mt-8  w-full'>
          <div className='bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex items-center justify-center md:flex-wrap flex-col md:flex-row sm:justify-between md:justify-around md:gap-10 mb-8  items-left w-full l:w-[80%] gap-6 lg:gap-6 p-7 '>
            <div className='flex flex-col items-center gap-2 text-center '>
              <FaUniversity size={30} />
              <p className='md:max-w-36 sm:text-base text-xs font-semibold'>
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
              <p className='whitespace-nowrap  sm:text-base text-xs font-semibold'>
                +2, Bachelor Program
              </p>
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
              <a href={college?.website_url} target='_blank'>
                <p className='whitespace-nowrap hover:underline hover:text-blue-500 hover:cursor-pointer sm:text-base text-xs font-semibold'>
                  {college?.website_url || 'www.check.com'}
                </p>
              </a>
            </div>
          </div>
        </div>

        <div className='space-y-4 text-[#b0b2c3] fixed left-8 top-[30%] md:-translate-y-1 bg-white p-2 rounded-xl flex items-center flex-col'>
          <div className='text-black font-bold text-sm'>Share</div>
          <img src='/images/fb.png' alt='Facebook' className='w-6' />
          <img src='/images/insta.png' alt='Instagram' className='w-6' />
          <img src='/images/linkedin.png' alt='LinkedIn' className='w-6' />
          <img src='/images/twitter.png' alt='Twitter' className='w-6' />
        </div>
      </div>
    </>
  )
}

export default ApplyImageSection