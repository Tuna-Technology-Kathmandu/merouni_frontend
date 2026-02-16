'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { debounce } from 'lodash'
import { Search, Building2, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import EmptyState from '@/ui/shadcn/EmptyState'
import UniversityShimmer from './UniversityShimmer'
import Pagination from '@/app/blogs/components/Pagination'
import UniversityCard from './UniversityCard'
import { authFetch } from '@/app/utils/authFetch'

// Client-side fetch functions
const fetchUniversitiesFromAPI = async (page = 1, filters = {}, searchQuery = '') => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '24' 
    })
    
    if (searchQuery) {
      queryParams.append('q', searchQuery)
    }

    // Add type filter if exists
    if (filters.type && filters.type.length > 0) {
        // Taking the first one if multiple, or handling array if backend supports logic for IN
        // Backend logic I added: type_of_institute = :type. So single value.
        // If frontend supports multiple selection, we might need to adjust backend or send one.
        // For now, let's assume single selection or send the last selected one for simplicity as per requirement "Public/Private" usually exclusive or filtered one by one.
        // Actually, my backend logic `type_of_institute = :type` implies a single value.
        // I will take the last selected value to filter. 
        queryParams.append('type', filters.type[filters.type.length - 1])
    }

    const url = `${process.env.baseUrl}/university?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()

    return {
      universities: data.items || [],
      pagination: {
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    return {
      universities: [],
      pagination: { currentPage: 1, totalPages: 1, totalCount: 0 }
    }
  }
}

// Memoized FilterSection 
const FilterSection = React.memo(function FilterSection({
  title,
  options,
  selectedValues,
  onCheckboxChange,
}) {

  return (
    <div className='bg-white rounded-2xl p-6 border border-gray-200 shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-gray-800 font-bold text-xs md:text-sm uppercase tracking-wider'>
          {title}
        </h3>
      </div>
      
      <div className='mt-2 space-y-2.5'>
          {options.map((opt, idx) => (
            <label
              key={idx}
              className='flex items-center gap-3 group cursor-pointer'
            >
              <input
                type='checkbox'
                checked={selectedValues.includes(opt.value)}
                onChange={() => onCheckboxChange(opt.value)}
                className='w-4 h-4 rounded border-gray-300 text-[#0A70A7] focus:ring-[#0A70A7] transition-all cursor-pointer'
              />
              <span className='text-gray-600 group-hover:text-gray-900 text-sm font-medium transition-colors'>
                {opt.name}
              </span>
            </label>
          ))}
      </div>
    </div>
  )
})


const Body = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Initial values from URL
  const initialSearch = searchParams.get('q') || ''
  const initialPage = parseInt(searchParams.get('page')) || 1
  const initialType = searchParams.get('type') ? [searchParams.get('type')] : []

  const [universities, setUniversities] = useState([])
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: initialPage,
    totalCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [isSearching, setIsSearching] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState({
    type: initialType
  })

  // URL Sync Helper
  const updateURL = useCallback((params) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
             if(value.length > 0) newParams.set(key, value[value.length-1]) // Supporting single select logic via URL for now
             else newParams.delete(key)
        } else {
             newParams.set(key, value)
        }
      } else {
        newParams.delete(key)
      }
    })
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])


  // Sync state on URL change (e.g. Back button)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const pg = parseInt(searchParams.get('page')) || 1
    const type = searchParams.get('type')
    
    setSearchQuery(q)
    setPagination(prev => ({ ...prev, currentPage: pg }))
    if(type) setSelectedFilters(prev => ({...prev, type: [type] }))
    else setSelectedFilters(prev => ({...prev, type: [] }))

  }, [searchParams])

  // Scroll to top on URL change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [searchParams])

  const debouncedUniversitySearch = useMemo(
    () =>
      debounce(async (query) => {
        updateURL({ q: query, page: 1 })
      }, 500),
    [updateURL]
  )

  useEffect(() => {
    if (searchQuery !== initialSearch) {
      debouncedUniversitySearch(searchQuery)
      return () => debouncedUniversitySearch.cancel()
    }
  }, [searchQuery, initialSearch, debouncedUniversitySearch])

  // Fetch data when URL changes
  useEffect(() => {
    const fetchData = async () => {
      const q = searchParams.get('q') || ''
      const pg = parseInt(searchParams.get('page')) || 1
      const type = searchParams.get('type')

      setIsLoading(true)
      try {
        if (q) setIsSearching(true)
        
        const filters = { type: type ? [type] : [] }
        const data = await fetchUniversitiesFromAPI(pg, filters, q)
        
        setUniversities(data.universities)
        setPagination(data.pagination)
        
        if (q) setIsSearching(false)

      } catch (err) {
        setUniversities([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [searchParams])


  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const arr = prev[filterType]
      // Toggle logic
      const newArr = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value]
      
      const newFilters = {
        ...prev,
        [filterType]: newArr
      }

      // Update URL immediately for simplicity
      updateURL({ type: newArr, page: 1 }) // Reset to page 1

      return newFilters
    })
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      updateURL({ page })
    }
  }

  const instituteTypes = [
      { name: 'Public', value: 'Public' },
      { name: 'Private', value: 'Private' }
  ]

  return (
    <div className='max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 mb-20'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8 border-b border-gray-100 pb-12'>
        <div className='flex-1 space-y-6 w-full'>
          <div className='flex items-center gap-4 mb-2'>
            <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
              Universities
            </h2>
            <span className='bg-blue-50 text-[#0A70A7] px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider'>
              {pagination.totalItems || '0'} Results
            </span>
          </div>

          <div className='flex bg-white items-center rounded-2xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#0A70A7] focus-within:border-[#0A70A7] transition-all px-5 py-2.5 relative w-full group'>
            <Search className='w-5 h-5 text-gray-400 group-focus-within:text-[#0A70A7] transition-colors' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by university name...'
              className='w-full px-4 py-2 bg-transparent text-base font-medium outline-none placeholder:text-gray-400'
            />
            <div className='absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3'>
              {isSearching && (
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#0A70A7]'></div>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
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

      <div className='flex flex-col lg:flex-row gap-12'>
        <div className='lg:w-[320px] space-y-8 shrink-0 hidden lg:block sticky top-24 self-start max-h-[calc(100vh-160px)] overflow-y-auto pr-2 sidebar-scrollbar'>
          <div className='flex justify-between items-center mb-[-16px] px-1'>
            <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Filters</span>
            <button
              className='text-gray-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-wider transition-colors'
              onClick={() => {
                setSearchQuery('')
                setSelectedFilters({ type: [] })
                updateURL({ q: '', type: [], page: 1})
              }}
            >
              Clear All
            </button>
          </div>
          
          <FilterSection
            title='Institute type'
            options={instituteTypes}
            selectedValues={selectedFilters.type}
            onCheckboxChange={(val) => handleFilterChange('type', val)}
          />
        </div>

        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <UniversityShimmer key={idx} />
              ))}
            </div>
          ) : universities.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
              {universities.map((uni, idx) => (
                <UniversityCard
                  key={uni.id || idx}
                  university={uni}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title='No Universities Found'
              description="We couldn't find any universities matching your current search or filter criteria."
              action={{
                label: 'Clear All Filters',
                onClick: () => {
                    setSearchQuery('')
                    setSelectedFilters({ type: [] })
                    updateURL({ q: '', type: [], page: 1})
                }
              }}
            />
          )}

          {!searchQuery &&
            universities.length > 0 &&
            pagination.totalPages > 1 && (
              <div className='mt-16 flex justify-center'>
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
        </div>
      </div>

    </div>
  )
}

export default Body
