'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FaArrowLeft,
  FaAward,
  FaCalendar,
  FaDollarSign,
  FaUser,
  FaFile
} from 'react-icons/fa'
import Link from 'next/link'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../ui/molecules/Loading'
import EmptyState from '@/ui/shadcn/EmptyState'
import { getScholarshipBySlug } from '../actions'
import { formatDate } from '@/utils/date.util'
import { Button } from '@/ui/shadcn/button'
import { THEME_BLUE } from '@/constants/constants'

const ScholarshipDetailsPage = ({ params }) => {
  const router = useRouter()
  const [scholarship, setScholarship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const fetchScholarshipDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs

        const scholarshipData = await getScholarshipBySlug(slugs)
        setScholarship(scholarshipData || null)
      } catch (err) {
        console.error('Error fetching scholarship details:', err)
        setError(err.message || 'Failed to load scholarship details')
        setScholarship(null)
      } finally {
        setLoading(false)
      }
    }

    fetchScholarshipDetails()
  }, [params])

  if (loading) {
    return (
      <div className='bg-white min-h-screen'>
        <Header />
        <Navbar />
        <div className='min-h-[60vh] flex items-center justify-center'>
          <Loading />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !scholarship) {
    return (
      <div className='bg-white min-h-screen'>
        <Header />
        <Navbar />
        <div className='min-h-[60vh] flex items-center justify-center px-6'>
          <EmptyState
            icon={FaAward}
            title='Scholarship Not Found'
            description={
              error || 'The scholarship you are looking for does not exist.'
            }
            action={{
              label: 'Back to Scholarships',
              onClick: () => router.push('/scholarship')
            }}
          />
        </div>
        <Footer />
      </div>
    )
  }



  // Safely parse eligibilityCriteria
  const parseCriteria = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch (e) {
        // If it's not valid JSON, treat it as a single string item
        return [value]
      }
    }
    // If it's an object or other type, wrap it in an array
    return [value]
  }

  const eligibilityCriteria = parseCriteria(scholarship?.eligibilityCriteria)
  const renewalCriteria = parseCriteria(scholarship?.renewalCriteria)

  return (
    <div className='bg-white min-h-screen'>
      <Header />
      <Navbar />

      <main className='max-w-7xl mx-auto px-6 py-12'>
        {/* Navigation */}
        <div className='mb-8'>
          <Link
            href='/scholarship'
            className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors'
          >
            <FaArrowLeft className='w-3 h-3' />
            <span>Back to Scholarships</span>
          </Link>
        </div>

        <div className='flex flex-col lg:flex-row gap-12'>
          {/* Main Content */}
          <div className='flex-1'>
            {/* Header */}
            <div className='mb-8'>
              <div className='flex items-start gap-4 mb-6'>
                <div className='bg-[#0A6FA7]/10 p-4 rounded-2xl'>
                  <FaAward className='w-8 h-8 text-[#0A6FA7]' />
                </div>
                <div className='flex-1'>
                  <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight'>
                    {scholarship.name}
                  </h1>
                  {scholarship.scholarshipCategory && (
                    <span className='inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100'>
                      {scholarship.scholarshipCategory.title}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {scholarship.description && (
              <div className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  About Scholarship
                </h2>
                <div
                  className='text-gray-600 leading-relaxed text-lg prose prose-gray max-w-none'
                  dangerouslySetInnerHTML={{ __html: scholarship.description }}
                />
              </div>
            )}

            {/* Eligibility Criteria */}
            {eligibilityCriteria.length > 0 && (
              <div className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                  <FaFile className='w-6 h-6 text-[#0A6FA7]' />
                  Eligibility Criteria
                </h2>
                <ul className='space-y-3'>
                  {Array.isArray(eligibilityCriteria) &&
                    eligibilityCriteria.length > 0 &&
                    eligibilityCriteria.map((criteria, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-3 text-gray-700'
                      >
                        <span className='text-[#0A6FA7] mt-1.5'>•</span>
                        <span>
                          {typeof criteria === 'string'
                            ? criteria
                            : criteria?.text || JSON.stringify(criteria)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Renewal Criteria */}
            {renewalCriteria.length > 0 && (
              <div className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Renewal Criteria
                </h2>
                <ul className='space-y-3'>
                  {Array.isArray(renewalCriteria) &&
                    renewalCriteria.length > 0 &&
                    renewalCriteria.map((criteria, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-3 text-gray-700'
                      >
                        <span className='text-[#0A6FA7] mt-1.5'>•</span>
                        <span>
                          {typeof criteria === 'string'
                            ? criteria
                            : criteria?.text || JSON.stringify(criteria)}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Contact Information */}
            {scholarship.contactInfo && (
              <div className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2'>
                  <FaUser className='w-6 h-6 text-[#0A6FA7]' />
                  Contact Information
                </h2>
                <div
                  className='text-gray-700 leading-relaxed prose prose-gray max-w-none'
                  dangerouslySetInnerHTML={{ __html: scholarship.contactInfo }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:w-80 space-y-6'>
            <div className='bg-gray-50 rounded-2xl p-8 sticky top-6'>
              <h3 className='text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4'>
                Scholarship Details
              </h3>
              <div className='space-y-4'>
                {scholarship.amount && (
                  <div className='flex flex-col border-b border-gray-100 pb-4'>
                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2'>
                      Amount
                    </span>
                    <span className='text-2xl font-bold text-green-700'>
                      {Number.isNaN(parseFloat(scholarship.amount))
                        ? scholarship.amount
                        : `Rs. ${parseFloat(scholarship.amount).toLocaleString()}`}
                    </span>
                  </div>
                )}

                {scholarship.applicationDeadline && (
                  <div className='flex flex-col border-b border-gray-100 pb-4'>
                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2'>
                      <FaCalendar className='w-3 h-3' />
                      Application Deadline
                    </span>
                    <span className='text-base font-medium text-gray-900'>
                      {formatDate(scholarship.applicationDeadline)}
                    </span>
                  </div>
                )}

                <div className='pt-2'>
                  {(() => {
                    const isDeadlinePassed = scholarship.applicationDeadline && new Date() > new Date(scholarship.applicationDeadline)

                    if (isDeadlinePassed) {
                      return (
                        <Button
                          className='w-full py-6 text-lg font-semibold text-white shadow-md cursor-not-allowed opacity-70'
                          style={{ backgroundColor: '#6b7280' }}
                          disabled
                        >
                          Deadline Passed
                        </Button>
                      )
                    }

                    return (
                      <Link href={`/scholarship/apply/${scholarship.slugs || scholarship.id}`} className='w-full'>
                        <Button
                          className='w-full py-6 text-lg font-semibold text-white shadow-md transition-all hover:-translate-y-0.5'
                          style={{ backgroundColor: THEME_BLUE }}
                        >
                          Apply Now
                        </Button>
                      </Link>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ScholarshipDetailsPage
