'use client'

import Link from 'next/link'

const DegreeCard = ({ degree }) => {
  const level = degree.programlevel?.title
  const faculty = degree.programfaculty?.title

  return (
    <article className='bg-white rounded-xl border border-gray-100 p-5 flex flex-col hover:border-gray-200 hover:shadow-sm transition-all duration-200'>
      <h2 className='text-base font-semibold text-gray-900 line-clamp-2 mb-2'>
        {degree.title}
      </h2>
      {(level || faculty) && (
        <p className='text-sm text-gray-600 mb-3'>
          {[level, faculty].filter(Boolean).join(' · ')}
        </p>
      )}
      {(degree.duration || degree.credits) && (
        <p className='text-xs text-gray-400 mb-4'>
          {[degree.duration, degree.credits].filter(Boolean).join(' · ')}
        </p>
      )}
      <div className='mt-auto pt-3 border-t border-gray-50'>
        <Link
          href={`/degree/${degree.slugs}`}
          className='block py-2 rounded-lg text-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors'
        >
          View
        </Link>
      </div>
    </article>
  )
}

export default DegreeCard
