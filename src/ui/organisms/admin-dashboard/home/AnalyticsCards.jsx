'use client'

import React from 'react'
import UserCard from '@/ui/molecules/cards/UserCard'

const AnalyticsCards = ({ analytics, loading }) => {
  const cards = [
    { type: 'Users', value: analytics?.totalUsers },
    { type: 'College', value: analytics?.totalColleges },
    { type: 'University', value: analytics?.totalUniversities },
    { type: 'Consultancy', value: analytics?.totalConsultancies },
    { type: 'Agents', value: analytics?.totalAgents },
    { type: 'Events', value: analytics?.totalEvents },
    { type: 'Referrals', value: analytics?.totalReferrals },
    { type: 'Blogs', value: analytics?.totalBlogs }
  ]

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {cards.map((card) => (
        <UserCard
          key={card.type}
          type={card.type}
          value={card.value}
          loading={loading}
        />
      ))}
    </div>
  )
}

export default AnalyticsCards
