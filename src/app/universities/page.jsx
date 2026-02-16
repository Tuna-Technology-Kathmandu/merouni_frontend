'use client'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { fetchUniversities } from './actions'
import { Search, GraduationCap } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import UniversityShimmer from './components/UniversityShimmer'
import Pagination from '../blogs/components/Pagination'
import UniversityCard from './components/UniversityCard'

const UniversityPage = () => {
  const [universities, setUniversities] = useState([])
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
      console.log(response.items,"response.items")
      if (response && response.items) {
        setUniversities(response.items)
        setPagination((prev) => ({
          ...prev,
          totalPages: response.pagination ? response.pagination.totalPages : 1, // Handle potential missing pagination
          totalCount: response.pagination
            ? response.pagination.totalCount
            : response.items.length
        }))
      } else {
        setUniversities([])
      }
    } catch (error) {
      console.error('Error:', error)
      setUniversities([])
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
      <div className='min-h-screen bg-white py-12 md:py-20 px-4 sm:px-6'>
        <div className='max-w-[1600px] mx-auto'>
          <div className='text-center mb-16'>
            <h1 className='text-3xl md:text-4xl font-black text-gray-900 mb-4'>
              Available <span className='text-[#0A70A7]'>Universities</span>
            </h1>
            <p className='text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed'>
              Discover a wide range of degree programs designed to help you
              achieve your academic and career goals.
            </p>
          </div>

          {/* Search Bar */}
          <div className='flex justify-center mb-16'>
            <div className='relative w-full max-w-xl'>
              <input
                type='text'
                placeholder='Search universities...'
                className='w-full px-6 py-4 pl-14 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#0A70A7] focus:ring-4 focus:ring-[#0A70A7]/10 outline-none transition-all duration-300 text-gray-800 placeholder:text-gray-400 font-medium'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className='absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Universities Grid */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {[...Array(8)].map((_, index) => (
                <UniversityShimmer key={index} />
              ))}
            </div>
          ) : universities.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title='No Universities Found'
              description={
                searchTerm
                  ? `No universities match "${searchTerm}"`
                  : 'No universities are currently available'
              }
              action={
                searchTerm
                  ? {
                      label: 'Clear Search',
                      onClick: () => {
                        setSearchTerm('')
                        loadUniversity(1)
                      }
                    }
                  : null
              }
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {universities
                // Filter is handled by API usually, but keeping simplistic client-side check if needed, mostly redundant if API handles 'q'
                .map((uni, index) => (
                  <UniversityCard key={index} university={uni} />
                ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='mt-16 flex justify-center'>
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default UniversityPage
