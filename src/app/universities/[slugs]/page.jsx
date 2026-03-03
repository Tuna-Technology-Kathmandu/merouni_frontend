'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../ui/molecules/Loading'
import { getUniversityBySlug } from '../actions'
import RelatedUniversities from './components/RelatedUniversities'
import ShareSection from './components/ShareSection'
import UpperSection from './components/upperSection'

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
    <div className='bg-white min-h-screen'>
      <Header />
      <Navbar />

      <UpperSection university={university} />
      <RelatedUniversities university={university} />
      <ShareSection university={university} />
      <Footer />
    </div>
  )
}

export default UniversityDetailPage
