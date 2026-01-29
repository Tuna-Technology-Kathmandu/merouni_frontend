'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { PiLineVerticalThin } from 'react-icons/pi'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import { IoArrowUp } from 'react-icons/io5'
import { Calendar } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import Sponsors from './Sponsors'
import EventCard from '../../components/Frontpage/EventCard'
import { IoIosSearch } from 'react-icons/io'
import Thisweek from './Thisweek'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Link from 'next/link'
import Loading from '../../components/Loading'
import Pagination from '../blogs/components/Pagination'
import { Select } from '@/components/ui/select'
import { getColleges } from '../action'
import { debounce } from 'lodash'
import useMediaQuery from './MediaQuery'
import { DotenvConfig } from '@/config/env.config'

// Client-side fetch functions to replace server actions
const fetchEvents = async (page = 1, collegeId = '') => {
  try {
    const url = new URL(`${DotenvConfig.NEXT_APP_API_BASE_URL}/event`)
    url.searchParams.append('page', page)
    url.searchParams.append('limit', 12)
    if (collegeId) {
      url.searchParams.append('college_id', collegeId)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

const searchEvent = async (query, collegeId = '') => {
  try {
    const url = new URL(`${DotenvConfig.NEXT_APP_API_BASE_URL}/event`)
    url.searchParams.append('q', query)
    if (collegeId) {
      url.searchParams.append('college_id', collegeId)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to search events: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching events:', error)
    throw error
  }
}

const fetchThisWeekEvents = async (collegeId = '') => {
  try {
    const url = new URL(`${DotenvConfig.NEXT_APP_API_BASE_URL}/event/this-week`)
    if (collegeId) url.searchParams.append('college_id', collegeId)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch this week's events")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching this week's events:", error)
    throw error
  }
}

const fetchNextWeekEvents = async (collegeId = '') => {
  try {
    const url = new URL(`${DotenvConfig.NEXT_APP_API_BASE_URL}/event/next-month`)
    if (collegeId) url.searchParams.append('college_id', collegeId)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch next week's events")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching next week's events:", error)
    throw error
  }
}

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
    totalCount: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')

  const [allLoading, setAllLoading] = useState(false)
  const [colleges, setColleges] = useState([])
  const [selectedCollege, setSelectedCollege] = useState('')

  useEffect(() => {
    const fetchCollegesData = async () => {
      try {
        const data = await getColleges(null, null, 999, 1)
        setColleges(data.items || [])
      } catch (err) {
        console.error('Failed to fetch colleges:', err)
      }
    }
    fetchCollegesData()
  }, [])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    if (!searchQuery) {
      loadEvents(pagination.currentPage, selectedCollege)
    }
  }, [pagination.currentPage, searchQuery, selectedCollege])

  const loadEvents = async (page = 1, collegeId = '') => {
    try {
      setAllLoading(true)
      const response = await fetchEvents(page, collegeId)
      const events = response.items || []
      setAllEvents(events)
      setPagination({
        currentPage: response.pagination?.currentPage || page,
        totalPages: response.pagination?.totalPages || 1,
        totalCount: response.pagination?.totalCount || 0
      })

      // Fetch specific sections with college filtering
      const thisWeek = await fetchThisWeekEvents(collegeId)
      const nextWeek = await fetchNextWeekEvents(collegeId)

      // Update states
      setThisWeekEvents(thisWeek.events || [])
      setNextWeekEvents(nextWeek.events || [])

      const featured = thisWeek.events?.[0] || events[0] || null
      setFeaturedEvent(featured)

    } catch (error) {
      setError('Failed to load Events')
      console.error('Error loading events:', error)
      setAllEvents([])
      setThisWeekEvents([])
      setNextWeekEvents([])
      setFeaturedEvent(null)
    } finally {
      setLoading(false)
      setAllLoading(false)
    }
  }

  const handlePageChange = (page) => {
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
        try {
          const results = await searchEvent(query, selectedCollege)
          setAllEvents(results.items || [])
          setPagination(
            results.pagination || {
              currentPage: 1,
              totalPages: 1,
              totalCount: 0
            }
          )
        } catch (error) {
          console.error('Error searching events:', error)
          setAllEvents([])
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalCount: 0
          })
        } finally {
          setIsSearching(false)
        }
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
            <div className='flex flex-col lg:flex-row items-center justify-between p-0 lg:p-10 max-w-[1600px] mx-auto '>
              <div className='order-1 lg:order-2 w-full lg:w-1/3 flex justify-end mt-0 mb-2 lg:mb-0 lg:mt-0 h-[400px] max-lg:h-[300px]'>
                {isMobile ? (
                  <img
                    src={featuredEvent.image || '/images/events.webp'}
                    alt={featuredEvent.title ?? 'Featured Event'}
                    className='shadow-md w-full h-full '
                  />
                ) : (
                  <img
                    src={featuredEvent.image || '/images/events.webp'}
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
                      {(() => {
                        try {
                          const host = JSON.parse(featuredEvent.event_host) // parse the JSON string
                          return host?.time
                            ? new Date(
                              `1970-01-01T${host.time}:00`
                            ).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                              hour12: true
                            })
                            : 'No Time Available'
                        } catch (e) {
                          return 'Invalid Time Data'
                        }
                      })()}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className='order-1 lg:order-2  flex flex-row mb-6 lg:mb-0 items-center justify-center lg:items-center lg:justify-start lg:flex-row gap-4'>
                  <Link href={`/events/${featuredEvent.slugs}`}>
                    <button className='border-2 border-black text-black px-2 py-1 lg:px-6 lg:py-2 rounded-full lg:rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300 flex flex-row items-center justify-between mt-5'>
                      <span className='pr-2 lg:pr-4 font-semibold text-sm lg:text-base'>
                        View More
                      </span>
                      <IoIosArrowDroprightCircle size={25} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Sponsors Section */}
          <Sponsors />

          {/* This Week's Events */}

          {thisWeekEvents.length > 0 && (
            <Thisweek
              title='This week Events'
              subtitle='Connect, learn, and celebrate together'
              thisWeekEvents={thisWeekEvents}
            />
          )}

          {/* Upcoming Events */}
          {nextWeekEvents.length > 0 && (
            <div className='mt-8'>
              <Thisweek
                title='Upcoming Events'
                subtitle='Don’t miss what’s happening around you'
                thisWeekEvents={nextWeekEvents}
              />
            </div>
          )}

          {/* All events */}
          <div className='container mx-auto px-4 py-12 md:py-20'>
            <div className='flex flex-col min-[1330px]:flex-row gap-6 min-[1330px]:gap-12 items-center min-[1330px]:items-start max-sm:px-9'>
              {/* Left Section - Filters & Archive */}
              <div className='w-full lg:w-1/4 space-y-6 min-[1330px]:space-y-8'>
                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                  <h2 className='text-xl font-bold text-gray-900 mb-6'>Filters</h2>

                  {/* Search Bar */}
                  <div className='space-y-4'>
                    <div className='group'>
                      <label className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block'>Search</label>
                      <div className='relative flex items-center'>
                        <input
                          type='text'
                          placeholder='Search events...'
                          className='w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] focus:border-transparent transition-all'
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <IoIosSearch className='absolute right-3 text-gray-400 text-xl group-focus-within:text-[#0A6FA7] transition-colors' />
                      </div>
                    </div>

                    {/* College Filter */}
                    <div className='group'>
                      <label className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block'>Institution</label>
                      <div className='relative'>
                        <select
                          value={selectedCollege}
                          onChange={(e) => {
                            setSelectedCollege(e.target.value)
                            setPagination(prev => ({ ...prev, currentPage: 1 }))
                          }}
                          className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] focus:border-transparent transition-all appearance-none bg-white text-sm font-medium'
                        >
                          <option value=''>All Institutions</option>
                          {colleges.map((college) => (
                            <option key={college.id} value={college.id}>
                              {college.name}
                            </option>
                          ))}
                        </select>
                        <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
                          <IoIosArrowDroprightCircle className='rotate-90' />
                        </div>
                      </div>
                    </div>

                    {/* Reset Button */}
                    {(selectedCollege || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedCollege('')
                          setSearchQuery('')
                          setPagination(prev => ({ ...prev, currentPage: 1 }))
                        }}
                        className='w-full py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors'
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Events Grid */}
              <div className='w-full lg:w-3/4'>
                <div className='flex items-center justify-between mb-8'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {selectedCollege ? colleges.find(c => c.id === selectedCollege)?.name + ' Events' : 'All Events'}
                  </h2>
                  <div className='text-sm text-gray-500 font-medium'>
                    Showing {allEvents.length} of {pagination.totalCount} events
                  </div>
                </div>

                {/* Responsive Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 min-[1330px]:grid-cols-3 gap-6 md:gap-8'>
                  {allLoading ? (
                    [...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className='bg-gray-100 rounded-lg h-80 animate-pulse'
                      ></div>
                    ))
                  ) : allEvents.length === 0 ? (
                    <div className='col-span-full'>
                      <EmptyState
                        icon={Calendar}
                        title='No Events Found'
                        description={
                          searchQuery
                            ? `No events match your search "${searchQuery}"`
                            : 'No events are currently scheduled'
                        }
                        action={
                          searchQuery
                            ? {
                              label: 'Clear Search',
                              onClick: () => {
                                setSearchQuery('')
                                loadEvents(1)
                              }
                            }
                            : null
                        }
                      />
                    </div>
                  ) : (
                    allEvents.map((event) => (
                      <Link
                        href={`/events/${event.slugs}`}
                        key={event.id}
                        passHref
                      >
                        <div className='transition-transform duration-300 hover:scale-[1.02]'>
                          <EventCard event={event} />
                        </div>
                      </Link>
                    ))
                  )}
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
