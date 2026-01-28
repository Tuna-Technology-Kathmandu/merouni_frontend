'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, BookOpen } from 'lucide-react'

const CategoryCard = ({ category, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className='group relative bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden cursor-pointer p-6 flex flex-col items-center text-center transition-all'
    >
      <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
        <ChevronRight className='w-5 h-5 text-[#0A70A7]' />
      </div>

      <div className='w-20 h-20 mb-6 relative'>
        <div className='absolute inset-0 bg-[#0A70A7] opacity-10 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-300'></div>
        <div className='absolute inset-0 bg-[#0A70A7] rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-100 transform group-hover:-rotate-3 transition-transform duration-300'>
          <span className='text-3xl font-bold'>
            {category.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      <h2 className='text-xl font-bold text-gray-800 mb-3 group-hover:text-[#0A70A7] transition-colors'>
        {category.name}
      </h2>

      {category.description ? (
        <p className='text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed'>
          {category.description}
        </p>
      ) : (
        <p className='text-sm text-gray-400 italic mb-4'>
          Explore materials in this category
        </p>
      )}

      <div className='mt-auto flex items-center gap-2 text-xs font-semibold text-[#0A70A7] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0'>
        <BookOpen className='w-4 h-4' />
        <span>BROWSE MATERIALS</span>
      </div>
    </motion.div>
  )
}

export default CategoryCard
