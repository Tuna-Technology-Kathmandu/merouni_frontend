'use client'
import React from 'react'
import MaterialItem from './MaterialItem'
import Shimmer from '../../../components/Shimmer'

const MaterialsGrid = ({ materials, loading }) => {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array(6)
          .fill('')
          .map((_, index) => (
            <div
              key={index}
              className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg'
            >
              <div className='flex justify-evenly items-start mb-4'>
                <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                  <Shimmer width='30px' height='30px' />
                </div>
                <div className='flex flex-col gap-4 w-full'>
                  <Shimmer width='80%' height='20px' />
                  <Shimmer width='60%' height='18px' />
                  <Shimmer width='90%' height='15px' />
                  <div className='flex gap-2'>
                    <Shimmer width='40%' height='15px' />
                    <Shimmer width='40%' height='15px' />
                  </div>
                </div>
              </div>
            </div>
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
