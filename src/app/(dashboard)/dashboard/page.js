'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import StudentEnrollmentGrowthChart from '../../../components/EnrollmentChart'
import UserCard from '../../../components/UserCard'
import Piechart from '../../../components/Piechart'
import { destr } from 'destr'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'

const AdminDashboard = () => {
  const { setHeading } = usePageHeading()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setHeading('Welcome to Admin Dashboard')
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    let isMounted = true

    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const res = await authFetch(
          `${process.env.baseUrl}${process.env.version}/analytics/admin-overview`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load analytics')
        }

        const json = await res.json()
        if (!isMounted) return
        setAnalytics(json?.data || null)
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className='p-4 flex flex-col gap-8'>
      <div className='w-full flex flex-col gap-8'>
        {/* USER CARDS */}
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard
            type='Users'
            value={analytics?.totalUsers}
            loading={loading}
          />
          <UserCard
            type='College'
            value={analytics?.totalColleges}
            loading={loading}
          />
          <UserCard
            type='Agents'
            value={analytics?.totalAgents}
            loading={loading}
          />
          <UserCard
            type='Events'
            value={analytics?.totalEvents}
            loading={loading}
          />
          <UserCard
            type='Referrals'
            value={analytics?.totalReferrals}
            loading={loading}
          />
        </div>
        {/* MIDDLE CHARTS */}
        <div className='flex flex-col gap-8'>
          <div className='w-full h-[450px]'>
            <Piechart data={analytics?.educationalInstitutions} />
          </div>
          <div className='w-full h-[450px]'>
            <StudentEnrollmentGrowthChart
              data={analytics?.studentEnrollmentGrowth}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const StudentDashboard = () => {
  const user = useSelector((state) => state.user?.data)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadApplications = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authFetch(
          `${process.env.baseUrl}${process.env.version}/referral/user/referrals`,
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
    <div className='p-4 space-y-6'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='text-2xl font-bold'>
            Welcome{user?.firstName ? `, ${user.firstName}` : ''} 👋
          </h1>
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-5'>
        {/* Applied Colleges - 80% width (4/5 columns) */}
        <div className='lg:col-span-4'>
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
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <p className='font-semibold text-gray-900'>
                              {app?.referralCollege?.name || 'Unnamed College'}
                            </p>
                            {app?.status && (
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  app.status === 'ACCEPTED'
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
                          <p className='text-xs text-gray-500 mt-1'>
                            {app?.student_name}
                            {app?.student_email
                              ? ` • ${app.student_email}`
                              : ''}
                          </p>
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
      </div>
    </div>
  )
}

const InstitutionDashboard = () => {
  const user = useSelector((state) => state.user?.data)
  const [applicationsCount, setApplicationsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadApplicationsCount = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authFetch(
          `${process.env.baseUrl}${process.env.version}/referral/institution/applications`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load applications')
        }

        const data = await res.json()
        if (!isMounted) return
        const applications = Array.isArray(data) ? data : []
        setApplicationsCount(applications.length)
      } catch (err) {
        console.error('Error loading applications:', err)
        if (isMounted) {
          setError(err.message || 'Failed to load applications')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadApplicationsCount()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className='p-4 space-y-6'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='text-2xl font-bold'>
            Welcome{user?.firstName ? `, ${user.firstName}` : ''} 👋
          </h1>
          <p className='text-gray-600 text-sm mt-1'>
            Manage applications for your institution.
          </p>
        </div>
      </div>

      <div className='flex gap-4 justify-between flex-wrap'>
        <UserCard
          type='Applications'
          value={applicationsCount}
          loading={loading}
        />
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
          <p className='text-sm text-red-600'>Error: {error}</p>
        </div>
      )}
    </div>
  )
}

const DashboardPage = () => {
  const rawRole = useSelector((state) => state.user?.data?.role)
  const role =
    typeof rawRole === 'string' ? destr(rawRole) || {} : rawRole || {}

  const isStudentOnly =
    role?.student && !role?.admin && !role?.['super-admin'] && !role?.editor

  const isInstitutionOnly =
    role?.institution &&
    !role?.admin &&
    !role?.['super-admin'] &&
    !role?.editor &&
    !role?.student

  if (isStudentOnly) {
    return <StudentDashboard />
  }

  if (isInstitutionOnly) {
    return <InstitutionDashboard />
  }

  return <AdminDashboard />
}

export default DashboardPage
