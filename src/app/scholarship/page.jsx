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
    return () => clearTimeout(handler)
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

          {/* Search */}
          <div className='flex justify-center mb-10 md:mb-20 '>
            <div className='relative w-full max-w-lg'>
              <input
                type='text'
                placeholder='Search scholarships...'
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
              />
              <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Scholarships */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {Array(6)
                .fill('')
                .map((_, index) => (
                  <div
                    key={index}
                    className='bg-white rounded-2xl p-6 border border-gray-200 shadow-md'
                  >
                    <div className='flex items-start gap-4'>
                      <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                        <Shimmer width='30px' height='30px' />
                      </div>
                      <div className='flex flex-col gap-3 w-full'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredScholarships.length === 0 ? (
                <div className='text-center text-gray-500 mt-8 col-span-full'>
                  No scholarships found matching your search.
                </div>
              ) : (
                filteredScholarships.map((scholarship) => (
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
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ScholarshipPage
