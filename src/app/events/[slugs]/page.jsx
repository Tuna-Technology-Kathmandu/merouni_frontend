'use client'
import Banner from '@/app/blogs/[slugs]/components/Banner'
import { useEffect, useState } from 'react'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../ui/molecules/Loading'
import Cardlist from './components/Cardlist'
import Description from './components/Description'
import Hero from './components/Hero'

// Client-side fetch functions to replace server actions
const fetchEventBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/event/${slug}`,
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
      `${process.env.baseUrl}/event`,
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
  }, [params]) 


  if (error) return <div>Error: {error}</div>

  return (
    <div className='bg-white min-h-screen'>
      <Header />
      <Navbar />
      {loading ? (
        <div className='min-h-[60vh] flex items-center justify-center'>
          <Loading />
        </div>
      ) : (
        <main className='animate-in fade-in duration-700'>
          <Hero event={event} />

          <div className='max-w-[1200px] mx-auto px-6 py-10'>
            <Banner />
          </div>

          <Description event={event} />

          <Cardlist events={relatedEvents} />
        </main>
      )}

      <Footer />
    </div>
  )
}

export default EventDetailsPage
