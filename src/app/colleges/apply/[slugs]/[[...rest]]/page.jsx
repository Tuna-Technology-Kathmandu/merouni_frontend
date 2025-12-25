'use client'

import React, { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../../components/Frontpage/Header'
import Navbar from '../../../../../components/Frontpage/Navbar'
import FormSection from './components/formSection'
import { getCollegeBySlug } from '../../../actions'
import { FaArrowLeft } from 'react-icons/fa'

const ApplyPage = ({ params }) => {
  const router = useRouter()
  const headerRef = useRef(null)
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  const { slugs, rest } = use(params)
  const id = rest?.[0]

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        console.log('Fetching college apply details for slug:', slugs)
        const collegeData = await getCollegeBySlug(slugs)

        if (collegeData) {
          setCollege(collegeData)
        } else {
          setError('No data found')
        }
      } catch (error) {
        console.error('Error fetching college details:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (slugs) {
      fetchCollegeDetails()
    }
  }, [slugs])

  useEffect(() => {
    // Calculate header height
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }

    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)

    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        html {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar {
          display: none;
        }
        body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <main className='w-full min-h-screen relative'>
        {/* Header and Navbar - Above everything with sticky positioning */}
        <div ref={headerRef} className='sticky top-0 z-50 bg-white'>
          <Header />
          <Navbar />
        </div>

        {/* Banner Image Background - Starts after header */}
        <div
          className='fixed left-0 right-0 bottom-0 z-0'
          style={{ top: `${headerHeight}px` }}
        >
          {loading ? (
            <div className='w-full h-full bg-slate-300 animate-pulse' />
          ) : (
            <img
              src={college?.featured_img || '/images/degreeHero.webp'}
              className='object-cover w-full h-full'
              alt='College Banner'
              loading='lazy'
            />
          )}
          {/* Dark overlay for better form visibility */}
          <div className='absolute inset-0 bg-black bg-opacity-40' />
        </div>

        {/* Back Button */}
        <div className='relative z-20 pt-4 px-4 md:px-8'>
          <button
            onClick={() => router.back()}
            className='inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-md hover:bg-opacity-100 transition-all text-gray-700 hover:text-gray-900'
          >
            <FaArrowLeft className='w-4 h-4' />
            <span className='font-medium'>Back</span>
          </button>
        </div>

        {/* Form Section Overlay */}
        <div className='relative z-10 min-h-screen flex items-start justify-center pt-20 pb-12 px-4'>
          <FormSection college={college} id={id} />
        </div>
      </main>
    </>
  )
}

export default ApplyPage
