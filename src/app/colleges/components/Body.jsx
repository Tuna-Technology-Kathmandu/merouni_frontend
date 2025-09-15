'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { debounce } from 'lodash'
import { Search } from 'lucide-react'
import { FaExpandAlt } from 'react-icons/fa'

import UniversityCardShimmer from './UniversityShimmerCard'
import Pagination from '@/app/blogs/components/Pagination'
import {
  getColleges,
  searchColleges,
  getPrograms,
  getUniversity
} from '../actions'
import UniversityCard from './UniversityCard'

//all districts

const districts = [
  'Bhojpur',
  'Dhankuta',
  'Ilam',
  'Jhapa',
  'Khotang',
  'Morang',
  'Okhaladhunga',
  'Panchthar',
  'Sankhuwasabha',
  'Solukhumbu',
  'Sunsari',
  'Taplejung',
  'Terhathum',
  'Udayapur',
  'Bara',
  'Dhanusha',
  'Mahottari',
  'Parsa',
  'Rautahat',
  'Saptari',
  'Sarlahi',
  'Siraha',
  'Bhaktapur',
  'Chitawan',
  'Dhading',
  'Dolakha',
  'Kathmandu',
  'Kavrepalanchok',
  'Lalitpur',
  'Makwanpur',
  'Nuwakot',
  'Ramechhap',
  'Rasuwa',
  'Sindhuli',
  'Sindhupalchok',
  'Baglung',
  'Gorkha',
  'Kaski',
  'Lamjung',
  'Manang',
  'Mustang',
  'Myagdi',
  'Nawalpur',
  'Parbat',
  'Syangja',
  'Tanahu',
  'Arghakhanchi',
  'Banke',
  'Bardiya',
  'Dang',
  'Gulmi',
  'Kapilbastu',
  'Nawalparasi',
  'Palpa',
  'Pyuthan',
  'Rolpa',
  'Rukum Purba',
  'Rupandehi',
  'Dailekh',
  'Dolpa',
  'Humla',
  'Jajarkot',
  'Jumla',
  'Kalikot',
  'Mugu',
  'Rukum Paschim',
  'Salyan',
  'Surkhet',
  'Achham',
  'Baitadi',
  'Bajhang',
  'Bajura',
  'Dadeldhura',
  'Darchula',
  'Doti',
  'Kailali',
  'Kanchanpur'
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
    <div className='bg-white rounded-xl p-4 border border-gray-200 shadow-lg'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='text-gray-800 font-medium'>{title}</h3>
      </div>
      <div className='relative flex'>
        <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400' />
        <input
          type='text'
          value={filterInputs[inputField]}
          onChange={(e) => handleFilterInputChange(inputField, e.target.value)}
          placeholder={`Search by ${title.toLowerCase()}`}
          className='w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none'
        />
        {isLoading && (
          <div className='absolute right-2 top-2.5'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500'></div>
          </div>
        )}
      </div>
      <div className='mt-3 space-y-2 overflow-y-auto h-24 scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-100'>
        {options.length === 0 ? (
          <div className='text-center text-sm text-gray-400'>No data found</div>
        ) : (
          options.map((opt, idx) => (
            <label key={idx} className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={selectedValues.includes(opt.name)}
                onChange={() => onCheckboxChange(opt.name)}
                className='rounded-full border-gray-300'
              />
              <span className='text-gray-700 text-sm'>{opt.name}</span>
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
  // Handlers for modal filters
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
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
      <div className='bg-white rounded-xl p-6 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[60%] h-full max-h-[90%] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>All Filters</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 text-xl'
          >
            ✕
          </button>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          <FilterSection
            title='Discipline'
            inputField='discipline'
            options={modalDisciplines}
            selectedValues={modalSelectedFilters.degree}
            onCheckboxChange={(val) => handleModalFilterChange('degree', val)}
            filterInputs={modalFilterInputs}
            handleFilterInputChange={handleModalFilterInputChange}
            isLoading={isModalDisciplineLoading}
          />
          <FilterSection
            title='District'
            inputField='district'
            options={modalFilteredDistricts}
            selectedValues={modalSelectedFilters.state}
            onCheckboxChange={(val) => handleModalFilterChange('state', val)}
            filterInputs={modalFilterInputs}
            handleFilterInputChange={handleModalFilterInputChange}
          />
          <FilterSection
            title='Affiliation'
            inputField='affiliation'
            options={modalAffiliations}
            selectedValues={modalSelectedFilters.uni}
            onCheckboxChange={(val) => handleModalFilterChange('uni', val)}
            filterInputs={modalFilterInputs}
            handleFilterInputChange={handleModalFilterInputChange}
            isLoading={isModalAffiliationLoading}
          />
          <FilterSection
            title='Institute type'
            inputField='instituteType'
            options={modalFilteredInstituteTypes}
            selectedValues={modalSelectedFilters.type}
            onCheckboxChange={(val) => handleModalFilterChange('type', val)}
            filterInputs={modalFilterInputs}
            handleFilterInputChange={handleModalFilterInputChange}
          />
        </div>
        <div className='flex justify-end mt-4'>
          <button
            onClick={onApply}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
})

const CollegeFinder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [universities, setUniversities] = useState([])
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalCount: 1
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Main filter state
  const [filterInputs, setFilterInputs] = useState({
    discipline: '',
    affiliation: '',
    district: '',
    instituteType: ''
  })

  const [filteredDisciplines, setFilteredDisciplines] = useState([])
  const [filteredAffiliations, setFilteredAffiliations] = useState([])

  const [selectedFilters, setSelectedFilters] = useState({
    degree: [],
    uni: [],
    state: [],
    type: []
  })

  // Modal filter state
  const [modalFilterInputs, setModalFilterInputs] = useState(filterInputs)
  const [modalSelectedFilters, setModalSelectedFilters] =
    useState(selectedFilters)
  const [modalDisciplines, setModalDisciplines] = useState(filteredDisciplines)
  const [modalAffiliations, setModalAffiliations] =
    useState(filteredAffiliations)

  // Loading states for filter search
  const [isDisciplineLoading, setIsDisciplineLoading] = useState(false)
  const [isAffiliationLoading, setIsAffiliationLoading] = useState(false)
  const [isModalDisciplineLoading, setIsModalDisciplineLoading] =
    useState(false)
  const [isModalAffiliationLoading, setIsModalAffiliationLoading] =
    useState(false)

  // Debounced functions for discipline and affiliation
  const debouncedFetchDisciplines = useMemo(
    () =>
      debounce(async (query) => {
        setIsDisciplineLoading(true)
        const programs = await getPrograms(query)
        setFilteredDisciplines(programs.map((p) => ({ name: p.title })))
        setIsDisciplineLoading(false)
      }, 500),
    []
  )

  const debouncedFetchAffiliations = useMemo(
    () =>
      debounce(async (query) => {
        setIsAffiliationLoading(true)
        const unis = await getUniversity(query)
        setFilteredAffiliations(unis.map((u) => ({ name: u.fullname })))
        setIsAffiliationLoading(false)
      }, 500),
    []
  )

  // Debounced functions for modal discipline and affiliation
  const debouncedFetchModalDisciplines = useMemo(
    () =>
      debounce(async (query) => {
        setIsModalDisciplineLoading(true)
        const programs = await getPrograms(query)
        setModalDisciplines(programs.map((p) => ({ name: p.title })))
        setIsModalDisciplineLoading(false)
      }, 500),
    []
  )

  const debouncedFetchModalAffiliations = useMemo(
    () =>
      debounce(async (query) => {
        setIsModalAffiliationLoading(true)
        const unis = await getUniversity(query)
        setModalAffiliations(unis.map((u) => ({ name: u.fullname })))
        setIsModalAffiliationLoading(false)
      }, 500),
    []
  )

  // Initial fetch for disciplines and affiliations
  useEffect(() => {
    const init = async () => {
      const programs = await getPrograms()
      setFilteredDisciplines(programs.map((p) => ({ name: p.title })))
      setModalDisciplines(programs.map((p) => ({ name: p.title })))
      const unis = await getUniversity()
      setFilteredAffiliations(unis.map((u) => ({ name: u.fullname })))
      setModalAffiliations(unis.map((u) => ({ name: u.fullname })))
    }
    init()
  }, [])

  // Fetch colleges on mount and when filters change
  const fetchColleges = useCallback(
    async (page = 1) => {
      setIsLoading(true)
      try {
        const data = await getColleges(page, selectedFilters)
        setUniversities(data.colleges)
        setPagination(data.pagination)
      } catch (err) {
        console.error(err)
      }
      setIsLoading(false)
    },
    [selectedFilters]
  )

  useEffect(() => {
    fetchColleges(1)
  }, [fetchColleges])

  // Handlers for sidebar filters
  const handleFilterInputChange = (field, value) => {
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

  // Debounced discipline and affiliation search for sidebar
  useEffect(() => {
    debouncedFetchDisciplines(filterInputs.discipline)
    return () => debouncedFetchDisciplines.cancel()
  }, [filterInputs.discipline])

  useEffect(() => {
    debouncedFetchAffiliations(filterInputs.affiliation)
    return () => debouncedFetchAffiliations.cancel()
  }, [filterInputs.affiliation])

  // Handlers for modal filters
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

  // Debounced discipline and affiliation search for modal
  useEffect(() => {
    debouncedFetchModalDisciplines(modalFilterInputs.discipline)
    return () => debouncedFetchModalDisciplines.cancel()
  }, [modalFilterInputs.discipline])

  useEffect(() => {
    debouncedFetchModalAffiliations(modalFilterInputs.affiliation)
    return () => debouncedFetchModalAffiliations.cancel()
  }, [modalFilterInputs.affiliation])

  // Search handlers
  const handleCollegeSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Debounced college search
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
      fetchColleges(1)
    }
  }, [searchQuery])

  // Local filtering for district and institute type
  const filteredDistricts = useMemo(
    () =>
      districts
        .filter((d) =>
          d.toLowerCase().includes(filterInputs.district.toLowerCase())
        )
        .map((d) => ({ name: d })),
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

  // Modal local filtering
  const modalFilteredDistricts = useMemo(
    () =>
      districts
        .filter((d) =>
          d.toLowerCase().includes(modalFilterInputs.district.toLowerCase())
        )
        .map((d) => ({ name: d })),
    [modalFilterInputs.district]
  )

  const modalFilteredInstituteTypes = useMemo(
    () =>
      ['private', 'public']
        .filter((t) =>
          t
            .toLowerCase()
            .includes(modalFilterInputs.instituteType.toLowerCase())
        )
        .map((t) => ({ name: t })),
    [modalFilterInputs.instituteType]
  )

  // Modal apply handler
  const handleApplyModalFilters = () => {
    setFilterInputs(modalFilterInputs)
    setSelectedFilters(modalSelectedFilters)
    setFilteredDisciplines(modalDisciplines)
    setFilteredAffiliations(modalAffiliations)
    setIsModalOpen(false)
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }))
      fetchColleges(page)
    }
  }

  return (
    <div className='max-w-[1600px] mx-auto p-6 px-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-semibold'>Filters</h2>
          <div className='flex gap-3'>
            <button
              className='text-gray-600 text-sm flex items-center hover:text-gray-800'
              onClick={() => {
                setModalFilterInputs(filterInputs)
                setModalSelectedFilters(selectedFilters)
                setModalDisciplines(filteredDisciplines)
                setModalAffiliations(filteredAffiliations)
                setIsModalOpen(true)
              }}
            >
              <div>Expand</div>
              <div className='mx-2'>
                <FaExpandAlt />
              </div>
            </button>
            <button
              className='text-gray-600 text-sm'
              onClick={async () => {
                setSearchQuery('')
                setSelectedFilters({ state: [], degree: [], uni: [], type: [] })
                setFilterInputs({
                  discipline: '',
                  affiliation: '',
                  district: '',
                  instituteType: ''
                })

                // Re-fetch default options
                const programs = await getPrograms()
                setFilteredDisciplines(programs.map((p) => ({ name: p.title })))
                const unis = await getUniversity()
                setFilteredAffiliations(unis.map((u) => ({ name: u.fullname })))
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex gap-4'>
            <h2 className='text-xl font-semibold'>Colleges</h2>
            <span className='text-gray-500'>
              ({pagination.totalCount || '0'} Colleges)
            </span>
          </div>
        </div>

        {/* College search */}
        <div className='flex bg-gray-100 items-center rounded-xl relative'>
          <Search className='left-3 top-2.5 w-5 h-5 text-gray-400 mx-2' />
          <input
            type='text'
            value={searchQuery}
            onChange={handleCollegeSearchChange}
            placeholder='Search by colleges'
            className='w-full pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none'
          />
          {isSearching && (
            <div className='absolute right-3 top-2.5'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500'></div>
            </div>
          )}
        </div>
      </div>

      <div className='flex gap-8'>
        <div className='w-1/4 space-y-4 hidden md:block'>
          {!isModalOpen && (
            <>
              <FilterSection
                title='Discipline'
                inputField='discipline'
                options={filteredDisciplines}
                selectedValues={selectedFilters.degree}
                onCheckboxChange={(val) => handleFilterChange('degree', val)}
                filterInputs={filterInputs}
                handleFilterInputChange={handleFilterInputChange}
                isLoading={isDisciplineLoading}
              />
              <FilterSection
                title='District'
                inputField='district'
                options={filteredDistricts}
                selectedValues={selectedFilters.state}
                onCheckboxChange={(val) => handleFilterChange('state', val)}
                filterInputs={filterInputs}
                handleFilterInputChange={handleFilterInputChange}
              />
              <FilterSection
                title='Affiliation'
                inputField='affiliation'
                options={filteredAffiliations}
                selectedValues={selectedFilters.uni}
                onCheckboxChange={(val) => handleFilterChange('uni', val)}
                filterInputs={filterInputs}
                handleFilterInputChange={handleFilterInputChange}
                isLoading={isAffiliationLoading}
              />
              <FilterSection
                title='Institute type'
                inputField='instituteType'
                options={filteredInstituteTypes}
                selectedValues={selectedFilters.type}
                onCheckboxChange={(val) => handleFilterChange('type', val)}
                filterInputs={filterInputs}
                handleFilterInputChange={handleFilterInputChange}
              />
            </>
          )}
        </div>

        <div className='md:w-3/4 w-full'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {Array.from({ length: 6 }).map((_, idx) => (
                <UniversityCardShimmer key={idx} />
              ))}
            </div>
          ) : universities.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {universities.map((u, idx) => (
                <UniversityCard {...u} key={idx} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
              No Results Found
            </div>
          )}
          {!searchQuery && universities.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <FilterModal
          modalFilterInputs={modalFilterInputs}
          setModalFilterInputs={setModalFilterInputs}
          modalSelectedFilters={modalSelectedFilters}
          setModalSelectedFilters={setModalSelectedFilters}
          modalDisciplines={modalDisciplines}
          modalAffiliations={modalAffiliations}
          modalFilteredDistricts={modalFilteredDistricts}
          modalFilteredInstituteTypes={modalFilteredInstituteTypes}
          isModalDisciplineLoading={isModalDisciplineLoading}
          isModalAffiliationLoading={isModalAffiliationLoading}
          onApply={handleApplyModalFilters}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default CollegeFinder
