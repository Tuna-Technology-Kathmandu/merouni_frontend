'use client'
import React, { useEffect, useState } from 'react'
import { fetchDegrees } from './actions'
import { Search } from 'lucide-react'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import Header from '../components/Frontpage/Header'
import Shimmer from '../components/Shimmer'
import Link from 'next/link'

const DegreePage = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true)
      try {
        const response = await fetchDegrees(debouncedSearch)
        setCourses(response.items)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getCourses()
  }, [debouncedSearch])

  return (
    <>
      <Header />
      <Navbar />
      <div className='container mx-auto p-6'>
        <div className='mb-8'>
          <div className='border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2'>
            <span className='text-2xl font-bold mr-2'>Available</span>
            <span className='text-[#0A70A7] text-2xl font-bold'>Degrees</span>
          </div>

          {/* Search Bar */}
          <div className='flex justify-end w-full'>
            <div className='relative w-full max-w-md mb-6'>
              <input
                type='text'
                placeholder='Search degrees...'
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className='w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
            </div>
          </div>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array(6)
              .fill('')
              .map((_, index) => (
                <div
                  key={index}
                  className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg'
                >
                  <div className='flex justify-evenly items-start mb-4'>
                    <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                      <Shimmer width='30px' height='30px' />
                    </div>
                    <div className='flex flex-col gap-4 w-full'>
                      <Shimmer width='80%' height='20px' />
                      <Shimmer width='60%' height='18px' />
                      <Shimmer width='90%' height='15px' />
                      <div className='flex gap-2'>
                        <Shimmer width='40%' height='15px' />
                        <Shimmer width='40%' height='15px' />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {courses.length === 0 ? (
              <div className='text-center text-gray-500 mt-8'>
                No degrees found matching your search.
              </div>
            ) : (
              courses.map((degree, index) => (
                <Link href={`/degree/${degree.slugs}`} key={index}>
                  <div className='border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white'>
                    <div className='mb-4'>
                      <h2 className='text-xl font-semibold mb-4'>
                        {degree.title}
                      </h2>
                    </div>
                    <div className='space-y-2'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Duration:</span>
                        <span>{degree.duration}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Credits:</span>
                        <span>{degree.credits}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Language:</span>
                        <span>{degree.language}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Fee:</span>
                        <span>{degree.fee}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Delivery:</span>
                        <span>{degree.delivery_mode}</span>
                      </div>
                      <div className='mt-4 pt-4 border-t'>
                        <p className='text-sm text-gray-600'>
                          <strong>Eligibility:</strong>{' '}
                          {degree.eligibility_criteria}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default DegreePage
