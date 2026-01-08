'use client'
import React from 'react'
import CategoryCard from './CategoryCard'

const CategoryGrid = ({ categories, onCategoryClick }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 mb-10'>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onClick={() => onCategoryClick(category)}
        />
      ))}
      {/* Unlisted/Others Card for materials without category */}
      <div
        onClick={() => onCategoryClick({ id: 'unlisted', name: 'Unlisted' })}
        className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105 cursor-pointer border-2 border-dashed border-gray-300'
      >
        <div className='p-8 text-center'>
          <div className='w-20 h-20 mx-auto mb-4 bg-gray-400 rounded-full flex items-center justify-center'>
            <span className='text-white text-2xl font-bold'>?</span>
          </div>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>Unlisted</h2>
          <p className='text-sm text-gray-600 line-clamp-2'>
            Materials without a category
          </p>
        </div>
      </div>
    </div>
  )
}

export default CategoryGrid
