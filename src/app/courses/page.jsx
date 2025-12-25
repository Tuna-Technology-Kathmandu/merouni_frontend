'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Search } from 'lucide-react'
import { fetchCourses } from './actions' // Make sure this points to the updated version of fetchCourses
import { getAllFaculty } from './actions'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Shimmer from '../../components/Shimmer'

import { getBanners } from '../action'
import AdLayout from '../../components/Frontpage/AdLayout'
import Link from 'next/link'
import Pagination from '../blogs/components/Pagination'

const CoursePage = () => {
  const [courses, setCourses] = useState([])
  const [banner, setBanner] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    credits: { min: '', max: '' },
    duration: { min: '', max: '' },
    faculty: ''
  })

  const [draftFilters, setDraftFilters] = useState({
    credits: { min: '', max: '' },
    duration: { min: '', max: '' },
    faculty: ''
  })

  const empty = {
    credits: { min: '', max: '' },
    duration: { min: '', max: '' },
    faculty: ''
  }
  const [storeFaculties, setStoreFaculties] = useState([])
  const [showFaculties, setShowFaculties] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  //for pagination
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalCount: 1
  })

  const topRef = useRef(null)

  const fetchCoursesData = async (page) => {
    setLoading(true)

    try {
      const credits =
        filters.credits?.min && filters.credits?.max
          ? `${filters.credits.min}-${filters.credits.max}`
          : ''

      const duration =
        filters.duration?.min && filters.duration?.max
          ? `${filters.duration.min}-${filters.duration.max}`
          : ''

      const faculty = filters.faculty || ''

      const response = await fetchCourses(
        credits,
        duration,
        faculty,
        page,
        debouncedSearch
      )

      setCourses(response.items)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

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
    fetchCoursesData(1)
  }, [filters, debouncedSearch])

  useEffect(() => {
    fetchCoursesData(pagination.currentPage)
  }, [pagination.currentPage])

  useEffect(() => {
    fetchBanner()
  }, [])

  //for faculty
  useEffect(() => {
    fetchFaculties()
  }, [])

  const fetchBanner = async () => {
    try {
      const response = await getBanners()
      setBanner(response.items)
    } catch (error) {}
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const [type, key] = name.split('.')
    setDraftFilters((prev) => ({
      ...prev,
      [type]: { ...prev[type], [key]: value }
    }))
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
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
  }, [pagination.currentPage, filters, debouncedSearch])

  //for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // reset filters and search
  const reset = () => {
    setDraftFilters(empty)
    setFilters(empty)
    setSearchTerm('')
    setDebouncedSearch('')
  }

  const applyFilters = () => {
    setFilters(draftFilters)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }
  return (
    <>
      <Header />
      <Navbar />
      <AdLayout banners={banner} size='medium' number={3} />

      <div className='min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-12 px-6'>
        <div className='text-center mb-12'>
          <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
            <span className='text-[#0A70A7]'>Courses</span>
          </h1>
          <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
            Discover a wide range of courses
          </p>
        </div>

        <div className='flex justify-center mb-10 md:mb-20 '>
          <div className='relative w-full max-w-lg'>
            <input
              type='text'
              placeholder='Search courses...'
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
            />
            <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
          </div>
        </div>

        <div className='w-full p-4 flex flex-col lg:flex-row gap-10 justify-between'>
          {/* Sidebar with Filters */}
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
              <div className='mb-4 relative'>
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

              {/* Duration Filter (Range) */}
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-600 mb-2'>
                  Duration (months)
                </label>
                <div className='flex gap-2'>
                  <input
                    type='number'
                    name='duration.min'
                    value={draftFilters.duration.min}
                    onChange={handleFilterChange}
                    placeholder='Min'
                    className='w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                  <input
                    type='number'
                    name='duration.max'
                    value={draftFilters.duration.max}
                    onChange={handleFilterChange}
                    placeholder='Max'
                    className='w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
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
            {loading ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {Array(6)
                  .fill('')
                  .map((_, index) => (
                    <div
                      key={index}
                      className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg'
                    >
                      <div className='flex justify-evenly items-start mb-4'>
                        <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                          <Shimmer width='30px' height='30px' />
                        </div>
                        <div className='flex flex-col gap-4 w-full'>
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
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {courses.length > 0 ? (
                  courses.map((course, index) => (
                    <div
                      key={index}
                      className='bg-white w-full rounded-xl p-4 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300'
                    >
                      <div className='w-full flex mb-4'>
                        <div className='w-full'>
                          <h3 className='font-semibold text-lg leading-tight mb-2'>
                            {course.title}
                          </h3>
                          <p className='text-sm text-gray-600 mb-2'>
                            <span className='text-black font-semibold'>
                              Code:
                            </span>{' '}
                            {course.code}
                          </p>
                          <p
                            className='text-black text-sm my-4 text-justify'
                            dangerouslySetInnerHTML={{
                              __html:
                                course.description.length > 140
                                  ? course.description.slice(0, 140) + '...'
                                  : course.description
                            }}
                          ></p>
                          <div className='w-full flex mb-4 justify-between'>
                            <span className='text-sm text-gray-600'>
                              <span className='text-black font-semibold'>
                                Credits:
                              </span>{' '}
                              {course.credits}
                            </span>
                            <span className='text-[13px] text-gray-600'>
                              <span className='text-black font-medium'>
                                Duration:
                              </span>{' '}
                              {course.duration} months
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/degree/single-subject/${course?.slugs}`}
                        className='flex gap-3'
                      >
                        <button className='flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium'>
                          Details
                        </button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className='text-center text-sm'>
                    No courses found with the selected filters.
                  </p>
                )}
              </div>
            )}

            {/* pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default CoursePage
