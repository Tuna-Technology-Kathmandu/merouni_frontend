'use client'

import { DotenvConfig } from '@/config/env.config'
import { useEffect, useState } from 'react'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../components/Loading'
import SchoolApplyNow from './components/SchoolApplyNow'
import RelatedSchools from './components/RelatedSchool'
import SchoolOverview from './components/schoolOverview'
import SchoolImageSection from './components/SchoolUpperSection'

// Share Section Component
const ShareSection = ({ school }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out ${school?.name} on our platform`

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
        <span className='text-gray-900 font-bold text-xs uppercase tracking-widest mr-2'>Share</span>

        {/* Facebook */}
        <button
          onClick={handleFacebookShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on Facebook'
        >
          <img src='/images/fb.png' alt='Facebook' className='w-5' />
        </button>

        {/* Twitter/X */}
        <button
          onClick={handleTwitterShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on Twitter'
        >
          <img
            src='/images/twitter.png'
            alt='Twitter'
            className='w-5'
          />
        </button>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedInShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on LinkedIn'
        >
          <img
            src='/images/linkedin.png'
            alt='LinkedIn'
            className='w-5'
          />
        </button>

        {/* Instagram */}
        <button
          onClick={handleInstagramShare}
          className='hover:opacity-80 transition-all hover:-translate-y-1'
          aria-label='Share on Instagram'
        >
          <img
            src='/images/insta.png'
            alt='Instagram'
            className='w-5'
          />
        </button>
      </div>
    </div>
  )
}

const SchoolDetailPage = ({ params }) => {
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSlugAndSchoolDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        fetchSchoolDetails(slugs)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }
    fetchSlugAndSchoolDetails()
  }, [])

  const fetchSchoolDetails = async (slugs) => {
    if (typeof window === 'undefined') return

    try {
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/school/${slugs}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          cache: 'no-store'
        }
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch school details: ${response.statusText}`
        )
      }

      const data = await response.json()
      const schoolData = data.item

      if (schoolData) {
        setSchool(schoolData)
      } else {
        setError('No data found')
      }
    } catch (error) {
      console.error('Error fetching school details:', error)
      setError(error.message || 'Failed to load school details')
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

  if (!school) {
    return <div>No school data available.</div>
  }

  console.log(school)

  return (
    <div className='bg-white min-h-screen'>
      <Header />
      <Navbar />
      <div className='flex flex-col gap-16 md:gap-24 pb-20'>
        <SchoolImageSection school={school} />
        <SchoolOverview college={school} />
        <SchoolApplyNow school={school} />
        <RelatedSchools school={school} />
      </div>

      {/* Share Section - Bottom Center */}
      <ShareSection school={school} />

      <Footer />
    </div>
  )
}

export default SchoolDetailPage
