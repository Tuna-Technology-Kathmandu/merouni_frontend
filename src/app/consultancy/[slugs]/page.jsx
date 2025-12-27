'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/Frontpage/Navbar'
import Header from '../../../components/Frontpage/Header'
import Footer from '../../../components/Frontpage/Footer'
import ImageSection from './components/upperSection'
import ConsultancyOverview from './components/ConsultancyOverview'
import ContactNow from './components/ContactNow'
import RelatedConsultancies from './components/RelatedConsultancies'
import { getConsultancyBySlug } from '../actions'
import Loading from '../../../components/Loading'

const ConsultancyDetailPage = ({ params }) => {
  const router = useRouter()
  const [consultancy, setConsultancy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSlugAndConsultancyDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        fetchConsultancyDetails(slugs)
      } catch (error) {
        console.error('Error resolving params:', error)
        setError('Error loading consultancy')
        setLoading(false)
      }
    }
    fetchSlugAndConsultancyDetails()
  }, [params])

  const fetchConsultancyDetails = async (slugs) => {
    try {
      setLoading(true)
      const consultancyData = await getConsultancyBySlug(slugs)

      if (consultancyData) {
        const consultancy = consultancyData.consultancy || consultancyData

        if (consultancy && (consultancy.id || consultancy.title)) {
          setConsultancy(consultancy)
        } else {
          setError('Invalid consultancy data')
        }
      } else {
        setError('No consultancy found')
      }
    } catch (error) {
      console.error('Error fetching consultancy details:', error)
      setError(error.message || 'Failed to load consultancy')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>Error</h1>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => router.push('/consultancy')}
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600'
            >
              Back to Consultancies
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!consultancy) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
              Consultancy Not Found
            </h1>
            <button
              onClick={() => router.push('/consultancy')}
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600'
            >
              Back to Consultancies
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <div>
      <Header />
      <Navbar />
      <ImageSection consultancy={consultancy} />
      <ConsultancyOverview consultancy={consultancy} />
      <ContactNow consultancy={consultancy} />
      <RelatedConsultancies consultancy={consultancy} />
      <Footer />
    </div>
  )
}

export default ConsultancyDetailPage
