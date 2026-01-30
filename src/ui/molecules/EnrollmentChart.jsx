'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, X } from 'lucide-react'
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

const COLORS = [
  'rgb(99 102 241)',   // indigo-500
  'rgb(20 184 166)',   // teal-500
  'rgb(245 158 11)',   // amber-500
  'rgb(236 72 153)',   // pink-500
  'rgb(139 92 246)',   // violet-500
  'rgb(34 197 94)',    // green-500
  'rgb(251 146 60)',   // orange-500
  'rgb(59 130 246)'    // blue-500
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className='bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-100 px-4 py-3 min-w-[160px] z-[9999] relative'>
      <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2'>
        {label}
      </p>
      <div className='space-y-1.5'>
        {payload.map((entry, index) => (
          <div key={index} className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2'>
              <span
                className='w-2.5 h-2.5 rounded-full'
                style={{ backgroundColor: entry.color }}
              />
              <span className='text-sm text-gray-600'>{entry.name}</span>
            </div>
            <span className='text-sm font-semibold text-gray-900 tabular-nums'>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const CustomLegend = ({ payload }) => {
  return (
    <div className='flex flex-wrap items-center gap-4 px-1 pb-2'>
      {payload?.map((entry, index) => (
        <div
          key={index}
          className='flex items-center gap-2 text-sm'
        >
          <span
            className='w-3 h-3 rounded-full'
            style={{ backgroundColor: entry.color }}
          />
          <span className='text-gray-600 font-medium'>{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const StudentEnrollmentGrowthChart = ({
  data,
  availableYears = [],
  selectedYears = [],
  onYearsChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const enrollmentData = Array.isArray(data) && data.length > 0 ? data : []

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleYearToggle = (year) => {
    if (!onYearsChange) return

    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year].sort((a, b) => b - a)

    // Ensure at least one year is selected
    if (newSelectedYears.length > 0) {
      onYearsChange(newSelectedYears)
    }
  }

  // Generate Line components for each selected year
  const renderLines = () => {
    if (!selectedYears || selectedYears.length === 0) return null

    return selectedYears.map((year, index) => (
      <Line
        key={year}
        type='monotone'
        dataKey={`enrolled_${year}`}
        name={year.toString()}
        stroke={COLORS[index % COLORS.length]}
        strokeWidth={2.5}
        dot={{ fill: COLORS[index % COLORS.length], r: 4, strokeWidth: 2, stroke: '#fff' }}
        activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
        legendType='circle'
        isAnimationActive
        animationDuration={400}
        animationEasing='ease-out'
      />
    ))
  }

  return (
    <div className='bg-white rounded-2xl w-full h-full p-6 shadow-sm border border-gray-100/80'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-base font-semibold text-gray-800 tracking-tight'>
          Student Enrollment Growth
        </h2>
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all'
          >
            <span>Years</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isDropdownOpen && availableYears.length > 0 && (
            <div className='absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] max-h-64 overflow-y-auto'>
              <div className='p-2'>
                {availableYears.map((year) => {
                  const isSelected = selectedYears.includes(year)
                  return (
                    <label
                      key={year}
                      className='flex items-center gap-3 p-2.5 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors'
                    >
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => handleYearToggle(year)}
                        className='w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer'
                      />
                      <span className='text-sm font-medium text-gray-700'>{year}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='h-[calc(100%-3.5rem)] relative z-10'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={enrollmentData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              vertical={false}
              stroke='#e5e7eb'
              strokeOpacity={0.6}
            />
            <XAxis
              dataKey='name'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
              padding={{ left: 8, right: 8 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Legend content={<CustomLegend />} />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StudentEnrollmentGrowthChart
