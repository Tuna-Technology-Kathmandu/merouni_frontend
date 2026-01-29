import React from 'react'
const FacilitySection = ({ college }) => {
  return (
    <div className='max-w-4xl'>
      <h2 className='text-xl md:text-2xl font-bold mb-8 text-gray-900'>
        Facilities
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8'>
        {college?.collegeFacility.map((item, index) => {
          return (
            <div key={index} className='group flex flex-col p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300'>
              <div className='flex items-center gap-4 mb-4'>
                {item?.icon && (
                  <div className='w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 p-2 group-hover:bg-[#30AD8F]/5 transition-colors'>
                    <img
                      src={item.icon}
                      alt={item?.title}
                      className='w-full h-full object-contain'
                    />
                  </div>
                )}

                <h3 className='text-base md:text-lg font-bold text-gray-800 group-hover:text-[#30AD8F] transition-colors'>
                  {item?.title}
                </h3>
              </div>
              <p className='text-gray-500 leading-relaxed text-sm md:text-base'>
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
