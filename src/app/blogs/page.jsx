'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import FeaturedBlogs from './components/FeaturedBlogs'
import BlogFilters from './components/BlogFilters'
import services from '@/app/apiService'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const Blogs = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  // State
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialization from search params
  const initialSearch = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || 'all'
  const initialPage = parseInt(searchParams.get('page')) || 1

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalCount: 0
  })

  const debounceRef = useRef(null)

  // Categories
  const [categories, setCategories] = useState([
    { id: 'all', title: 'All' }
  ])

  // URL Sync Helper
  const updateURL = useCallback((params) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  // Data Fetching
  const fetchBlogsData = async (page = 1, search = '', category = '') => {
    setLoading(true)
    setError(null)
    try {
      const catParam = category === 'all' ? '' : category
      const params = {
        page,
        category_id: catParam,
        status: 'published',
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
        setPagination(prev => ({ ...prev, totalCount: 0, currentPage: page }))
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
      const response = await services.category.getAll({ type: 'BLOG' })
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

  // Sync state when URL params change (e.g. browser back/forward)
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const cat = searchParams.get('category') || 'all'
    const pg = parseInt(searchParams.get('page')) || 1

    setSearchQuery(q)
    setSelectedCategory(cat)
    setPagination(prev => ({ ...prev, currentPage: pg }))
    
    fetchBlogsData(pg, q, cat)
  }, [searchParams])

  // Effect: Debounced Search & Filter Change (Updates URL only)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    // Skip initial sync to avoid double fetch on mount
    if (searchQuery === initialSearch && selectedCategory === initialCategory) return

    debounceRef.current = setTimeout(() => {
      updateURL({ 
        q: searchQuery, 
        category: selectedCategory, 
        page: 1 // Reset to page 1 on search/filter
      })
    }, 500)

    return () => clearTimeout(debounceRef.current)
  }, [searchQuery, selectedCategory, updateURL, initialSearch, initialCategory])

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      updateURL({ page })
    }
  }

  // Scroll to top on any URL parameter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [searchParams])


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

        {/* Content Section */}
        <FeaturedBlogs
          blogs={blogs}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          searchQuery={searchQuery}
        />
      </div>

      <Footer />
    </>
  )
}

export default Blogs
