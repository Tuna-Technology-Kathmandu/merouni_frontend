import { useRouter } from 'next/navigation'
import React from 'react'

const ProgramSection = ({ college }) => {
  const route = useRouter()

  const handleApply = (id) => {
    route.push(`/colleges/apply/${college.slugs}/${id}`)
  }
  const handleDegree = (degree) => {
    route.push(`/degree/${degree}`)
    console.log(degree)
  }
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>
        Offered Programs
      </h2>
      {college?.collegeCourses.length > 0 ? (
        college.collegeCourses.map((course, index) => (
          <div key={index} className='mt-7 max-[1120px]:mt-5 max-md:mt-4'>
            <h2
              onClick={() => handleDegree(course?.program?.title)}
              className='text-xs md:text-sm lg:text-base mb-4 font-semibold cursor-pointer hover:text-[#2981B2]'
            >
              {course.program.title}
            </h2>
            <button
              onClick={() => {
                handleApply(course.id)
              }}
              type='button'
              className='bg-[#2981B2] text-[11px] md:text-[15px] lg:text-[15px] p-1 px-2 rounded-lg text-white
        hover:scale-105 transition-all duration-300 ease-in-out'
            >
              Apply Now
            </button>
          </div>
        ))
      ) : (
        <p className='text-gray-700 mt-9 max-[1120px]:mt-6 leading-7 text-xs md:text-sm lg:text-base'>
          Please visit us later...
        </p>
      )}

      <h2 className='text-[13px] md:text-[15px] lg:text-[17px] font-bold mt-16'>
        Institution Type
      </h2>
      <p className='text-gray-700 mt-4 text-xs md:text-sm lg:text-base'>
        {college?.institute_type}
      </p>
    </div>
  )
}

export default ProgramSection
