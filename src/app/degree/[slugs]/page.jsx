'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
import { BookOpen, GraduationCap } from 'lucide-react'
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

  const isSimpleDegree = degree && degree.short_name != null && !degree.syllabus

  return (
    <>
      <div>
        <Header />
        <Navbar />
        {degree && (
          <>
            {isSimpleDegree ? (
              <div className='bg-white min-h-screen'>
                <div className='w-full bg-gray-50 border-b border-gray-100 py-16 md:py-24'>
                  <div className='container mx-auto px-4'>
                    <div className='max-w-4xl'>
                      {degree.short_name && (
                        <p className='text-sm font-semibold text-[#0A6FA7] uppercase tracking-wide mb-2'>
                          {degree.short_name}
                        </p>
                      )}
                      <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                        {degree.title}
                      </h1>
                    </div>
                  </div>
                </div>
                <div className='container mx-auto px-4 -mt-8'>
                  <div className='w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50 flex items-center justify-center'>
                    <img
                      src={degree.cover_image || degree.featured_image || '/images/logo.png'}
                      alt={degree.title}
                      className={
                        degree.cover_image || degree.featured_image
                          ? 'w-full h-full object-cover'
                          : 'w-2/3 h-auto object-contain opacity-50'
                      }
                    />
                  </div>
                </div>
                {degree.programs && degree.programs.length > 0 && (
                  <div className='container mx-auto px-4 py-12'>
                    <div className='max-w-4xl mx-auto'>
                      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <GraduationCap className='w-6 h-6 text-[#0A6FA7]' />
                        Programs under this degree
                      </h2>
                      <ul className='space-y-2'>
                        {degree.programs.map((program) => (
                          <li key={program.id}>
                            {program.slugs ? (
                              <Link
                                href={`/program/${encodeURIComponent(program.slugs)}`}
                                className='block py-2 px-4 rounded-lg border border-gray-200 hover:border-[#0A6FA7] hover:bg-[#0A6FA7]/5 transition-colors text-gray-800 hover:text-[#0A6FA7]'
                              >
                                <span className='font-medium'>{program.title}</span>
                                {program.code && (
                                  <span className='text-sm text-gray-500 ml-2'>
                                    ({program.code})
                                  </span>
                                )}
                                {program.duration && (
                                  <span className='text-sm text-gray-500 ml-2'>
                                    · {program.duration}
                                  </span>
                                )}
                              </Link>
                            ) : (
                              <div className='block py-2 px-4 rounded-lg border border-gray-200 text-gray-800'>
                                <span className='font-medium'>{program.title}</span>
                                {program.code && (
                                  <span className='text-sm text-gray-500 ml-2'>
                                    ({program.code})
                                  </span>
                                )}
                                {program.duration && (
                                  <span className='text-sm text-gray-500 ml-2'>
                                    · {program.duration}
                                  </span>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className='container mx-auto px-4 py-12'>
                  <a
                    href='/degree'
                    className='inline-flex items-center text-sm font-medium text-[#0A6FA7] hover:underline'
                  >
                    ← Browse all degrees
                  </a>
                </div>
              </div>
            ) : (
              <>
                <ImageSection degree={degree} />
                <Syllabus degree={degree} />
                <CollegeTeach degree={degree} />
                <RelatedCourses degree={degree} />
                {degree.programs && degree.programs.length > 0 && (
                  <div className='container mx-auto px-4 py-12'>
                    <div className='max-w-4xl mx-auto'>
                      <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                        <GraduationCap className='w-6 h-6 text-[#0A6FA7]' />
                        Programs under this degree
                      </h2>
                      <ul className='space-y-4'>
                        {degree.programs.map((program) => (
                          <li key={program.id}>
                            <Link
                              href={`/program/${encodeURIComponent(program.slugs || program.slug)}`}
                              className='block p-4 rounded-xl border border-gray-100 bg-white hover:border-[#0A6FA7] hover:shadow-md transition-all group'
                            >
                              <div className='flex items-center justify-between'>
                                <div className='flex-1'>
                                  <h3 className='font-bold text-gray-900 group-hover:text-[#0A6FA7] transition-colors'>
                                    {program.title}
                                  </h3>
                                  <div className='flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm text-gray-500'>
                                    {program.code && (
                                      <span>Code: {program.code}</span>
                                    )}
                                    {program.duration && (
                                      <span>· {program.duration}</span>
                                    )}
                                    {program.credits && (
                                      <span>· {program.credits} Credits</span>
                                    )}
                                  </div>
                                </div>
                                <div className='ml-4'>
                                  <span className='px-4 py-2 rounded-lg bg-gray-50 text-[#0A6FA7] text-sm font-semibold group-hover:bg-[#0A6FA7] group-hover:text-white transition-all'>
                                    View Program
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
        <Footer />
      </div>
    </>
  )
}

export default CourseDescription
