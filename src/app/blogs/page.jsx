'use client'

import React, { useState, useEffect, useRef } from 'react'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Latest from './components/Latest'
import FeaturedBlogs from './components/FeaturedBlogs'
import BlogFilters from './components/BlogFilters'
import services from '@/app/apiService'

const Blogs = () => {
  // State
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  const debounceRef = useRef(null)

  // Constants

  const [categories, setCategories] = useState([
    { id: 'all', title: 'All' }
  ])

  // Data Fetching
  const fetchBlogsData = async (page = 1, search = '', category = '') => {
    setLoading(true)
    setError(null)
    try {
      const catParam = category === 'all' ? '' : category
      const params = {
        page,
        category_title: catParam,
        q: search
      }
      const response = await services.blogs.getAll(params)

      if (response && response.items) {
        setBlogs(response.items)
        if (response.pagination) {
          setPagination({
            currentPage: response.pagination.currentPage,
            totalPages: response.pagination.totalPages,
            totalCount: response.pagination.totalCount
          })
        }
      } else {
        setBlogs([])
        setPagination(prev => ({ ...prev, totalCount: 0 }))
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }


  const fetchCategories = async () => {
    try {
      const response = await services.category.getAll()
      if (response && response.items) {
        setCategories([{ id: 'all', title: 'All' }, ...response.items])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Effect: Debounced Search & Filter Change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      // Reset to page 1 on filter change
      if (pagination.currentPage !== 1) {
        // If we were not on page 1, setPage(1) will trigger the other effect? 
        // Better to just fetch here and update pagination state atomically.
        setPagination(prev => ({ ...prev, currentPage: 1 }))
        fetchBlogsData(1, searchQuery, selectedCategory)
      } else {
        fetchBlogsData(1, searchQuery, selectedCategory)
      }
    }, 500)

    return () => clearTimeout(debounceRef.current)
  }, [searchQuery, selectedCategory])

  // Effect: Page Change (only if triggered manually via pagination)
  // Logic: We need to distinguish between "reset due to filter" and "user clicked page 2"
  // Actually, simpler approach: Create a wrapper for page change and call fetch directly.

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }))
      fetchBlogsData(page, searchQuery, selectedCategory)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // View Logic
  // Show Hero (Latest) ONLY if: Page 1 AND No Search AND Category is 'all'
  const isDefaultView = pagination.currentPage === 1 && !searchQuery && selectedCategory === 'all'

  // Slicing
  let heroBlogs = []
  let gridBlogs = []

  if (loading) {
    // While loading, we might show skeletons. 
    // For simplicity, let's just pass empty or retain old data.
    // But best UX is to show loading state.
    // Latest component handles null gracefully.
  }

  if (isDefaultView && blogs.length > 0) {
    heroBlogs = blogs.slice(0, 5)
    gridBlogs = blogs.slice(5)
  } else {
    heroBlogs = []
    gridBlogs = blogs
  }

  return (
    <>
      <Header />
      <Navbar />

      <div className='min-h-screen bg-white pb-20'>
        {/* Filters Section */}
        <div className='max-w-[1600px] mx-auto px-4 sm:px-8 pt-8'>
          <BlogFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />
        </div>

        {/* Latest / Hero Section */}
        {/* Only show if Default View and we have data */}
        {isDefaultView && !loading && heroBlogs.length > 0 && (
          <Latest blogs={heroBlogs} />
        )}

        {/* Featured / Grid Section */}
        <FeaturedBlogs
          blogs={gridBlogs}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      <Footer />
    </>
  )
}

export default Blogs
