'use client'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Filter, X } from 'lucide-react'
import { Select } from '@/ui/shadcn/select'
import EmptyState from '@/ui/shadcn/EmptyState'
import { getConsultancies, getCourses } from './actions'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Pagination from '../blogs/components/Pagination'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'

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

  const handleClick = (slugs) => {
    router.push(`/consultancy/${slugs}`)
  }

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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {consultancyData.map((consultancy) => {
                const destinations = JSON.parse(consultancy.destination || '[]')
                const address = JSON.parse(consultancy.address || '{}')
                const description = consultancy?.description || ''
                const logo = consultancy?.logo || ''

                return (
                  <div
                    key={consultancy.id}
                    className='group cursor-pointer h-full'
                    onClick={() => handleClick(consultancy.slugs)}
                  >
                    <div className='bg-white rounded-[32px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-[#0A6FA7]/20 flex flex-col'>
                      {/* Banner */}
                      <div className='relative h-48 w-full bg-gray-100'>
                        <Image
                          src={
                            consultancy?.featured_image ||
                            'https://placehold.co/600x400'
                          }
                          alt={consultancy.title}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-500'
                          priority
                        />

                        {consultancy.pinned === 1 && (
                          <span className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#0A6FA7] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm border border-gray-100 uppercase tracking-wider'>
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className='p-8 flex flex-col flex-grow'>
                        {/* Logo and Title */}
                        <div className='flex items-start gap-4 mb-4'>
                          {logo && (
                            <div className='relative w-12 h-12 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-1'>
                              <Image
                                src={logo}
                                alt={`${consultancy.title} Logo`}
                                fill
                                className='object-contain p-1'
                              />
                            </div>
                          )}
                          <h2 className='text-lg font-bold text-gray-900 group-hover:text-[#0A6FA7] transition-colors line-clamp-2 leading-tight'>
                            {consultancy.title}
                          </h2>
                        </div>

                        {/* Description */}
                        {description && (
                          <p className='text-gray-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed'>
                            {description}
                          </p>
                        )}

                        <div className='mt-auto space-y-4 pt-6 border-t border-gray-50'>
                          {/* Destinations */}
                          {destinations.length > 0 && (
                            <div>
                              <h3 className='text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                                Destinations
                              </h3>
                              <div className='flex flex-wrap gap-2'>
                                {destinations.slice(0, 3).map((dest, index) => (
                                  <span
                                    key={index}
                                    className='bg-gray-50 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-gray-100'
                                  >
                                    {dest.country}
                                  </span>
                                ))}
                                {destinations.length > 3 && (
                                  <span className='text-xs font-bold text-gray-400 py-1'>
                                    +more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Address */}
                          {(address.city || address.street) && (
                            <div>
                              <h3 className='text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1'>
                                Location
                              </h3>
                              <div className='flex items-center gap-1.5 text-gray-600'>
                                <MapPin className='w-3.5 h-3.5 text-[#0A6FA7]' />
                                <span className='text-sm font-semibold truncate'>
                                  {[address.street, address.city]
                                    .filter(Boolean)
                                    .join(', ')}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
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
