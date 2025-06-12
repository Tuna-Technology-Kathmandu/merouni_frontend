import React from 'react'

const ProgramSection = ({ college }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>
        Offered Programs
      </h2>
      {college?.collegeCourses.length > 0 ? (
        college.collegeCourses.map((course, index) => (
          <div key={index} className='mt-7 max-[1120px]:mt-5 max-md:mt-4'>
            <h2 className='text-xs md:text-sm lg:text-base mb-4 font-semibold'>
              {course.program.title}
            </h2>
            {/* <button
              type='button'
              className='bg-[#2981B2] text-[11px] md:text-[15px] lg:text-[15px] p-1 px-2 rounded-lg text-white
        hover:scale-105 transition-all duration-300 ease-in-out'
            >
              Apply Now
            </button> */}
          </div>
        ))
      ) : (
        <p className='text-gray-700 mt-9 max-[1120px]:mt-6 leading-7 text-xs md:text-sm lg:text-base'>
          Please visit us later...
        </p>
      )}
    </div>
  )
}

export default ProgramSection
