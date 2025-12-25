'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Frontpage/Navbar'
import Header from '../../../components/Frontpage/Header'
import Footer from '../../../components/Frontpage/Footer'
import ImageSection from './components/upperSection'
import CollegeOverview from './components/NewCollegeOverview'
import { getCollegeBySlug } from '../actions'
import ApplyNow from './components/applyNow'
import RelatedColleges from './components/RelatedColleges'
import Loading from '../../../components/Loading'

const CollegeDetailPage = ({ params }) => {
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSlugAndCollegeDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        fetchCollegeDetails(slugs)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }
    fetchSlugAndCollegeDetails()
  }, [])

  const fetchCollegeDetails = async (slugs) => {
    try {
      const collegeData = await getCollegeBySlug(slugs)

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

  // useEffect(() => {
  //   console.log('College Data:', college?.collegeFacility)
  // }, [college])

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
