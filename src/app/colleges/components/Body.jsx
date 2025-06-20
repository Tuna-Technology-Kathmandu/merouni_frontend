'use client'
import { Search } from 'lucide-react'
import { FaExpandAlt } from 'react-icons/fa'
import FilterSection from './FilterSection'
// import AffiliationSection from "./AffiliationSection";
// import CourseFeeSection from "./CourseFeeSection";
import UniversityCard from './UniversityCard'
import { useState, useEffect, useCallback } from 'react'
import {
  getColleges,
  searchColleges,
  getPrograms,
  getUniversity
} from '../actions'
import { debounce } from 'lodash'
import UniversityCardShimmer from './UniversityShimmerCard'
import Pagination from '@/app/blogs/components/Pagination'
import Link from 'next/link'

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
  const [degree, setDegree] = useState([])
  const [uni, setUni] = useState([])

  const [selectedFilters, setSelectedFilters] = useState({
    state: '',
    degree: '',
    uni: '',
    level: '',
    courseFees: { min: 0, max: 1000000 }
  })

  useEffect(() => {
    if (!searchQuery) {
      fetchColleges(pagination.currentPage, selectedFilters)
    }
  }, [pagination.currentPage, searchQuery, selectedFilters])

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        setIsSearching(true)
        const results = await searchColleges(query)
        setUniversities(results.colleges)
        setPagination(results.pagination)
        setIsSearching(false)
      }
    }, 1000), // 1000ms delay
    []
  )
  // for getting programs
  useEffect(() => {
    const fetchPrograms = async () => {
      const programData = await getPrograms()
      const programTitles = programData.map((prog) => ({
        name: prog.title
      }))
      setDegree(programTitles)
    }

    fetchPrograms()
  }, [])

  // for getting university
  useEffect(() => {
    const fetchUniversity = async () => {
      const universityData = await getUniversity()
      const Titles = universityData.map((uni) => ({
        name: uni.fullname
      }))
      setUni(Titles)
    }

    fetchUniversity()
  }, [])

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const fetchColleges = async (page) => {
    setIsLoading(true)
    try {
      const data = await getColleges(page, selectedFilters)
      setUniversities(data.colleges)
      setPagination(data.pagination)
      console.log('data response', data)
    } catch (error) {
      console.error('Error fetching colleges:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {}, [universities])

  const fetchFilteredPrograms = async (searchTerm) => {
    if (!searchTerm) {
      // Load all programs if search is empty
      const allPrograms = await getPrograms()
      setDegree(allPrograms.map((p) => ({ name: p.title })))
      return
    }

    // Call your backend API with searchTerm to get filtered programs
    // Assuming you have a backend function to support search like getPrograms(searchTerm)
    const filteredPrograms = await getPrograms(searchTerm)
    setDegree(filteredPrograms.map((p) => ({ name: p.title })))
  }

  const fetchFilteredUniversities = async (searchTerm) => {
    if (!searchTerm) {
      const allUniversities = await getUniversity()
      setUni(allUniversities.map((u) => ({ name: u.fullname })))
      return
    }

    const filteredUniversities = await getUniversity(searchTerm)
    setUni(filteredUniversities.map((u) => ({ name: u.fullname })))
  }
  const filters = [
    {
      title: 'Discipline ',
      placeholder: 'Search by discipline',
      options: degree,
      selectedItems: selectedFilters.degree,
      onSelectionChange: (item) => {
        setSelectedFilters((prev) => ({ ...prev, degree: item }))
      },
      onSearchInputChange: fetchFilteredPrograms
    },
    {
      title: 'District',
      placeholder: 'Search by district',
      options: [
        { name: 'Bhojpur' },
        { name: 'Dhankuta' },
        { name: 'Ilam' },
        { name: 'Jhapa' },
        { name: 'Khotang' },
        { name: 'Morang' },
        { name: 'Okhaladhunga' },
        { name: 'Panchthar' },
        { name: 'Sankhuwasabha' },
        { name: 'Solukhumbu' },
        { name: 'Sunsari' },
        { name: 'Taplejung' },
        { name: 'Terhathum' },
        { name: 'Udayapur' },
        { name: 'Bara' },
        { name: 'Dhanusha' },
        { name: 'Mahottari' },
        { name: 'Parsa' },
        { name: 'Rautahat' },
        { name: 'Saptari' },
        { name: 'Sarlahi' },
        { name: 'Siraha' },
        { name: 'Bhaktapur' },
        { name: 'Chitawan' },
        { name: 'Dhading' },
        { name: 'Dolakha' },
        { name: 'Kathmandu' },
        { name: 'Kavrepalanchok' },
        { name: 'Lalitpur' },
        { name: 'Makwanpur' },
        { name: 'Nuwakot' },
        { name: 'Ramechhap' },
        { name: 'Rasuwa' },
        { name: 'Sindhuli' },
        { name: 'Sindhupalchok' },
        { name: 'Baglung' },
        { name: 'Gorkha' },
        { name: 'Kaski' },
        { name: 'Lamjung' },
        { name: 'Manang' },
        { name: 'Mustang' },
        { name: 'Myagdi' },
        { name: 'Nawalpur' },
        { name: 'Parbat' },
        { name: 'Syangja' },
        { name: 'Tanahu' },
        { name: 'Arghakhanchi' },
        { name: 'Banke' },
        { name: 'Bardiya' },
        { name: 'Dang' },
        { name: 'Gulmi' },
        { name: 'Kapilbastu' },
        { name: 'Nawalparasi' },
        { name: 'Palpa' },
        { name: 'Pyuthan' },
        { name: 'Rolpa' },
        { name: 'Rukum Purba' },
        { name: 'Rupandehi' },
        { name: 'Dailekh' },
        { name: 'Dolpa' },
        { name: 'Humla' },
        { name: 'Jajarkot' },
        { name: 'Jumla' },
        { name: 'Kalikot' },
        { name: 'Mugu' },
        { name: 'Rukum Paschim' },
        { name: 'Salyan' },
        { name: 'Surkhet' },
        { name: 'Achham' },
        { name: 'Baitadi' },
        { name: 'Bajhang' },
        { name: 'Bajura' },
        { name: 'Dadeldhura' },
        { name: 'Darchula' },
        { name: 'Doti' },
        { name: 'Kailali' },
        { name: 'Kanchanpur' }
      ],

      selectedItems: selectedFilters.state,
      onSelectionChange: (item) => {
        setSelectedFilters((prev) => ({ ...prev, state: item }))
      }
    },
    {
      title: 'Affiliation ',
      placeholder: 'Search by Affiliation',
      options: uni,
      selectedItems: selectedFilters.uni,
      onSelectionChange: (item) => {
        setSelectedFilters((prev) => ({ ...prev, uni: item }))
      },
      onSearchInputChange: fetchFilteredUniversities
    },
    {
      title: 'Institute Level ',
      placeholder: 'Search by institute level',
      options: [{ name: 'School' }, { name: 'College' }],
      selectedItems: selectedFilters.level,
      onSelectionChange: (item) => {
        setSelectedFilters((prev) => ({ ...prev, level: item }))
      }
    }
  ]

  const FilterModal = () => (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
      <div className='bg-white rounded-xl p-6 w-full max-w-[90%] md:max-w-[80%] lg:max-w-[60%] h-full max-h-[90%] overflow-y-auto'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>All Filters</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className='text-gray-500 hover:text-gray-700 text-xl'
          >
            ✕
          </button>
        </div>
        {/* Responsive Filter Layout */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filters.map((filter, index) => (
            <FilterSection key={index} {...filter} />
          ))}

          {/* <AffiliationSection /> */}
          {/* <CourseFeeSection /> */}
        </div>
        <div className='flex justify-end mt-4'>
          <button
            onClick={() => setIsModalOpen(false)}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition'
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page
      }))
    }
  }

  const NoResultsFound = () => (
    <div className='flex flex-col items-center justify-center h-64'>
      <Search className='w-16 h-16 text-gray-300 mb-4' />
      <h3 className='text-xl font-semibold text-gray-600'>No Results Found</h3>
      <p className='text-gray-500 mt-2'>
        Try adjusting your search criteria or browse all colleges
      </p>
    </div>
  )

  console.log('universities', universities)
  return (
    <div className='max-w-[1600px] mx-auto p-6'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-semibold'>Filters</h2>
          <div className='flex gap-3'>
            <button
              className='text-gray-600 text-sm flex items-center hover:text-gray-800'
              onClick={() => setIsModalOpen(true)}
            >
              <div>Expand</div>
              <div className='mx-2'>
                <FaExpandAlt />
              </div>
            </button>
            <button
              className='text-gray-600 text-sm'
              onClick={() => {
                setSearchQuery('') // Clear search query
                setSelectedFilters({
                  state: [],
                  degree: [],
                  affiliations: [],
                  courseFees: { min: 0, max: 1000000 }
                }) // Reset all filters
              }}
            >
              Clear All
            </button>
          </div>
        </div>
        <div className='flex  items-center gap-4'>
          <div className='flex gap-4'>
            <h2 className='text-xl font-semibold'>Colleges</h2>
            <span className='text-gray-500'>
              ({pagination.totalCount || '0'} Colleges)
            </span>
          </div>
        </div>
        <div className='flex bg-gray-100 items-center rounded-xl '>
          <Search className=' left-3 top-2.5 w-5 h-5 text-gray-400 mx-2' />
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder='Search by colleges'
            className='w-full pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none'
          />
          {isSearching && (
            <div className='absolute right-3 top-2.5'>
              <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500'></div>
            </div>
          )}
        </div>
      </div>
      <div className='flex gap-8'>
        <div className='w-1/4 space-y-4 hidden md:block'>
          {filters.map((filter, index) => (
            <FilterSection key={index} {...filter} />
          ))}

          {/* <AffiliationSection /> */}
          {/* <CourseFeeSection /> */}
        </div>

        <div className=' md:w-3/4'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {Array.from({ length: 6 }).map((_, index) => (
                <UniversityCardShimmer key={index} />
              ))}
            </div>
          ) : (
            <>
              {universities.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {universities.map((university, index) => {
                    return (
                      <Link key={index} href={`/colleges/${university.slug}`}>
                        <UniversityCard {...university} />
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <NoResultsFound />
              )}
              {!searchQuery && universities.length > 0 && (
                <Pagination
                  onPageChange={handlePageChange}
                  pagination={pagination}
                />
              )}
            </>
          )}
        </div>
      </div>
      {isModalOpen && <FilterModal />}
    </div>
  )
}

export default CollegeFinder
