'use client'

import { useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { getCareers } from './actions'
import Link from 'next/link'
import { Search, Briefcase, X } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Pagination from '../blogs/components/Pagination'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const CareerPage = () => {
  const [careers, setCareers] = useState([])
  const [isScrolling, setIsScrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [isSearching, setIsSearching] = useState(false)

  // Debounce search
  useEffect(() => {
    setIsSearching(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setIsSearching(false)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const loadCareers = useCallback(async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await getCareers(page, search)
      setCareers(response.items || [])
      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalCount: response.pagination.totalCount
        }))
      }
    } catch (error) {
      console.error('Error:', error)
      setCareers([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset to page 1 when search changes
  useLayoutEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [debouncedSearch])

  // Fetch when page or search changes
  useEffect(() => {
    loadCareers(pagination.currentPage, debouncedSearch)
  }, [debouncedSearch, pagination.currentPage, loadCareers])

  // Handle page change
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
                  Explore Career{' '}
                  <span className='text-[#0A6FA7]'>Opportunities</span>
                </h1>
                <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
              </div>
              <p className='text-gray-500 max-w-xl font-medium text-lg mt-2'>
                Join our team and build a rewarding career with us. Browse open
                positions and find the role that best fits your skills.
              </p>
            </div>

            {/* Clear All Button */}
            {searchTerm && (
              <button
                onClick={clearFilters}
                className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
              >
                <X className='w-4 h-4' />
                Clear Search
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className='bg-white rounded-[32px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-12'>
            <div className='max-w-2xl mx-auto'>
              <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                Search Careers
              </label>
              <div className='relative group'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                <input
                  type='text'
                  placeholder='Job title or keyword...'
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400'
                />
                {isSearching && (
                  <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-[#0A6FA7]'></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && !isScrolling && (
            <div className='mb-8 px-2'>
              <p className='text-sm text-gray-500 font-semibold'>
                Showing <span className='text-gray-900'>{careers.length}</span>{' '}
                of{' '}
                <span className='text-gray-900'>{pagination.totalCount}</span>{' '}
                results
              </p>
            </div>
          )}

          {/* Career Cards Grid */}
          {loading || isScrolling ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          ) : careers.length === 0 ? (
            <div className='bg-white rounded-[32px] border border-gray-100 border-dashed py-20'>
              <EmptyState
                icon={Briefcase}
                title='No Careers Found'
                description={
                  searchTerm
                    ? 'No career opportunities match your search. Try adjusting your search keywords.'
                    : 'No career opportunities are currently available'
                }
                action={
                  searchTerm
                    ? { label: 'Clear Search', onClick: clearFilters }
                    : null
                }
              />
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {careers.map((career) => (
                <Link
                  href={`/career/${career.slugs}`}
                  key={career.id}
                  className='group'
                >
                  <div className='h-full bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#0A6FA7]/5 hover:border-[#0A6FA7]/20 transition-all duration-500 flex flex-col overflow-hidden'>
                    <div className='relative h-48 w-full bg-gray-100'>
                      <img
                        src={career?.featuredImage || '/images/job.webp'}
                        alt={career.title}
                        className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-700'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60' />
                      {career.college && (
                        <div className='absolute bottom-4 left-4 right-4'>
                          <span className='inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#0A6FA7] shadow-sm'>
                            {career.college.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='p-8 flex flex-col flex-1'>
                      <h2 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A6FA7] transition-colors line-clamp-2 tracking-tight'>
                        {career.title}
                      </h2>

                      <p className='text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed'>
                        {career.description}
                      </p>

                      <div className='mt-auto pt-6 border-t border-gray-50 flex items-center justify-between'>
                        <div className='flex flex-col'>
                          <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                            Posted
                          </span>
                          <span className='text-sm font-bold text-gray-700'>
                            {formatDate(career.createdAt)}
                          </span>
                        </div>
                        <div className='w-8 h-8 rounded-full bg-[#0A6FA7]/10 flex items-center justify-center group-hover:bg-[#0A6FA7] transition-colors duration-500'>
                          <Briefcase className='w-4 h-4 text-[#0A6FA7] group-hover:text-white transition-colors duration-500' />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className='mt-20 flex justify-center'>
              <div className='bg-white px-8 py-4 rounded-[24px] shadow-sm border border-gray-100'>
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

export default CareerPage
