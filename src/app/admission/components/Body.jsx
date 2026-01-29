'use client'
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { Search, Clipboard, Filter, X, ChevronRight, GraduationCap } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { getAdmission, fetchPrograms } from '../actions'
import Link from 'next/link'
import Pagination from '../../blogs/components/Pagination'
import { CardSkeleton } from '@/components/ui/CardSkeleton'

const AdmissionPage = () => {
  const [admission, setAdmission] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [programs, setPrograms] = useState([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [isScrolling, setIsScrolling] = useState(false)

  // Fetch filter options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const progData = await fetchPrograms()
        setPrograms(progData)
      } catch (error) {
        console.error('Error fetching filter options:', error)
      }
    }
    fetchOptions()
  }, [])

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
  const fetchAdmissionData = useCallback(async (page = 1, search = '', program = '') => {
    setLoading(true)
    try {
      const response = await getAdmission(search, page, program)
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
  }, [])

  useEffect(() => {
    fetchAdmissionData(pagination.currentPage, debouncedSearch, selectedProgram)
  }, [debouncedSearch, selectedProgram, pagination.currentPage, fetchAdmissionData])

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
    setSelectedProgram('')
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
            <p className='mt-4 text-gray-500 max-w-2xl font-medium text-base md:text-lg'>
              Find and apply to the best college programs in Nepal. Your future starts here.
            </p>
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
              <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>Search Admissions</label>
              <div className='relative group'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                <input
                  type='text'
                  placeholder='Search by college or program...'
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400'
                />
              </div>
            </div>

            {/* Program Filter */}
            <div className='lg:col-span-3'>
                              <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>Program / Course</label>
              <div className='relative group'>
                  <Filter className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors z-10' />
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                    className='w-full px-12 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 appearance-none cursor-pointer'
                >
                  <option value=''>All Programs</option>
                  {programs.map((prog) => (
                    <option key={prog.id} value={prog.slugs}>{prog.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {!loading && !isScrolling && (
          <div className='flex items-center justify-between mb-8 px-2'>
            <p className='text-sm font-semibold text-gray-500'>
              Showing <span className='text-gray-900'>{admission.length}</span> of <span className='text-gray-900'>{pagination.totalCount}</span> admissions
            </p>
          </div>
        )}

        {/* Admissions Grid */}
        {loading || isScrolling ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array(6).fill('').map((_, index) => <CardSkeleton key={index} />)}
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
                <div
                  key={admis.id}
                  className='group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-[#0A6FA7]/20 transition-all duration-300 flex flex-col'
                >
                  <div className='flex items-start justify-between mb-6'>
                    <div className='p-3 bg-blue-50 rounded-2xl group-hover:bg-[#0A6FA7]/10 transition-colors duration-500'>
                      <GraduationCap className='w-6 h-6 text-[#0A6FA7] transition-colors duration-500' />
                    </div>
                  </div>

                  <Link href={`/degree/${admis?.program?.slugs}`}>
                    <h2 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0A6FA7] transition-colors line-clamp-2 min-h-[56px] tracking-tight leading-snug'>
                      {admis.program.title}
                    </h2>
                  </Link>

                  <div className='space-y-4 pt-4 border-t border-gray-50'>
                    <div className='flex flex-col gap-1'>
                      <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>College</span>
                      <Link
                        href={`/colleges/${admis?.collegeAdmissionCollege?.slugs}`}
                        className='text-sm font-semibold text-[#0A6FA7] hover:underline'
                      >
                        {admis.collegeAdmissionCollege.name}
                      </Link>
                    </div>

                    <div className='grid grid-cols-1 gap-3 pt-2'>
                      <div className='flex flex-col gap-1'>
                        <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>Process</span>
                        <span className='text-sm font-medium text-gray-600 line-clamp-1'>{admis.admission_process}</span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-8 pt-6 border-t border-gray-50 flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>Fees</span>
                      <span className='text-sm font-bold text-gray-900'>{admis.fee_details || 'Contact College'}</span>
                    </div>
                    <Link
                      href={`/degree/${admis?.program?.slugs}`}
                      className='p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#0A6FA7] group-hover:text-white transition-all transform group-hover:translate-x-1'
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
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
