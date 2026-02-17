'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, MapPin } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'

const AppliedCollegesPage = () => {
  const { setHeading } = usePageHeading()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setHeading('Applied Colleges')
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    let isMounted = true

    const loadApplications = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authFetch(
          `${process.env.baseUrl}/referral/user/referrals`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load applied colleges')
        }

        const data = await res.json()
        if (!isMounted) return
        setApplications(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error loading applied colleges:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load applied colleges')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadApplications()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className='p-4'>
      <div className='bg-white rounded-xl shadow p-4'>
        <h2 className='text-lg font-semibold mb-2'>
          Your Applied Colleges
        </h2>
        <p className='text-sm text-gray-600 mb-3'>
          Track the status of the colleges you&apos;ve applied to.
        </p>

        {loading && (
          <div className='flex justify-center items-center h-24'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          </div>
        )}

        {!loading && error && (
          <p className='text-sm text-red-600'>Error: {error}</p>
        )}

        {!loading && !error && (
          <>
            {applications.length === 0 ? (
              <p className='text-sm text-gray-500'>
                You haven&apos;t applied to any colleges yet.
              </p>
            ) : (
              <div className='space-y-3'>
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className='flex flex-col md:flex-row md:items-center justify-between border rounded-lg px-3 py-3 gap-2'
                  >
                    <div className='flex-1 flex items-start gap-3'>
                      {/* College Logo */}
                      <div className='flex-shrink-0'>
                        {app?.referralCollege?.college_logo ? (
                          <img
                            src={app.referralCollege.college_logo}
                            alt={
                              app?.referralCollege?.name || 'College Logo'
                            }
                            className='w-12 h-12 object-contain rounded'
                          />
                        ) : (
                          <div className='w-12 h-12 bg-gray-100 rounded flex items-center justify-center'>
                            <span className='text-gray-400 text-xs'>
                              No Logo
                            </span>
                          </div>
                        )}
                      </div>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <p className='font-semibold text-gray-900'>
                            {app?.referralCollege?.name ||
                              'Unnamed College'}
                          </p>
                          {app?.status && (
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'ACCEPTED'
                                ? 'bg-green-100 text-green-800'
                                : app.status === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                              {app.status}
                            </span>
                          )}
                        </div>
                        {/* College Contact and Location in single row */}
                        {(app?.referralCollege?.contacts?.length > 0 ||
                          app?.referralCollege?.address) && (
                            <div className='text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2'>
                              {app?.referralCollege?.contacts?.length > 0 && (
                                <span className='flex items-center gap-1'>
                                  <Phone className='w-3 h-3' />
                                  {app.referralCollege.contacts
                                    .map((contact) => contact.contact_number)
                                    .join(', ')}
                                </span>
                              )}

                              {app?.referralCollege?.address && (
                                <span className='flex items-center gap-1'>
                                  <MapPin className='w-3 h-3' />
                                  {[
                                    app.referralCollege.address.city,
                                    app.referralCollege.address.state,
                                    app.referralCollege.address.country
                                  ]
                                    .filter(Boolean)
                                    .join(', ')}
                                </span>
                              )}
                            </div>
                          )}

                        {/* Other Details */}
                        {app?.course && (
                          <p className='text-xs text-gray-500 mt-1'>
                            Course: {app.course.title}
                          </p>
                        )}
                        {app?.createdAt && (
                          <p className='text-xs text-gray-500 mt-1'>
                            Applied:{' '}
                            {new Date(app.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }
                            )}
                          </p>
                        )}
                        {app?.student_description && (
                          <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                            {app.student_description}
                          </p>
                        )}
                        {app?.remarks && (
                          <p className='text-xs text-gray-600 mt-2 italic border-l-2 border-gray-300 pl-2'>
                            <span className='font-medium'>Remarks: </span>
                            {app.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                    {app?.referralCollege?.slugs && (
                      <Link
                        href={`/colleges/${app.referralCollege.slugs}`}
                        className='inline-flex items-center text-sm font-medium text-blue-600 hover:underline'
                      >
                        View College
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AppliedCollegesPage
