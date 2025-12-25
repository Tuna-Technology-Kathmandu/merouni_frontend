'use client'
import React from 'react'
import { IoIosMore } from 'react-icons/io'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const StudentEnrollmentGrowthChart = ({ data }) => {
  const enrollmentData = Array.isArray(data) && data.length > 0 ? data : []

  return (
    <div className='bg-white rounded-lg p-4 h-full shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold'>Student Enrollment Growth</h1>
        <IoIosMore />
      </div>
      <div className='h-[calc(100%-2.5rem)]'>
        {' '}
        {/* Dynamically calculated height */}
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart data={enrollmentData}>
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#ddd'
            />
            <XAxis
              dataKey='name'
              axisLine={false}
              tick={{ fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: '#6b7280' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '10px',
                borderColor: 'lightgray'
              }}
            />
            <Legend
              align='left'
              verticalAlign='top'
              wrapperStyle={{ paddingTop: '10px' }} // Increased margin
            />
            <Line
              type='monotone'
              dataKey='enrolled'
              stroke='#8884d8'
              strokeWidth={2}
              legendType='circle'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StudentEnrollmentGrowthChart
