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

const enrollmentData = [
  { name: 'Jan', enrolled: 1000 },
  { name: 'Feb', enrolled: 1200 },
  { name: 'Mar', enrolled: 1500 },
  { name: 'Apr', enrolled: 2000 },
  { name: 'May', enrolled: 2300 },
  { name: 'Jun', enrolled: 2600 },
  { name: 'Jul', enrolled: 2800 },
  { name: 'Aug', enrolled: 3000 },
  { name: 'Sep', enrolled: 3500 },
  { name: 'Oct', enrolled: 3700 },
  { name: 'Nov', enrolled: 3900 },
  { name: 'Dec', enrolled: 4000 }
]

const StudentEnrollmentGrowthChart = () => {
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
