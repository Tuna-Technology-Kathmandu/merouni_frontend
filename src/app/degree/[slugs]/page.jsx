'use client'

import { useEffect, useState, useMemo } from 'react'
import DOMPurify from 'dompurify'
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
import { BookOpen, GraduationCap, Building2 } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import CollegeCard from '@/ui/molecules/cards/CollegeCard'

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

  const uniqueColleges = useMemo(() => {
    if (degree?.colleges && degree.colleges.length > 0) return degree.colleges
    if (!degree?.programs) return []
    const collegesMap = new Map()
    degree.programs.forEach((program) => {
      program.colleges?.forEach((college) => {
        if (!collegesMap.has(college.id)) {
          collegesMap.set(college.id, college)
        }
      })
    })
    return Array.from(collegesMap.values())
  }, [degree])

  if (loading) {
    return <Loading />
  }

  if (error || !degree) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='container mx-auto px-4 py-10'>
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
                <div className='w-full bg-gray-50 border-b border-gray-100 py-10 md:py-10'>
                  <div className='container mx-auto px-4'>
                    <div className='max-w-4xl mx-auto'>
                      {degree.short_name && (
                        <p className='text-sm font-semibold text-[#0A6FA7] uppercase tracking-wide mb-2'>
                          {degree.short_name}
                        </p>
                      )}
                      <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6'>
                        {degree.title}
                      </h1>
                      {degree.description && (
                        <p className='text-gray-600 text-lg max-w-2xl leading-relaxed mb-8'>
                          {degree.description}
                        </p>
                      )}

                      <div className='w-full aspect-video rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50 flex items-center justify-center mb-8'>
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
                      
                      {degree.content && (
                        <div 
                          className='prose prose-blue max-w-none mb-8'
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(degree.content) }}
                        />
                      )}
                    </div>
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
                                <span className='font-medium'>
                                  {program.title}
                                  {program.university_programs?.[0]?.university?.fullname && (
                                    <span className='text-gray-500 font-normal'>
                                      {' '}
                                      - {program.university_programs[0].university.fullname}
                                    </span>
                                  )}
                                </span>
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
                                <span className='font-medium'>
                                  {program.title}
                                  {program.university_programs?.[0]?.university?.fullname && (
                                    <span className='text-gray-500 font-normal'>
                                      {' '}
                                      - {program.university_programs[0].university.fullname}
                                    </span>
                                  )}
                                </span>
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
                {uniqueColleges.length > 0 && (
                  <div className='container mx-auto px-4 py-12'>
                    <div className='max-w-4xl mx-auto'>
                      <h2 className='text-3xl font-bold text-gray-900 mb-8 flex items-center bg-gray-50/50 p-4 rounded-2xl w-full'>
                        <Building2 className='w-8 h-8 text-[#30AD8F] mr-4' />
                        Colleges offering this course
                      </h2>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
                        {uniqueColleges.map((college, index) => (
                          <Link key={index} href={`/colleges/${college.slugs || college.slug}`}>
                            <div className='group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex items-center space-x-5 h-full'>
                              <div className='w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100 group-hover:border-[#30AD8F]/20 transition-colors'>
                                <img
                                  src={college.college_logo || college.logo || '/images/collegePhoto.png'}
                                  alt={college.name}
                                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                />
                              </div>
                              <div className='flex-1'>
                                <h3 className='font-bold text-gray-900 group-hover:text-[#0A70A7] transition-colors line-clamp-1'>
                                  {college.name}
                                </h3>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
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
                
                {degree.content && (
                  <div className='container mx-auto px-4 py-12'>
                    <div className='max-w-4xl mx-auto'>
                      <div 
                        className='prose prose-blue max-w-none'
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(degree.content) }}
                      />
                    </div>
                  </div>
                )}

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
                                    {program.university_programs?.[0]?.university?.fullname && (
                                      <span className='text-gray-500 font-normal'>
                                        {' '}
                                        - {program.university_programs[0].university.fullname}
                                      </span>
                                    )}
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
