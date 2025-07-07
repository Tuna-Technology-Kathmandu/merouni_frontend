'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { PiLineVerticalThin } from 'react-icons/pi'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import { IoArrowUp } from 'react-icons/io5'
import Sponsors from './Sponsors'
import Image from 'next/image'
import EventCard from '../components/Frontpage/EventCard'
import { IoIosSearch } from 'react-icons/io'
import Thisweek from './Thisweek'
import {
  getEvents,
  getThisWeekEvents,
  getNextWeekEvents,
  searchEvent
} from './action'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import Header from '../components/Frontpage/Header'
import Link from 'next/link'
import Loading from '../components/Loading'
import Pagination from '../blogs/components/Pagination'
import { debounce } from 'lodash'
import useMediaQuery from './MediaQuery'

const Events = () => {
  const [allEvents, setAllEvents] = useState([])
  const [thisWeekEvents, setThisWeekEvents] = useState([])
  const [nextWeekEvents, setNextWeekEvents] = useState([])
  const [featuredEvent, setFeaturedEvent] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const [allLoading, setAllLoading] = useState(false)

  useEffect(() => {
    if (!searchQuery) {
      loadEvents(pagination.currentPage)
    }
  }, [pagination.currentPage, searchQuery])

  const loadEvents = async (page = 1) => {
    try {
      setAllLoading(true)
      const response = await getEvents(page)
      const events = response.items
      console.log('Events:', response)
      setAllEvents(events)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalCount: response.pagination.totalCount
      })

      // Filter events for different sections
      const thisWeek = await getThisWeekEvents()
      const nextWeek = await getNextWeekEvents()
      const featured = thisWeek.events[0] // First event as featured

      // Parse the event_host data for the featured event
      const eventHost = featured?.event_host
        ? JSON.parse(featured.event_host)
        : null
      //featured.eventHost = eventHost; // Attach the parsed eventHost to the featuredEvent

      setFeaturedEvent(featured)
      setThisWeekEvents(thisWeek.events)
      setNextWeekEvents(nextWeek.events)
    } catch (error) {
      setError('Failed to load Events')
      console.error(error)
    } finally {
      setLoading(false)
      setAllLoading(false)
    }
  }

  const handlePageChange = (page) => {
    console.log('Pages response from pagination controle:', page)
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page
      }))
    }
  }

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        setIsSearching(true)
        const results = await searchEvent(query)
        console.log('Search Results in event:', results)
        setAllEvents(results.items)
        setPagination(results.pagination)
        setIsSearching(false)
      }
    }, 1000), // 1000ms delay
    []
  )

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <Header />
      <Navbar />

      {loading ? (
        <Loading />
      ) : (
        <div className='mx-auto'>
          {featuredEvent && featuredEvent.event_host && (
            <div className='flex flex-col lg:flex-row items-center justify-between p-0 lg:p-10 max-w-[1600px] mx-auto mb-10 '>
              <div className='order-1 lg:order-2 w-full lg:w-1/3 flex justify-end mt-0 mb-2 lg:mb-0 lg:mt-0 bg-red-100 h-[400px]'>
                {isMobile ? (
                  <img
                    src='/images/events.png'
                    alt={featuredEvent.title ?? 'Featured Event'}
                    className='lg:rounded-lg rounded-none shadow-md w-full h-full'
                  />
                ) : (
                  <img
                    src='/images/events.png'
                    alt={featuredEvent.title ?? 'Featured Event'}
                    className='lg:rounded-lg rounded-none shadow-md w-full h-full'
                  />
                )}
              </div>

              {/* Featured Event Content */}
              <div className='order-2 lg:order-1 lg:w-1/2 flex flex-col'>
                <h2 className='text-2xl lg:text-3xl font-bold mb-4 mt-4 lg:mt-0 text-center lg:text-start'>
                  {featuredEvent.title ?? 'No Title Available'}
                </h2>
                <p className='lg:mb-6 text-center lg:text-start'>
                  {featuredEvent.description ?? 'No Description Available'}
                </p>

                {/* Event Details */}
                <div className='order-2 lg:order-1 bg-gradient-to-l from-[#30AD8F] to-[#0A6FA7] text-white rounded-lg flex flex-row mb-8 items-center justify-between max-[1130px]:w-[400px] w-[600px] h-[120px] p-6 lg:p-8'>
                  <div className='flex flex-col items-center'>
                    <p className='text-sm font-bold'>Starts</p>
                    <p className='whitespace-nowrap'>
                      {new Date(
                        JSON.parse(featuredEvent.event_host)?.start_date ??
                          new Date()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='flex items-center'>
                    <PiLineVerticalThin style={{ color: 'white' }} size={50} />
                  </div>
                  <div className='flex flex-col items-center'>
                    <p className='text-sm font-bold'>Ends</p>
                    <p className='whitespace-nowrap'>
                      {new Date(
                        JSON.parse(featuredEvent.event_host)?.end_date ??
                          new Date()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='flex items-center'>
                    <PiLineVerticalThin style={{ color: 'white' }} size={50} />
                  </div>
                  <div className='flex flex-col items-center'>
                    <p className='text-sm font-bold whitespace-nowrap'>Time</p>
                    <p className='whitespace-nowrap'>
                      {JSON.parse(featuredEvent.event_host)?.time ??
                        'No Time Available'}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className='order-1 lg:order-2  flex flex-row mb-6 lg:mb-0 items-center justify-center lg:items-center lg:justify-start lg:flex-row gap-4'>
                  <button className='border-2 border-black text-black px-2 py-1 lg:px-6 lg:py-2 rounded-full lg:rounded-lg hover:bg-gray-800 hover:text-white transition-all flex flex-row items-center justify-between mt-5'>
                    <span className='pr-2 lg:pr-4 font-semibold text-sm lg:text-base'>
                      View More
                    </span>
                    <IoIosArrowDroprightCircle size={25} />
                  </button>
                  <a
                    href='#'
                    className='text-[#3D3D3D] hover:text-blue-700 underline flex items-center mt-5'
                  >
                    <span className='text-sm lg:text-base'>Apply Here</span>
                    <IoArrowUp className='rotate-45' />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Sponsors Section */}
          <Sponsors />

          {/* This Week's Events */}

          <Thisweek
            title='This week Events'
            subtitle='Connect, learn, and celebrate together'
            thisWeekEvents={thisWeekEvents}
          />

          {/* Upcoming Events */}
          <div className='mt-8'>
            <Thisweek
              title='Upcoming Events'
              subtitle='Don’t miss what’s happening around you'
              thisWeekEvents={nextWeekEvents}
            />
          </div>

          {/* All events */}
          <div className='container mx-auto px-4 py-12 md:py-20 mb-10 md:mb-20'>
            <div className='flex flex-col lg:flex-row gap-6 lg:gap-12'>
              {/* Left Section - Filters & Archive */}
              <div className='w-full lg:w-1/4 space-y-6 lg:space-y-8'>
                {/* Heading */}
                <h1 className='text-2xl md:text-3xl font-bold text-[#0A6FA7] text-center lg:text-left'>
                  All Events
                </h1>

                {/* Search Bar */}
                <div className='relative'>
                  <div className='relative flex items-center'>
                    <input
                      type='text'
                      placeholder='Search Events...'
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] focus:border-transparent'
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    <IoIosSearch className='absolute right-3 text-gray-400 text-xl' />
                  </div>
                  {isSearching && (
                    <div className='absolute right-3 top-3.5'>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#0A6FA7]'></div>
                    </div>
                  )}
                </div>

                {/* Archive Section - Hidden on mobile, visible from lg+ */}
                <div className='hidden lg:block bg-white p-4 rounded-lg shadow-sm'>
                  <h2 className='text-lg font-semibold mb-3 text-gray-800'>
                    Archive
                  </h2>
                  <div className='border-b border-gray-200 w-full mb-3'></div>
                  <ul className='space-y-2'>
                    {[
                      'January 2025',
                      'December 2024',
                      'November 2024',
                      'October 2024'
                    ].map((month, index) => (
                      <li
                        key={index}
                        className='text-gray-600 hover:text-[#0A6FA7] cursor-pointer transition-colors duration-200'
                      >
                        {month}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Section - Events Grid */}
              <div className='w-full lg:w-3/4'>
                {/* Responsive Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                  {allLoading
                    ? [...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className='bg-gray-100 rounded-lg h-80 animate-pulse'
                        ></div>
                      ))
                    : allEvents.map((event) => (
                        <Link
                          href={`/events/${event.slugs}`}
                          key={event.id}
                          passHref
                        >
                          <div className='transition-transform duration-300 hover:scale-[1.02]'>
                            <EventCard event={event} />
                          </div>
                        </Link>
                      ))}
                </div>

                {/* Pagination - Centered with responsive margin */}
                <div className='mt-8 md:mt-12 flex justify-center'>
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Events

// this week events
