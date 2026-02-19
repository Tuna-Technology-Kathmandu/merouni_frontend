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

  if (!college?.collegeCourses || college.collegeCourses.length === 0) {
    return null
  }

  return (
    <div className='bg-white rounded-xl border p-6'>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>
        Offered Programs
      </h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6'>
        {college.collegeCourses.map((course, index) => (
          <div
            key={index}
            className='group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between'
          >
            <div>
              <h3
                onClick={() => handleDegree(course?.program?.title)}
                className='text-base font-semibold text-gray-800 cursor-pointer group-hover:text-[#0A6FA7] transition-colors leading-snug mb-4'
              >
                {course.program.title}
              </h3>
            </div>
            <button
              onClick={() => handleApply(course.id)}
              type='button'
              className='w-full sm:w-max bg-[#0A6FA7] hover:bg-[#085e8a] text-white text-sm font-medium py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-sm'
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProgramSection
