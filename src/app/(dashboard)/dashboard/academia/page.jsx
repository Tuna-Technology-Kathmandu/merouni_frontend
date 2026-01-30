import AcademiaCard from '../../../../ui/molecules/AcademiaCard'
import React from 'react'

const page = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
        <AcademiaCard
          title='Courses'
          img='/images/logo.png'
          link='/dashboard/courses'
        />
        <AcademiaCard
          title='Exams'
          img='/images/logo.png'
          link='/dashboard/exams'
        />
        <AcademiaCard
          title='Program'
          img='/images/logo.png'
          link='/dashboard/program'
        />
        <AcademiaCard
          title='Scholarship'
          img='/images/logo.png'
          link='/dashboard/scholarship'
        />
      </div>
    </div>
  )
}

export default page
