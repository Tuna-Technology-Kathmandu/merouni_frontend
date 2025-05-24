'use client'
import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

import { fetchScholarships } from './actions'
import Shimmer from '../components/Shimmer'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import Header from '../components/Frontpage/Header'

const ScholarshipPage = () => {
  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm])

  useEffect(() => {
    const getScholarships = async () => {
      setLoading(true)
      try {
        const response = await fetchScholarships()
        setScholarships(response.scholarships)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    getScholarships()
  }, [])

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <>
      <Header />
      <Navbar />

      <div className='container mx-auto p-6'>
        <div className='border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2'>
          <span className='text-2xl font-bold mr-2'>Scholarship</span>
          <span className='text-[#0A70A7] text-2xl font-bold'>Program</span>
        </div>
        {/* Search Bar */}
        <div className='flex justify-end w-full'>
          <div className='relative w-full max-w-md mb-6'>
            <input
              type='text'
              placeholder='Search scholarship...'
              className='w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
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
            {filteredScholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className='bg-white rounded-xl p-6 border border-gray-200 shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-300'
              >
                <div className='flex flex-col mb-4'>
                  <h3 className='font-semibold text-lg mb-2'>
                    {scholarship.name}
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-gray-600'>
                        Amount:
                      </span>
                      <span className='text-lg font-semibold text-green-600'>
                        ${parseFloat(scholarship.amount).toLocaleString()}
                      </span>
                    </div>

                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-gray-600'>
                        Deadline:
                      </span>
                      <span className='text-sm'>
                        {new Date(
                          scholarship.applicationDeadline
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-gray-600'>
                        Eligibility:
                      </span>
                      <span className='text-sm'>
                        {scholarship.eligibilityCriteria.replace(/"/g, '')}
                      </span>
                    </div>

                    <div className='flex flex-col'>
                      <span className='text-sm font-medium text-gray-600'>
                        Renewal Criteria:
                      </span>
                      <span className='text-sm'>
                        {scholarship.renewalCriteria.replace(/"/g, '')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <button className='flex-1 py-2 px-4 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 text-sm font-medium'>
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export default ScholarshipPage
