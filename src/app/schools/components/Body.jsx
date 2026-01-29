'use client'
import { Search, School } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { FaExpandAlt } from 'react-icons/fa'
import FilterSection from './FilterSection'
import UniversityCard from './UniversityCard'
import { useState, useEffect, useCallback, useRef } from 'react'
import { debounce } from 'lodash'
import Pagination from '@/app/blogs/components/Pagination'
import { ShimmerCard } from './ShimmerCard'
import { DotenvConfig } from '@/config/env.config'
import { buildQueryString } from '@/lib/queryString'

const CollegeFinder = () => {
  const topRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [universities, setUniversities] = useState([])
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    totalCount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Filter States
  const [selectedFilters, setSelectedFilters] = useState({
    grade: [],
    affiliation: [],
    amenity: [],
    district: [],
    type: []
  })

  // Filter Options (Static for now, can be fetched if API available)
  const filterOptions = {
    grade: [
      { name: 'Kindergarten', count: 0 },
      { name: 'Grade 1-5', count: 0 },
      { name: 'Grade 6-10', count: 0 },
      { name: 'Grade 11-12', count: 0 }
    ],
    affiliation: [
      { name: 'NEB', count: 0 },
      { name: 'CBSE', count: 0 },
      { name: 'Cambridge / A-Level', count: 0 },
      { name: 'IB', count: 0 }
    ],
    amenity: [
      { name: 'Hostel', count: 0 },
      { name: 'Transportation', count: 0 },
      { name: 'Library', count: 0 },
      { name: 'Lab', count: 0 },
      { name: 'Sports', count: 0 },
      { name: 'Cafeteria', count: 0 }
    ],
    district: [
      { name: 'Kathmandu', count: 0 },
      { name: 'Lalitpur', count: 0 },
      { name: 'Bhaktapur', count: 0 },
      { name: 'Chitwan', count: 0 },
      { name: 'Pokhara', count: 0 }
    ],
    type: [
      { name: 'Public', count: 0 },
      { name: 'Private', count: 0 },
      { name: 'Community', count: 0 }
    ]
  }

  // Fetch Logic
  const fetchColleges = async (page = 1) => {
    setIsLoading(true)
    try {
      const queryParams = {
        page,
        limit: 24,
        q: searchQuery,
        grade: selectedFilters.grade.join(','),
        affiliation: selectedFilters.affiliation.join(','),
        amenity: selectedFilters.amenity.join(','),
        district: selectedFilters.district.join(','),
        type: selectedFilters.type.join(',')
      }

      const queryString = buildQueryString(queryParams)
      const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/college/list-school?${queryString}`

      const response = await fetch(url, { cache: 'no-store' })

      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()

      if (data.items) {
        setUniversities(data.items.map((college) => ({
          name: college.name,
          description: college.description,
          googleMapUrl: college.google_map_url,
          instituteType: college.institute_type,
          slug: college.slugs,
          collegeId: college.id,
          logo: college.logo || college.image
        })))

        setPagination(data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalRecords: data.items.length
        })
      } else {
        setUniversities([])
      }

    } catch (error) {
      console.error('Error fetching colleges:', error)
      setUniversities([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced Search
  const debouncedFetch = useCallback(
    debounce(() => {
      fetchColleges(1)
    }, 800),
    [searchQuery, selectedFilters]
  )

  useEffect(() => {
    debouncedFetch()
    return () => debouncedFetch.cancel()
  }, [searchQuery, selectedFilters])


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleFilterChange = (category, items) => {
    setSelectedFilters(prev => ({ ...prev, [category]: items }))
  }

  const handlePageChange = (page) => {
    fetchColleges(page)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleClearAll = () => {
    setSearchQuery('')
    setSelectedFilters({
      grade: [],
      affiliation: [],
      amenity: [],
      district: [],
      type: []
    })
  }

  return (
    <div className='max-w-[1600px] mx-auto p-6' ref={topRef}>
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
        <div className='flex items-center gap-4 w-full md:w-auto'>
          <h2 className='text-xl font-semibold'>Filters</h2>
          <div className='flex gap-3'>
            <button
              className='text-gray-600 text-sm flex items-center hover:text-gray-800 md:hidden'
              onClick={() => setIsModalOpen(true)}
            >
              <div>Filter</div>
              <div className='mx-2'>
                <FaExpandAlt />
              </div>
            </button>
            <button
              className='text-gray-600 text-sm hover:text-red-500 transition-colors'
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <div className='hidden md:block text-gray-500'>
            ({pagination.totalCount || 0} schools)
          </div>
          <div className='relative w-full md:w-80'>
            <Search className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search schools...'
              className='w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow'
            />
          </div>
        </div>
      </div>

      <div className='flex gap-8'>
        {/* Desktop Filters */}
        <div className='w-1/4 space-y-4 hidden lg:block'>
          <FilterSection
            title="Grade"
            options={filterOptions.grade}
            selectedItems={selectedFilters.grade}
            onSelectionChange={(items) => handleFilterChange('grade', items)}
          />
          <FilterSection
            title="Affiliation"
            options={filterOptions.affiliation}
            selectedItems={selectedFilters.affiliation}
            onSelectionChange={(items) => handleFilterChange('affiliation', items)}
          />
          <FilterSection
            title="Type"
            options={filterOptions.type}
            selectedItems={selectedFilters.type}
            onSelectionChange={(items) => handleFilterChange('type', items)}
          />
          <FilterSection
            title="District"
            options={filterOptions.district}
            selectedItems={selectedFilters.district}
            placeholder="Search district"
            onSelectionChange={(items) => handleFilterChange('district', items)}
          />
          <FilterSection
            title="Amenity"
            options={filterOptions.amenity}
            selectedItems={selectedFilters.amenity}
            placeholder="Search amenity"
            onSelectionChange={(items) => handleFilterChange('amenity', items)}
          />
        </div>

        {/* Results */}
        <div className='w-full lg:w-3/4'>
          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, index) => (
                <ShimmerCard key={index} />
              ))}
            </div>
          ) : (
            <>
              {universities.length > 0 ? (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                  {universities.map((university, index) => (
                    <UniversityCard key={index} {...university} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={School}
                  title='No Schools Found'
                  description={searchQuery ? `No schools match "${searchQuery}"` : 'Try adjusting your filters'}
                  action={{ label: 'Clear Filters', onClick: handleClearAll }}
                />
              )}

              {universities.length > 0 && (
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black/60 z-50 flex justify-end transition-opacity'>
          <div className='bg-white w-[85%] max-w-md h-full overflow-y-auto p-6 animate-in slide-in-from-right duration-300'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold'>Filters</h2>
              <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-gray-100 rounded-full'>✕</button>
            </div>
            <div className='space-y-6'>
              <FilterSection
                title="Grade"
                options={filterOptions.grade}
                selectedItems={selectedFilters.grade}
                onSelectionChange={(items) => handleFilterChange('grade', items)}
              />
              <FilterSection
                title="Affiliation"
                options={filterOptions.affiliation}
                selectedItems={selectedFilters.affiliation}
                onSelectionChange={(items) => handleFilterChange('affiliation', items)}
              />
              <FilterSection
                title="Type"
                options={filterOptions.type}
                selectedItems={selectedFilters.type}
                onSelectionChange={(items) => handleFilterChange('type', items)}
              />
              <FilterSection
                title="District"
                options={filterOptions.district}
                selectedItems={selectedFilters.district}
                placeholder="Search district"
                onSelectionChange={(items) => handleFilterChange('district', items)}
              />
              <FilterSection
                title="Amenity"
                options={filterOptions.amenity}
                selectedItems={selectedFilters.amenity}
                placeholder="Search amenity"
                onSelectionChange={(items) => handleFilterChange('amenity', items)}
              />
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegeFinder
