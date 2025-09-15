'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { getConsultancies } from './actions'
import Header from '../components/Frontpage/Header'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import Shimmer from '../components/Shimmer'

export default function ConsultanciesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = Number(searchParams.get('page')) || 1
  const queryParam = searchParams.get('q') || ''

  const [searchTerm, setSearchTerm] = useState(queryParam)
  const [debouncedSearch, setDebouncedSearch] = useState(queryParam)
  const [consultancyData, setConsultancyData] = useState({
    items: [],
    pagination: {}
  })
  const [loading, setLoading] = useState(false)

  // Debouncing logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Fetch data when search or page changes
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await getConsultancies(currentPage, debouncedSearch)
        setConsultancyData(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [currentPage, debouncedSearch])

  useEffect(() => {
    if (debouncedSearch !== queryParam) {
      router.push(`/consultancy?q=${debouncedSearch}`, { scroll: false })
    }
  }, [debouncedSearch, queryParam, router])

  console.log(consultancyData)

  return (
    <>
      <Header />
      <Navbar />
      <div className='min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-12 px-6'>
        <div className='container mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
              Explore <span className='text-[#0A70A7]'>Consultancies</span>
            </h1>
            <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
              Discover trusted consultancies that guide you through admissions,
              applications, and career opportunities abroad.
            </p>
          </div>

          {/* Search Bar */}
          <div className='flex justify-center mb-10 md:mb-20 w-full'>
            <div className='relative w-full max-w-lg'>
              <input
                type='text'
                placeholder='Search consultancy...'
                className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <div
                    key={index}
                    className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg'
                  >
                    <div className='flex flex-col gap-4'>
                      <div className='w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center'>
                        <Shimmer width='100%' height='100%' />
                      </div>
                      <Shimmer width='80%' height='20px' />
                      <Shimmer width='60%' height='18px' />
                      <Shimmer width='90%' height='15px' />
                      <div className='flex gap-2'>
                        <Shimmer width='40%' height='15px' />
                        <Shimmer width='30%' height='15px' />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {consultancyData.items.map((consultancy) => {
                const destinations = JSON.parse(consultancy.destination)
                const address = JSON.parse(consultancy.address)

                return (
                  <Link
                    href={`/consultancies/${consultancy.slugs}`}
                    key={consultancy.id}
                    className='block group'
                  >
                    <div className='bg-white rounded-2xl shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1'>
                      {/* Banner */}
                      <div className='relative h-48 w-full bg-green-100'>
                        <Image
                          src={
                            consultancy?.featured_image ||
                            'https://placehold.co/600x400'
                          }
                          alt={consultancy.title}
                          fill
                          className='object-cover group-hover:scale-105 transition-transform duration-300'
                          priority
                        />

                        {consultancy.pinned === 1 && (
                          <span className='absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md'>
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className='p-6 flex flex-col'>
                        {/* Title */}
                        <h2 className='text-lg md:text-xl font-bold text-gray-800 group-hover:text-[#0A70A7] transition-colors mb-3 line-clamp-2'>
                          {consultancy.title}
                        </h2>

                        {/* Destinations */}
                        <div className='mb-3'>
                          <h3 className='text-sm font-semibold text-gray-700 mb-1'>
                            Destinations
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {destinations.map((dest, index) => (
                              <span
                                key={index}
                                className='bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium'
                              >
                                {dest.city}, {dest.country}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Address */}
                        <div className='mb-3'>
                          <h3 className='text-sm font-semibold text-gray-700 mb-1'>
                            Address
                          </h3>
                          <p className='text-gray-600 text-sm leading-relaxed'>
                            {address.street}, {address.city}, {address.state}{' '}
                            {address.zip}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className='mt-auto pt-4 border-t border-gray-100'>
                          <p className='text-[#0A70A7] font-semibold text-sm group-hover:underline'>
                            Courses Available →
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {consultancyData.pagination?.totalPages > 1 && (
            <div className='mt-8 flex justify-center gap-2'>
              {Array.from(
                { length: consultancyData.pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <Link
                  key={page}
                  href={`/consultancies?page=${page}`}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
