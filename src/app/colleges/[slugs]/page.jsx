'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '@/app/components/Frontpage/Navbar'
import Header from '@/app/components/Frontpage/Header'
import Footer from '@/app/components/Frontpage/Footer'
import ImageSection from './components/upperSection'
import CollegeOverview from './components/NewCollegeOverview'
import { getCollegeBySlug } from '../actions'
import ApplyNow from './components/applyNow'
import RelatedColleges from './components/RelatedColleges'
import Loading from '../../components/Loading'

const CollegeDetailPage = ({ params }) => {
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSlugAndCollegeDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        console.log('SLUGS:', slugs)
        fetchCollegeDetails(slugs)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }
    fetchSlugAndCollegeDetails()
  }, [])

  const fetchCollegeDetails = async (slugs) => {
    try {
      console.log('Fetching college details for slug:', slugs)
      const collegeData = await getCollegeBySlug(slugs)
      console.log('Fetched data:', collegeData)

      if (collegeData) {
        setCollege(collegeData)
      } else {
        setError('No data found')
      }
    } catch (error) {
      console.error('Error fetching college details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('College Data:', college)
  }, [college])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!college) {
    return <div>No college data available.</div>
  }

  return (
    <div>
      <Header />
      <Navbar />
      <ImageSection college={college} />
      <CollegeOverview college={college} />
      <ApplyNow college={college} />
      <RelatedColleges college={college} />
      <Footer />
    </div>
  )
}

export default CollegeDetailPage
