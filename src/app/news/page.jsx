'use client'

import React, { useState, useEffect, useRef } from 'react'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import NewsFilters from './components/NewsFilters'
import FeaturedNews from './components/FeaturedNews'
import { getNews, getCategories } from '@/app/action'

const News = () => {
    // State
    const [news, setNews] = useState([])
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

    const [categories, setCategories] = useState([
        { id: 'all', title: 'All' }
    ])

    const debounceRef = useRef(null)

    // Data Fetching
    const fetchNewsData = async (page = 1, search = '', category = '') => {
        setLoading(true)
        setError(null)
        try {
            const catParam = category === 'all' ? '' : category
            const response = await getNews(page, catParam, search)

            if (response && response.items) {
                setNews(response.items)
                if (response.pagination) {
                    setPagination({
                        currentPage: response.pagination.currentPage,
                        totalPages: response.pagination.totalPages,
                        totalCount: response.pagination.totalCount
                    })
                }
            } else {
                setNews([])
                setPagination(prev => ({ ...prev, totalCount: 0 }))
            }
        } catch (error) {
            console.error('Error fetching news:', error)
            setError('Failed to load news')
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await getCategories({ type: 'NEWS' })
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
                setPagination(prev => ({ ...prev, currentPage: 1 }))
                fetchNewsData(1, searchQuery, selectedCategory)
            } else {
                fetchNewsData(1, searchQuery, selectedCategory)
            }
        }, 500)

        return () => clearTimeout(debounceRef.current)
    }, [searchQuery, selectedCategory])

    const handlePageChange = (page) => {
        if (page > 0 && page <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: page }))
            fetchNewsData(page, searchQuery, selectedCategory)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <>
            <Header />
            <Navbar />

            <div className='min-h-screen bg-white pb-20'>
                {/* Filters Section */}
                <div className='max-w-[1600px] mx-auto px-4 sm:px-8 pt-8'>
                    <NewsFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        categories={categories}
                    />
                </div>

                {/* News Grid Section */}
                <FeaturedNews
                    news={news}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>

            <Footer />
        </>
    )
}

export default News
