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
import {
  Phone,
  MapPin,
  Plus,
  Calendar,
  Newspaper,
  FileText,
  School,
  GraduationCap,
  Book,
  Trophy,
  Pen,
  Briefcase
} from 'lucide-react'

const AdminDashboard = () => {
  const { setHeading } = usePageHeading()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedYears, setSelectedYears] = useState([])

  useEffect(() => {
    setHeading('Welcome to Admin Dashboard')
    return () => setHeading(null)
  }, [setHeading])

  // Initial load
  useEffect(() => {
    let isMounted = true

    const loadAnalytics = async () => {
      try {
        setLoading(true)
        const res = await authFetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/analytics/admin-overview`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load analytics')
        }

        const json = await res.json()
        if (!isMounted) return

        const data = json?.data || null
        setAnalytics(data)

        // Initialize selected years from API response
        if (data?.selectedYears) {
          setSelectedYears(data.selectedYears)
        }
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

  // Reload when selected years change (only if years are already initialized)
  useEffect(() => {
    if (selectedYears.length === 0) return

    let isMounted = true

    const loadAnalytics = async () => {
      try {
        setLoading(true)
        // Build query string with years parameter
        const yearsParam = selectedYears.map((y) => `years=${y}`).join('&')
        const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/analytics/admin-overview?${yearsParam}`

        const res = await authFetch(url, { cache: 'no-store' })

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
  }, [selectedYears])

  const handleYearsChange = (years) => {
    setSelectedYears(years)
  }

  return (
    <div className='p-4 flex flex-col gap-8'>
      <div className='w-full flex flex-col gap-8'>
        {/* USER CARDS */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
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
            type='University'
            value={analytics?.totalUniversities}
            loading={loading}
          />
          <UserCard
            type='Consultancy'
            value={analytics?.totalConsultancies}
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

        {/* QUICK ACTIONS */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Quick Actions
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
            <Link
              href='/dashboard/events?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group'
            >
              <div className='p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors'>
                <Calendar className='w-5 h-5 text-blue-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-blue-600'>
                Add Event
              </span>
            </Link>

            <Link
              href='/dashboard/news?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group'
            >
              <div className='p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors'>
                <Newspaper className='w-5 h-5 text-green-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-green-600'>
                Add News
              </span>
            </Link>

            <Link
              href='/dashboard/material?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors group'
            >
              <div className='p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors'>
                <FileText className='w-5 h-5 text-purple-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-purple-600'>
                Add Material
              </span>
            </Link>

            <Link
              href='/dashboard/addCollege?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors group'
            >
              <div className='p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors'>
                <School className='w-5 h-5 text-orange-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-orange-600'>
                Add College
              </span>
            </Link>

            <Link
              href='/dashboard/program?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors group'
            >
              <div className='p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors'>
                <GraduationCap className='w-5 h-5 text-indigo-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-indigo-600'>
                Add Program
              </span>
            </Link>

            <Link
              href='/dashboard/courses?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors group'
            >
              <div className='p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors'>
                <Book className='w-5 h-5 text-teal-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-teal-600'>
                Add Course
              </span>
            </Link>

            <Link
              href='/dashboard/scholarship?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors group'
            >
              <div className='p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors'>
                <Trophy className='w-5 h-5 text-yellow-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-yellow-600'>
                Add Scholarships
              </span>
            </Link>

            <Link
              href='/dashboard/exams?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-colors group'
            >
              <div className='p-2 bg-pink-100 rounded-lg group-hover:bg-pink-200 transition-colors'>
                <Pen className='w-5 h-5 text-pink-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-pink-600'>
                Add Exams
              </span>
            </Link>

            <Link
              href='/dashboard/consultancy?add=true'
              className='flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors group'
            >
              <div className='p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors'>
                <Briefcase className='w-5 h-5 text-red-600' />
              </div>
              <span className='text-sm font-medium text-gray-700 group-hover:text-red-600'>
                Add Consultancy
              </span>
            </Link>
          </div>
        </div>

        {/* MIDDLE CHARTS */}
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='w-full lg:w-1/2 h-[450px]'>
            <Piechart data={analytics?.educationalInstitutions} />
          </div>
          <div className='w-full lg:w-1/2 h-[450px]'>
            <StudentEnrollmentGrowthChart
              data={analytics?.studentEnrollmentGrowth}
              availableYears={analytics?.availableYears || []}
              selectedYears={
                selectedYears.length > 0
                  ? selectedYears
                  : analytics?.selectedYears || []
              }
              onYearsChange={handleYearsChange}
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
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [wishlistError, setWishlistError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const loadApplications = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authFetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/referral/user/referrals`,
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

  useEffect(() => {
    let isMounted = true

    const loadWishlist = async () => {
      if (!user?.id) return

      try {
        setWishlistLoading(true)
        setWishlistError(null)
        const res = await authFetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/wishlist?user_id=${user.id}`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load wishlist')
        }

        const data = await res.json()
        if (!isMounted) return
        setWishlist(Array.isArray(data.items) ? data.items : [])
      } catch (err) {
        console.error('Error loading wishlist:', err)
        if (isMounted) {
          setWishlistError(err.message || 'Failed to load wishlist')
        }
      } finally {
        if (isMounted) {
          setWishlistLoading(false)
        }
      }
    }

    loadWishlist()

    return () => {
      isMounted = false
    }
  }, [user?.id])

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
        {/* Wishlist - 20% width (1/5 column) */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-xl shadow p-4'>
            <h2 className='text-lg font-semibold mb-2'>Your Wishlist</h2>
            <p className='text-sm text-gray-600 mb-3'>
              Colleges you&apos;ve saved for later.
            </p>

            {wishlistLoading && (
              <div className='flex justify-center items-center h-24'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500'></div>
              </div>
            )}

            {!wishlistLoading && wishlistError && (
              <p className='text-sm text-red-600'>Error: {wishlistError}</p>
            )}

            {!wishlistLoading && !wishlistError && (
              <>
                {wishlist.length === 0 ? (
                  <p className='text-sm text-gray-500'>
                    Your wishlist is empty.
                  </p>
                ) : (
                  <div className='space-y-3 max-h-[600px] overflow-y-auto'>
                    {wishlist.map((item) => (
                      <Link
                        key={item.id}
                        href={`/colleges/${item.college?.slugs || '#'}`}
                        className='block border rounded-lg p-2 hover:bg-gray-50 transition-colors'
                      >
                        <div className='flex flex-col items-center gap-2'>
                          {item.college?.college_logo ? (
                            <img
                              src={item.college.college_logo}
                              alt={item.college?.name || 'College Logo'}
                              className='w-16 h-16 object-contain rounded'
                            />
                          ) : (
                            <div className='w-16 h-16 bg-gray-100 rounded flex items-center justify-center'>
                              <span className='text-gray-400 text-xs'>
                                No Logo
                              </span>
                            </div>
                          )}
                          <p className='text-sm font-medium text-center text-gray-900 line-clamp-2'>
                            {item.college?.name || 'Unnamed College'}
                          </p>
                        </div>
                      </Link>
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
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/referral/institution/applications`,
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

  const isStudentOnly = role?.student && !role?.admin && !role?.editor

  const isInstitutionOnly =
    role?.institution && !role?.admin && !role?.editor && !role?.student

  if (isStudentOnly) {
    return <StudentDashboard />
  }

  if (isInstitutionOnly) {
    return <InstitutionDashboard />
  }

  return <AdminDashboard />
}

export default DashboardPage
