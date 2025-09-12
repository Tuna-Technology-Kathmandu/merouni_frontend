'use client'
import React, { useState, useEffect } from 'react'
import { getEventBySlug, getRelatedEvents } from '../../events/action'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Hero from './components/Hero'
import Description from './components/Description'
import Cardlist from './components/Cardlist'
import Loading from '../../components/Loading'

const EventDetailsPage = ({ params }) => {
  const [event, setEvent] = useState(null)
  const [relatedEvents, setRelatedEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const slugs = params.slugs // No need to await params.slugs

        const [eventData, allEvents] = await Promise.all([
          getEventBySlug(slugs),
          getRelatedEvents()
        ])
        setEvent(eventData || null) // Set eventData directly
        setRelatedEvents(allEvents)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [params.slugs]) // Add params.slugs to dependency array

  useEffect(() => {
    console.log('Events:', event)
    console.log('related:', event)
  }, [event])

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
          <Description event={event} />
          <Cardlist events={relatedEvents} />
        </>
      )}

      <Footer />
    </div>
  )
}

export default EventDetailsPage
