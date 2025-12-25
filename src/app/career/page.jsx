'use client'

import { useEffect, useState } from 'react'
import { getCareers } from './actions'
import Link from 'next/link'
import { Search } from 'lucide-react'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const CareerCardShimmer = () => (
  <div className='bg-white rounded-lg shadow-md overflow-hidden h-full animate-pulse'>
    <div className='relative h-48 w-full bg-gray-200'></div>
    <div className='p-4'>
      <div className='h-6 bg-gray-200 rounded mb-2 w-3/4'></div>
      <div className='space-y-2'>
        <div className='h-4 bg-gray-200 rounded w-full'></div>
        <div className='h-4 bg-gray-200 rounded w-5/6'></div>
        <div className='h-4 bg-gray-200 rounded w-2/3'></div>
      </div>
      <div className='h-4 bg-gray-200 rounded w-1/2 mt-4'></div>
    </div>
  </div>
)

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [careersData, setCareersData] = useState({ items: [], pagination: {} })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  // Fetch data when page or search term changes
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const data = await getCareers(
          careersData.pagination.currentPage || 1,
          debouncedSearch
        )
        setCareersData(data)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching careers:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [debouncedSearch, careersData.pagination.currentPage])

  useEffect(() => {
    if (careersData.items.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [careersData.items])

  const handlePageChange = (page) => {
    if (page > 0 && page <= careersData.pagination.totalPages) {
      setCareersData((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          currentPage: page
        }
      }))
    }
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
              Explore Career{' '}
              <span className='text-[#0A70A7]'>Opportunities</span>
            </h1>
            <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
              Join our team and build a rewarding career with us. Browse open
              positions and find the role that best fits your skills and
              aspirations.
            </p>
          </div>
          {/* Search */}
          <div className='flex justify-center mb-10 md:mb-20 '>
            <div className='relative w-full max-w-lg'>
              <input
                type='text'
                placeholder='Search career...'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handlePageChange(1)
                }}
                className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
              />
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
              Error loading careers: {error}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && careersData.items?.length === 0 && (
            <div className='text-center py-12'>
              <h3 className='text-lg font-medium text-gray-900'>
                No careers found
              </h3>
              <p className='mt-2 text-gray-600'>
                Try adjusting your search query
              </p>
            </div>
          )}

          {/* Cards Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {loading
              ? // Show shimmer cards while loading
                Array.from({ length: 6 }).map((_, index) => (
                  <CareerCardShimmer key={`shimmer-${index}`} />
                ))
              : // Show actual career cards when not loading
                careersData.items?.map((career) => (
                  <Link
                    href={`/career/${career.slugs}`}
                    key={career.id}
                    className='block hover:shadow-xl transition-shadow duration-300'
                  >
                    <div className='bg-white rounded-lg shadow-md overflow-hidden h-full'>
                      <div className='h-48 w-full'>
                        <img
                          src={career?.featuredImage || '/images/job.webp'}
                          alt={career.title}
                          fill
                          className='object-cover w-full h-full '
                        />
                      </div>
                      <div className='p-4'>
                        <h2 className='text-xl max-md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
                          {career.title}
                        </h2>
                        <p className='text-gray-600 mb-4 line-clamp-3 max-sm:text-sm max-sm:mb-2'>
                          {career.description}
                        </p>
                        <div className='text-sm text-gray-500'>
                          <p>Posted: {formatDate(career.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          {/* Pagination */}
          {!loading && careersData.pagination?.totalPages > 1 && (
            <div className='flex items-center justify-center gap-4 mt-8'>
              <button
                onClick={() =>
                  handlePageChange(careersData.pagination.currentPage - 1)
                }
                disabled={careersData.pagination.currentPage === 1}
                className='px-4 py-2 bg-gray-300 rounded-full mx-2 disabled:opacity-50'
              >
                &lt;
              </button>

              <span className='text-gray-700'>
                Page {careersData.pagination.currentPage} of{' '}
                {careersData.pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  handlePageChange(careersData.pagination.currentPage + 1)
                }
                disabled={
                  careersData.pagination.currentPage ===
                  careersData.pagination.totalPages
                }
                className='px-4 py-2 bg-gray-300 rounded-full mx-2 disabled:opacity-50'
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
