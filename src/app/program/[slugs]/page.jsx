'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../ui/molecules/Loading'
import EmptyState from '@/ui/shadcn/EmptyState'
import { getProgramBySlug } from '../actions'
import { slugify } from '@/lib/slugify'
import {
  BookOpen,
  GraduationCap,
  Clock,
  DollarSign,
  Building2,
  FileText,
  Target,
  ListOrdered
} from 'lucide-react'

const ProgramDetailPage = ({ params }) => {
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true)
        setError(null)
        const resolvedParams = await params
        const slugs = decodeURIComponent(resolvedParams.slugs)
        const finalSlug = slugify(slugs)
        const data = await getProgramBySlug(finalSlug)
        setProgram(data)
      } catch (err) {
        console.error('Error fetching program:', err)
        setError(err.message || 'Failed to load program')
        setProgram(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProgram()
  }, [params])

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='min-h-[60vh] flex items-center justify-center'>
          <Loading />
        </div>
        <Footer />
      </>
    )
  }

  if (error || !program) {
    return (
      <>
        <Header />
        <Navbar />
        <div className='container mx-auto px-4 py-20'>
          <EmptyState
            icon={BookOpen}
            title='Program Not Found'
            description={
              error || "The program you're looking for doesn't exist or was moved."
            }
            action={{
              label: 'Browse Degrees',
              onClick: () => (window.location.href = '/degree')
            }}
          />
        </div>
        <Footer />
      </>
    )
  }

  const groupedSyllabus = program?.syllabus?.reduce((acc, item) => {
    const year = item.year
    const semester = item.semester
    if (!acc[year]) acc[year] = {}
    if (semester === 0) {
      if (!acc[year].yearly) acc[year].yearly = []
      acc[year].yearly.push(item)
    } else {
      if (!acc[year][semester]) acc[year][semester] = []
      acc[year][semester].push(item)
    }
    return acc
  }, {})

  return (
    <>
      <Header />
      <Navbar />
      <div className='bg-white min-h-screen'>
        {/* Hero */}
        <div className='w-full bg-gray-50 border-b border-gray-100 py-16 md:py-24'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl'>
              <div className='flex flex-wrap items-center gap-2 mb-4'>
                {program.code && (
                  <span className='px-3 py-1 bg-[#0A6FA7]/10 text-[#0A6FA7] text-sm font-semibold rounded-full'>
                    {program.code}
                  </span>
                )}
                {program.programdegree?.title && (
                  <span className='text-gray-500 text-sm'>
                    · {program.programdegree.short_name || program.programdegree.title}
                  </span>
                )}
                {program.programlevel?.title && (
                  <span className='text-gray-500 text-sm'>
                    · {program.programlevel.title}
                  </span>
                )}
              </div>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                {program.title}
              </h1>
              <div className='flex flex-wrap gap-4 text-gray-600'>
                {program.duration && (
                  <span className='flex items-center gap-1'>
                    <Clock className='w-4 h-4' /> {program.duration}
                  </span>
                )}
                {program.delivery_type && (
                  <span>{program.delivery_type}</span>
                )}
                {program.delivery_mode && (
                  <span>· {program.delivery_mode}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='container mx-auto px-4 py-8 max-w-4xl'>
          <Link
            href='/degree'
            className='inline-flex items-center text-sm font-medium text-[#0A6FA7] hover:underline mb-8'
          >
            ← Back to degrees
          </Link>

          <div className='space-y-10'>
            {program.fee && (
              <section>
                <h2 className='text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                  <DollarSign className='w-5 h-5 text-[#0A6FA7]' />
                  Fee structure
                </h2>
                <div className='prose text-gray-700 whitespace-pre-wrap'>
                  {program.fee}
                </div>
              </section>
            )}

            {program.eligibility_criteria && (
              <section>
                <h2 className='text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                  <FileText className='w-5 h-5 text-[#0A6FA7]' />
                  Eligibility
                </h2>
                <div className='prose text-gray-700 whitespace-pre-wrap'>
                  {program.eligibility_criteria}
                </div>
              </section>
            )}

            {program.learning_outcomes && (
              <section>
                <h2 className='text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                  <Target className='w-5 h-5 text-[#0A6FA7]' />
                  Learning outcomes
                </h2>
                <div className='prose text-gray-700 whitespace-pre-wrap'>
                  {program.learning_outcomes}
                </div>
              </section>
            )}

            {program.curriculum && (
              <section>
                <h2 className='text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                  <ListOrdered className='w-5 h-5 text-[#0A6FA7]' />
                  Curriculum
                </h2>
                <div className='prose text-gray-700 whitespace-pre-wrap'>
                  {program.curriculum}
                </div>
              </section>
            )}

            {groupedSyllabus && Object.keys(groupedSyllabus).length > 0 && (
              <section className='bg-gray-50 rounded-xl p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                  <GraduationCap className='w-5 h-5 text-[#0A6FA7]' />
                  Syllabus
                </h2>
                <div className='space-y-6'>
                  {Object.entries(groupedSyllabus)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([year, semesters]) => (
                      <div key={year} className='border-b border-gray-200 pb-6 last:border-0'>
                        <h3 className='text-lg font-medium text-[#0A6FA7] mb-4'>
                          Year {year}
                        </h3>
                        <div className='space-y-4'>
                          {semesters.yearly?.map((item) => (
                            <div
                              key={item.id}
                              className='flex justify-between items-center py-2 px-3 bg-white rounded border border-gray-100'
                            >
                              <span className='font-medium'>
                                {item.programCourse?.title ?? '—'}
                              </span>
                              {item.is_elective && (
                                <span className='text-xs text-amber-600 font-medium'>
                                  Elective
                                </span>
                              )}
                            </div>
                          ))}
                          {Object.entries(semesters)
                            .filter(([k]) => k !== 'yearly')
                            .sort(([a], [b]) => Number(a) - Number(b))
                            .map(([semester, items]) => (
                              <div key={semester}>
                                <p className='text-sm font-medium text-gray-600 mb-2'>
                                  Semester {semester}
                                </p>
                                {items.map((item) => (
                                  <div
                                    key={item.id}
                                    className='flex justify-between items-center py-2 px-3 bg-white rounded border border-gray-100 mb-1'
                                  >
                                    <span className='font-medium'>
                                      {item.programCourse?.title ?? '—'}
                                    </span>
                                    {item.is_elective && (
                                      <span className='text-xs text-amber-600 font-medium'>
                                        Elective
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}

            {program.colleges && program.colleges.length > 0 && (
              <section>
                <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2'>
                  <Building2 className='w-5 h-5 text-[#0A6FA7]' />
                  Colleges offering this program
                </h2>
                <ul className='space-y-2'>
                  {program.colleges.map((college) => (
                    <li key={college.id}>
                      {college.slugs ? (
                        <Link
                          href={`/colleges/${encodeURIComponent(college.slugs)}`}
                          className='block py-2 px-4 rounded-lg border border-gray-200 hover:border-[#0A6FA7] hover:bg-[#0A6FA7]/5 text-gray-800 hover:text-[#0A6FA7] transition-colors'
                        >
                          {college.name}
                        </Link>
                      ) : (
                        <div className='py-2 px-4 rounded-lg border border-gray-200 text-gray-800'>
                          {college.name}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ProgramDetailPage
