'use client'

import React from 'react'
import { BookOpen } from 'lucide-react'

const CoursesSection = ({ consultancy }) => {
  const courses = consultancy?.consultancyCourses || []

  if (courses.length === 0) {
    return null
  }

  return (
    <div className='max-w-4xl'>
      <h2 className='text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2'>
        <BookOpen className='w-5 h-5 text-[#0A6FA7]' />
        Offered Courses
      </h2>
      <ul className='list-disc list-inside space-y-2 text-gray-600 text-sm'>
        {courses.map((course, index) => (
          <li key={index}>{course.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default CoursesSection
