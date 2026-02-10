'use client'
import React, { useEffect, useState, useCallback, useLayoutEffect, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Initialization from search params
  const initialSearch = searchParams.get('q') || ''
  const initialDisciplines = searchParams.get('disciplines')?.split(',').map(Number).filter(Boolean) || []
  const initialPage = parseInt(searchParams.get('page')) || 1

  const [degrees, setDegrees] = useState([])
  const [isScrolling, setIsScrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)

  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalCount: 0
  })
  const [isSearching, setIsSearching] = useState(false)
  const [selectedDisciplines, setSelectedDisciplines] = useState(initialDisciplines)
  const [filteredDisciplines, setFilteredDisciplines] = useState([])
  const [isDisciplinesLoading, setIsDisciplinesLoading] = useState(false)
  const [filterInput, setFilterInput] = useState('')

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

  // Sync state with URL
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const discs = searchParams.get('disciplines')?.split(',').map(Number).filter(Boolean) || []
    const pg = parseInt(searchParams.get('page')) || 1

    setSearchTerm(q)
    setDebouncedSearch(q)
    setSelectedDisciplines(discs)
    setPagination(prev => ({ ...prev, currentPage: pg }))
  }, [searchParams])

  // Scroll to top on URL change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [searchParams])

  // Debounce search (Updates URL)
  useEffect(() => {
    setIsSearching(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setIsSearching(false)
      if (searchTerm !== initialSearch) {
        updateURL({ q: searchTerm, page: 1 })
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm, initialSearch, updateURL])

  // Disciplines update URL
  useEffect(() => {
    const currentDiscsStr = selectedDisciplines.join(',')
    if (currentDiscsStr !== (searchParams.get('disciplines') || '')) {
      updateURL({ disciplines: currentDiscsStr, page: 1 })
    }
  }, [selectedDisciplines, searchParams, updateURL])

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

  // Fetch when searchParams change
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const discs = searchParams.get('disciplines')?.split(',').map(Number).filter(Boolean) || []
    const pg = parseInt(searchParams.get('page')) || 1
    loadDegrees(pg, q, discs)
  }, [searchParams, loadDegrees])

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      updateURL({ page })
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

          {/* Search Bar Section */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8 border-b border-gray-100 pb-12'>
            <div className='flex-1 space-y-6 w-full'>
              <div className='flex items-center gap-4 mb-2'>
                <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
                  Degrees
                </h2>
                <span className='bg-blue-50 text-[#0A6FA7] px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider'>
                  {pagination.totalCount || '0'} Results
                </span>
              </div>

              <div className='flex bg-white items-center rounded-2xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#0A6FA7] focus-within:border-[#0A6FA7] transition-all px-5 py-2.5 relative w-full group'>
                <Search className='w-5 h-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Degree title or short name...'
                  className='w-full px-4 py-2 bg-transparent text-base font-medium outline-none placeholder:text-gray-400'
                />
                <div className='absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3'>
                  {isSearching && (
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#0A6FA7]'></div>
                  )}
                  {searchTerm && (
                    <button
                      onClick={clearFilters}
                      className='p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-all'
                      title='Clear search'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar & Content Section */}
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
