'use client'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { fetchUniversities } from './actions'
import { Search } from 'lucide-react'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Link from 'next/link'
import UniversityShimmer from './components/UniversityShimmer'
import Pagination from '../blogs/components/Pagination'

const UniversityPage = () => {
  const [universities, setUniversities] = useState([]) // Renamed for clarity
  const [loading, setLoading] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const loadUniversity = useCallback(async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await fetchUniversities(search, page)
      setUniversities(response.items)
      setPagination((prev) => ({
        ...prev,
        totalPages: response?.totalPages,
        totalCount: response?.totalItems
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
    loadUniversity(pagination.currentPage, debouncedSearch)
  }, [debouncedSearch, pagination.currentPage, loadUniversity])

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setIsScrolling(true)
      setPagination((prev) => ({ ...prev, currentPage: page }))
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pagination.currentPage])

  return (
    <>
      <Header />
      <Navbar />
      <div className='min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-12 px-6'>
        <div className='container mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
              Available <span className='text-[#0A70A7]'>Universities</span>
            </h1>
            <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
              Discover a wide range of degree programs designed to help you
              achieve your academic and career goals.
            </p>
          </div>

          {/* Search Bar */}
          <div className='flex justify-center mb-10 md:mb-20 '>
            <div className='relative w-full max-w-lg'>
              <input
                type='text'
                placeholder='Search university...'
                className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
            </div>
          </div>
        </div>

        {/* Universities Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, index) => (
              <UniversityShimmer key={index} />
            ))}
          </div>
        ) : universities.length === 0 ? ( // Check for empty universities array *after* loading
          <div className='text-center text-gray-500 mt-8'>
            No universities found.
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {universities
              .filter((uni) =>
                uni.fullname.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((uni, index) => (
                <Link href={`/universities/${uni?.slugs}`} key={index}>
                  <div className='border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white'>
                    <div className='mb-4 flex justify-between items-center'>
                      <h2 className='text-xl font-semibold'>{uni.fullname}</h2>
                      <img
                        src={
                          uni?.featured_image ||
                          `https://avatar.iran.liara.run/username?username=${uni?.fullname}`
                        } // Consider using a placeholder or actual university logo
                        alt={uni.fullname + ' Logo'} // Add alt text for accessibility
                        className='w-[65px] h-[65px] rounded-2xl'
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://placehold.co/600x400'
                        }} // Placeholder on image error
                      />
                    </div>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span>
                          {uni.city}, {uni.state} {uni.country}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className='mt-12 flex justify-center'>
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default UniversityPage
