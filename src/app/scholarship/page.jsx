'use client'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { Search, Award, Filter, X } from 'lucide-react'
import { Select } from '@/ui/shadcn/select'
import EmptyState from '@/ui/shadcn/EmptyState'
import {
  fetchScholarships,
  fetchCategories,
  applyForScholarship
} from './actions'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ScholarshipPage = () => {
  const router = useRouter()
  const user = useSelector((state) => state.user?.data)
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: ''
  })
  const [isScrolling, setIsScrolling] = useState(false)
  const [applyingIds, setApplyingIds] = useState(new Set())

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    getCategories()
  }, [])

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => clearTimeout(handler)
  }, [searchTerm])

  // Reset page equivalent (if we had pagination)
  useLayoutEffect(() => {
    // If we add pagination later, reset it here
  }, [debouncedSearch, filters])

  // Fetch scholarships
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

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({ category: '' })
  }

  const handleApply = async (scholarshipId) => {
    // Check if user is logged in
    if (!user || !user.id) {
      toast.error('Please login to apply for scholarships')
      router.push('/sign-in')
      return
    }

    // Check if already applying
    if (applyingIds.has(scholarshipId)) {
      return
    }

    try {
      setApplyingIds((prev) => new Set(prev).add(scholarshipId))
      
      await applyForScholarship(scholarshipId)
      
      toast.success('Application submitted successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to apply for scholarship')
    } finally {
      setApplyingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(scholarshipId)
        return newSet
      })
    }
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
                  Explore Our{' '}
                  <span className='text-[#0A6FA7]'>Scholarships</span>
                </h1>
                <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
              </div>
              <p className='text-gray-500 max-w-xl font-medium text-lg mt-2'>
                Find scholarships designed to support your education and make
                your learning journey more affordable.
              </p>
            </div>

            {/* Clear All Button */}
            {(searchTerm || filters.category) && (
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
                  Search Scholarships
                </label>
                <div className='relative group'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                  <input
                    type='text'
                    placeholder='Search scholarships by name...'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400'
                  />
                </div>
              </div>

              <div className='lg:col-span-4'>
                <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                  Category
                </label>
                <div className='relative group'>
                  <Select
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        category: e.target.value
                      }))
                    }
                    className='w-full pl-6'
                  >
                    <option value=''>All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && (
            <div className='mb-8 px-2'>
              <p className='text-sm text-gray-500 font-semibold'>
                Showing{' '}
                <span className='text-gray-900'>{scholarships.length}</span>{' '}
                results
              </p>
            </div>
          )}

          {/* Scholarships Grid */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
            </div>
          ) : scholarships.length === 0 ? (
            <div className='bg-white rounded-[32px] border border-gray-100 border-dashed py-20'>
              <EmptyState
                icon={Award}
                title='No Scholarships Found'
                description={
                  searchTerm || filters.category
                    ? 'No scholarships match your search or filters'
                    : 'No scholarships are currently available'
                }
                action={
                  searchTerm || filters.category
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
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className='group bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-[#0A6FA7]/20 transition-all duration-300 flex flex-col h-full cursor-pointer'
                >
                  <div className='flex items-start justify-between mb-6'>
                    <div className='bg-[#0A6FA7]/10 p-3 rounded-2xl group-hover:bg-[#0A6FA7] transition-colors duration-500'>
                      <Award className='w-6 h-6 text-[#0A6FA7] group-hover:text-white transition-colors duration-500' />
                    </div>
                    {scholarship.amount && (
                      <span className='px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100 uppercase tracking-wider'>
                        ${parseFloat(scholarship.amount).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <h2 className='text-xl font-bold text-gray-900 mb-4 group-hover:text-[#0A6FA7] transition-colors line-clamp-2 min-h-[3.5rem] tracking-tight'>
                    {scholarship.name}
                  </h2>

                  <div className='mt-auto space-y-4 pt-6 border-t border-gray-50'>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-col'>
                        <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                          Deadline
                        </span>
                        <span className='text-sm font-bold text-gray-700'>
                          {new Date(
                            scholarship.applicationDeadline
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {scholarship.eligibilityCriteria && (
                        <div className='flex flex-col text-right'>
                          <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                            Eligibility
                          </span>
                          <span className='text-sm font-bold text-gray-700 truncate max-w-[120px]'>
                            {scholarship.eligibilityCriteria.replace(/"/g, '')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='mt-6 pt-4 flex gap-3'>
                    <Link
                      href={`/scholarship/${scholarship.slugs || scholarship.id}`}
                      className='flex-1 py-3 rounded-xl bg-gray-50 text-gray-700 font-bold text-sm group-hover:bg-[#0A6FA7] group-hover:text-white transition-all duration-300 text-center'
                    >
                      View Details
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApply(scholarship.id)
                      }}
                      disabled={applyingIds.has(scholarship.id)}
                      className='flex-1 py-3 rounded-xl bg-[#0A6FA7] text-white font-bold text-sm hover:bg-[#085a86] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {applyingIds.has(scholarship.id)
                        ? 'Applying...'
                        : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ToastContainer position='top-right' autoClose={3000} />
    </>
  )
}

export default ScholarshipPage
