import React from 'react'
const FacilitySection = ({ college }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold mb-10'>
        Facilities
      </h2>
      <div className='mt-7 max-[1120px]:mt-5 max-md:mt-4 space-y-10'>
        {college?.collegeFacility.map((item, index) => {
          return (
            <div key={index} className='space-y-4'>
              <div className='flex items-center gap-4'>
                {item?.icon && (
                  <div className='w-10 h-10'>
                    <img
                      src={item.icon}
                      className='w-full h-full object-cover'
                    ></img>
                  </div>
                )}

                <h1 className='text-xs md:text-sm lg:text-base mb-4 font-semibold'>
                  {item?.title}
                </h1>
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
