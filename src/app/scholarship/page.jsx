'use client'
import React, { useEffect, useState } from 'react'
import { Search, Award } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

import { fetchScholarships } from './actions'
import { CardSkeleton } from '@/components/ui/CardSkeleton'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'

const ScholarshipPage = () => {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    applicationDeadline: '',
    activeOnly: false
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  useEffect(() => {
    const getScholarships = async () => {
      setLoading(true)
      try {
        const response = await fetchScholarships({
          q: debouncedSearch,
          ...filters
        })
        setScholarships(response.scholarships || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    getScholarships()
  }, [debouncedSearch, filters])

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <>
      <Header />
      <Navbar />

      <div className='min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-12 px-6'>
        <div className='container mx-auto'>
          {/* Title */}
          <div className='text-center mb-12'>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
              Explore Our <span className='text-[#0A70A7]'>Scholarships</span>
            </h1>
            <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
              Find scholarships designed to support your education and make your
              learning journey more affordable.
            </p>
          </div>

          {/* Search and Filters */}
          <div className='max-w-4xl mx-auto mb-12 space-y-6'>
            <div className='relative w-full'>
              <input
                type='text'
                placeholder='Search scholarships by name...'
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
              />
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm'>
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-500 uppercase px-1'>Min Amount</label>
                <input
                  type='number'
                  name='minAmount'
                  placeholder='Min $'
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0A70A7] text-sm'
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-500 uppercase px-1'>Max Amount</label>
                <input
                  type='number'
                  name='maxAmount'
                  placeholder='Max $'
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0A70A7] text-sm'
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs font-semibold text-gray-500 uppercase px-1'>Deadline After</label>
                <input
                  type='date'
                  name='applicationDeadline'
                  value={filters.applicationDeadline}
                  onChange={handleFilterChange}
                  className='w-full px-3 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0A70A7] text-sm'
                />
              </div>
              <div className='flex items-end pb-1'>
                <label className='flex items-center gap-3 cursor-pointer group px-2 py-2 hover:bg-gray-50 rounded-xl transition-colors w-full border border-transparent'>
                  <div className='relative'>
                    <input
                      type='checkbox'
                      name='activeOnly'
                      checked={filters.activeOnly}
                      onChange={handleFilterChange}
                      className='sr-only peer'
                    />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#0A70A7] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                  </div>
                  <span className='text-sm font-medium text-gray-600 group-hover:text-gray-900'>Active Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Scholarships */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          ) : scholarships.length === 0 ? (
            <EmptyState
              icon={Award}
              title='No Scholarships Found'
              description={
                searchTerm || Object.values(filters).some((v) => v !== '' && v !== false)
                  ? 'No scholarships match your search or filters'
                  : 'No scholarships are currently available'
              }
              action={
                searchTerm || Object.values(filters).some((v) => v !== '' && v !== false)
                  ? {
                    label: 'Clear Search & Filters',
                    onClick: () => {
                      setSearchTerm('')
                      setFilters({
                        minAmount: '',
                        maxAmount: '',
                        applicationDeadline: '',
                        activeOnly: false
                      })
                    }
                  }
                  : null
              }
            />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className='border rounded-2xl p-6 bg-white hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer'
                >
                  <h2 className='text-lg font-bold text-gray-800 mb-3 min-h-[60px]'>
                    {scholarship.name}
                  </h2>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Amount:</span>
                      <span className='font-medium text-green-600'>
                        ${parseFloat(scholarship.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Deadline:</span>
                      <span className='font-medium'>
                        {new Date(
                          scholarship.applicationDeadline
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-gray-600'>Eligibility:</span>
                      <span className='text-sm'>
                        {scholarship.eligibilityCriteria.replace(/"/g, '')}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-gray-600'>Renewal:</span>
                      <span className='text-sm'>
                        {scholarship.renewalCriteria.replace(/"/g, '')}
                      </span>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <button className='w-full py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium'>
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ScholarshipPage
