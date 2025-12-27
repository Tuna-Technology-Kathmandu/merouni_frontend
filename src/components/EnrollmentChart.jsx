'use client'
import React, { useState, useEffect, useRef } from 'react'
import { IoIosMore } from 'react-icons/io'
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

const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff8042'
]

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
      : [...selectedYears, year].sort((a, b) => b - a) // Sort descending

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
        stroke={colors[index % colors.length]}
        strokeWidth={2}
        legendType='circle'
      />
    ))
  }

  return (
    <div className='bg-white rounded-lg p-4 h-full shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold'>Student Enrollment Growth</h1>
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-2 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <span>Years</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {isDropdownOpen && availableYears.length > 0 && (
            <div className='absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto'>
              <div className='p-2'>
                {availableYears.map((year) => {
                  const isSelected = selectedYears.includes(year)
                  return (
                    <label
                      key={year}
                      className='flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded'
                    >
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => handleYearToggle(year)}
                        className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                      />
                      <span className='text-sm'>{year}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='h-[calc(100%-2.5rem)]'>
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
              wrapperStyle={{ paddingTop: '10px' }}
            />
            {renderLines()}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default StudentEnrollmentGrowthChart
