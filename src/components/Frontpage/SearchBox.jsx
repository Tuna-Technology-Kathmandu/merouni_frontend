'use client'

import React, { useState, useEffect } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import Link from 'next/link'
import { DotenvConfig } from '../../config/env.config'

const SearchBox = ({ onClose }) => {
  const popularSearches = [
    'KUUMAT',
    'SEE RESULT 2025',
    'NEB Class 12 Result 2025',
    'IOE Entrance Exam 2025',
    'MBBS Entrance Exam Nepal',
    'Best College for BIT in Nepal',
    'Lok Sewa Aayog Vacancy',
    'TU Entrance Exam'
  ]

  const [searchTag, setSearchTag] = useState('')
  const [searchResults, setSearchResults] = useState({
    events: [],
    blogs: [],
    colleges: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect if the screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // Mobile is < 768px (md breakpoint)
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch search results based on input
  const fetchSearchResults = async (query) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/search?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setSearchResults({
          blogs: Array.isArray(data.blogs) ? data.blogs : [],
          events: Array.isArray(data.events) ? data.events : [],
          colleges: Array.isArray(data.colleges) ? data.colleges : []
        })
      } else {
        setSearchResults({ blogs: [], events: [] })
      }
    } catch (error) {
      setSearchResults({ blogs: [], events: [] })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchTag.trim() !== '') {
      fetchSearchResults(searchTag)
    } else {
      setSearchResults({ blogs: [], events: [] })
    }
  }, [searchTag])

  const handleInputChange = (e) => {
    setSearchTag(e.target.value)
  }

  const handleItemClick = (value) => {
    setSearchTag(value)
  }

  //the sections for showing the result of the search
  const ResultSection = ({ title, items }) => {
    const [slice, setSlice] = useState(3)
    const [toggleView, setToggleView] = useState(true)

    if (!Array.isArray(items) || items.length === 0) return null
    const categoryPath = title.toLowerCase()

    const viewClick = () => {
      setSlice(items.length)
      setToggleView(false)
    }

    const viewLess = () => {
      setSlice(3)
      setToggleView(true)
    }

    return (
      <div className='mb-8 px-4 md:px-10'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-base md:text-lg font-semibold'>{title}</h2>
          {items.length > slice && toggleView && (
            <p
              className='text-sm text-[#30AD8F] border-b border-[#30AD8F] hover:text-[#248a72] transition cursor-pointer'
              onClick={viewClick}
            >
              View All
            </p>
          )}
          {!toggleView && (
            <p
              className='text-sm text-[#30AD8F] border-b border-[#30AD8F] hover:text-[#248a72] transition cursor-pointer'
              onClick={viewLess}
            >
              View Less
            </p>
          )}
        </div>

        {/* Responsive grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {items.slice(0, slice).map((item, index) => (
            <Link href={`/${categoryPath}/${item.slugs}`} key={index}>
              <div className='cursor-pointer bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-center items-center text-center'>
                {/* Icon-like placeholder */}
                <div className='w-16 h-16 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg mb-4'>
                  {item.name?.charAt(0) || '?'}
                </div>

                {/* Title */}
                <h3 className='text-base md:text-lg font-semibold text-gray-800 group-hover:text-emerald-600 transition'>
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`fixed flex flex-col top-0 left-0 w-full transition-all duration-300 z-50 ${searchTag.trim()
          ? 'h-screen bg-white overflow-auto'
          : 'h-[400px] md:h-[450px] bg-white shadow-md'
        }`}
      onClick={(e) => e.stopPropagation()} // Prevents clicks from propagating
    >
      {/* 🔹 Search Input Container */}
      <div className='relative flex justify-center mt-6 px-4 md:px-0'>
        <div className='relative w-full max-w-lg md:w-[600px]'>
          <input
            type='text'
            placeholder={
              isMobile
                ? 'Search Colleges, Events ...'
                : 'Search Universities, Colleges, Events & more...'
            }
            value={searchTag}
            className='w-full py-2 border-b-2 border-black focus:outline-none placeholder-gray-500 pr-16 text-sm sm:text-base'
            onChange={handleInputChange}
            autoFocus
          />
          {/* Icons Container */}
          <div className='absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4 pr-2'>
            {searchTag.trim() && (
              <button
                onClick={() => {
                  setSearchTag('')
                  setSearchResults({ blogs: [], events: [] })
                }}
                className='hover:bg-[#30AD8F] hover:rounded-lg p-1'
              >
                <RxCross2
                  size={20}
                  className='text-gray-600 hover:text-white'
                />
              </button>
            )}
            <IoIosSearch size={20} className='text-black' />
          </div>
        </div>
      </div>

      {/* 🔹 Popular Searches (Now Centered Below Search Field) */}
      {!searchTag.trim() && (
        <div className='absolute left-1/2 transform -translate-x-40 md:-translate-x-64 mt-20 w-[600px] h-[300px] md:h-[400px] overflow-y-auto'>
          <h3 className='text-gray-500 font-semibold'>Popular Searches</h3>
          <ul className='mt-2  '>
            {popularSearches.map((search, index) => (
              <li
                key={index}
                className='py-2  font-medium cursor-pointer hover:bg-gray-100 hover:text-[#30AD8F] rounded-md'
                onClick={() => handleItemClick(search)}
              >
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Search Results */}
      {searchTag.trim() && (
        <div className='w-full mt-6 px-4 md:px-10'>
          {isLoading ? (
            <div className='text-gray-500 text-center mt-10'>Loading...</div>
          ) : (
            <>
              {Object.values(searchResults).every((arr) => arr.length === 0) ? (
                <div className='text-gray-500 text-center mt-10'>
                  No results found for "{searchTag}"
                </div>
              ) : (
                <>
                  <ResultSection title='Events' items={searchResults.events} />
                  <ResultSection title='Blogs' items={searchResults.blogs} />
                  <ResultSection
                    title='Colleges'
                    items={searchResults.colleges}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBox
