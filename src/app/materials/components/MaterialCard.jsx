'use client'
import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { getMaterials } from '../action'
import Pagination from '../../blogs/components/Pagination'
import Shimmer from '../../../components/Shimmer'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import Link from 'next/link'

const MaterialCard = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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
    loadPageNumber(pagination.currentPage)
  }, [pagination.currentPage, debouncedSearch])

  const loadPageNumber = async (page) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getMaterials(page, debouncedSearch) // Pass search term to API

      if (response && response.pagination) {
        setBlogs(response.materials)

        setPagination((prev) => ({
          ...prev,
          ...response.pagination
        }))
      } else {
        console.error('Pagination data not found in response:', response)
      }
    } catch (error) {
      setError('Failed to load materials')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page // Update current page
      }))
    }
  }

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...'
    }
    return str
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <>
      <div className='flex flex-col max-w-[1600px] mx-auto px-8 mt-10'>
        {/* top section  */}
        <div className='flex flex-row border-b-2 border-[#0A70A7] w-[45px] mb-10'>
          <span className='text-2xl font-bold mr-2'>Our</span>
          <span className='text-[#0A70A7] text-2xl font-bold'>Materials</span>
        </div>

        {/* Search Bar */}
        <div className='flex justify-end w-full'>
          <div className='relative w-full max-w-md mb-6'>
            <input
              type='text'
              placeholder='Search material...'
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
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4'>
            {blogs.map((blog, index) => (
              <div
                key={index}
                className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105'
              >
                <img
                  src='https://placehold.co/600x400'
                  alt={blog.title}
                  className='w-full h-48 object-cover'
                />
                <div className='p-4'>
                  <div className='flex justify-between items-center'>
                    <h1 className='text-lg font-semibold mb-2'>{blog.title}</h1>
                    <MdOutlineRemoveRedEye
                      className='w-6 h-6 cursor-pointer'
                      onClick={() => window.open(blog.downloadUrl, '_blank')}
                    />
                  </div>
                  <a
                    href={blog.downloadUrl} // The link to the PDF
                    download
                    className='w-full h-full'
                  >
                    <button className='mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
                      Download Now
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
  )
}

export default MaterialCard
