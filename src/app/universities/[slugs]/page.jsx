'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Frontpage/Navbar'
import Header from '../../../components/Frontpage/Header'
import Footer from '../../../components/Frontpage/Footer'
import ImageSection from './components/upperSection'
// import CollegeOverview from "./components/collegeOverview";
import { getUniversityBySlug } from '../actions'
import Gallery from './components/Gallery'
// import ApplyNow from "./components/applyNow";
import RelatedUniversities from './components/RelatedUniversities'
import Loading from '../../../components/Loading'

const UniversityDetailPage = ({ params }) => {
  // const { slugs } = params; // Use `slugs` directly from `params`
  const [university, setUniversity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSlugAndCollegeDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        fetchUniversityDetails(slugs)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }

    fetchSlugAndCollegeDetails()
  }, [])

  const fetchUniversityDetails = async (slugs) => {
    try {
      const universityData = await getUniversityBySlug(slugs)

      if (universityData) {
        setUniversity(universityData)
      } else {
        setError('No data found')
      }
    } catch (error) {
      console.error('Error fetching university details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!university) {
    return <div>No university data available.</div>
  }

  return (
    <div>
      <Header />
      <Navbar />
      <ImageSection university={university} />
      <RelatedUniversities university={university} />
      <Footer />
    </div>
  )
}

export default UniversityDetailPage
