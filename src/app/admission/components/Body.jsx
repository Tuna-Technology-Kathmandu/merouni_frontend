'use client'
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { Search } from 'lucide-react'
import { getAdmission } from '../actions'
import Link from 'next/link'
import Pagination from '../../blogs/components/Pagination'
import { CardSkeleton } from '@/components/ui/CardSkeleton'

const AdmissionPage = () => {
  const [admission, setAdmission] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [isScrolling, setIsScrolling] = useState(false)

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Reset to page 1 when search changes
  useLayoutEffect(() => {
    setPagination((prev) =>
      prev.currentPage !== 1 ? { ...prev, currentPage: 1 } : prev
    )
  }, [debouncedSearch])

  // Fetch admission data
  const fetchAdmission = useCallback(async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await getAdmission(search, page)
      setAdmission(response.items)

      // Do not overwrite currentPage from API → only update totals
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
    fetchAdmission(pagination.currentPage, debouncedSearch)
  }, [debouncedSearch, pagination.currentPage, fetchAdmission])

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setIsScrolling(true)
      setPagination((prev) => ({ ...prev, currentPage: page }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-12 px-6'>
      <div className='container mx-auto'>
        {/* Title */}
        <div className='text-center mb-12'>
          <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
            Opening <span className='text-[#0A70A7]'>Admissions</span>
          </h1>
          <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
            Explore the latest admission opportunities across colleges and
            programs.
          </p>
        </div>

        {/* Search */}
        <div className='flex justify-center mb-10 md:mb-20 '>
          <div className='relative w-full max-w-lg'>
            <input
              type='text'
              placeholder='Search admissions...'
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
            />
            <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
          </div>
        </div>

        {/* Admissions */}
        {loading || isScrolling ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array(6)
              .fill('')
              .map((_, index) => (
                <CardSkeleton key={index} />
              ))}
          </div>
        ) : admission.length === 0 ? (
          <div className='min-h-[400px] flex items-center justify-center'>
            <div className='text-center'>
              <div className='mb-4'>
                <svg
                  className='mx-auto h-24 w-24 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                No Admissions Found
              </h3>
              <p className='text-gray-600 mb-4'>
                {searchTerm
                  ? `No admissions match your search "${searchTerm}"`
                  : 'No admission details are currently available'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0A70A7] hover:bg-[#085a8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0A70A7]'
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {admission.map((admis, index) => (
                <div
                  key={index}
                  className='border rounded-2xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer'
                >
                  <Link
                    href={`/degree/${admis?.program?.slugs}`}
                    className='hover:underline hover:decoration-[#0A70A7]'
                  >
                    <h2 className='text-lg font-bold text-gray-800 mb-3 min-h-[60px]'>
                      {admis.program.title}
                    </h2>
                  </Link>

                  <div className='space-y-2 text-sm'>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>College:</span>{' '}
                      <Link
                        href={`/colleges/${admis?.collegeAdmissionCollege?.slugs}`}
                        className='hover:underline hover:decoration-[#0A70A7]'
                      >
                        {admis.collegeAdmissionCollege.name}
                      </Link>
                    </p>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>
                        Admission Process:
                      </span>{' '}
                      {admis.admission_process}
                    </p>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>Eligibility:</span>{' '}
                      {admis.eligibility_criteria}
                    </p>
                    <p className='text-gray-700'>
                      <span className='font-semibold'>Fee Details:</span>{' '}
                      {admis.fee_details}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className='mt-12 flex justify-center'>
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
