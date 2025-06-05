'use client'
import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { GoArrowLeft } from 'react-icons/go'
import { GoArrowRight } from 'react-icons/go'
import { getBlogs } from '@/app/action'
import LatestBlogsShimmer from '../components/LatestBlogShimmer' // Adjust path if needed
import LatestBlogs from './LatestBlogs' // Adjust path if needed

const Latest = () => {
  const scrollRef = useRef(null)
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const page = 1

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getBlogs(page)
      setBlogs(response.items)
      console.log('featued', response.items)
    } catch (error) {
      setError('Failed to load latest Blogs')
      console.error('Error fetching latest blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const truncateString = (str, maxLength) => {
    if (str?.length > maxLength) {
      // Optional chaining for str
      return str.slice(0, maxLength) + '...'
    }
    return str
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    try {
      // Try-catch for date parsing
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid Date' // Or a suitable default
    }
  }

  return (
    <div className='bg-[#F1F1F1] w-full h-[500px] max-md:h-[480px] relative'>
      <div className='flex flex-col max-w-[1600px] mx-auto px-4 sm:px-8'>
        <div className='border-b-2 border-[#0A70A7] w-[45px] mt-10 mb-7'>
          <span className='text-2xl font-bold mr-2'>Latest</span>
          <span className='text-[#0A70A7] text-2xl font-bold'>Blogs</span>
        </div>

        {loading ? (
          <div className=' mb-10'>
            <div className='flex overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2'>
              {[...Array(4)].map((_, i) => (
                <LatestBlogsShimmer key={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className=' mb-10'>
            <button
              onClick={scrollLeft}
              className='absolute right-24 bottom-7  bg-gray-300 hover:bg-gray-300 p-2 rounded-full shadow-md z-10'
            >
              <GoArrowLeft />
            </button>
            <button
              onClick={scrollRight}
              className='absolute right-10 bottom-7 bg-gray-300 hover:bg-gray-300 p-2 rounded-full shadow-md z-10'
            >
              <GoArrowRight />
            </button>
            <div
              ref={scrollRef}
              className='flex overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-200 p-2'
            >
              {blogs?.length > 0 ? ( // Optional chaining for blogs
                blogs.map((blog, index) => (
                  <Link href={`/blogs/${blog.slug}`} key={index}>
                    <LatestBlogs
                      key={index}
                      title={truncateString(blog.title, 30)}
                      description={truncateString(blog.description, 100)}
                      image={
                        blog?.featuredImage || 'https://placehold.co/600x400'
                      } // Use blog.image if available
                      date={formatDate(blog.createdAt)}
                    />
                  </Link>
                ))
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p>No blogs found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Latest
