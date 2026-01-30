'use client'

import { useEffect, useState } from 'react'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../ui/molecules/Loading'
import { getDegreeBySlug } from '../actions'
import CollegeTeach from './components/collegeTeach'
import RelatedCourses from './components/RelatedCourses'
import Syllabus from './components/syllabus'
import ImageSection from './components/upperSection'
import { slugify } from '@/lib/slugify'
import { BookOpen } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'

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

  if (error || !degree) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='container mx-auto px-4 py-20'>
          <EmptyState
            icon={BookOpen}
            title={
              error === 'Degree not found' || !degree
                ? 'Degree Not Found'
                : 'Something went wrong'
            }
            description={
              error ||
              "We couldn't find the degree you're looking for. It might have been moved or deleted."
            }
            action={{
              label: 'Browse All Degrees',
              onClick: () => (window.location.href = '/degree')
            }}
          />
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
