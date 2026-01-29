'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Frontpage/Navbar'
import Header from '../../../components/Frontpage/Header'
import Footer from '../../../components/Frontpage/Footer'
import ImageSection from './components/upperSection'
import CollegeOverview from './components/NewCollegeOverview'
import ApplyNow from './components/applyNow'
import RelatedColleges from './components/RelatedColleges'
import Loading from '../../../components/Loading'
import { DotenvConfig } from '@/config/env.config'

// Share Section Component
const ShareSection = ({ college }) => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = `Check out ${college?.name} on our platform`

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
    // Only run on client side
    if (typeof window === 'undefined') return

    try {
      // Use direct fetch instead of server action to avoid SSR issues
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college/${slugs}`,
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
          `Failed to fetch college details: ${response.statusText}`
        )
      }

      const data = await response.json()
      const collegeData = data.item

      if (collegeData) {
        setCollege(collegeData)
      } else {
        setError('No data found')
      }
    } catch (error) {
      console.error('Error fetching college details:', error)
      setError(error.message || 'Failed to load college details')
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

      {/* Share Section - Bottom Center */}
      <ShareSection college={college} />

      <Footer />
    </div>
  )
}

export default CollegeDetailPage
