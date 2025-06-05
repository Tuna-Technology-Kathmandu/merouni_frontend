'use client'
import React, { useState, useEffect } from 'react'
import BlogCard from './BlogCard'
import { getBlogs } from '@/app/action'
import Pagination from './Pagination'
import FeaturedBlogsShimmer from './FeaturedBlogShimmer'
import Link from 'next/link'

const FeaturedBlogs = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1
  })

  const [Blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const category_title = ''

  useEffect(() => {
    loadPageNumber(pagination.currentPage)
  }, [pagination.currentPage])

  const loadPageNumber = async (page) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getBlogs(page, category_title)
      console.log('Response of blogs:', response)

      if (response && response.pagination) {
        setBlogs(response.items)
        console.log('look', response.pagination)
        // setPagination((prev) => ({
        //   ...prev,
        //   ...response.pagination,
        // }));
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

  const handlePageChange = (page) => {
    console.log('Pages response from pagination controle:', page)
    if (page > 0 && page <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page
      }))
    }
  }

  useEffect(() => {
    console.log('Updated Current Page:', pagination.currentPage)
  }, [pagination.currentPage])

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
        {/* top section  */}
        <div className='flex flex-row border-b-2 border-[#0A70A7] w-[45px] mb-10'>
          <span className='text-2xl font-bold mr-2'>Featured</span>
          <span className='text-[#0A70A7] text-2xl font-bold'>Blogs</span>
        </div>

        {loading ? (
          <FeaturedBlogsShimmer />
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {Blogs.map((blog, index) => (
              <Link href={`/blogs/${blog.slug}`} key={index}>
                <div key={index}>
                  <BlogCard
                    date={formatDate(blog.createdAt)}
                    description={truncateString(blog.description, 100)}
                    image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s'
                    title={truncateString(blog.title, 20)}
                    slug={blog.slug}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </>
  )
}

export default FeaturedBlogs
