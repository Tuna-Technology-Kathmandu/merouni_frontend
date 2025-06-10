import React from 'react'
// import GoogleMap from './../GoogleMap'

const AddressSection = ({ college }) => {
  console.log(college)
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Address</h2>

      {/* <div className=' w-full bg-slate-200 h-[200px] rounded-lg mt-12 max-[1120px]:mt-9'>
        <GoogleMap mapUrl={college.google_map_url} />
      </div> */}

      <div className='w-full mt-7 grid grid-cols-3 gap-4 max-[550px]:grid-cols-2 max-[400px]:grid-cols-1 '>
        <div className=' text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
          <p className='text-xs md:text-sm lg:text-base font-semibold'>
            Country
          </p>
          <p className='text-xs md:text-[13px] font-medium lg:text-[15px] mt-2'>
            {college?.collegeAddress?.country || 'N/A'}
          </p>
        </div>
        <div className=' text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
          <p className='text-xs md:text-sm lg:text-base font-semibold'>
            District
          </p>
          <p className='text-xs md:text-[13px] font-medium lg:text-[15px] mt-2'>
            {college?.collegeAddress?.state || 'N/A'}
          </p>
        </div>
        <div className='text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
          <p className='text-xs md:text-sm lg:text-base font-semibold'>City</p>
          <p className='text-xs md:text-[13px] font-medium lg:text-[15px] mt-2'>
            {college?.collegeAddress?.city || 'N/A'}
          </p>
        </div>
        <div className='text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
          <p className='text-xs md:text-sm lg:text-base font-semibold'>
            Street
          </p>
          <p className='text-xs md:text-[13px] font-medium lg:text-[15px] mt-2'>
            {college?.collegeAddress?.street || 'N/A'}
          </p>
        </div>
        <div className='text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
          <p className='text-xs md:text-sm lg:text-base font-semibold'>
            Postal Code
          </p>
          <p className='text-xs md:text-[13px] font-medium lg:text-[15px] mt-2'>
            {college?.collegeAddress?.postal_code || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AddressSection

//  <p className="text-xs md:text-sm lg:text-base font-semibold w-1/3 ">Country:<span className="text-xs md:text-[13px] font-medium lg:text-[15px] ml-7">{college?.collegeAddress?.country || 'N/A'}</span></p>
//                 <p className="text-xs md:text-sm lg:text-base font-semibold w-1/3">Country:<span className="text-xs md:text-[13px] font-medium lg:text-[15px] ml-2">{college?.collegeAddress?.country || 'N/A'}</span></p>
//                 <p className="text-xs md:text-sm lg:text-base font-semibold w-1/3">Country:<span className="text-xs md:text-[13px] font-medium lg:text-[15px] ml-2">{college?.collegeAddress?.country || 'N/A'}</span></p>
//                 <p className="text-xs md:text-sm lg:text-base font-semibold">Country:<span className="text-xs md:text-[13px] font-medium lg:text-[15px] ml-2">{college?.collegeAddress?.country || 'N/A'}</span></p>
//                 <p className="text-xs md:text-sm lg:text-base font-semibold">Country:<span className="text-xs md:text-[13px] font-medium lg:text-[15px] ml-2">{college?.collegeAddress?.country || 'N/A'}</span></p>
