import React from 'react'
import { PiLineVerticalThin } from 'react-icons/pi'

const ImageSection = ({ degree }) => {
  console.log(degree)
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
            <h2 className='font-bold text-lg sm:text-2xl md:leading-10'>
              {degree?.title || ''}
            </h2>
            <p className='text-sm md:text-base text-gray-700 mt-2'>
              {degree?.code || ''}
            </p>
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

      {/* careers opportunities */}
      {degree?.careers && (
        <div className=' bg-opacity-10 text-black rounded-md flex flex-col w-full  mb-8 pt-8 px-[75px] max-md:px-[30px]'>
          <h2 className='font-bold text-lg md:text-xl leading-10 mb-2 text-center md:text-left'>
            Career Opportunities
          </h2>
          <p className='pt-2 leading-7 text-justify'>{degree?.careers || ''}</p>
        </div>
      )}

      {/* eligibility criteria */}
      {degree?.eligibility_criteria && (
        <div className=' bg-opacity-10 text-black rounded-md flex flex-col w-full  mb-8 pt-8 px-[75px] max-md:px-[30px]'>
          <h2 className='font-bold text-lg md:text-xl leading-10 mb-2 text-center md:text-left'>
            Eligibility Criteria
          </h2>
          <p className='pt-2 leading-7 text-justify'>
            {degree?.eligibility_criteria}
          </p>
        </div>
      )}

      {/* eligibility criteria */}
      {degree?.curriculum && (
        <div className=' bg-opacity-10 text-black rounded-md flex flex-col w-full  mb-8 pt-8 px-[75px] max-md:px-[30px]'>
          <h2 className='font-bold text-lg md:text-xl leading-10 mb-2 text-center md:text-left'>
            Curriculum
          </h2>
          <p className='pt-2 leading-7 text-justify'>{degree?.curriculum}</p>
        </div>
      )}

      {/* additional informaiton */}
      {/* additional information */}
      <div className='bg-opacity-10 text-black rounded-md flex flex-col w-full mb-8 pt-8 px-[75px] max-md:px-[30px]'>
        <h2 className='font-bold text-lg md:text-xl leading-10 mb-2 text-center md:text-left'>
          Additional Information
        </h2>

        {degree?.credits && (
          <div className='flex gap-3 items-center pt-2'>
            <p className='font-medium'>Credits:</p>
            <p>{degree.credits}</p>
          </div>
        )}

        {degree?.programlevel?.title && (
          <div className='flex gap-3 items-center pt-1'>
            <p className='font-medium'>Level:</p>
            <p>{degree.programlevel.title}</p>
          </div>
        )}

        {degree?.language && (
          <div className='flex gap-3 items-center pt-1'>
            <p className='font-medium'>Language:</p>
            <p>{degree.language}</p>
          </div>
        )}

        {degree?.programexam?.title && (
          <div className='flex gap-3 items-center pt-1'>
            <p className='font-medium'>Entrance Exam:</p>
            <p>{degree.programexam.title}</p>
          </div>
        )}

        {degree?.fee && (
          <div className='flex gap-3 items-center pt-1'>
            <p className='font-medium'>Fee Structure:</p>
            <p>{degree.fee}</p>
          </div>
        )}

        {degree?.delivery_type && (
          <div className='flex gap-3 items-center pt-1'>
            <p className='font-medium'>Delivery Type:</p>
            <p>{degree.delivery_type}</p>
          </div>
        )}

        {degree?.programscholarship?.name && (
          <div className='flex gap-3 items-center pt-1'>
            <p className='font-medium'>Scholarship:</p>
            <p>{degree.programscholarship.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageSection
