'use client'
import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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
import ScholarshipCard from '@/ui/molecules/cards/ScholarshipCard'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ScholarshipPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const user = useSelector((state) => state.user?.data)

  // Initialization from URL
  const initialSearch = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''

  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: initialCategory
  })
  const [applyingIds, setApplyingIds] = useState(new Set())

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

  // Sync state with URL params
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const cat = searchParams.get('category') || ''
    setSearchTerm(q)
    setDebouncedSearch(q)
    setFilters({ category: cat })
  }, [searchParams])

  // Scroll to top on URL change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [searchParams])

  // Debounce search (Updates URL)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== initialSearch) {
        updateURL({ q: searchTerm })
      }
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm, initialSearch, updateURL])

  // Category filter updates URL
  useEffect(() => {
    if (filters.category !== initialCategory) {
      updateURL({ category: filters.category })
    }
  }, [filters.category, initialCategory, updateURL])

  // Fetch scholarships when URL parameters change
  useEffect(() => {
    const getScholarships = async () => {
      const q = searchParams.get('q') || ''
      const cat = searchParams.get('category') || ''
      setLoading(true)
      try {
        const response = await fetchScholarships({
          q,
          category: cat
        })
        setScholarships(response.scholarships || [])
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    getScholarships()
  }, [searchParams])

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
                  Explore &nbsp;
                  <span className='text-[#0A6FA7]'>Scholarships</span>
                </h1>
                <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
              </div>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {scholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  onApply={handleApply}
                  isApplying={applyingIds.has(scholarship.id)}
                />
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
