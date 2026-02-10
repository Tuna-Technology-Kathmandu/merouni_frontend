'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import EventFilters from './components/EventFilters'
import FeaturedEvents from './components/FeaturedEvents'
import Sponsors from './Sponsors'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { fetchEvents, searchEvent, fetchThisWeekEvents } from './action'
import { getColleges } from '../action'

const Events = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    // State
    const [events, setEvents] = useState([])
    const [thisWeekEvents, setThisWeekEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Initialization from search params
    const initialSearch = searchParams.get('q') || ''
    const initialPage = parseInt(searchParams.get('page')) || 1

    // Filters State
    const [searchQuery, setSearchQuery] = useState(initialSearch)

    // Pagination
    const [pagination, setPagination] = useState({
        currentPage: initialPage,
        totalPages: 1,
        totalCount: 0
    })

    const debounceRef = useRef(null)

    // URL Sync Helper
    const updateURL = useCallback((params) => {
        const newParams = new URLSearchParams(searchParams.toString())
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value)
            } else {
                newParams.delete(key)
            }
        })
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
    }, [searchParams, pathname, router])

    // Data Fetching
    const fetchEventsData = async (page = 1, search = '') => {
        setLoading(true)
        setError(null)
        try {
            // Fetch main events
            let response
            if (search) {
                response = await searchEvent(search)
            } else {
                response = await fetchEvents(page)
            }

            if (response && response.items) {
                setEvents(response.items)
                if (response.pagination) {
                    setPagination({
                        currentPage: response.pagination.currentPage || page,
                        totalPages: response.pagination.totalPages || 1,
                        totalCount: response.pagination.totalCount || 0
                    })
                }
            } else {
                setEvents([])
                setPagination(prev => ({ ...prev, totalCount: 0, currentPage: page }))
            }

            // Fetch "This Week" events if not searching and on first page
            if (!search && page === 1) {
                const thisWeek = await fetchThisWeekEvents()
                setThisWeekEvents(thisWeek.events || [])
            } else {
                setThisWeekEvents([])
            }

        } catch (error) {
            console.error('Error fetching events:', error)
            setError('Failed to load events')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Removed fetchCollegesData()
    }, [])

    // Sync state when URL params change
    useEffect(() => {
        const q = searchParams.get('q') || ''
        const pg = parseInt(searchParams.get('page')) || 1

        setSearchQuery(q)
        setPagination(prev => ({ ...prev, currentPage: pg }))
        
        fetchEventsData(pg, q)
    }, [searchParams])

    // Effect: Debounced Search & Filter Change
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (searchQuery === initialSearch) return
        debounceRef.current = setTimeout(() => {
            updateURL({ 
                q: searchQuery, 
                page: 1 
            })
        }, 500)
        return () => clearTimeout(debounceRef.current)
    }, [searchQuery, updateURL, initialSearch])

    // Handle page change
    const handlePageChange = (page, search = searchQuery) => {
        if (page > 0 && page <= (pagination.totalPages || 1)) {
            updateURL({ page, q: search })
        }
    }

    // Scroll to top on any URL parameter change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' })
    }, [searchParams])

    return (
        <>
            <Header />
            <Navbar />

            <div className='min-h-screen bg-white'>
                {/* Filters Section */}
                <div className='max-w-[1600px] mx-auto px-4 sm:px-8 pt-8'>
                    <EventFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>

                {/* Content Section */}
                <FeaturedEvents
                    events={events}
                    featuredEvents={thisWeekEvents}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    searchQuery={searchQuery}
                />

                {/* Sponsors Section at the bottom */}
                {!loading && events.length > 0 && (
                    <div className='mt-20'>
                        <Sponsors />
                    </div>
                )}
            </div>

            <Footer />
        </>
    )
}

export default Events
