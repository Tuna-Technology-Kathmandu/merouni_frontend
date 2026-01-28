'use client'
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { fetchDegrees } from './actions'
import { Search } from 'lucide-react'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Link from 'next/link'
import Pagination from '../blogs/components/Pagination'
import { CardSkeleton } from '@/components/ui/CardSkeleton'

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
  const [isSearching, setIsSearching] = useState(false)

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Load degrees
  const loadDegrees = useCallback(async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await fetchDegrees(search, page)
      setCourses(response.items)
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalCount: response.pagination.totalCount
      }))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset to page 1 when search changes (only if not already page 1)
  useLayoutEffect(() => {
    setPagination((prev) =>
      prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev
    )
  }, [debouncedSearch])

  // Fetch when page or search changes
  useEffect(() => {
    loadDegrees(pagination.currentPage, debouncedSearch)
  }, [debouncedSearch, pagination.currentPage, loadDegrees])

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setIsScrolling(true)
      setPagination((prev) => ({ ...prev, currentPage: page }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setIsScrolling(false), 500)
    }
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
          {loading || isScrolling ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          ) : courses.length === 0 ? (
            <div className='min-h-[400px] flex items-center justify-center'>
              <div className='text-center'>
                <div className='mb-4'>
                  <svg
                    className='mx-auto h-24 w-24 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  No Degrees Found
                </h3>
                <p className='text-gray-600 mb-4'>
                  {searchTerm
                    ? `No degrees match your search "${searchTerm}"`
                    : 'No degrees are currently available'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0A70A7] hover:bg-[#085a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A70A7]'
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {courses.map((degree, index) => (
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
                ))}
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
      <Footer />
    </>
  )
}

export default DegreePage
