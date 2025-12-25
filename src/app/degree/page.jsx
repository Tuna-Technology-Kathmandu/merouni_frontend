'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { fetchDegrees } from './actions'
import { getAllFaculty } from '../courses/actions'
import { Search } from 'lucide-react'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Shimmer from '../../components/Shimmer'
import Link from 'next/link'
import Pagination from '../blogs/components/Pagination'

const DegreePage = () => {
  const [courses, setCourses] = useState([])
  const [isScrolling, setIsScrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  const topRef = useRef()
  //for filter
  const storeDuration = [
    '1 years',
    '2 years',
    '3 years',
    '4 years',
    '5 years',
    '6 years',
    '7 years'
  ]
  const [storeFaculties, setStoreFaculties] = useState([])
  const [showFaculties, setShowFaculties] = useState(false)
  const [showDurations, setShowDurations] = useState(false)
  const [filters, setFilters] = useState({
    credits: { min: '', max: '' },
    duration: '',
    faculty: ''
  })

  const [draftFilters, setDraftFilters] = useState({
    credits: { min: '', max: '' },
    duration: '',
    faculty: ''
  })
  const [isSearching, setIsSearching] = useState(false)

  // Load degrees
  const loadDegrees = useCallback(
    async (page) => {
      setLoading(true)
      try {
        const credits =
          filters.credits?.min && filters.credits?.max
            ? `${filters.credits.min}-${filters.credits.max}`
            : ''

        const duration = filters.duration || ''

        const faculty = filters.faculty || ''
        const response = await fetchDegrees(
          page,
          credits,
          duration,
          faculty,
          debouncedSearch
        )
        setCourses(response.items)
        setPagination(response?.pagination)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    },
    [filters, debouncedSearch]
  )

  // for faaculties fetching
  const fetchFaculties = async () => {
    try {
      const response = await getAllFaculty(1)
      console.log('API response:', response)
      setStoreFaculties(response?.items ?? [])
    } catch (err) {
      console.error('Failed to fetch faculties:', err)
    }
  }

  useEffect(() => {
    loadDegrees(1)
  }, [filters, debouncedSearch])

  useEffect(() => {
    loadDegrees(pagination?.currentPage)
  }, [pagination?.currentPage])

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination?.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }))
    }
  }

  //useEffect after page change
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (!topRef.current) return

    const y = topRef.current.getBoundingClientRect().top + window.scrollY - 200

    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [pagination?.currentPage, filters, debouncedSearch])

  //for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchTerm])

  //for faculty
  useEffect(() => {
    fetchFaculties()
  }, [])

  // reset filters and search
  const reset = () => {
    const empty = {
      credits: { min: '', max: '' },
      duration: '',
      faculty: ''
    }

    setDraftFilters(empty)
    setFilters(empty)
    setSearchTerm('')
    setDebouncedSearch('')
  }

  //handle filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const [type, key] = name.split('.')
    setDraftFilters((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value }
    }))
  }

  //apply
  const applyFilters = () => {
    setFilters(draftFilters)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className='min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-12 px-6'>
        <div className='container mx-auto'>
          {/* Title */}
          <div className='text-center mb-12'>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
              Explore Our <span className='text-[#0A70A7]'>Degrees</span>
            </h1>
            <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
              Discover a wide range of degree programs designed to help you
              achieve your academic and career goals.
            </p>
          </div>

          {/* Search */}
          <div className='flex justify-center mb-10 md:mb-20 '>
            <div className='relative w-full max-w-lg'>
              <input
                type='text'
                placeholder='Search degrees...'
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
              />
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
              {isSearching && (
                <div className='absolute right-4 top-3.5'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#0A70A7]'></div>
                </div>
              )}
            </div>
          </div>

          {/* Courses */}
          <div className='w-full p-4 flex flex-col lg:flex-row gap-10 justify-between'>
            <div className='w-full lg:w-1/4 mb-6 lg:mb-0'>
              <div className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg'>
                <div className='mb-4 w-full flex justify-between'>
                  <h3 className='font-semibold text-xl'>Filters</h3>
                  <h3
                    className=' text-sm hover:text-clientBtn hover:cursor-pointer'
                    onClick={reset}
                  >
                    Reset
                  </h3>
                </div>

                {/* faculty filter */}
                <div className='mb-4 relative z-20'>
                  <div
                    className='w-full border p-3 flex items-center rounded-lg cursor-pointer'
                    onClick={() => setShowFaculties(!showFaculties)}
                  >
                    <h1 className='block text-sm font-medium text-gray-600'>
                      {draftFilters.faculty === ''
                        ? 'Faculty'
                        : draftFilters.faculty}
                    </h1>
                  </div>

                  {showFaculties && (
                    <div className='absolute top-[122%] text-sm h-44 overflow-scroll w-full bg-white rounded-lg shadow-[0px_0px_10px_3px_rgba(0,0,0,0.2)]'>
                      {storeFaculties.map((item, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setDraftFilters((prev) => ({
                                ...prev,
                                faculty: item.title
                              }))
                              setShowFaculties(false)
                            }}
                            className='w-full p-3 hover:bg-slate-200 cursor-pointer'
                          >
                            {item?.title}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* crsfits filter */}
                <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-600 mb-2'>
                    Credits
                  </label>
                  <div className='flex gap-2'>
                    <input
                      type='number'
                      name='credits.min'
                      value={draftFilters.credits.min}
                      onChange={handleFilterChange}
                      placeholder='Min'
                      className='w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <input
                      type='number'
                      name='credits.max'
                      value={draftFilters.credits.max}
                      onChange={handleFilterChange}
                      placeholder='Max'
                      className='w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>

                {/* Duration Filter */}
                <div className='mb-4 relative'>
                  <div
                    className='w-full border p-3 flex items-center rounded-lg cursor-pointer'
                    onClick={() => setShowDurations(!showDurations)}
                  >
                    <h1 className='block text-sm font-medium text-gray-600'>
                      {draftFilters.duration === ''
                        ? 'Duration'
                        : draftFilters.duration}
                    </h1>
                  </div>

                  {showDurations && (
                    <div className='absolute top-[122%] text-sm h-44 overflow-scroll w-full bg-white rounded-lg shadow-[0px_0px_10px_3px_rgba(0,0,0,0.2)]'>
                      {storeDuration.map((item, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => {
                              setDraftFilters((prev) => ({
                                ...prev,
                                duration: item
                              }))
                              setShowDurations(false)
                            }}
                            className='w-full p-3 hover:bg-slate-200 cursor-pointer'
                          >
                            {item}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div
                  className=' w-full flex justify-center mt-3'
                  onClick={applyFilters}
                >
                  <button className='text-sm font-semibold px-4 py-2 bg-[#387CAE] hover:bg-[#29638c] text-white rounded-lg '>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            <div className='w-full lg:w-3/4' ref={topRef}>
              {loading || isScrolling ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {Array(6)
                    .fill('')
                    .map((_, index) => (
                      <div
                        key={index}
                        className='bg-white rounded-2xl p-6 border border-gray-200 shadow-md'
                      >
                        <div className='flex items-start gap-4'>
                          <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                            <Shimmer width='30px' height='30px' />
                          </div>
                          <div className='flex flex-col gap-3 w-full'>
                            <Shimmer width='80%' height='20px' />
                            <Shimmer width='60%' height='18px' />
                            <Shimmer width='90%' height='15px' />
                            <div className='flex gap-2'>
                              <Shimmer width='40%' height='15px' />
                              <Shimmer width='40%' height='15px' />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {courses.length === 0 ? (
                      <div className='text-center text-gray-500 mt-8 col-span-full'>
                        No degrees found matching your search.
                      </div>
                    ) : (
                      courses.map((degree, index) => (
                        <Link href={`/degree/${degree.slugs}`} key={index}>
                          <div className='border rounded-2xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer'>
                            <h2 className='text-lg font-bold text-gray-800 mb-3 min-h-[60px]'>
                              {degree.title}
                            </h2>
                            <div className='space-y-2 text-sm'>
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Duration:</span>
                                <span className='font-medium'>
                                  {degree.duration}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Credits:</span>
                                <span className='font-medium'>
                                  {degree.credits}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Language:</span>
                                <span className='font-medium'>
                                  {degree.language}
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-gray-600'>Delivery:</span>
                                <span className='font-medium'>
                                  {degree.delivery_mode}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className='mt-12 flex justify-center'>
                      <Pagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default DegreePage
