'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { debounce } from 'lodash'
import { Search } from 'lucide-react'
import { FaExpandAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'

import UniversityCardShimmer from './UniversityShimmerCard'
import Pagination from '@/app/blogs/components/Pagination'
import UniversityCard from './UniversityCard'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

// Client-side fetch functions
const fetchCollegesFromAPI = async (page = 1, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '24'
    })

    if (filters.degree?.length > 0) {
      filters.degree.forEach((deg) => queryParams.append('degree', deg))
    }
    if (filters.state?.length > 0) {
      filters.state.forEach((state) => queryParams.append('state', state))
    }
    if (filters.uni?.length > 0) {
      filters.uni.forEach((uni) => queryParams.append('university', uni))
    }
    if (filters.type?.length > 0) {
      filters.type.forEach((type) => queryParams.append('type', type))
    }

    const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const data = await response.json()

    return {
      colleges: data.items?.map((college) => ({
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
    return { colleges: [], pagination: { currentPage: 1, totalPages: 1, totalCount: 0 } }
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
      return { colleges: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0 } }
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

    return { colleges, pagination: data.pagination || { currentPage: 1, totalPages: 0, totalCount: 0 } }
  } catch (error) {
    console.error('Failed to search colleges:', error)
    return { colleges: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0 } }
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
    if (!response.ok) throw new Error('Failed to fetch Programs')
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

const districts = [
  'Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaladhunga', 'Panchthar',
  'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur', 'Bara',
  'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha', 'Bhaktapur',
  'Chitawan', 'Dhading', 'Dolakha', 'Kathmandu', 'Kavrepalanchok', 'Lalitpur', 'Makwanpur',
  'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok', 'Baglung', 'Gorkha', 'Kaski',
  'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Syangja', 'Tanahu',
  'Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilbastu', 'Nawalparasi', 'Palpa',
  'Pyuthan', 'Rolpa', 'Rukum Purba', 'Rupandehi', 'Dailekh', 'Dolpa', 'Humla', 'Jajarkot',
  'Jumla', 'Kalikot', 'Mugu', 'Rukum Paschim', 'Salyan', 'Surkhet', 'Achham', 'Baitadi',
  'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur'
]

// Memoized FilterSection
const FilterSection = React.memo(function FilterSection({
  title,
  inputField,
  options,
  selectedValues,
  onCheckboxChange,
  filterInputs,
  handleFilterInputChange,
  isLoading
}) {
  return (
    <div className='bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-gray-900 font-bold text-sm uppercase tracking-wider'>{title}</h3>
      </div>
      <div className='relative flex items-center mb-4 px-1'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
        <input
          type='text'
          value={filterInputs[inputField]}
          onChange={(e) => handleFilterInputChange(inputField, e.target.value)}
          placeholder={`Search ${title.toLowerCase()}...`}
          className='w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#387CAE]/20 transition-all'
        />
        {isLoading && (
          <div className='absolute right-4 top-1/2 -translate-y-1/2'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#387CAE]'></div>
          </div>
        )}
      </div>
      <div className='mt-2 space-y-2.5 overflow-y-auto h-32 pr-2 custom-scrollbar'>
        {options.length === 0 ? (
          <div className='text-center py-4 text-xs text-gray-400 font-medium italic'>No matches found</div>
        ) : (
          options.map((opt, idx) => (
            <label key={idx} className='flex items-center gap-3 group cursor-pointer'>
              <div className='relative flex items-center justify-center'>
                <input
                  type='checkbox'
                  checked={selectedValues.includes(opt.name)}
                  onChange={() => onCheckboxChange(opt.name)}
                  className='peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#387CAE] checked:border-[#387CAE] transition-all cursor-pointer'
                />
                <svg className='absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='4'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <span className='text-gray-600 group-hover:text-gray-900 text-sm font-medium transition-colors'>{opt.name}</span>
            </label>
          ))
        )}
      </div>
    </div>
  )
})

// Memoized FilterModal
const FilterModal = React.memo(function FilterModal({
  modalFilterInputs,
  setModalFilterInputs,
  modalSelectedFilters,
  setModalSelectedFilters,
  modalDisciplines,
  modalAffiliations,
  modalFilteredDistricts,
  modalFilteredInstituteTypes,
  isModalDisciplineLoading,
  isModalAffiliationLoading,
  onApply,
  onClose
}) {
  const handleModalFilterInputChange = (field, value) => {
    setModalFilterInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleModalFilterChange = (filterType, value) => {
    setModalSelectedFilters((prev) => {
      const arr = prev[filterType]
      return {
        ...prev,
        [filterType]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value]
      }
    })
  }

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className='bg-white rounded-[2.5rem] p-8 w-full max-w-5xl h-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl space-y-6'
      >
        <div className='flex justify-between items-center shrink-0 pr-2'>
          <h2 className='text-2xl font-black text-gray-900 tracking-tight'>All Filters</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900'
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className='flex-1 overflow-y-auto pr-2 custom-scrollbar'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6'>
            <FilterSection title='Discipline' inputField='discipline' options={modalDisciplines} selectedValues={modalSelectedFilters.degree} onCheckboxChange={(val) => handleModalFilterChange('degree', val)} filterInputs={modalFilterInputs} handleFilterInputChange={handleModalFilterInputChange} isLoading={isModalDisciplineLoading} />
            <FilterSection title='District' inputField='district' options={modalFilteredDistricts} selectedValues={modalSelectedFilters.state} onCheckboxChange={(val) => handleModalFilterChange('state', val)} filterInputs={modalFilterInputs} handleFilterInputChange={handleModalFilterInputChange} />
            <FilterSection title='Affiliation' inputField='affiliation' options={modalAffiliations} selectedValues={modalSelectedFilters.uni} onCheckboxChange={(val) => handleModalFilterChange('uni', val)} filterInputs={modalFilterInputs} handleFilterInputChange={handleModalFilterInputChange} isLoading={isModalAffiliationLoading} />
            <FilterSection title='Institute type' inputField='instituteType' options={modalFilteredInstituteTypes} selectedValues={modalSelectedFilters.type} onCheckboxChange={(val) => handleModalFilterChange('type', val)} filterInputs={modalFilterInputs} handleFilterInputChange={handleModalFilterInputChange} />
          </div>
        </div>

        <div className='flex justify-end gap-3 pt-6 shrink-0 border-t border-gray-50'>
          <button onClick={onClose} className='px-8 py-3 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-colors'>CANCEL</button>
          <button onClick={onApply} className='bg-[#387CAE] text-white px-10 py-3 rounded-2xl font-bold hover:bg-[#2d638c] transition-all shadow-lg shadow-blue-100'>APPLY FILTERS</button>
        </div>
      </motion.div>
    </div>
  )
})

const CollegeFinder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [universities, setUniversities] = useState([])
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, totalCount: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const [filterInputs, setFilterInputs] = useState({ discipline: '', affiliation: '', district: '', instituteType: '' })
  const [filteredDisciplines, setFilteredDisciplines] = useState([])
  const [filteredAffiliations, setFilteredAffiliations] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({ degree: [], uni: [], state: [], type: [] })

  const [modalFilterInputs, setModalFilterInputs] = useState(filterInputs)
  const [modalSelectedFilters, setModalSelectedFilters] = useState(selectedFilters)
  const [modalDisciplines, setModalDisciplines] = useState(filteredDisciplines)
  const [modalAffiliations, setModalAffiliations] = useState(filteredAffiliations)

  const [isDisciplineLoading, setIsDisciplineLoading] = useState(false)
  const [isAffiliationLoading, setIsAffiliationLoading] = useState(false)
  const [isModalDisciplineLoading, setIsModalDisciplineLoading] = useState(false)
  const [isModalAffiliationLoading, setIsModalAffiliationLoading] = useState(false)

  const user = useSelector((state) => state.user.data)
  const [wishlistCollegeIds, setWishlistCollegeIds] = useState(new Set())

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) return setWishlistCollegeIds(new Set())
      try {
        const response = await authFetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/wishlist?user_id=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setWishlistCollegeIds(new Set((data.items || []).map((item) => item.college?.id).filter(Boolean)))
        }
      } catch (error) { setWishlistCollegeIds(new Set()) }
    }
    fetchWishlist()
  }, [user?.id])

  const debouncedFetchDisciplines = useMemo(() => debounce(async (query) => {
    setIsDisciplineLoading(true)
    const programs = await getPrograms(query)
    setFilteredDisciplines(programs.map((p) => ({ name: p.title })))
    setIsDisciplineLoading(false)
  }, 500), [])

  const debouncedFetchAffiliations = useMemo(() => debounce(async (query) => {
    setIsAffiliationLoading(true)
    const unis = await getUniversity(query)
    setFilteredAffiliations(unis.map((u) => ({ name: u.fullname })))
    setIsAffiliationLoading(false)
  }, 500), [])

  const debouncedFetchModalDisciplines = useMemo(() => debounce(async (query) => {
    setIsModalDisciplineLoading(true)
    const programs = await getPrograms(query)
    setModalDisciplines(programs.map((p) => ({ name: p.title })))
    setIsModalDisciplineLoading(false)
  }, 500), [])

  const debouncedFetchModalAffiliations = useMemo(() => debounce(async (query) => {
    setIsModalAffiliationLoading(true)
    const unis = await getUniversity(query)
    setModalAffiliations(unis.map((u) => ({ name: u.fullname })))
    setIsModalAffiliationLoading(false)
  }, 500), [])

  useEffect(() => {
    const init = async () => {
      const programs = await getPrograms(); setFilteredDisciplines(programs.map(p => ({ name: p.title }))); setModalDisciplines(programs.map(p => ({ name: p.title })))
      const unis = await getUniversity(); setFilteredAffiliations(unis.map(u => ({ name: u.fullname }))); setModalAffiliations(unis.map(u => ({ name: u.fullname })))
    }; init()
  }, [])

  const fetchCollegesData = useCallback(async (page = 1) => {
    setIsLoading(true)
    try {
      const data = await fetchCollegesFromAPI(page, selectedFilters)
      setUniversities(data.colleges); setPagination(data.pagination)
    } catch (err) { setUniversities([]) } finally { setIsLoading(false) }
  }, [selectedFilters])

  useEffect(() => { fetchCollegesData(1) }, [fetchCollegesData])

  const handleFilterInputChange = (field, value) => setFilterInputs((prev) => ({ ...prev, [field]: value }))
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const arr = prev[filterType]
      return { ...prev, [filterType]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] }
    })
  }

  useEffect(() => { debouncedFetchDisciplines(filterInputs.discipline); return () => debouncedFetchDisciplines.cancel() }, [filterInputs.discipline])
  useEffect(() => { debouncedFetchAffiliations(filterInputs.affiliation); return () => debouncedFetchAffiliations.cancel() }, [filterInputs.affiliation])

  const debouncedCollegeSearch = useMemo(() => debounce(async (query) => {
    setIsSearching(true)
    const results = await searchColleges(query)
    setUniversities(results.colleges); setPagination(results.pagination); setIsSearching(false)
  }, 500), [])

  useEffect(() => {
    if (searchQuery) { debouncedCollegeSearch(searchQuery); return () => debouncedCollegeSearch.cancel() }
    else { fetchCollegesData(1) }
  }, [searchQuery, fetchCollegesData])

  const filteredDistricts = useMemo(() => districts.filter(d => d.toLowerCase().includes(filterInputs.district.toLowerCase())).map(d => ({ name: d })), [filterInputs.district])
  const filteredInstituteTypes = useMemo(() => ['private', 'public'].filter(t => t.toLowerCase().includes(filterInputs.instituteType.toLowerCase())).map(t => ({ name: t })), [filterInputs.instituteType])

  const handleApplyModalFilters = () => { setFilterInputs(modalFilterInputs); setSelectedFilters(modalSelectedFilters); setIsModalOpen(false) }

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page })); fetchCollegesData(page); window.scrollTo({ top: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className='max-w-[1600px] mx-auto p-6 px-8 mb-20'>
      <div className='flex flex-col md:flex-row justify-between items-end mb-10 gap-6 border-b border-gray-100 pb-10'>
        <div className='flex-1 space-y-4'>
          <div className='flex items-center gap-4 mb-2'>
            <h2 className='text-3xl font-black text-gray-900 tracking-tight'>Colleges</h2>
            <span className='bg-blue-50 text-[#387CAE] px-3 py-1 rounded-full text-xs font-bold'>
              {pagination.totalCount || '0'} RESULTS
            </span>
          </div>

          <div className='flex bg-white items-center rounded-2xl border border-gray-100 shadow-sm focus-within:shadow-xl focus-within:border-[#387CAE]/30 transition-all px-4 py-1.5 relative w-full group'>
            <Search className='w-5 h-5 text-gray-400 group-focus-within:text-[#387CAE] transition-colors' />
            <input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search by college name, city or state...' className='w-full px-4 py-2.5 bg-transparent rounded-xl text-base font-medium focus:outline-none placeholder:text-gray-400' />
            {isSearching && (
              <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-[#387CAE]'></div>
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center gap-3 shrink-0 mb-1'>
          <button
            onClick={() => { setModalFilterInputs(filterInputs); setModalSelectedFilters(selectedFilters); setIsModalOpen(true) }}
            className='flex items-center gap-2 bg-white border border-gray-100 px-6 py-3.5 rounded-2xl text-gray-700 font-bold text-sm shadow-sm hover:shadow-md transition-all'
          >
            <FaExpandAlt className="w-3.5 h-3.5" />
            ADVANCED FILTERS
          </button>
          <button className='text-gray-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest pl-2 transition-colors' onClick={() => { setSearchQuery(''); setSelectedFilters({ state: [], degree: [], uni: [], type: [] }); setFilterInputs({ discipline: '', affiliation: '', district: '', instituteType: '' }) }}>Clear All</button>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-10'>
        <div className='lg:w-[320px] space-y-6 shrink-0 hidden lg:block'>
          <FilterSection title='Discipline' inputField='discipline' options={filteredDisciplines} selectedValues={selectedFilters.degree} onCheckboxChange={(val) => handleFilterChange('degree', val)} filterInputs={filterInputs} handleFilterInputChange={handleFilterInputChange} isLoading={isDisciplineLoading} />
          <FilterSection title='District' inputField='district' options={filteredDistricts} selectedValues={selectedFilters.state} onCheckboxChange={(val) => handleFilterChange('state', val)} filterInputs={filterInputs} handleFilterInputChange={handleFilterInputChange} />
          <FilterSection title='Affiliation' inputField='affiliation' options={filteredAffiliations} selectedValues={selectedFilters.uni} onCheckboxChange={(val) => handleFilterChange('uni', val)} filterInputs={filterInputs} handleFilterInputChange={handleFilterInputChange} isLoading={isAffiliationLoading} />
          <FilterSection title='Institute type' inputField='instituteType' options={filteredInstituteTypes} selectedValues={selectedFilters.type} onCheckboxChange={(val) => handleFilterChange('type', val)} filterInputs={filterInputs} handleFilterInputChange={handleFilterInputChange} />
        </div>

        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
              {Array.from({ length: 6 }).map((_, idx) => <UniversityCardShimmer key={idx} />)}
            </div>
          ) : universities.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'>
              {universities.map((u, idx) => (
                <UniversityCard {...u} key={idx} wishlistCollegeIds={wishlistCollegeIds} onWishlistUpdate={setWishlistCollegeIds} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100'>
              <div className='bg-white p-6 rounded-full shadow-sm mb-6'><Search className="w-10 h-10 text-gray-200" /></div>
              <p className='text-gray-900 font-bold text-xl mb-2'>No Matches Found</p>
              <p className='text-gray-500'>Try adjusting your search or filters to see more results.</p>
            </div>
          )}

          {!searchQuery && universities.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <FilterModal
            modalFilterInputs={modalFilterInputs} setModalFilterInputs={setModalFilterInputs}
            modalSelectedFilters={modalSelectedFilters} setModalSelectedFilters={setModalSelectedFilters}
            modalDisciplines={modalDisciplines} modalAffiliations={modalAffiliations}
            modalFilteredDistricts={filteredDistricts} modalFilteredInstituteTypes={filteredInstituteTypes}
            isModalDisciplineLoading={isModalDisciplineLoading} isModalAffiliationLoading={isModalAffiliationLoading}
            onApply={handleApplyModalFilters} onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollegeFinder
