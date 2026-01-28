'use client'
import React from 'react'
import CategoryCard from './CategoryCard'
import { Folder, Plus } from 'lucide-react'
import { GridSkeleton } from '@/components/ui/GridSkeleton'
import EmptyState from '@/components/ui/EmptyState'

const CategoryGrid = ({ categories, onCategoryClick, loading }) => {
  if (loading) {
    return <GridSkeleton className='p-4 mb-10' />
  }

  if (!loading && categories.length === 0) {
    return (
      <EmptyState
        icon={Folder}
        title='No Categories Found'
        description="We couldn't find any material categories at the moment. Please check back later or try a different section."
        className='w-full'
      />
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 mb-16'>
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
        className='group relative bg-white border-2 border-dashed border-gray-200 hover:border-[#0A70A7] hover:bg-blue-50/30 rounded-2xl overflow-hidden transition-all p-6 flex flex-col items-center text-center cursor-pointer'
      >
        <div className='w-20 h-20 mb-6 bg-gray-100 group-hover:bg-[#0A70A7] group-hover:rotate-6 rounded-3xl flex items-center justify-center transition-all duration-300'>
          <Plus className='w-8 h-8 text-gray-400 group-hover:text-white' />
        </div>
        <h2 className='text-xl font-bold text-gray-800 mb-2 group-hover:text-[#0A70A7]'>
          Other Materials
        </h2>
        <p className='text-sm text-gray-500'>
          Materials that aren't categorized yet
        </p>
      </div>
    </div>
  )
}

export default CategoryGrid
