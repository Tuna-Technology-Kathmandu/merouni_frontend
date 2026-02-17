'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Dynamically import charts with SSR disabled to fix ResponsiveContainer issues
const StudentEnrollmentGrowthChart = dynamic(
  () => import('@/ui/molecules/EnrollmentChart'),
  { ssr: false }
)

const Piechart = dynamic(
  () => import('@/ui/molecules/Piechart'),
  { ssr: false }
)

const DashboardCharts = ({
  analytics,
  selectedYears = [],
  onYearsChange
}) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted && (
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-1/2' style={{ minHeight: '450px', height: '450px' }}>
            <Piechart data={analytics?.educationalInstitutions} />
          </div>
          <div className='w-full lg:w-1/2' style={{ minHeight: '450px', height: '450px' }}>
            <StudentEnrollmentGrowthChart
              data={analytics?.studentEnrollmentGrowth}
              availableYears={analytics?.availableYears || []}
              selectedYears={
                selectedYears.length > 0
                  ? selectedYears
                  : analytics?.selectedYears || []
              }
              onYearsChange={onYearsChange}
            />
          </div>
        </div>
      )}

      {!mounted && (
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100/80 flex items-center justify-center' style={{ minHeight: '450px', height: '450px' }}>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          </div>
          <div className='w-full lg:w-1/2 bg-white rounded-2xl shadow-sm border border-gray-100/80 flex items-center justify-center' style={{ minHeight: '450px', height: '450px' }}>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
          </div>
        </div>
      )}
    </>
  )
}

export default DashboardCharts
