'use client'
import React from 'react'
import MaterialItem from './MaterialItem'
import { CardSkeleton } from '@/components/ui/CardSkeleton'

const MaterialsGrid = ({ materials, loading }) => {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array(6)
          .fill('')
          .map((_, index) => (
            <CardSkeleton key={index} />
          ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
      {materials.length > 0 ? (
        materials.map((material, index) => (
          <MaterialItem key={material.id || index} material={material} />
        ))
      ) : materials.length == 0 && !loading ? (
        <div className='col-span-full text-center py-12'>
          <p className='text-gray-500 text-lg'>
            No materials found in this category.
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default MaterialsGrid
