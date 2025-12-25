'use client'
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { fetchDegrees } from './actions'
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
      <Footer />
    </>
  )
}

export default DegreePage
