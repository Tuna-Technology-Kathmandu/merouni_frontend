'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getCareers } from './actions'
import { Search } from 'lucide-react'
import Header from '../components/Frontpage/Header'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import { useState, useEffect } from 'react'

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function VacanciesPage({ searchParams }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const currentPage = Number(searchParams.page) || 1
        const response = await getCareers(currentPage)
        setData(response)
      } catch (err) {
        console.error('Failed to load vacancies:', err)
        setError('Failed to load vacancies. Please try again later.')
        setData({ items: [] }) // Set empty array to prevent rendering errors
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchParams])

  return (
    <>
      <Header />
      <Navbar />
      <div className='container mx-auto px-4'>
        <div className='mb-8'>
          <div className='border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2'>
            <span className='text-2xl font-bold mr-2'>Our</span>
            <span className='text-[#0A70A7] text-2xl font-bold'>Vacancies</span>
          </div>

          {/* Search Bar */}
          <div className='flex justify-end w-full mb-6'>
            <div className='relative w-full max-w-md'>
              <input
                type='text'
                placeholder='Search vacancy...'
                className='w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className='bg-white rounded-lg shadow-lg overflow-hidden h-full border border-gray-200 animate-pulse'
                >
                  <div className='relative h-48 w-full bg-gray-300'></div>
                  <div className='p-6'>
                    <div className='h-6 bg-gray-300 rounded w-3/4 mb-3'></div>
                    <div className='h-4 bg-gray-300 rounded w-full mb-3'></div>
                    <div className='h-4 bg-gray-300 rounded w-5/6 mb-4'></div>
                    <div className='h-4 bg-gray-300 rounded w-1/2'></div>
                  </div>
                </div>
              ))
            : data?.items?.length > 0
              ? data.items.map((vacancy) => (
                  <Link
                    href={`/vacancy/${vacancy.slug}`}
                    key={vacancy.id}
                    className='block hover:transform hover:scale-105 transition-all duration-300'
                  >
                    <div className='bg-white rounded-lg shadow-lg overflow-hidden h-full border border-gray-200'>
                      <div className='relative h-48 w-full'>
                        <Image
                          src={
                            vacancy?.featuredImage ?? '/images/meroUniSmall.gif'
                          }
                          alt={vacancy.title}
                          fill
                          className='object-cover'
                          priority
                        />
                      </div>
                      <div className='p-6'>
                        <h2 className='text-xl font-semibold text-gray-900 mb-3 line-clamp-2'>
                          {vacancy.title}
                        </h2>
                        <p className='text-gray-600 mb-4 line-clamp-3'>
                          {vacancy.description}
                        </p>
                        <p>Posted: {formatDate(vacancy.createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                ))
              : !loading && (
                  <div className='col-span-full text-center py-12'>
                    <p className='text-gray-500 text-lg'>
                      No vacancies available at the moment.
                    </p>
                  </div>
                )}
        </div>
      </div>
      <Footer />
    </>
  )
}
