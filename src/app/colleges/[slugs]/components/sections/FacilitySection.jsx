import React from 'react'

const FacilitySection = ({ college }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold mb-'>
        Facilities
      </h2>
      <div className='mt-7 max-[1120px]:mt-5 max-md:mt-4 space-y-7'>
        {college?.collegeFacility.map((item, index) => {
          return (
            <div key={index} className='space-y-4'>
              <h1 className='text-xs md:text-sm lg:text-base mb-4 font-semibold'>
                {item?.title}
              </h1>
              <div className='w-full sm:w-[50%] bg-red-400 h-40'>
                <img
                  src={item?.icon || 'https://placehold.co/600x400'}
                  className='w-full h-full object-cover'
                ></img>
              </div>
              <p className='text-gray-800 mt-9 max-[1120px]:mt-5 leading-7 max-md:leading-5 text-xs md:text-sm lg:text-base text-justify'>
                {item?.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FacilitySection
