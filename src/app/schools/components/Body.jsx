'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { debounce } from 'lodash'
import { Search, Building2, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import EmptyState from '@/ui/shadcn/EmptyState'
import { ShimmerCard } from './ShimmerCard'
import Pagination from '@/app/blogs/components/Pagination'
import CollegeCard from '@/ui/molecules/cards/CollegeCard'
import FilterSection from './FilterSection'
import { authFetch } from '@/app/utils/authFetch'

// Helper to construct School filter params
const buildSchoolQueryParams = (page, filters = {}) => {
  return {
    page: page.toString(),
    limit: '24',
    affiliation: filters.affiliation?.join(',') || '',
    type: filters.type?.join(',') || ''
  }
}

// Client-side fetch functions
const fetchSchoolsFromAPI = async (page = 1, filters = {}) => {
  try {
    const params = buildSchoolQueryParams(page, filters)
    const queryParams = new URLSearchParams(params)
    const url = `${process.env.baseUrl}/school?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()

    return {
      schools:
        data.items?.map((school) => ({
          name: school.name,
          location: `${school.address?.city || ''}, ${school.address?.state || ''}`,
          description: school.description,
          googleMapUrl: school.google_map_url,
          instituteType: school.institute_type,
          slug: school.slugs,
          collegeId: school.id,
          collegeImage: school.featured_img || school.image,
          logo: school.logo
        })) || [],
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: data.items?.length || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch schools:', error)
    return {
      schools: [],
      pagination: { currentPage: 1, totalPages: 1, totalCount: 0 }
    }
  }
}

const searchSchools = async (query) => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/school?q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      }
    )

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()
    if (!data.items || data.items.length === 0) {
      return {
        schools: [],
        pagination: { currentPage: 1, totalPages: 0, totalCount: 0 }
      }
    }

    const schools = data.items.map((school) => ({
      collegeId: school.id,
      name: school.name,
      slug: school.slugs,
      collegeImage: school.featured_img || school.image,
      location: `${school.address?.city || ''}, ${school.address?.state || ''}`,
      description: school.description || 'No description available.',
      logo: school.logo || 'default_logo.png',
      instituteType: school.institute_type || 'Unknown'
    }))

    return {
      schools,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: schools.length
      }
    }
  } catch (error) {
    console.error('Failed to search schools:', error)
    return {
      schools: [],
      pagination: { currentPage: 1, totalPages: 1, totalCount: 0 }
    }
  }
}

const SchoolFinder = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Initial values from URL
  const initialSearch = searchParams.get('q') || ''
  const initialPage = parseInt(searchParams.get('page')) || 1

  const [schools, setSchools] = useState([])
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: initialPage,
    totalCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [isSearching, setIsSearching] = useState(false)

  // Filter Input States (for search within filters)
  const [filterInputs, setFilterInputs] = useState({
    type: '',
    affiliation: ''
  })

  // Selected Filter Values
  const [selectedFilters, setSelectedFilters] = useState({
    affiliation: [],
    type: []
  })

  const user = useSelector((state) => state.user.data)
  const [wishlistCollegeIds, setWishlistCollegeIds] = useState(new Set())

  // Static Filter Options
  const staticOptions = useMemo(() => ({
    affiliation: [
      { id: 'NEB', name: 'NEB' },
      { id: 'CBSE', name: 'CBSE' },
      { id: 'Cambridge / A-Level', name: 'Cambridge / A-Level' },
      { id: 'IB', name: 'IB' }
    ],
    type: [
      { id: 'Public', name: 'Public' },
      { id: 'Private', name: 'Private' },
      { id: 'Community', name: 'Community' }
    ]
  }), [])

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

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return setWishlistCollegeIds(new Set())
      try {
        const response = await authFetch(
          `${process.env.baseUrl}/wishlist?user_id=${user.id}`
        )
        if (response.ok) {
          const data = await response.json()
          setWishlistCollegeIds(
            new Set(
              (data.items || []).map((item) => item.college?.id).filter(Boolean)
            )
          )
        }
      } catch (error) {
        setWishlistCollegeIds(new Set())
      }
    }
    fetchWishlist()
  }, [user?.id])

  // Sync state on URL change
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const pg = parseInt(searchParams.get('page')) || 1
    setSearchQuery(q)
    setPagination(prev => ({ ...prev, currentPage: pg }))
  }, [searchParams])

  // Scroll to top on URL change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [searchParams])

  // Debounced Search Query URL Update
  const debouncedSearchUpdate = useMemo(
    () =>
      debounce(async (query) => {
        updateURL({ q: query, page: 1 })
      }, 500),
    [updateURL]
  )

  useEffect(() => {
    if (searchQuery !== initialSearch) {
      debouncedSearchUpdate(searchQuery)
      return () => debouncedSearchUpdate.cancel()
    }
  }, [searchQuery, initialSearch, debouncedSearchUpdate])

  // Main Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const q = searchParams.get('q') || ''
      const pg = parseInt(searchParams.get('page')) || 1

      setIsLoading(true)
      try {
        if (q) {
          setIsSearching(true)
          const results = await searchSchools(q)
          setSchools(results.schools)
          setPagination(results.pagination)
          setIsSearching(false)
        } else {
          const data = await fetchSchoolsFromAPI(pg, selectedFilters)
          setSchools(data.schools)
          setPagination(data.pagination)
        }
      } catch (err) {
        setSchools([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [searchParams, selectedFilters])

  const handleFilterSearchChange = (field, value) => {
    setFilterInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const arr = prev[filterType]
      return {
        ...prev,
        [filterType]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value]
      }
    })
  }

  const filteredAffiliations = useMemo(
    () =>
      staticOptions.affiliation.filter((a) =>
        a.name.toLowerCase().includes(filterInputs.affiliation.toLowerCase())
      ),
    [filterInputs.affiliation, staticOptions.affiliation]
  )

  const filteredInstituteTypes = useMemo(
    () =>
      staticOptions.type.filter((t) =>
        t.name.toLowerCase().includes(filterInputs.type.toLowerCase())
      ),
    [filterInputs.type, staticOptions.type]
  )

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      updateURL({ page })
    }
  }

  return (
    <div className='max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 mb-20'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8 border-b border-gray-100 pb-12'>
        <div className='flex-1 space-y-6 w-full'>
          <div className='flex items-center gap-4 mb-2'>
            <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
              Schools
            </h2>
            <span className='bg-blue-50 text-[#0A70A7] px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider'>
              {pagination.totalCount || '0'} Results
            </span>
          </div>

          <div className='flex bg-white items-center rounded-2xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#0A70A7] focus-within:border-[#0A70A7] transition-all px-5 py-2.5 relative w-full group'>
            <Search className='w-5 h-5 text-gray-400 group-focus-within:text-[#0A70A7] transition-colors' />
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search by school name, city or state...'
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
                setSelectedFilters({ affiliation: [], type: [] })
                setFilterInputs({ type: '', affiliation: '' })
              }}
            >
              Clear All
            </button>
          </div>
          <FilterSection
            title='Affiliation'
            inputField='affiliation'
            options={filteredAffiliations}
            selectedValues={selectedFilters.affiliation}
            onCheckboxChange={(val) => handleFilterChange('affiliation', val)}
            defaultValue={filterInputs.affiliation}
            onSearchChange={handleFilterSearchChange}
          />
          <FilterSection
            title='Institute type'
            inputField='type'
            options={filteredInstituteTypes}
            selectedValues={selectedFilters.type}
            onCheckboxChange={(val) => handleFilterChange('type', val)}
            defaultValue={filterInputs.type}
            onSearchChange={handleFilterSearchChange}
          />
        </div>

        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
              {Array.from({ length: 9 }).map((_, idx) => (
                <ShimmerCard key={idx} />
              ))}
            </div>
          ) : schools.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
              {schools.map((s, idx) => (
                <CollegeCard
                  key={s.collegeId ?? idx}
                  name={s.name}
                  location={s.location}
                  collegeId={s.collegeId}
                  slug={s.slug}
                  collegeImage={s.collegeImage}
                  instituteType={s.instituteType}
                  wishlistCollegeIds={wishlistCollegeIds}
                  onWishlistUpdate={setWishlistCollegeIds}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title='No Schools Found'
              description="We couldn't find any schools matching your current search or filter criteria. Try clearing some filters to see more results."
              action={{
                label: 'Clear All Filters',
                onClick: () => {
                  setSearchQuery('')
                  setSelectedFilters({
                    affiliation: [],
                    type: []
                  })
                  setFilterInputs({
                    type: ''
                  })
                }
              }}
            />
          )}

          {!searchQuery &&
            schools.length > 0 &&
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

export default SchoolFinder
