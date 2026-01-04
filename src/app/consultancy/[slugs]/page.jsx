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

// Share Section Component
const ShareSection = ({ consultancy }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out ${consultancy?.title || consultancy?.name} on our platform`

  const handleFacebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareTitle)}`,
      'facebook-share-dialog',
      'width=626,height=436'
    )
  }

  const handleTwitterShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`,
      'twitter-share-dialog',
      'width=550,height=420'
    )
  }

  const handleLinkedInShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      'linkedin-share-dialog',
      'width=550,height=420'
    )
  }

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(`${shareTitle}\n${currentUrl}`)
    alert('Link copied to clipboard! You can now paste it in Instagram')
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 py-3 sm:py-4'>
      <div className='max-w-[1600px] mx-auto px-4'>
        <div className='text-black font-bold text-xs sm:text-sm mb-3 text-center'>
          Share
        </div>
        <div className='flex flex-row gap-3 sm:gap-4 items-center justify-center'>
          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on Facebook'
          >
            <img src='/images/fb.png' alt='Facebook' className='w-5 sm:w-6' />
          </button>

          {/* Twitter/X */}
          <button
            onClick={handleTwitterShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on Twitter'
          >
            <img
              src='/images/twitter.png'
              alt='Twitter'
              className='w-5 sm:w-6'
            />
          </button>

          {/* LinkedIn */}
          <button
            onClick={handleLinkedInShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on LinkedIn'
          >
            <img
              src='/images/linkedin.png'
              alt='LinkedIn'
              className='w-5 sm:w-6'
            />
          </button>

          {/* Instagram */}
          <button
            onClick={handleInstagramShare}
            className='hover:opacity-80 transition-opacity hover:scale-110'
            aria-label='Share on Instagram'
          >
            <img
              src='/images/insta.png'
              alt='Instagram'
              className='w-5 sm:w-6'
            />
          </button>
        </div>
      </div>
    </div>
  )
}

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
      <ShareSection consultancy={consultancy} />
      <Footer />
    </div>
  )
}

export default ConsultancyDetailPage
