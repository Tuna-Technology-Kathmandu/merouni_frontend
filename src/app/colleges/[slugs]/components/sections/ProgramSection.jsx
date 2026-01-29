import { useRouter } from 'next/navigation'
import React from 'react'

const ProgramSection = ({ college }) => {
  const route = useRouter()

  const handleApply = (id) => {
    route.push(`/colleges/apply/${college.slugs}/${id}`)
  }
  const handleDegree = (degree) => {
    route.push(`/degree/${degree}`)
  }
  return (
    <div className='max-w-4xl'>
      <h2 className='text-xl md:text-2xl font-bold mb-8 text-gray-900'>
        Offered Programs
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6'>
        {college?.collegeCourses.length > 0 ? (
          college.collegeCourses.map((course, index) => (
            <div key={index} className='group bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between'>
              <div>
                <h3
                  onClick={() => handleDegree(course?.program?.title)}
                  className='text-base md:text-lg font-bold text-gray-800 cursor-pointer group-hover:text-[#0A6FA7] transition-colors leading-snug mb-4'
                >
                  {course.program.title}
                </h3>
              </div>
              <button
                onClick={() => handleApply(course.id)}
                type='button'
                className='w-full sm:w-max bg-[#0A6FA7] hover:bg-[#085e8a] text-white text-sm font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-md'
              >
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <p className='text-gray-400 italic text-sm md:text-base'>
            No programs offered at the moment.
          </p>
        )}
      </div>

      <div className='mt-16 pt-8 border-t border-gray-100'>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>
          Institution Type
        </h3>
        <p className='text-gray-600 font-medium'>
          {college?.institute_type}
        </p>
      </div>
    </div>
  )
}

export default ProgramSection
