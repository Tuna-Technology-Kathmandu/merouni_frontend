'use client'
import React from 'react'
import { Search } from 'lucide-react'
import CategoryGrid from './CategoryGrid'
import MaterialsGrid from './MaterialsGrid'
import Pagination from '../../blogs/components/Pagination'

/**
 * Reusable MaterialCard component for rendering materials UI
 * This component is now just for UI rendering and receives all data via props
 */
const MaterialCard = ({
  // Category view props
  categories = [],
  onCategoryClick,
  showCategories = false,

  // Materials view props
  materials = [],
  loading = false,
  selectedCategoryName = null,
  onBackClick,
  searchTerm = '',
  onSearchChange,
  pagination = null,
  onPageChange
}) => {
  return (
    <div className='flex flex-col max-w-[1600px] mx-auto px-8 mt-10'>
      {showCategories ? (
        <>
          {/* Category Cards */}
          <CategoryGrid
            categories={categories}
            onCategoryClick={onCategoryClick}
          />
        </>
      ) : (
        <>
          {/* Back Button and Category Title */}
          {selectedCategoryName && (
            <div className='flex items-center justify-between mb-6 px-4'>
              {onBackClick && (
                <button
                  onClick={onBackClick}
                  className='flex items-center gap-2 text-[#0A70A7] hover:text-[#085a85] font-medium'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 19l-7-7 7-7'
                    />
                  </svg>
                  Back to Categories
                </button>
              )}
              <h2 className='text-2xl font-bold text-gray-800'>
                {selectedCategoryName}
              </h2>
              <div className='w-24'></div>
            </div>
          )}

          {/* Search Bar */}
          {onSearchChange && (
            <div className='flex justify-center mb-10 md:mb-20 w-full'>
              <div className='relative w-full max-w-md mb-6'>
                <input
                  type='text'
                  placeholder='Search material...'
                  className='w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onChange={(e) => onSearchChange(e.target.value)}
                  value={searchTerm}
                />
                <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
              </div>
            </div>
          )}

          {/* Materials Grid */}
          <MaterialsGrid materials={materials} loading={loading} />

          {/* Pagination */}
          {pagination && onPageChange && (
            <Pagination pagination={pagination} onPageChange={onPageChange} />
          )}
        </>
      )}
    </div>
  )
}

export default MaterialCard
