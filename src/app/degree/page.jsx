'use client'
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { fetchDegrees, fetchFaculties, fetchLevels } from './actions'
import { Search, BookOpen, Filter, X, GraduationCap } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Pagination from '../blogs/components/Pagination'
import DegreeCard from '@/ui/molecules/cards/DegreeCard'
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

  const loadDegrees = useCallback(
    async (page = 1, search = '', facultyId = '', level = '') => {
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
    },
    []
  )

  // Reset to page 1 when search or filters change
  useLayoutEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [debouncedSearch, selectedFaculty, selectedLevel])

  // Fetch when page, search, or filters change
  useEffect(() => {
    loadDegrees(
      pagination.currentPage,
      debouncedSearch,
      selectedFaculty,
      selectedLevel
    )
  }, [debouncedSearch, pagination.currentPage, selectedFaculty, selectedLevel])

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
                  Explore <span className='text-[#0A6FA7]'>Degrees</span>
                </h1>
                <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
              </div>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
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
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {courses.map((degree) => (
                  <DegreeCard key={degree.id ?? degree.slugs} degree={degree} />
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
