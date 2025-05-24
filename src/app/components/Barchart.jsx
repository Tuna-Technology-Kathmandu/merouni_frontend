'use client'

import { IoIosMore } from 'react-icons/io'
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const data = [
  {
    name: 'Week 1',
    activeUsers: 590,
    pageViews: 800,
    totalActivity: 1400
  },
  {
    name: 'Week 2',
    activeUsers: 868,
    pageViews: 967,
    totalActivity: 1506
  },
  {
    name: 'Week 3',
    activeUsers: 1397,
    pageViews: 1098,
    totalActivity: 989
  },
  {
    name: 'Week 4',
    activeUsers: 1480,
    pageViews: 1200,
    totalActivity: 1228
  },
  {
    name: 'Week 5',
    activeUsers: 1520,
    pageViews: 1108,
    totalActivity: 1100
  },
  {
    name: 'Week 6',
    activeUsers: 1400,
    pageViews: 680,
    totalActivity: 1700
  }
]

const AdminChart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>User Engagement</h1>
        <IoIosMore />
      </div>
      <ResponsiveContainer width='100%' height='90%'>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#ddd' />
          <XAxis
            dataKey='name'
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: '#d1d5db' }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align='center'
            verticalAlign='top'
            wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }}
          />
          <Bar dataKey='activeUsers' barSize={20} fill='#413ea0' />
          <Line
            type='monotone'
            dataKey='pageViews'
            stroke='#ff7300'
            strokeWidth={3}
          />
          <Area
            type='monotone'
            dataKey='totalActivity'
            fill='#82ca9d'
            stroke='#82ca9d'
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AdminChart
