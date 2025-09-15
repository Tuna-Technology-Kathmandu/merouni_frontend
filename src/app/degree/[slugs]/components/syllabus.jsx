import React from 'react'
import he from 'he'
import Link from 'next/link'

const Syllabus = ({ degree }) => {
  // Group syllabus by year and semester
  const groupedSyllabus = degree?.syllabus?.reduce((acc, course) => {
    const year = course.year
    const semester = course.semester

    if (!acc[year]) acc[year] = {}

    if (semester === 0) {
      if (!acc[year].yearly) acc[year].yearly = []
      acc[year].yearly.push(course)
    } else {
      if (!acc[year][semester]) acc[year][semester] = []
      acc[year][semester].push(course)
    }
    return acc
  }, {})

  return (
    <section className='bg-gradient-to-b from-[#f8fafc] to-[#edf6f9] pt-10 px-6 mt-12 rounded-xl'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-xl md:text-2xl font-extrabold text-gray-800 text-center mb-12'>
          📘 Syllabus
        </h2>

        {groupedSyllabus &&
          Object.entries(groupedSyllabus)
            .sort(([a], [b]) => a - b)
            .map(([year, semesters]) => (
              <div
                key={year}
                className='mb-12 pb-8 border-b border-gray-300 last:border-none'
              >
                {/* Year heading */}
                <p className='text-xl font-bold text-center text-[#0A6FA7] mb-8'>
                  Year {year}
                </p>

                {/* Yearly courses */}
                {semesters.yearly && (
                  <div className='mb-10'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-6 text-center md:text-left'>
                      📖 Yearly Courses
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {semesters.yearly.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Semesters */}
                {Object.entries(semesters)
                  .filter(([key]) => key !== 'yearly')
                  .sort(([a], [b]) => a - b)
                  .map(([semester, courses]) => (
                    <div key={semester} className='mb-10'>
                      <h3 className='text-lg font-semibold text-gray-700 mb-6 text-center md:text-left'>
                        📚 Semester {semester}
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {courses.map((course) => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
      </div>
    </section>
  )
}

const CourseCard = ({ course }) => {
  // Decode + truncate description
  const decodedContent = course?.programCourse?.description
    ? he.decode(course.programCourse.description.slice(0, 140) + '...')
    : ''

  return (
    <Link href={`/degree/single-subject/${course?.programCourse.slugs}`}>
      <div className='bg-white p-5 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group'>
        {/* Title */}
        <h2 className='text-lg font-semibold text-gray-800 mb-1 group-hover:text-[#0A6FA7] transition'>
          {course?.programCourse?.title}
        </h2>
        <p className='text-sm text-gray-600 mb-3'>
          Credits:{' '}
          <span className='font-medium'>
            {course?.programCourse?.credits || 'N/A'}
          </span>
        </p>

        {/* Elective badge */}
        {course.is_elective && (
          <span className='inline-block mt-4 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full'>
            Elective
          </span>
        )}
      </div>
    </Link>
  )
}

export default Syllabus
