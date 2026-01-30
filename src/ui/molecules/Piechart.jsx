'use client'

import React, { useMemo, useState } from 'react'
import {
  PieChart,
  Pie,
  Sector,
  ResponsiveContainer,
  Cell,
  Tooltip
} from 'recharts'

const COLORS = [
  'rgb(99 102 241)',   // indigo-500
  'rgb(20 184 166)',  // teal-500
  'rgb(245 158 11)'   // amber-500
]

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill
  } = props
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' }}
    />
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const total = payload[0]?.payload?.total
  const pct = total ? ((item.value / total) * 100).toFixed(1) : '0'
  return (
    <div className='bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-100 px-4 py-3 min-w-[140px] z-[9999] relative'>
      <p className='font-semibold text-gray-900'>{item.name}</p>
      <p className='text-sm text-gray-600'>
        <span className='text-indigo-600 font-medium'>{item.value}</span>
        <span className='text-gray-400'> · </span>
        <span>{pct}%</span>
      </p>
    </div>
  )
}

const CountChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null)

  const safeData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) return data
    return [
      { name: 'Colleges', value: 0 },
      { name: 'Universities', value: 0 },
      { name: 'Consultancies', value: 0 }
    ]
  }, [data])

  const total = useMemo(
    () => safeData.reduce((acc, item) => acc + (item.value || 0), 0),
    [safeData]
  )

  const dataWithTotal = useMemo(
    () => safeData.map((d) => ({ ...d, total })),
    [safeData, total]
  )

  const onPieEnter = (_, index) => setActiveIndex(index)
  const onPieLeave = () => setActiveIndex(null)

  return (
    <div className='bg-white rounded-2xl w-full h-full p-6 shadow-sm border border-gray-100/80'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-base font-semibold text-gray-800 tracking-tight'>
          Educational Institutions
        </h2>
      </div>

      <div className='relative w-full h-[280px] z-10'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Pie
              data={dataWithTotal}
              cx='50%'
              cy='50%'
              innerRadius={72}
              outerRadius={96}
              paddingAngle={2}
              dataKey='value'
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive
              animationDuration={400}
              animationEasing='ease-out'
            >
              {safeData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke='none'
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center total */}
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-gray-800 tabular-nums'>{total}</p>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wider'>Total</p>
          </div>
        </div>
      </div>

      <div className='flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100'>
        {safeData.map((item, index) => {
          const pct = total ? (((item.value || 0) / total) * 100).toFixed(0) : '0'
          return (
            <div
              key={item.name}
              className='flex items-center gap-2'
            >
              <span
                className='w-3 h-3 rounded-full shrink-0'
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className='text-sm text-gray-600'>
                <span className='font-semibold text-gray-900'>{item.value}</span>
                <span className='text-gray-400 ml-1'>{item.name}</span>
                <span className='text-gray-400 ml-1'>· {pct}%</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CountChart
