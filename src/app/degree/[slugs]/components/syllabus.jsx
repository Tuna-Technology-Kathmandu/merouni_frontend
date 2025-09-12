import React, { useState } from 'react'
import he from 'he'
import Link from 'next/link'

const Syllabus = ({ degree }) => {
  // First group by year, then by semester
  const groupedSyllabus = degree?.syllabus?.reduce((acc, course) => {
    const year = course.year
    const semester = course.semester

    if (!acc[year]) {
      acc[year] = {}
    }

    // For semester 0 (yearly courses)
    if (semester === 0) {
      if (!acc[year].yearly) {
        acc[year].yearly = []
      }
      acc[year].yearly.push(course)
    } else {
      if (!acc[year][semester]) {
        acc[year][semester] = []
      }
      acc[year][semester].push(course)
    }

    return acc
  }, {})

  return (
    <div className='bg-[#D9D9D9] bg-opacity-20 flex flex-col items-center mt-10'>
      <h2 className='font-bold text-2xl md:text-3xl leading-10 mb-6 text-center md:text-left mt-8'>
        Syllabus
      </h2>
      <div className='flex flex-col w-full max-w-6xl px-4'>
        {groupedSyllabus &&
          Object.entries(groupedSyllabus)
            .sort(([yearA], [yearB]) => yearA - yearB)
            .map(([year, semesters]) => (
              <div
                key={year}
                className='mb-4 border-b-2 border-b-[#2981b2] pb-4'
              >
                <p className='mb-1 mt-10 text-2xl font-semibold text-center'>
                  Year {year}
                </p>

                {semesters.yearly && (
                  <div className='mb-8'>
                    <h3 className='text-lg font-medium mb-4'>Yearly Courses</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-16'>
                      {semesters.yearly.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                )}

                {Object.entries(semesters)
                  .filter(([key]) => key !== 'yearly')
                  .sort(([semesterA], [semesterB]) => semesterA - semesterB)
                  .map(([semester, courses]) => (
                    <div key={semester} className='mb-8'>
                      <h3 className='text-lg font-medium mb-4 text-center underline'>
                        Semester {semester}
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {courses.map((course) => (
                          <CourseCard key={course.id} course={course} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
      </div>
    </div>
  )
}

const CourseCard = ({ course }) => {
  // Safely handle the content decoding
  const decodedContent = course?.programCourse?.description
    ? he.decode(course.programCourse.description.slice(0, 140) + '...')
    : ''

  return (
    <Link href={`/degree/single-subject/${course?.programCourse.slugs}`}>
      <div className='bg-white p-4 rounded-2xl shadow-sm hover:-translate-y-1 transition group cursor-pointer'>
        <h2 className='text-base font-semibold group-hover:text-[#0A6FA7] transition'>
          {course?.programCourse?.title}
        </h2>
        <h3 className='text-sm text-gray-700'>
          Credits: {course?.programCourse?.credits || 'N/A'}
        </h3>

        {decodedContent && (
          <div
            dangerouslySetInnerHTML={{ __html: decodedContent }}
            className='text-gray-800 mt-4 leading-7 
            [&>iframe]:w-full 
            [&>iframe]:max-w-[calc(100vw-40px)] 
            [&>iframe]:aspect-video 
            [&>iframe]:h-auto
            [&>iframe]:rounded-lg 
            [&>iframe]:mt-4
            [&>iframe]:mx-auto
            [&>iframe]:block
            [&_table]:w-full
            [&_table]:my-4
            [&_table]:border-collapse
            [&_th]:bg-gray-100
            [&_th]:p-2
            [&_th]:text-left
            [&_th]:border
            [&_th]:border-gray-300
            [&_td]:p-2
            [&_td]:border
            [&_td]:border-gray-300
            [&_tr:nth-child(even)]:bg-gray-50
            [&_h1]:text-2xl
            [&_h1]:font-bold
            [&_h1]:mt-8
            [&_h1]:mb-4
            [&_h2]:text-xl
            [&_h2]:font-bold
            [&_h2]:mt-6
            [&_h2]:mb-3
            text-xs md:text-sm lg:text-base
            overflow-x-hidden
            [&_ol]:list-decimal 
[&_ol]:pl-8 
[&_ol]:my-4
[&_ol]:space-y-2
[&_ul]:list-disc 
[&_ul]:pl-8 
[&_ul]:my-4
[&_ul]:space-y-2
[&_li]:pl-2'
          />
        )}

        {course.is_elective && (
          <span className='inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
            Elective
          </span>
        )}
      </div>
    </Link>
  )
}

export default Syllabus
