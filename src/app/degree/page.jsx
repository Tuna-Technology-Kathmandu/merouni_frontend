'use client'
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { fetchDegrees, fetchFaculties, fetchLevels } from './actions'
import { Search, BookOpen, Filter, X, GraduationCap } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Link from 'next/link'
import Pagination from '../blogs/components/Pagination'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'

const DegreePage = () => {
  const [courses, setCourses] = useState([])
  const [isScrolling, setIsScrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Filter states
  const [faculties, setFaculties] = useState([])
  const [levels, setLevels] = useState([])
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [isSearching, setIsSearching] = useState(false)

  // Fetch filter options on mount
  useEffect(() => {
    const getFilterOptions = async () => {
      try {
        const [facList, levelList] = await Promise.all([
          fetchFaculties(),
          fetchLevels()
        ])
        setFaculties(facList || [])
        setLevels(levelList || [])
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }
    getFilterOptions()
  }, [])

  // Debounce search
  useEffect(() => {
    setIsSearching(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setIsSearching(false)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

<<<<<<< HEAD
  // Load degrees
  const loadDegrees = useCallback(
    async (page = 1, search = '', faculty = '', level = '') => {
      setLoading(true)
      try {
        const response = await fetchDegrees(search, page, faculty, level)
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
    },
    []
  )
=======
  const loadDegrees = useCallback(async (page = 1, search = '', facultyId = '', level = '') => {
    setLoading(true)
    try {
      const response = await fetchDegrees(search, page, facultyId, level)
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
>>>>>>> a01b8f31c52222f3dfa4c2f7e49e896c890131d5

  // Reset to page 1 when search or filters change
  useLayoutEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [debouncedSearch, selectedFaculty, selectedLevel])

  // Fetch when page, search, or filters change
  useEffect(() => {
<<<<<<< HEAD
    loadDegrees(
      pagination.currentPage,
      debouncedSearch,
      selectedFaculty,
      selectedLevel
    )
  }, [
    debouncedSearch,
    pagination.currentPage,
    selectedFaculty,
    selectedLevel,
    loadDegrees
  ])
=======
    loadDegrees(pagination.currentPage, debouncedSearch, selectedFaculty, selectedLevel)
  }, [debouncedSearch, pagination.currentPage, selectedFaculty, selectedLevel])
>>>>>>> a01b8f31c52222f3dfa4c2f7e49e896c890131d5

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setIsScrolling(true)
      setPagination((prev) => ({ ...prev, currentPage: page }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedFaculty('')
    setSelectedLevel('')
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className='min-h-screen bg-gray-50/50 py-12 px-6 font-sans'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
            <div>
              <div className='relative inline-block mb-3'>
                <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight'>
                  Explore Our <span className='text-[#0A6FA7]'>Degrees</span>
                </h1>
                <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
              </div>
              <p className='text-gray-500 max-w-xl font-medium text-lg mt-2'>
                Discover specialized degree programs tailored to your academic
                and professional aspirations.
              </p>
            </div>

            {/* Clear All Button */}
            {(searchTerm || selectedFaculty || selectedLevel) && (
              <button
                onClick={clearFilters}
                className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
              >
                <X className='w-4 h-4' />
                Clear All Filters
              </button>
            )}
          </div>

          {/* Filters & Search Bar */}
          <div className='bg-white rounded-[32px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6'>
              {/* Search */}
              <div className='lg:col-span-6'>
                <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                  Search Programs
                </label>
                <div className='relative group'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                  <input
                    type='text'
                    placeholder='Program title or keyword...'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400'
                  />
                  {isSearching && (
                    <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A6FA7]'></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Faculty Filter */}
              <div className='lg:col-span-3'>
                <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                  Faculty
                </label>
                <div className='relative group'>
                  <Filter className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors z-10' />
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className='w-full px-12 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 appearance-none cursor-pointer'
                  >
                    <option value=''>All Faculties</option>
                    {faculties.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Level Filter */}
              <div className='lg:col-span-3'>
                <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                  Level
                </label>
                <div className='relative group'>
                  <GraduationCap className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors z-10' />
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className='w-full px-12 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 appearance-none cursor-pointer'
                  >
                    <option value=''>All Levels</option>
                    {levels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && !isScrolling && (
            <div className='mb-8 px-2'>
              <p className='text-sm text-gray-500 font-semibold'>
                Showing <span className='text-gray-900'>{courses.length}</span>{' '}
                of{' '}
                <span className='text-gray-900'>{pagination.totalCount}</span>{' '}
                results
              </p>
            </div>
          )}

          {/* Courses Grid */}
          {loading || isScrolling ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          ) : courses.length === 0 ? (
            <div className='bg-white rounded-[32px] border border-gray-100 border-dashed py-20'>
              <EmptyState
                icon={BookOpen}
                title='No Degrees Found'
                description={
                  searchTerm || selectedFaculty || selectedLevel
                    ? 'No degrees match your current filter criteria. Try adjusting your search or filters.'
                    : 'No degrees are currently available'
                }
                action={
                  searchTerm || selectedFaculty || selectedLevel
                    ? { label: 'Clear All Filters', onClick: clearFilters }
                    : null
                }
              />
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {courses.map((degree, index) => (
                  <Link
                    href={`/degree/${degree.slugs}`}
                    key={index}
                    className='group'
                  >
                    <div className='h-full bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#0A6FA7]/5 hover:border-[#0A6FA7]/20 transition-all duration-500 flex flex-col'>
                      <div className='flex items-start justify-between mb-6'>
                        <div className='bg-[#0A6FA7]/10 p-3 rounded-2xl group-hover:bg-[#0A6FA7] transition-colors duration-500'>
                          <BookOpen className='w-6 h-6 text-[#0A6FA7] group-hover:text-white transition-colors duration-500' />
                        </div>
                        {degree.programlevel?.title && (
                          <span className='px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-100'>
                            {degree.programlevel.title}
                          </span>
                        )}
                      </div>

                      <h2 className='text-xl font-bold text-gray-900 mb-4 group-hover:text-[#0A6FA7] transition-colors line-clamp-2 min-h-[3.5rem] tracking-tight'>
                        {degree.title}
                      </h2>

                      {degree.programfaculty?.title && (
                        <p className='text-sm text-[#30AD8F] font-bold mb-6 flex items-center gap-2'>
                          <span className='w-1.5 h-1.5 rounded-full bg-[#30AD8F]'></span>
                          {degree.programfaculty.title}
                        </p>
                      )}

                      <div className='mt-auto space-y-4 pt-6 border-t border-gray-50'>
                        <div className='flex items-center justify-between'>
                          <div className='flex flex-col'>
                            <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                              Duration
                            </span>
                            <span className='text-sm font-bold text-gray-700'>
                              {degree.duration || 'N/A'}
                            </span>
                          </div>
                          <div className='flex flex-col text-right'>
                            <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                              Credits
                            </span>
                            <span className='text-sm font-bold text-gray-700'>
                              {degree.credits || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className='flex items-center justify-between'>
                          <div className='flex flex-col'>
                            <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                              Delivery
                            </span>
                            <span className='text-sm font-bold text-gray-700'>
                              {degree.delivery_mode || 'N/A'}
                            </span>
                          </div>
                          <div className='flex flex-col text-right'>
                            <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                              Language
                            </span>
                            <span className='text-sm font-bold text-gray-700'>
                              {degree.language || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='mt-20 flex justify-center'>
                  <div className='bg-white px-8 py-4 rounded-[24px] shadow-sm border border-gray-100'>
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
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
