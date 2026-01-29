'use client'

import React, { useState, useEffect } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { RxCross2 } from 'react-icons/rx'
import { Search, X, Calendar, BookOpen, GraduationCap, ChevronRight } from 'lucide-react'
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
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch search results based on input
  const fetchSearchResults = async (query) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/search?q=${encodeURIComponent(query)}`
      )
      if (response.ok) {
        const data = await response.json()
        setSearchResults({
          blogs: Array.isArray(data.blogs) ? data.blogs : [],
          events: Array.isArray(data.events) ? data.events : [],
          colleges: Array.isArray(data.colleges) ? data.colleges : []
        })
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchTag.trim() !== '') {
      fetchSearchResults(searchTag)
    } else {
      setSearchResults({ blogs: [], events: [], colleges: [] })
    }
  }, [searchTag])

  const handleInputChange = (e) => {
    setSearchTag(e.target.value)
  }

  const handleItemClick = (value) => {
    setSearchTag(value)
  }

  //the sections for showing the result of the search
  const ResultSection = ({ title, items, icon: Icon, path }) => {
    const [slice, setSlice] = useState(3)
    const [toggleView, setToggleView] = useState(true)

    if (!Array.isArray(items) || items.length === 0) return null

    const viewClick = () => {
      setSlice(items.length)
      setToggleView(false)
    }

    const viewLess = () => {
      setSlice(3)
      setToggleView(true)
    }

    return (
      <div className='mb-12'>
        <div className='flex justify-between items-center mb-6 px-2'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-[#0A6FA7]/10 rounded-xl'>
              <Icon className='w-5 h-5 text-[#0A6FA7]' />
            </div>
            <h2 className='text-lg md:text-xl font-semibold text-gray-900'>{title}</h2>
          </div>
          {items.length > 3 && (
            <button
              className='text-sm font-semibold text-[#0A6FA7] hover:text-[#085a86] transition flex items-center gap-1'
              onClick={toggleView ? viewClick : viewLess}
            >
              {toggleView ? 'View All' : 'View Less'}
              <ChevronRight className={`w-4 h-4 transition-transform ${!toggleView ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {items.slice(0, slice).map((item, index) => (
            <Link href={`/${path}/${item.slugs}`} key={index} onClick={onClose}>
              <div className='group cursor-pointer bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-md hover:border-[#0A6FA7]/20 transition-all p-6 flex flex-col items-center text-center'>
                <div className='w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-[#0A6FA7] font-semibold text-2xl group-hover:bg-[#0A6FA7] group-hover:text-white transition-all mb-4'>
                  {item.name?.charAt(0) || item.title?.charAt(0) || '?'}
                </div>
                <h3 className='text-base md:text-lg font-semibold text-gray-800 group-hover:text-[#0A6FA7] transition-colors line-clamp-2'>
                  {item.name || item.title}
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
      className={`fixed inset-0 flex flex-col bg-white/95 backdrop-blur-xl transition-all duration-300 z-[100] font-sans ${searchTag.trim() ? 'h-screen overflow-auto' : 'h-[450px] shadow-lg'
        }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className='max-w-5xl mx-auto w-full px-6 flex flex-col pt-10'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='self-end p-2 px-3 text-red-500 hover:text-red-600 transition flex items-center gap-1 mb-4'
        >
          <X className='w-4 h-4' />
          <span className='text-[10px] font-semibold uppercase tracking-[0.2em]'>Close</span>
        </button>

        {/* 🔹 Search Input Container */}
        <div className='relative w-full mb-10'>
          <div className='relative group'>
            <input
              type='text'
              placeholder={
                isMobile
                  ? 'Colleges, Events, Blogs ...'
                  : 'Search Universities, Colleges, Events & more...'
              }
              value={searchTag}
              className='w-full py-4 bg-transparent border-b-2 border-gray-100 focus:border-[#0A6FA7] transition-all focus:outline-none placeholder-gray-300 text-2xl md:text-3xl font-semibold text-gray-900 pr-16 tracking-tight'
              onChange={handleInputChange}
              autoFocus
            />
            <div className='absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4 pr-2'>
              {isLoading && (
                <div className='w-5 h-5 border-2 border-[#0A6FA7]/20 border-t-[#0A6FA7] rounded-full animate-spin'></div>
              )}
              {searchTag.trim() && !isLoading && (
                <button
                  onClick={() => setSearchTag('')}
                  className='p-1 text-gray-400 hover:text-red-500 transition-colors'
                >
                  <X size={20} />
                </button>
              )}
              <Search size={24} className='text-[#0A6FA7]' />
            </div>
          </div>
        </div>

        {/* 🔹 Content Area */}
        <div className='flex-1 pb-20'>
          {/* Popular Searches */}
          {!searchTag.trim() && (
            <div className='animate-in fade-in duration-500'>
              <h3 className='text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400 mb-6'>Popular Searches</h3>
              <div className='flex flex-wrap gap-2'>
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className='px-5 py-2.5 rounded-2xl bg-gray-50 text-sm font-medium text-gray-600 hover:bg-[#0A6FA7]/10 hover:text-[#0A6FA7] transition-all border border-transparent hover:border-[#0A6FA7]/20'
                    onClick={() => handleItemClick(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchTag.trim() && (
            <div className='animate-in fade-in duration-300'>
              {!isLoading && Object.values(searchResults).every((arr) => arr.length === 0) ? (
                <div className='py-20 text-center'>
                  <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300'>
                    <Search size={32} />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-1'>No results found</h3>
                  <p className='text-gray-500 text-sm font-medium'>We couldn't find anything matching "{searchTag}"</p>
                </div>
              ) : (
                <>
                  <ResultSection title='Colleges' items={searchResults.colleges} icon={GraduationCap} path='colleges' />
                  <ResultSection title='Events' items={searchResults.events} icon={Calendar} path='events' />
                  <ResultSection title='Blogs' items={searchResults.blogs} icon={BookOpen} path='blogs' />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchBox
