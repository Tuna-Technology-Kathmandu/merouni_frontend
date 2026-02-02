'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { debounce } from 'lodash'
import { Search, Building2, School } from 'lucide-react'
import { FaExpandAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import EmptyState from '@/ui/shadcn/EmptyState'
import UniversityCardShimmer from './UniversityShimmerCard'
import Pagination from '@/app/blogs/components/Pagination'
import CollegeCard from '@/ui/molecules/cards/CollegeCard'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'
import { DistrictLists } from '@/constants/district'

// Client-side fetch functions
const fetchCollegesFromAPI = async (page = 1, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '24'
    })

    const body = {
      program_id: filters.degree || [],
      state: filters.state || [],
      university: filters.uni || [],
      type: filters.type || []
    }

    const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/college/filter?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store'
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()

    return {
      colleges:
        data.items?.map((college) => ({
          name: college.name,
          location: `${college.address?.city || ''}, ${college.address?.state || ''}`,
          description: college.description,
          googleMapUrl: college.google_map_url,
          instituteType: college.institute_type,
          slug: college.slugs,
          collegeId: college.id,
          collegeImage: college.featured_img,
          logo: college.college_logo
        })) || [],
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalCount: data.items?.length || 0
      }
    }
  } catch (error) {
    console.error('Failed to fetch colleges:', error)
    return {
      colleges: [],
      pagination: { currentPage: 1, totalPages: 1, totalCount: 0 }
    }
  }
}

const searchColleges = async (query) => {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?q=${encodeURIComponent(query)}`,
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
        colleges: [],
        pagination: { currentPage: 1, totalPages: 0, totalCount: 0 }
      }
    }

    const colleges = data.items.map((clz) => ({
      collegeId: clz.id,
      name: clz.name,
      slug: clz.slugs,
      collegeImage: clz.featured_img,
      location: `${clz.address?.city || ''}, ${clz.address?.state || ''}`,
      description: clz.description || 'No description available.',
      logo: clz.college_logo || 'default_logo.png',
      instituteType: clz.institute_type || 'Unknown'
    }))

    return {
      colleges,
      pagination: data.pagination || {
        currentPage: 1,
        totalPages: 0,
        totalCount: 0
      }
    }
  } catch (error) {
    console.error('Failed to search colleges:', error)
    return {
      colleges: [],
      pagination: { currentPage: 1, totalPages: 0, totalCount: 0 }
    }
  }
}

const getPrograms = async (searchQuery = '') => {
  try {
    const queryParams = new URLSearchParams()
    if (searchQuery) queryParams.append('q', searchQuery)
    const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/program?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('Failed to fetch programs')
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching programs:', error)
    return []
  }
}

const getUniversity = async (searchQuery = '') => {
  try {
    const queryParams = new URLSearchParams()
    if (searchQuery) queryParams.append('q', searchQuery)
    const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('Failed to fetch universities')
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching universities:', error)
    return []
  }
}

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


const CollegeFinder = () => {
  const [universities, setUniversities] = useState([])
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [filterInputs, setFilterInputs] = useState({
    program: '',
    affiliation: '',
    district: '',
    instituteType: ''
  })
  const [filteredPrograms, setFilteredPrograms] = useState([])
  const [filteredAffiliations, setFilteredAffiliations] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({
    degree: [],
    uni: [],
    state: [],
    type: []
  })

  const [isProgramsLoading, setIsProgramsLoading] = useState(false)
  const [isAffiliationLoading, setIsAffiliationLoading] = useState(false)

  const user = useSelector((state) => state.user.data)
  const [wishlistCollegeIds, setWishlistCollegeIds] = useState(new Set())

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return setWishlistCollegeIds(new Set())
      try {
        const response = await authFetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/wishlist?user_id=${user.id}`
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

  const fetchDisciplines = useCallback(async (q = '') => {
    setIsDisciplineLoading(true)
    const disciplines = await getDiscipline(q)
    setFilteredDisciplines(disciplines.map((d) => ({ id: d.id, name: d.title })))
    setIsDisciplineLoading(false)
  }, [])

  const fetchAffiliations = useCallback(async (q = '') => {
    setIsAffiliationLoading(true)
    const unis = await getUniversity(q)
    setFilteredAffiliations(unis.map((u) => ({ name: u.fullname })))
    setIsAffiliationLoading(false)
  }, [])

  useEffect(() => {
    const init = async () => {
      const programs = await getPrograms()
      setFilteredPrograms(programs.map((p) => ({ id: p.id, name: p.title })))

      const unis = await getUniversity()
      setFilteredAffiliations(unis.map((u) => ({ name: u.fullname })))
    }
    init()
  }, [])

  const fetchCollegesData = useCallback(
    async (page = 1) => {
      setIsLoading(true)
      try {
        const data = await fetchCollegesFromAPI(page, selectedFilters)
        setUniversities(data.colleges)
        setPagination(data.pagination)
      } catch (err) {
        setUniversities([])
      } finally {
        setIsLoading(false)
      }
    },
    [selectedFilters]
  )

  useEffect(() => {
    fetchCollegesData(1)
  }, [fetchCollegesData])

  const handleFilterSearchChange = (field, value) => {
    setFilterInputs((prev) => ({ ...prev, [field]: value }))
    if (field === 'program') fetchPrograms(value)
    if (field === 'affiliation') fetchAffiliations(value)
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

  const debouncedCollegeSearch = useMemo(
    () =>
      debounce(async (query) => {
        setIsSearching(true)
        const results = await searchColleges(query)
        setUniversities(results.colleges)
        setPagination(results.pagination)
        setIsSearching(false)
      }, 500),
    []
  )

  useEffect(() => {
    if (searchQuery) {
      debouncedCollegeSearch(searchQuery)
      return () => debouncedCollegeSearch.cancel()
    } else {
      fetchCollegesData(1)
    }
  }, [searchQuery, fetchCollegesData])

  const filteredDistricts = useMemo(
    () =>
      DistrictLists.filter((d) =>
        d.toLowerCase().includes(filterInputs.district.toLowerCase())
      ).map((d) => ({ name: d })),
    [filterInputs.district]
  )

  const filteredInstituteTypes = useMemo(
    () =>
      ['private', 'public']
        .filter((t) =>
          t.toLowerCase().includes(filterInputs.instituteType.toLowerCase())
        )
        .map((t) => ({ name: t })),
    [filterInputs.instituteType]
  )

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }))
      fetchCollegesData(page)
      window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className='max-w-[1600px] mx-auto p-4 md:p-8 lg:p-12 mb-20'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-8 border-b border-gray-100 pb-12'>
        <div className='flex-1 space-y-6 w-full'>
          <div className='flex items-center gap-4 mb-2'>
            <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
              Colleges
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
              placeholder='Search by college name, city or state...'
              className='w-full px-4 py-2 bg-transparent text-base font-medium outline-none placeholder:text-gray-400'
            />
            {isSearching && (
              <div className='absolute right-5 top-1/2 -translate-y-1/2'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#0A70A7]'></div>
              </div>
            )}
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
                setSelectedFilters({ state: [], degree: [], uni: [], type: [] })
                setFilterInputs({
                  program: '',
                  affiliation: '',
                  district: '',
                  instituteType: ''
                })
              }}
            >
              Clear All
            </button>
          </div>
          <FilterSection
            title='Program'
            inputField='program'
            options={filteredPrograms}
            selectedValues={selectedFilters.degree}
            onCheckboxChange={(val) => handleFilterChange('degree', val)}
            defaultValue={filterInputs.program}
            onSearchChange={handleFilterSearchChange}
            isLoading={isProgramsLoading}
          />
          <FilterSection
            title='District'
            inputField='district'
            options={filteredDistricts}
            selectedValues={selectedFilters.state}
            onCheckboxChange={(val) => handleFilterChange('state', val)}
            defaultValue={filterInputs.district}
            onSearchChange={handleFilterSearchChange}
          />
          <FilterSection
            title='Affiliation'
            inputField='affiliation'
            options={filteredAffiliations}
            selectedValues={selectedFilters.uni}
            onCheckboxChange={(val) => handleFilterChange('uni', val)}
            defaultValue={filterInputs.affiliation}
            onSearchChange={handleFilterSearchChange}
            isLoading={isAffiliationLoading}
          />
          <FilterSection
            title='Institute type'
            inputField='instituteType'
            options={filteredInstituteTypes}
            selectedValues={selectedFilters.type}
            onCheckboxChange={(val) => handleFilterChange('type', val)}
            defaultValue={filterInputs.instituteType}
            onSearchChange={handleFilterSearchChange}
          />
        </div>

        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
              {Array.from({ length: 9 }).map((_, idx) => (
                <UniversityCardShimmer key={idx} />
              ))}
            </div>
          ) : universities.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10'>
              {universities.map((u, idx) => (
                <CollegeCard
                  key={u.collegeId ?? idx}
                  name={u.name}
                  location={u.location}
                  collegeId={u.collegeId}
                  slug={u.slug}
                  collegeImage={u.collegeImage}
                  instituteType={u.instituteType}
                  wishlistCollegeIds={wishlistCollegeIds}
                  onWishlistUpdate={setWishlistCollegeIds}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title='No Colleges Found'
              description="We couldn't find any colleges matching your current search or filter criteria. Try clearing some filters to see more results."
              action={{
                label: 'Clear All Filters',
                onClick: () => {
                  setSearchQuery('')
                  setSelectedFilters({
                    state: [],
                    degree: [],
                    uni: [],
                    type: []
                  })
                  setFilterInputs({
                    discipline: '',
                    affiliation: '',
                    district: '',
                    instituteType: ''
                  })
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

export default CollegeFinder
