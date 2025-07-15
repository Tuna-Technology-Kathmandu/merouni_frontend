import React from 'react'
import Link from 'next/link'

const Fcollege = ({ name, description, image, slug }) => {
  return (
    <Link href={`/colleges/${slug}`}>
      <div className='flex gap-1 flex-col min-h-28  border border-gray-300 rounded-lg shadow-md w-[16em] md:w-80 lg:w-96 ml-10 overflow-hidden hover:shadow-lg transition-shadow duration-300 mb-8'>
        <div className='w-full h-28'>
          <img
            src={image}
            alt='College'
            className='object-cover w-full h-full hover:scale-110 transition-all duration-300'
          />
        </div>
        <div className='p-4'>
          <div className='font-semibold text-lg text-gray-800 truncate'>
            {name}
          </div>
          <div className='text-black text-sm mb-4 line-clamp-3 w-3/4'>
            {description.state}
          </div>
          <Link
            href={`/colleges/apply/${slug}`}
            className='mt-auto px-4 py-2 bg-[#387CAE] text-white rounded-lg inline-block text-center transition duration-200 w-1/2'
          >
            Apply
          </Link>
        </div>
      </div>
    </Link>
  )
}

export default Fcollege
