'use client'
import AdmissionCard from '@/ui/molecules/cards/AdmissionCard'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import EmptyState from '@/ui/shadcn/EmptyState'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import {
  Clipboard,
  Search,
  X
} from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import Pagination from '../../blogs/components/Pagination'
import { fetchCourses, getAdmission } from '../actions'


const AdmissionPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [admission, setAdmission] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedProgram, setSelectedCourse] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [selectedCourseObject, setSelectedCourseObject] = useState(null)

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Reset to page 1 when search or filters change
  useLayoutEffect(() => {
    setPagination((prev) =>
      prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev
    )
  }, [debouncedSearch, selectedProgram])

  // Fetch admission data
  const fetchAdmissionData = useCallback(
    async (page = 1, search = '', course = '') => {
      setLoading(true)
      try {
        const response = await getAdmission(search, page, course)
        setAdmission(response.items)
        setPagination((prev) => ({
          ...prev,
          totalPages: response.pagination.totalPages,
          totalCount: response.pagination.totalCount
        }))
      } catch (error) {
        console.error('Error:', error)
        setAdmission([])
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    fetchAdmissionData(pagination.currentPage, debouncedSearch, selectedProgram)
  }, [
    debouncedSearch,
    selectedProgram,
    pagination.currentPage,
    fetchAdmissionData
  ])

  // Scroll to top on URL or pagination change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [searchParams, pagination.currentPage])

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCourse('')
    setSelectedCourseObject(null)
  }

  return (
    <div className='min-h-screen bg-gray-50/50 py-12 px-6 font-sans'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
          <div>
            <div className='relative inline-block mb-3'>
              <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight'>
                Latest <span className='text-[#0A6FA7]'>Admissions</span> Open
              </h1>
              <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
            </div>

          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedProgram) && (
            <button
              onClick={clearFilters}
              className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
            >
              <X className='w-4 h-4' />
              Clear All Filters
            </button>
          )}
        </div>

        {/* Filters Section */}
        <div className='bg-white rounded-[32px] shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 p-8 mb-12'>
          <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
            {/* Search */}
            <div className='md:col-span-7'>
              <label className='block text-[11px]  font-bold  mb-2'>
                Search Admissions
              </label>
              <div className='relative group'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                <input
                  type='text'
                  placeholder='Search by college or course...'
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  className='w-full px-5 py-3.5 pl-12 rounded-md border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold'
                />
              </div>
            </div>

            {/* Course Filter */}
            <div className='lg:col-span-3'>
              <label className='block text-[11px] font-bold mb-2'>
                Course
              </label>
              <SearchSelectCreate
                onSearch={fetchCourses}
                onSelect={(prog) => {
                  setSelectedCourseObject(prog)
                  setSelectedCourse(prog.slugs)
                }}
                onRemove={() => {
                  setSelectedCourseObject(null)
                  setSelectedCourse('')
                }}
                selectedItems={selectedCourseObject}
                placeholder="Search or select course..."
                displayKey="title"
                valueKey="slugs"
                isMulti={false}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        {!loading && (
          <div className='flex items-center justify-between mb-8 px-2'>
            <p className='text-sm font-semibold text-gray-500'>
              Showing <span className='text-gray-900'>{admission.length}</span>{' '}
              of <span className='text-gray-900'>{pagination.totalCount}</span>{' '}
              admissions
            </p>
          </div>
        )}

        {/* Admissions Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array(6)
              .fill('')
              .map((_, index) => (
                <CardSkeleton key={index} />
              ))}
          </div>
        ) : admission.length === 0 ? (
          <div className='bg-white rounded-[40px] p-20 shadow-[0_2px_15px_rgba(0,0,0,0.01)] border border-gray-100'>
            <EmptyState
              icon={Clipboard}
              title='No Admissions Found'
              description={
                searchTerm || selectedProgram
                  ? 'No admissions match your selected filters. Try clearing them to see more.'
                  : 'No admission details are currently available'
              }
              action={
                searchTerm || selectedProgram
                  ? { label: 'Clear All Filters', onClick: clearFilters }
                  : null
              }
            />
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {admission.map((admis) => (
                <AdmissionCard key={admis.id} admis={admis} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className='mt-16 bg-white py-6 px-10 rounded-[32px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex justify-center'>
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdmissionPage
