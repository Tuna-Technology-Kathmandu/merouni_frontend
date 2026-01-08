'use client'
import React from 'react'

const CategoryCard = ({ category, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105 cursor-pointer'
    >
      <div className='p-8 text-center'>
        <div className='w-20 h-20 mx-auto mb-4 bg-[#0A70A7] rounded-full flex items-center justify-center'>
          <span className='text-white text-2xl font-bold'>
            {category.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          {category.name}
        </h2>
        {category.description && (
          <p className='text-sm text-gray-600 line-clamp-2'>
            {category.description}
          </p>
        )}
      </div>
    </div>
  )
}

export default CategoryCard
