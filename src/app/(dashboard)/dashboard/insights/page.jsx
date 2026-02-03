import React from 'react'
import StudentEnrollmentGrowthChart from '../../../../ui/molecules/EnrollmentChart'
import Announcements from '../../../../ui/molecules/Announcements'
import Calendar from '../../../../ui/molecules/Calendar'
import UserCard from '../../../../ui/molecules/cards/UserCard'
import Piechart from '../../../../ui/molecules/Piechart'
import Barchart from '../../../../ui/molecules/Barchart'
const page = () => {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        {/* USER CARDS */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='Users' />
          <UserCard type='College' />
          <UserCard type='Agents' />
          <UserCard type='Events' />
        </div>
        {/* MIDDLE CHARTS */}
        <div className='flex gap-4 flex-col lg:flex-row'>
          <div className='w-full lg:w-1/3 h-[450px]'>
            <Piechart />
          </div>
          <div className='w-full lg:w-2/3 h-[450px]'>
            <StudentEnrollmentGrowthChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className='w-full h-[500px]'>
          <Barchart />
        </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <Calendar />
        <Announcements />
      </div>
    </div>
  )
}

export default page
