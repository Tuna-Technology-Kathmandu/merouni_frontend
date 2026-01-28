'use client'

import { useEffect, useState } from 'react'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../components/Loading'
import { getDegreeBySlug } from '../actions'
import CollegeTeach from './components/collegeTeach'
import RelatedCourses from './components/RelatedCourses'
import Syllabus from './components/syllabus'
import ImageSection from './components/upperSection'
import { slugify } from '@/lib/slugify'

const CourseDescription = ({ params }) => {
  const [degree, setDegree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        setLoading(true)
        setError(null)

        const resolvedParams = await params
        const slugs = decodeURIComponent(resolvedParams.slugs)
        const finalSlug = slugify(slugs)

        await fetchDegreeDetails(finalSlug)
      } catch (error) {
        console.error('Error resolving params:', error)
        setError('Failed to load degree information')
        setLoading(false)
      }
    }
    fetchDegree()
  }, [params])

  const fetchDegreeDetails = async (slugs) => {
    try {
      const degreeData = await getDegreeBySlug(slugs)

      if (degreeData && degreeData.id) {
        setDegree(degreeData)
        setError(null)
      } else {
        setError('Degree not found')
        setDegree(null)
      }
    } catch (error) {
      console.error('Error fetching degree details:', error)
      setError(error.message || 'Failed to fetch degree details')
      setDegree(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='container mx-auto px-4 py-16 text-center'>
          <div className='max-w-md mx-auto'>
            <div className='mb-6'>
              <svg
                className='mx-auto h-24 w-24 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h1 className='text-4xl font-bold text-gray-800 mb-4'>
              {error === 'Degree not found' ? '404' : 'Error'}
            </h1>
            <p className='text-xl text-gray-600 mb-8'>{error}</p>
            <a
              href='/degree'
              className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
            >
              Browse All Degrees
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!degree) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='container mx-auto px-4 py-16 text-center'>
          <div className='max-w-md mx-auto'>
            <div className='mb-6'>
              <svg
                className='mx-auto h-24 w-24 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>
            <p className='text-xl text-gray-600 mb-8'>Degree not found</p>
            <a
              href='/degree'
              className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'
            >
              Browse All Degrees
            </a>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div>
        <Header />
        <Navbar />
        {degree && (
          <>
            <ImageSection degree={degree} />
            <Syllabus degree={degree} />
            <CollegeTeach degree={degree} />
            <RelatedCourses degree={degree} />
          </>
        )}
        <Footer />
      </div>
    </>
  )
}

export default CourseDescription
