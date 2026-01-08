'use client'
import React from 'react'
import { MdOutlineRemoveRedEye } from 'react-icons/md'

const MaterialItem = ({ material }) => {
  return (
    <div className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105'>
      <div className='w-full h-48 relative bg-gray-100'>
        <img
          src={material?.image || '/images/logo.png'}
          alt={material.title}
          className='w-full h-full object-cover'
          onError={(e) => {
            e.target.src = '/images/logo.png'
          }}
        />
      </div>
      <div className='p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-lg font-semibold mb-2'>{material.title}</h1>
          <MdOutlineRemoveRedEye
            className='w-6 h-6 cursor-pointer'
            onClick={() => window.open(material?.file, '_blank')}
          />
        </div>
        <a href={material?.file} download className='w-full h-full'>
          <button className='mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
            Download Now
          </button>
        </a>
      </div>
    </div>
  )
}

export default MaterialItem
