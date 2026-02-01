'use client'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Select } from '@/ui/shadcn/select'
import EmptyState from '@/ui/shadcn/EmptyState'
import { getConsultancies, getCourses } from './actions'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Pagination from '../blogs/components/Pagination'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import ConsultancyCard from '@/ui/molecules/cards/ConsultancyCard'

export default function ConsultanciesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [consultancyData, setConsultancyData] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [isScrolling, setIsScrolling] = useState(false)

  // Fetch courses on mount
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const data = await getCourses()
        setCourses(data)
      } catch (err) {
        console.error('Failed to fetch courses:', err)
      }
    }
    fetchCoursesData()
  }, [])

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Reset page on search or filter change
  useLayoutEffect(() => {
    setPagination((prev) =>
      prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev
    )
  }, [debouncedSearch, selectedCourse])

  // Fetch consultancies
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await getConsultancies(
          pagination.currentPage,
          debouncedSearch,
          selectedCourse
        )

        setConsultancyData(data.items)
        setPagination((prev) => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          totalCount: data.pagination.totalCount
        }))
      } catch (err) {
        console.error(err)
        setConsultancyData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [pagination.currentPage, debouncedSearch, selectedCourse])

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
    setSelectedCourse('')
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
                  Explore <span className='text-[#0A6FA7]'>Consultancies</span>
                </h1>
                <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
              </div>
            </div>

            {/* Clear All Button */}
            {(searchTerm || selectedCourse) && (
              <button
                onClick={clearFilters}
                className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
              >
                <X className='w-4 h-4' />
                Clear All Filters
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <div className='bg-white rounded-[32px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6'>
              {/* Search */}
              <div className='lg:col-span-8'>
                <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                  Search Consultancies
                </label>
                <div className='relative group'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                  <input
                    type='text'
                    placeholder='Search by consultancy name...'
                    className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                </div>
              </div>

              {/* Course Filter */}
              <div className='lg:col-span-4'>
                <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                  Filter by Course
                </label>
                <Select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className='w-full pl-6'
                >
                  <option value=''>All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && !isScrolling && (
            <div className='mb-8 px-2'>
              <p className='text-sm text-gray-500 font-semibold'>
                Showing{' '}
                <span className='text-gray-900'>{consultancyData.length}</span>{' '}
                of{' '}
                <span className='text-gray-900'>{pagination.totalCount}</span>{' '}
                results
              </p>
            </div>
          )}

          {/* Grid */}
          {loading || isScrolling ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          ) : consultancyData.length === 0 ? (
            <div className='bg-white rounded-[32px] border border-gray-100 border-dashed py-20'>
              <EmptyState
                icon={Search}
                title='No Consultancies Found'
                description={
                  searchTerm
                    ? `No consultancies match your search "${searchTerm}"`
                    : 'No consultancies are currently available'
                }
                action={
                  searchTerm || selectedCourse
                    ? {
                        label: 'Clear All Filters',
                        onClick: clearFilters
                      }
                    : null
                }
              />
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...consultancyData]
                .sort(
                  (a, b) => (b.pinned === 1 ? 1 : 0) - (a.pinned === 1 ? 1 : 0)
                )
                .map((consultancy) => (
                  <ConsultancyCard
                    key={consultancy.id}
                    consultancy={consultancy}
                  />
                ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='mt-16 flex justify-center'>
              <div className='bg-white px-8 py-4 rounded-[24px] shadow-[0_2px_15px_rgba(0,0,0,0.01)] border border-gray-100'>
                <Pagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
