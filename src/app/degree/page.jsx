'use client'
import React, { useEffect, useState, useCallback, useLayoutEffect, useMemo } from 'react'
import { debounce } from 'lodash'
import { fetchDegrees, getDiscipline } from './actions'
import { Search, BookOpen, X } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Pagination from '../blogs/components/Pagination'
import DegreeCard from '@/ui/molecules/cards/DegreeCard'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'

// Memoized FilterSection with local state for performant typing
const FilterSection = React.memo(function FilterSection({
  title,
  inputField,
  options,
  selectedValues,
  onCheckboxChange,
  defaultValue,
  onSearchChange,
  isLoading
}) {
  const [localSearch, setLocalSearch] = useState(defaultValue || '')

  const debouncedSearch = useMemo(
    () => debounce((val) => onSearchChange(inputField, val), 300),
    [onSearchChange, inputField]
  )

  const handleInputChange = (e) => {
    const val = e.target.value
    setLocalSearch(val)
    debouncedSearch(val)
  }

  // Update local search if default value changes externally (e.g. Clear All)
  useEffect(() => {
    setLocalSearch(defaultValue || '')
  }, [defaultValue])

  return (
    <div className='bg-white rounded-2xl p-6 border border-gray-200 shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-gray-800 font-bold text-xs md:text-sm uppercase tracking-wider'>
          {title}
        </h3>
      </div>
      <div className='relative flex items-center mb-4'>
        <Search className='absolute left-3 w-4 h-4 text-gray-400' />
        <input
          type='text'
          value={localSearch}
          onChange={handleInputChange}
          placeholder={`Search ${title.toLowerCase()}...`}
          className='w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
        />
        {isLoading && (
          <div className='absolute right-3'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A70A7]'></div>
          </div>
        )}
      </div>
      <div className='mt-2 space-y-2.5 overflow-y-auto h-36 pr-2 custom-scrollbar'>
        {options.length === 0 ? (
          <div className='text-center py-6 text-xs text-gray-400 italic font-medium'>
            No matches found
          </div>
        ) : (
          options.map((opt, idx) => (
            <label
              key={idx}
              className='flex items-center gap-3 group cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedValues.includes(opt.id || opt.name)}
                onChange={() => onCheckboxChange(opt.id || opt.name)}
                className='w-4 h-4 rounded border-gray-300 text-[#0A70A7] focus:ring-[#0A70A7] transition-all cursor-pointer'
              />
              <span className='text-gray-600 group-hover:text-gray-900 text-sm font-medium transition-colors'>
                {opt.name}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  )
})

const DegreePage = () => {
  const [degrees, setDegrees] = useState([])
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
  const [selectedDisciplines, setSelectedDisciplines] = useState([])
  const [filteredDisciplines, setFilteredDisciplines] = useState([])
  const [isDisciplinesLoading, setIsDisciplinesLoading] = useState(false)
  const [filterInput, setFilterInput] = useState('')

  // Debounce search
  useEffect(() => {
    setIsSearching(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setIsSearching(false)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const fetchDisciplinesList = useCallback(async (q = '') => {
    setIsDisciplinesLoading(true)
    const data = await getDiscipline(q)
    setFilteredDisciplines(data.map((d) => ({ id: d.id, name: d.title })))
    setIsDisciplinesLoading(false)
  }, [])

  useEffect(() => {
    fetchDisciplinesList('')
  }, [fetchDisciplinesList])

  const loadDegrees = useCallback(async (page = 1, search = '', disciplines = []) => {
    setLoading(true)
    try {
      const response = await fetchDegrees(search, page, disciplines)
      setDegrees(response.items || [])
      setPagination((prev) => ({
        ...prev,
        totalPages: response.pagination?.totalPages ?? 1,
        totalCount: response.pagination?.totalCount ?? 0
      }))
    } catch (error) {
      console.error('Error:', error)
      setDegrees([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset to page 1 when search or filters change
  useLayoutEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [debouncedSearch, selectedDisciplines])

  // Fetch when page, search or filters change
  useEffect(() => {
    loadDegrees(pagination.currentPage, debouncedSearch, selectedDisciplines)
  }, [debouncedSearch, pagination.currentPage, selectedDisciplines])

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
    setSelectedDisciplines([])
    setFilterInput('')
  }

  const handleDisciplineToggle = (disciplineId) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disciplineId)
        ? prev.filter((id) => id !== disciplineId)
        : [...prev, disciplineId]
    )
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

            {/* Clear Search Button */}
            {searchTerm && (
              <button
                onClick={clearFilters}
                className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
              >
                <X className='w-4 h-4' />
                Clear Search
              </button>
            )}
          </div>

          {/* Results Summary & Search Bar joined */}
          <div className='flex flex-col lg:flex-row gap-12'>
            {/* Sidebar */}
            <div className='lg:w-[320px] space-y-8 shrink-0 hidden lg:block sticky top-24 self-start max-h-[calc(100vh-160px)] overflow-y-auto pr-2 sidebar-scrollbar'>
              <div className='flex justify-between items-center mb-[-16px] px-1'>
                <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Filters</span>
                <button
                  className='text-gray-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-wider transition-colors'
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>
              <FilterSection
                title='Discipline'
                inputField='discipline'
                options={filteredDisciplines}
                selectedValues={selectedDisciplines}
                onCheckboxChange={handleDisciplineToggle}
                defaultValue={filterInput}
                onSearchChange={(field, val) => {
                  setFilterInput(val)
                  fetchDisciplinesList(val)
                }}
                isLoading={isDisciplinesLoading}
              />
            </div>

            {/* Main Content */}
            <div className='flex-1'>
              <div className='bg-white rounded-[32px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-12'>
                <div className='max-w-2xl'>
                  <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                    Search Degrees
                  </label>
                  <div className='relative group'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                    <input
                      type='text'
                      placeholder='Degree title or short name...'
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
              </div>

              {!loading && !isScrolling && (
                <div className='mb-8 px-2'>
                  <p className='text-sm text-gray-500 font-semibold'>
                    Showing <span className='text-gray-900'>{degrees.length}</span>{' '}
                    of{' '}
                    <span className='text-gray-900'>{pagination.totalCount}</span>{' '}
                    results
                  </p>
                </div>
              )}

          {/* Degrees Grid */}
          {loading || isScrolling ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          ) : degrees.length === 0 ? (
            <div className='bg-white rounded-[32px] border border-gray-100 border-dashed py-20'>
              <EmptyState
                icon={BookOpen}
                title='No Degrees Found'
                description={
                  searchTerm
                    ? 'No degrees match your search. Try a different keyword.'
                    : 'No degrees are currently available'
                }
                action={
                  searchTerm
                    ? { label: 'Clear Search', onClick: clearFilters }
                    : null
                }
              />
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {degrees.map((degree) => (
                  <DegreeCard key={degree.id ?? degree.slug} degree={degree} />
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
        </div>
      </div>
      <Footer />
    </>
  )
}

export default DegreePage
