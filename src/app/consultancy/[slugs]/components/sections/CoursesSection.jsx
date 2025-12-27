import React from 'react'

const CoursesSection = ({ consultancy }) => {
  const courses = consultancy?.consultancyCourses || []

  if (courses.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>
        Offered Courses
      </h2>
      {courses.length > 0 ? (
        <div className='mt-7 max-[1120px]:mt-5 max-md:mt-4'>
          <ul className='list-disc list-inside space-y-2 text-gray-800 text-xs md:text-sm lg:text-base'>
            {courses.map((course, index) => (
              <li key={index} className='font-medium'>
                {course.title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className='text-gray-700 mt-9 max-[1120px]:mt-6 leading-7 text-xs md:text-sm lg:text-base'>
          No courses available at the moment.
        </p>
      )}
    </div>
  )
}

export default CoursesSection
