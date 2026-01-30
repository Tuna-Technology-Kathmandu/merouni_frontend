'use client'

import React from 'react'

const TopAgentsTable = ({ topAgents, loading }) => {
  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6'>
      <h2 className='text-lg font-semibold text-gray-800 tracking-tight mb-4'>
        Top Performing Agents
      </h2>
      {loading ? (
        <div className='flex items-center justify-center h-32'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
        </div>
      ) : topAgents.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No agents found</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                  Rank
                </th>
                <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                  Agent Name
                </th>
                <th className='text-left py-3 px-4 text-sm font-semibold text-gray-700'>
                  Email
                </th>
                <th className='text-right py-3 px-4 text-sm font-semibold text-gray-700'>
                  Referrals
                </th>
                <th className='text-right py-3 px-4 text-sm font-semibold text-gray-700'>
                  Total Score
                </th>
              </tr>
            </thead>
            <tbody>
              {topAgents.map((item, index) => (
                <tr
                  key={item.agent_id}
                  className='border-b border-gray-100 hover:bg-gray-50 transition-colors'
                >
                  <td className='py-3 px-4'>
                    <span className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm'>
                      {index + 1}
                    </span>
                  </td>
                  <td className='py-3 px-4 text-sm font-medium text-gray-900'>
                    {item.agent?.fullName || 'Unknown Agent'}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-600'>
                    {item.agent?.email || '-'}
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-900 text-right font-medium'>
                    {item.referralCount}
                  </td>
                  <td className='py-3 px-4 text-right'>
                    <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800'>
                      {item.totalScore} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TopAgentsTable
