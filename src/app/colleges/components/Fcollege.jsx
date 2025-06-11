import React from 'react'
import Link from 'next/link'

const Fcollege = ({ name, description, image, slug }) => {
  return (
    <Link href={`/colleges/${slug}`}>
      <div className='flex gap-1 flex-col min-h-52 bg-[#e2ece9] border border-gray-300 rounded-lg shadow-md w-[16em] md:w-80 lg:w-96 ml-10 p-4  hover:shadow-lg transition-shadow duration-300 mb-8'>
        <div className='flex flex-col-reverse mb-3 justify-between '>
          <div className='font-semibold text-lg text-gray-800 truncate'>
            {name}
          </div>
          <img
            src={image}
            alt='College'
            className='w-12 h-12 rounded-full object-cover mr-4'
          />
        </div>
        <div className='text-black text-sm mb-4 line-clamp-3 w-3/4 min-h-16'>
          {description}
        </div>
        <Link
          href={`/colleges/apply/${slug}`}
          className='mt-auto px-4 py-2 bg-[#387CAE] text-white rounded-lg inline-block text-center transition duration-200 w-1/2'
        >
          Apply
        </Link>
      </div>
    </Link>
  )
}

export default Fcollege
