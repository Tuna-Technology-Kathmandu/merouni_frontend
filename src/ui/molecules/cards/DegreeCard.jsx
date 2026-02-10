'use client'

import Link from 'next/link'

const DegreeCard = ({ degree }) => {
  const slug = degree.slug ?? degree.slugs
  const isProgramShape = !!degree.programlevel || !!degree.programfaculty

  return (
    <article className='bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col hover:border-gray-200 hover:shadow-sm transition-all duration-200 h-full'>
      <div className='aspect-[3/2] w-full bg-gray-50 flex items-center justify-center overflow-hidden'>
        <img
          src={degree.cover_image || degree.featured_image || '/images/logo.png'}
          alt={degree.title}
          className={
            degree.cover_image || degree.featured_image
              ? 'w-full h-full object-cover'
              : 'w-2/3 h-auto object-contain opacity-50'
          }
        />
      </div>
      <div className='p-6 flex flex-col flex-1'>
        {degree.short_name && (
          <p className='text-xs font-semibold text-[#0A6FA7] uppercase tracking-wide mb-1'>
            {degree.short_name}
          </p>
        )}
        <h2 className='text-base font-semibold text-gray-900 line-clamp-2 mb-2'>
          {degree.title}
        </h2>
        {isProgramShape && (
          <>
            {(degree.programlevel?.title || degree.programfaculty?.title) && (
              <p className='text-sm text-gray-600 mb-3'>
                {[degree.programlevel?.title, degree.programfaculty?.title]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
            {(degree.duration || degree.credits) && (
              <p className='text-xs text-gray-400 mb-4'>
                {[degree.duration, degree.credits].filter(Boolean).join(' · ')}
              </p>
            )}
          </>
        )}
        <div className='mt-auto pt-3 border-t border-gray-50'>
          <Link
            href={`/degree/${slug}`}
            className='block py-2 rounded-lg text-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors'
          >
            View
          </Link>
        </div>
      </div>
    </article>
  )
}

export default DegreeCard
