'use client'
import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { IoSearch } from 'react-icons/io5'
import { Select } from '@/ui/shadcn/select'
import EmptyState from '@/ui/shadcn/EmptyState'
import { getConsultancies } from './actions'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Pagination from '../blogs/components/Pagination'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import ConsultancyCard from '@/ui/molecules/cards/ConsultancyCard'

export default function ConsultanciesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // Initialization from search params
  const initialSearch = searchParams.get('q') || ''
  const initialPage = parseInt(searchParams.get('page')) || 1

  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [consultancyData, setConsultancyData] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalCount: 0
  })
  const [loading, setLoading] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)

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


  // Sync state with URL
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const pg = parseInt(searchParams.get('page')) || 1

    setSearchTerm(q)
    setDebouncedSearch(q)
    setPagination(prev => ({ ...prev, currentPage: pg }))
  }, [searchParams])

  // Scroll to top on URL change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [searchParams])

  // Debouncing logic (Updates URL)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== initialSearch) {
        updateURL({ q: searchTerm, page: 1 })
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm, initialSearch, updateURL])


  // Fetch consultancies when URL params change
  useEffect(() => {
    async function fetchData() {
      const q = searchParams.get('q') || ''
      const pg = parseInt(searchParams.get('page')) || 1

      setLoading(true)
      try {
        const data = await getConsultancies(pg, q)
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
  }, [searchParams])

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      updateURL({ page })
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
          {/* Header & Search Section */}
          <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10'>
            <div className='relative'>
              <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight'>
                Explore <span className='text-[#0A6FA7]'>Consultancies</span>
              </h1>
              <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
            </div>

            <div className='flex flex-col md:flex-row items-center gap-6'>
              {/* Clear All Button */}
              {searchTerm && (
                <button
                  onClick={clearFilters}
                  className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors whitespace-nowrap'
                >
                  <X className='w-4 h-4' />
                  Clear Filters
                </button>
              )}

              {/* Search Input - Blog Style */}
              <div className='w-full md:w-[320px]'>
                <div className='relative group'>
                  <IoSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors text-lg' />
                  <input
                    type='text'
                    placeholder='Search consultancies...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full py-3 pl-12 pr-4 bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-700 shadow-sm focus:border-[#0A6FA7] focus:ring-2 focus:ring-[#0A6FA7]/20 transition-all'
                  />
                </div>
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
                  searchTerm
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
