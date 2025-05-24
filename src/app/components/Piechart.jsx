'use client'
import React, { useState } from 'react'
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'
import { IoIosMore } from 'react-icons/io'

const data = [
  { name: 'Schools', value: 500 },
  { name: 'Colleges', value: 300 },
  { name: 'Institutions', value: 150 },
  { name: 'Universities', value: 50 }
]

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill='#333'
      >{`Count: ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill='#999'
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const CountChart = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  // Calculate totals for the bottom section
  const total = data.reduce((acc, item) => acc + item.value, 0)
  const firstTwo = data.slice(0, 2)
  const firstTwoValues = firstTwo.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: ((item.value / total) * 100).toFixed(0)
  }))

  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      {/* TITLE */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold'>Educational Institutions</h1>
        <IoIosMore />
      </div>

      {/* CHART */}
      <div className='relative w-full h-[75%]'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={60}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* BOTTOM */}
      <div className='flex justify-center gap-16 mt-2'>
        {firstTwoValues.map((item, index) => (
          <div key={item.name} className='flex flex-col gap-1 items-center'>
            <div
              className={`w-5 h-5 rounded-full ${index === 0 ? 'bg-blue-400' : 'bg-yellow-400'}`}
            />
            <h1 className='font-bold text-black'>{item.value}</h1>
            <h2 className='text-xs text-black'>{`${item.name} (${item.percentage}%)`}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountChart
