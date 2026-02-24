import React from 'react'
const FacilitySection = ({ college }) => {
  if (!college?.facilities || college.facilities.length === 0) {
    return null
  }

  return (
    <div className='bg-white rounded-xl border p-4 sm:p-6'>
      <h2 className='text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6'>Facilities</h2>
      <div className='flex flex-row overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0 no-scrollbar sm:grid sm:grid-cols-2 gap-4 sm:gap-8'>
        {college.facilities.map((item, index) => {
          return (
            <div
              key={index}
              className='group flex flex-col p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all duration-300 min-w-[200px] sm:min-w-0'
            >
              <div className='flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4'>
                {item?.icon && (
                  <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-white flex-shrink-0 p-1.5 sm:p-2 border border-gray-100 group-hover:bg-[#30AD8F]/5 transition-colors'>
                    <img
                      src={item.icon}
                      alt={item?.title}
                      className='w-full h-full object-contain'
                    />
                  </div>
                )}

                <h3 className='text-sm sm:text-base font-semibold text-gray-800 group-hover:text-[#30AD8F] transition-colors line-clamp-1'>
                  {item?.title}
                </h3>
              </div>
              <p className='text-gray-500 leading-relaxed text-xs sm:text-sm line-clamp-2 sm:line-clamp-none'>
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
