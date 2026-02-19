import React from 'react'
const FacilitySection = ({ college }) => {
  if (!college?.facilities || college.facilities.length === 0) {
    return null
  }

  return (
    <div className='bg-white rounded-xl border p-6'>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>Facilities</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8'>
        {college.facilities.map((item, index) => {
          return (
            <div
              key={index}
              className='group flex flex-col p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-all duration-300'
            >
              <div className='flex items-center gap-4 mb-4'>
                {item?.icon && (
                  <div className='w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 p-2 border border-gray-100 group-hover:bg-[#30AD8F]/5 transition-colors'>
                    <img
                      src={item.icon}
                      alt={item?.title}
                      className='w-full h-full object-contain'
                    />
                  </div>
                )}

                <h3 className='text-base font-semibold text-gray-800 group-hover:text-[#30AD8F] transition-colors'>
                  {item?.title}
                </h3>
              </div>
              <p className='text-gray-500 leading-relaxed text-sm'>
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
