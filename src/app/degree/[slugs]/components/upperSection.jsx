import React from 'react'
import { PiLineVerticalThin } from 'react-icons/pi'

const ImageSection = ({ degree }) => {
  return (
    <div className='flex flex-col items-center w-full'>
      <div className='w-full'>
        <div className='h-[25vh] w-full md:h-[400px] relative'>
          <img
            src={'/images/degreeHero.webp'}
            alt='College Photo'
            className='object-cover w-full h-full'
          />
          <div className='absolute w-full h-full inset-0 bg-black/25 z-10'></div>
        </div>

        <div className='flex flex-row bg-[#30AD8F] bg-opacity-5 h-[110px] mb-20 items-center px-[75px] max-md:px-[30px]'>
          <div className=''>
            <h2 className='font-bold text-2xl leading-10'>
              {degree?.title || ''}
            </h2>
          </div>
        </div>
      </div>

      <div className=' w-[1000px] max-[1096px]:w-full bg-[#30AD8F] bg-opacity-10 text-black rounded-md flex md:flex-row md:gap-0 gap-5  mb-8  items-center justify-center flex-col px-[75px] max-md:px-[30px] h-auto md:h-[150px] p-8'>
        <div className=' flex flex-col items-center md:pr-14'>
          {/* <p className="text-sm font-bold">Starts</p> */}
          <img src='/images/course_year.png' alt='year' className='w-8' />
          <p className='whitespace-nowrap'>{degree?.duration || ''}</p>
        </div>
        <div className='md:flex items-center pr-5 hidden'>
          <PiLineVerticalThin size={60} />
        </div>
        <div className=' flex flex-col items-center md:pl-14 md:pr-14'>
          {/* <p className="text-sm font-bold">Starts</p> */}
          <img
            src='/images/course_faculty.png'
            alt='faculty'
            className='w-10'
          />
          <p className=' whitespace-nowrap'>
            {degree?.programfaculty?.title || ''}
          </p>
        </div>
        <div className='md:flex hidden items-center pr-5'>
          <PiLineVerticalThin size={60} />
        </div>
        <div className=' flex flex-col items-center md:pl-14'>
          {/* <p className="text-sm font-bold">Ends</p> */}
          <img src='/images/course_hour.png' alt='level' className='w-10' />

          <p className='whitespace-nowrap'>{degree?.delivery_mode || ''}</p>
        </div>
      </div>

      <div className=' bg-opacity-10 text-black rounded-md flex flex-col w-full  mb-8 pt-10 px-[75px] max-md:px-[30px]'>
        <h2 className='font-bold text-2xl md:text-3xl leading-10 mb-6 text-center md:text-left'>
          Why Study this course?
        </h2>
        <p className='pt-6 leading-7 text-justify '>
          {degree?.learning_outcomes || ''}
        </p>
      </div>
    </div>
  )
}

export default ImageSection
