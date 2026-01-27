'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Frontpage/Navbar'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Hero from './components/Hero'
import Description from './components/Description'
import Cardlist from './components/Cardlist'
import Loading from '../../../components/Loading'
import Banner from '@/app/blogs/[slugs]/components/Banner'

// Client-side fetch functions to replace server actions
const fetchEventBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/event/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.statusText}`)
    }

    const data = await response.json()
    return data.item
  } catch (error) {
    console.error('Error fetching event details:', error)
    throw error
  }
}

const fetchRelatedEvents = async () => {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/event`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch related events: ${response.statusText}`)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching related events:', error)
    throw error
  }
}

const EventDetailsPage = ({ params }) => {
  const [event, setEvent] = useState(null)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const fetchEventDetails = async () => {
      try {
        // Handle params which might be a promise in Next.js 15
        const resolvedParams = await params
        const slugs = resolvedParams.slugs

        const [eventData, allEvents] = await Promise.all([
          fetchEventBySlug(slugs),
          fetchRelatedEvents()
        ])
        setEvent(eventData || null)
        setRelatedEvents(allEvents || [])
      } catch (err) {
        console.error('Error fetching event details:', err)
        setError(err.message || 'Failed to load event details')
        setEvent(null)
        setRelatedEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [params]) // Add params to dependency array

  // useEffect(() => {
  //   console.log('Events:', event)
  //   console.log('related:', event)
  // }, [event])

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>
  // if (!event) return <div>No event found</div>;

  return (
    <div>
      <Header />
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <Hero event={event} />
          <div className='px-16 max-sm:px-9 max-w-[1600px] pt-10 mx-auto'>
            <Banner />
          </div>
          <div className=' px-16 max-sm:px-9 max-w-[1600px] mx-auto mt-12'>
            <Description event={event} />
          </div>
          <Cardlist events={relatedEvents} />
        </>
      )}

      <Footer />
    </div>
  )
}

export default EventDetailsPage
