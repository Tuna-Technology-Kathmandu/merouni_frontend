'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '../../../components/Frontpage/Navbar'
import Header from '../../../components/Frontpage/Header'
import Footer from '../../../components/Frontpage/Footer'
import ImageSection from './components/upperSection'
import ConsultancyOverview from './components/ConsultancyOverview'
import RelatedConsultancies from './components/RelatedConsultancies'
import { getConsultancyBySlug } from '../actions'
import Loading from '../../../ui/molecules/Loading'
import ApplyNow from './components/ApplyNow'

// Share Section — matches college detail page style
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
    <div className='fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-gray-100 shadow-2xl z-50 py-3 px-6 rounded-2xl transition-all hover:scale-105'>
      <div className='flex flex-row gap-5 items-center justify-center'>
        <span className='text-gray-700 text-xs uppercase tracking-wider font-medium mr-2'>
          Share
        </span>
        <button
          onClick={handleFacebookShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on Facebook'
        >
          <img src='/images/fb.png' alt='Facebook' className='w-5' />
        </button>
        <button
          onClick={handleTwitterShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on Twitter'
        >
          <img src='/images/twitter.png' alt='Twitter' className='w-5' />
        </button>
        <button
          onClick={handleLinkedInShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on LinkedIn'
        >
          <img src='/images/linkedin.png' alt='LinkedIn' className='w-5' />
        </button>
        <button
          onClick={handleInstagramShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on Instagram'
        >
          <img src='/images/insta.png' alt='Instagram' className='w-5' />
        </button>
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
        <div className='min-h-screen bg-gray-50/50 flex items-center justify-center px-4'>
          <div className='text-center max-w-md'>
            <h1 className='text-xl font-semibold text-gray-900 mb-3'>
              Something went wrong
            </h1>
            <p className='text-gray-600 mb-6'>{error}</p>
            <button
              onClick={() => router.push('/consultancy')}
              className='bg-[#0A6FA7] hover:bg-[#085e8a] text-white px-6 py-3 rounded-xl font-semibold transition-colors'
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
        <div className='min-h-screen bg-gray-50/50 flex items-center justify-center px-4'>
          <div className='text-center max-w-md'>
            <h1 className='text-xl font-semibold text-gray-900 mb-3'>
              Consultancy not found
            </h1>
            <p className='text-gray-600 mb-6'>
              The consultancy you&apos;re looking for doesn&apos;t exist or was
              removed.
            </p>
            <button
              onClick={() => router.push('/consultancy')}
              className='bg-[#0A6FA7] hover:bg-[#085e8a] text-white px-6 py-3 rounded-xl font-semibold transition-colors'
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
      <br />
      <br />
      <ConsultancyOverview consultancy={consultancy} />
      <ApplyNow consultancy={consultancy} />
      <RelatedConsultancies consultancy={consultancy} />
      <ShareSection consultancy={consultancy} />
      <Footer />
    </div>
  )
}

export default ConsultancyDetailPage
