'use client'

import React, { useState, useEffect, useRef } from 'react'
import BlogCard from './BlogCard'
import { authFetch } from '@/app/utils/authFetch'
import { getBlogs } from '@/app/action'
import Pagination from './Pagination'
import FeaturedBlogsShimmer from './FeaturedBlogShimmer'
import Link from 'next/link'
import { IoSearch } from 'react-icons/io5'

const FeaturedBlogs = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1
  })

  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const debounceRef = useRef(null)
  const category_title = ''

  // Fetch blogs by page (for default listing)
  const loadPageNumber = async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getBlogs(page, category_title)
      if (response && response.pagination) {
        setBlogs(response.items)
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalCount: response.pagination.totalCount
        })
      } else {
        console.error('Pagination data not found in response:', response)
      }
    } catch (error) {
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  // Fetch search results
  const fetchSearchResults = async (query) => {
    if (!query) {
      loadPageNumber(1)
      return
    }

    setLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/blogs?q=${query}`
      )

      if (response.ok) {
        const data = await response.json()
        setBlogs(data.items || [])

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            totalCount: data.pagination.totalCount
          })
        } else {
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
            totalPages: 1,
            totalCount: 0
          }))
        }
      } else {
        console.error('Error fetching search results:', response.statusText)
        setBlogs([])
      }
    } catch (error) {
      console.error('Error fetching search results:', error.message)
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      fetchSearchResults(searchQuery)
    }, 500)

    return () => clearTimeout(debounceRef.current)
  }, [searchQuery])

  // Fetch blogs for pagination only when no search is active
  useEffect(() => {
    if (!searchQuery) {
      loadPageNumber(pagination.currentPage)
    }
  }, [pagination.currentPage])

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page
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
      <div className='flex flex-col max-w-[1600px] mx-auto px-4 sm:px-8 mt-10'>
        {/* top section */}
        <div className='flex flex-row border-b-2 border-[#0A70A7] w-[45px] mb-7'>
          <span className='text-2xl font-bold mr-2'>Featured</span>
          <span className='text-[#0A70A7] text-2xl font-bold'>Blogs</span>
        </div>

        {/* Search Input */}
        <div className='w-full flex justify-end mb-7'>
          <div className='w-[250px] border h-10 relative rounded-[10px]'>
            <IoSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer' />
            <input
              type='text'
              placeholder='Search Blogs'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full h-full pl-10 pr-3 rounded-[10px] outline-none text-sm'
            />
          </div>
        </div>

        {loading ? (
          <FeaturedBlogsShimmer />
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full mb-10'>
              {blogs.map((blog, index) => (
                <Link href={`/blogs/${blog.slug}`} key={index}>
                  <div>
                    <BlogCard
                      date={formatDate(blog.createdAt)}
                      description={truncateString(blog.description, 100)}
                      image={
                        blog.featuredImage || 'https://placehold.co/600x400'
                      }
                      title={truncateString(blog.title, 20)}
                      slug={blog.slug}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
  )
}

export default FeaturedBlogs
