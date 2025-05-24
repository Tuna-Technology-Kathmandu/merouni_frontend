import React from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const Loading = () => {
  return (
    <div className='m-8'>
      <div className='flex justify-between items-center mb-6'>
        <Skeleton width={200} height={32} />
        <Skeleton width={120} height={36} />
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50 border-b'>
              {['Name', 'Email', 'Roles', 'Actions'].map((header, index) => (
                <th
                  key={index}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  <Skeleton width={80} height={16} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex} className='border-b'>
                <td className='px-6 py-4'>
                  <Skeleton width={150} height={20} />
                </td>
                <td className='px-6 py-4'>
                  <Skeleton width={200} height={20} />
                </td>
                <td className='px-6 py-4'>
                  <Skeleton width={80} height={20} className='mr-2' />
                  <Skeleton width={80} height={20} />
                </td>
                <td className='px-6 py-4'>
                  <div className='flex space-x-2'>
                    <Skeleton width={32} height={32} circle />
                    <Skeleton width={32} height={32} circle />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Loading
