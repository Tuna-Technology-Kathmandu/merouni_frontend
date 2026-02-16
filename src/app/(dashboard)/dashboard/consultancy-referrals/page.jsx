'use client'

import React, { useEffect, useState } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ShimmerEffect from '@/ui/molecules/ShimmerEffect'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle
} from 'lucide-react'

const ConsultancyReferralsPage = () => {
  const { setHeading } = usePageHeading()
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setHeading('Consultancy Referrals')
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    let isMounted = true

    const loadReferrals = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await authFetch(
          `${process.env.baseUrl}/consultancy-application/user/applications`,
          { cache: 'no-store', method: 'GET' }
        )

        if (!response.ok) {
          throw new Error('Failed to load consultancy referrals')
        }

        const data = await response.json()
        if (!isMounted) return
        setReferrals(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error loading consultancy referrals:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load consultancy referrals')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadReferrals()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) return <ShimmerEffect />
  if (error)
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <p className='text-red-600'>Error: {error}</p>
        </div>
      </div>
    )

  return (
    <div className='p-6 bg-white'>
      <div className='mb-6'>
        <p className='text-gray-600'>
          View all students you have referred to consultancies
        </p>
      </div>

      {referrals.length === 0 ? (
        <div className='text-center py-12 border border-gray-200 rounded-lg bg-gray-50'>
          <FileText className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <p className='text-lg text-gray-600 mb-2'>No consultancy referrals yet</p>
          <p className='text-sm text-gray-500'>
            Start referring students from the "Refer Student" page
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {referrals.map((referral) => {
            const consultancy = referral.consultancy || {}
            const address = consultancy.address || {}
            const location = [address.city, address.state, address.country]
              .filter(Boolean)
              .join(', ')

              console.log(consultancy,"DONE DONE")

            return (
              <div
                key={referral.id}
                className='border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white'
              >
                <div className='p-6'>
                  {/* Consultancy Info */}
                  <div className='flex items-start gap-4 mb-6 pb-4 border-b border-gray-200'>
                    <div className='flex-shrink-0'>
                      {consultancy.logo ? (
                        <img
                          src={consultancy.logo}
                          alt={consultancy.name || consultancy.title}
                          className='w-16 h-16 object-contain rounded-lg border border-gray-200'
                        />
                      ) : (
                        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200'>
                          <Building2 className='w-8 h-8 text-gray-400' />
                        </div>
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-semibold text-gray-800 mb-1'>
                        {consultancy.name || consultancy.title || 'N/A'}
                      </h3>
                      {location && (
                        <div className='flex items-center gap-2 text-sm text-gray-600'>
                          <MapPin className='w-4 h-4 text-gray-400' />
                          <span>{location}</span>
                        </div>
                      )}
                    </div>
                    <div className='flex-shrink-0'>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${referral.status === 'ACCEPTED'
                            ? 'bg-green-100 text-green-800'
                            : referral.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {referral.status || 'IN_PROGRESS'}
                      </span>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Student Name
                      </label>
                      <p className='text-gray-900'>
                        {referral.student_name || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email
                      </label>
                      <div className='flex items-center gap-2 text-gray-900'>
                        <Mail className='w-4 h-4 text-gray-400' />
                        <a
                          href={`mailto:${referral.student_email}`}
                          className='hover:text-blue-600 hover:underline'
                        >
                          {referral.student_email || 'N/A'}
                        </a>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Phone Number
                      </label>
                      <div className='flex items-center gap-2 text-gray-900'>
                        <Phone className='w-4 h-4 text-gray-400' />
                        {referral.student_phone_no ? (
                          <a
                            href={`tel:${referral.student_phone_no}`}
                            className='hover:text-blue-600 hover:underline'
                          >
                            {referral.student_phone_no}
                          </a>
                        ) : (
                          <span>N/A</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Service
                      </label>
                      <p className='text-gray-900'>
                        {consultancy.service || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {referral.student_description && (
                    <div className='mt-4 pt-4 border-t border-gray-200'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Description
                      </label>
                      <p className='text-gray-700 whitespace-pre-wrap'>
                        {referral.student_description}
                      </p>
                    </div>
                  )}

                  {/* Remarks */}
                  {referral.remarks && (
                    <div className='mt-4 pt-4 border-t border-gray-200'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Remarks
                      </label>
                      <p className='text-gray-700 whitespace-pre-wrap'>
                        {referral.remarks}
                      </p>
                    </div>
                  )}

                  {/* Submitted Date */}
                  <div className='mt-4 pt-4 border-t border-gray-200'>
                    <p className='text-xs text-gray-500'>
                      Referred on:{' '}
                      {new Date(referral.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ConsultancyReferralsPage
