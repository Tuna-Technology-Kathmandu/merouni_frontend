'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { getMaterialsByCategory, getMaterialCategories } from '../action'
import Pagination from '../../blogs/components/Pagination'
import Shimmer from '../../../components/Shimmer'
import { MdOutlineRemoveRedEye } from 'react-icons/md'
import Link from 'next/link'

const MaterialCard = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryIdFromUrl = searchParams.get('category_id')

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState(null)
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
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const cats = await getMaterialCategories()
        setCategories(cats)

        // If category_id is in URL, set it and find category name
        if (categoryIdFromUrl) {
          const category = cats.find(
            (cat) => cat.id.toString() === categoryIdFromUrl
          )
          if (category) {
            setSelectedCategory(category.id)
            setSelectedCategoryName(category.name)
          } else if (categoryIdFromUrl === 'unlisted') {
            setSelectedCategory('unlisted')
            setSelectedCategoryName('Unlisted')
          }
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    // Read category_id from URL on mount or when URL changes
    const urlCategoryId = searchParams.get('category_id')
    if (urlCategoryId && !selectedCategory) {
      // Category from URL, will be set in fetchCategories effect
      return
    }

    // Only load materials when a category is selected
    if (selectedCategory) {
      loadPageNumber(pagination.currentPage)
    } else {
      // Clear materials when no category is selected
      setBlogs([])
    }
  }, [pagination.currentPage, debouncedSearch, selectedCategory, searchParams])

  const loadPageNumber = async (page) => {
    if (!selectedCategory) return

    setLoading(true)
    setError(null)
    try {
      const response = await getMaterialsByCategory(
        page,
        debouncedSearch,
        selectedCategory
      )

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

  const handleCategoryClick = (category) => {
    // Handle both regular categories and unlisted
    const categoryId = category.id === 'unlisted' ? 'unlisted' : category.id

    // Update URL with category_id query parameter
    const params = new URLSearchParams()
    params.set('category_id', categoryId)
    router.push(`/materials/category?${params.toString()}`)

    setSelectedCategory(categoryId)
    setSelectedCategoryName(category.name)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handleBackToCategories = () => {
    // Remove category_id from URL
    router.push('/materials')
    setSelectedCategory(null)
    setSelectedCategoryName(null)
    setBlogs([])
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
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

  // Check if we're on the category page (has category_id in URL or selectedCategory is set)
  const isCategoryPage = selectedCategory || categoryIdFromUrl

  return (
    <>
      <div className='flex flex-col max-w-[1600px] mx-auto px-8 mt-10'>
        {/* top section - only show when not on category page */}
        {!isCategoryPage && (
          <div className='text-center mb-12'>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
              Explore Our <span className='text-[#0A70A7]'>Materials</span>
            </h1>
            <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
              Discover a materials to help you achieve your academic and career
              goals.
            </p>
          </div>
        )}

        {!selectedCategory ? (
          <>
            {/* Category Cards */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 mb-10'>
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105 cursor-pointer'
                >
                  <div className='p-8 text-center'>
                    <div className='w-20 h-20 mx-auto mb-4 bg-[#0A70A7] rounded-full flex items-center justify-center'>
                      <span className='text-white text-2xl font-bold'>
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className='text-sm text-gray-600 line-clamp-2'>
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {/* Unlisted/Others Card for materials without category */}
              <div
                onClick={() =>
                  handleCategoryClick({ id: 'unlisted', name: 'Unlisted' })
                }
                className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105 cursor-pointer border-2 border-dashed border-gray-300'
              >
                <div className='p-8 text-center'>
                  <div className='w-20 h-20 mx-auto mb-4 bg-gray-400 rounded-full flex items-center justify-center'>
                    <span className='text-white text-2xl font-bold'>?</span>
                  </div>
                  <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                    Unlisted
                  </h2>
                  <p className='text-sm text-gray-600 line-clamp-2'>
                    Materials without a category
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Back Button and Category Title */}
            <div className='flex items-center justify-between mb-6 px-4'>
              <button
                onClick={handleBackToCategories}
                className='flex items-center gap-2 text-[#0A70A7] hover:text-[#085a85] font-medium'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                Back to Categories
              </button>
              <h2 className='text-2xl font-bold text-gray-800'>
                {selectedCategoryName}
              </h2>
              <div className='w-24'></div>
            </div>

            {/* Search Bar */}
            <div className='flex justify-center mb-10 md:mb-20 w-full'>
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
          </>
        )}

        {selectedCategory && (
          <>
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
                {blogs.length > 0 ? (
                  blogs.map((blog, index) => (
                    <div
                      key={index}
                      className='bg-white shadow-md rounded-2xl overflow-hidden transition-transform transform hover:scale-105'
                    >
                      <div className='w-full h-48 relative bg-gray-100'>
                        <img
                          src={blog?.image || '/images/logo.png'}
                          alt={blog.title}
                          className='w-full h-full object-cover'
                          onError={(e) => {
                            e.target.src = '/images/logo.png'
                          }}
                        />
                      </div>
                      <div className='p-4'>
                        <div className='flex justify-between items-center'>
                          <h1 className='text-lg font-semibold mb-2'>
                            {blog.title}
                          </h1>
                          <MdOutlineRemoveRedEye
                            className='w-6 h-6 cursor-pointer'
                            onClick={() => window.open(blog?.file, '_blank')}
                          />
                        </div>
                        <a href={blog?.file} download className='w-full h-full'>
                          <button className='mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
                            Download Now
                          </button>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='col-span-full text-center py-12'>
                    <p className='text-gray-500 text-lg'>
                      No materials found in this category.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {selectedCategory && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </>
  )
}

export default MaterialCard
