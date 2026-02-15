'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { Phone, MapPin, Handshake } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import QuickActions from '@/ui/organisms/admin-dashboard/home/QuickActions'
import AnalyticsCards from '@/ui/organisms/admin-dashboard/home/AnalyticsCards'
import TopAgentsTable from '@/ui/organisms/admin-dashboard/home/TopAgentsTable'
import DashboardCharts from '@/ui/organisms/admin-dashboard/home/DashboardCharts'
import UserCard from '@/ui/molecules/cards/UserCard'
import AgentsListModal from '@/ui/organisms/admin-dashboard/home/AgentsListModal'

const AdminDashboard = () => {
  const { setHeading } = usePageHeading()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedYears, setSelectedYears] = useState([])
  const [topAgents, setTopAgents] = useState([])
  const [topAgentsLoading, setTopAgentsLoading] = useState(true)
  const [isAgentsModalOpen, setAgentsModalOpen] = useState(false)

  useEffect(() => {
    setHeading('Dashboard')
    return () => setHeading(null)
  }, [setHeading])

  // Load analytics data (Initial and when selectedYears change)
  useEffect(() => {
    let isMounted = true

    const loadAnalytics = async () => {
      try {
        setLoading(true)
        // Build query string with years parameter if selectedYears exist
        const yearsParam =
          selectedYears.length > 0
            ? '?' + selectedYears.map((y) => `years=${y}`).join('&')
            : ''
        const url = `${process.env.baseUrl}/analytics/admin-overview${yearsParam}`

        const res = await authFetch(url, { cache: 'no-store' })

        if (!res.ok) {
          throw new Error('Failed to load analytics')
        }

        const json = await res.json()
        if (!isMounted) return

        const data = json?.data || null
        setAnalytics(data)

        // Initialize selected years from API response if not already set
        if (selectedYears.length === 0 && data?.selectedYears) {
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
  }, [selectedYears])

  // Load top agents
  useEffect(() => {
    let isMounted = true

    const loadTopAgents = async () => {
      try {
        setTopAgentsLoading(true)
        const res = await authFetch(
          `${process.env.baseUrl}/referral/top-agents?limit=5`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load top agents')
        }

        const json = await res.json()
        if (!isMounted) return

        setTopAgents(json.data?.topAgents || [])
      } catch (error) {
        console.error('Error loading top agents:', error)
      } finally {
        if (isMounted) {
          setTopAgentsLoading(false)
        }
      }
    }

    loadTopAgents()

    return () => {
      isMounted = false
    }
  }, [])

  const handleYearsChange = (years) => {
    setSelectedYears(years)
  }

  return (
    <div className='p-4 flex flex-col gap-8'>
      <div className='w-full flex flex-col gap-8'>
        {/* ANALYTICS CARDS */}
        <AnalyticsCards analytics={analytics} loading={loading} />

        {/* QUICK ACTIONS */}
        <QuickActions />

        {/* DASHBOARD CHARTS */}
        <DashboardCharts
          analytics={analytics}
          selectedYears={selectedYears}
          onYearsChange={handleYearsChange}
        />

        {/* TOP AGENTS TABLE */}
        <TopAgentsTable
          topAgents={topAgents}
          loading={topAgentsLoading}
          onViewAll={() => setAgentsModalOpen(true)}
        />

        <AgentsListModal
          isOpen={isAgentsModalOpen}
          onClose={() => setAgentsModalOpen(false)}
        />
      </div>
    </div>
  )
}

const StudentDashboard = () => {
  const { setHeading } = usePageHeading()
  const user = useSelector((state) => state.user?.data)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const [wishlistError, setWishlistError] = useState(null)
  const [consultancyApplications, setConsultancyApplications] = useState([])
  const [consultancyLoading, setConsultancyLoading] = useState(true)
  const [consultancyError, setConsultancyError] = useState(null)

  useEffect(() => {
    setHeading('Dashboard')
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

  useEffect(() => {
    let isMounted = true

    const loadWishlist = async () => {
      if (!user?.id) return

      try {
        setWishlistLoading(true)
        setWishlistError(null)
        const res = await authFetch(
          `${process.env.baseUrl}/wishlist?user_id=${user.id}`,
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

  useEffect(() => {
    let isMounted = true

    const loadConsultancyApplications = async () => {
      try {
        setConsultancyLoading(true)
        setConsultancyError(null)
        const res = await authFetch(
          `${process.env.baseUrl}/consultancy-application/user/applications`,
          { cache: 'no-store' }
        )

        if (!res.ok) {
          throw new Error('Failed to load consultancy applications')
        }

        const data = await res.json()
        if (!isMounted) return
        setConsultancyApplications(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error loading consultancy applications:', err)
        if (isMounted) {
          setConsultancyError(err.message || 'Failed to load consultancy applications')
        }
      } finally {
        if (isMounted) {
          setConsultancyLoading(false)
        }
      }
    }

    loadConsultancyApplications()

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

          <div className='bg-white rounded-xl shadow p-4 mt-6'>
            <h2 className='text-lg font-semibold mb-2'>
              Your Applied Consultancies
            </h2>
            <p className='text-sm text-gray-600 mb-3'>
              Track your expert consultation requests.
            </p>

            {consultancyLoading && (
              <div className='flex justify-center items-center h-24'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500'></div>
              </div>
            )}

            {!consultancyLoading && consultancyError && (
              <p className='text-sm text-red-600'>Error: {consultancyError}</p>
            )}

            {!consultancyLoading && !consultancyError && (
              <>
                {consultancyApplications.length === 0 ? (
                  <p className='text-sm text-gray-500'>
                    You haven&apos;t applied to any consultancies yet.
                  </p>
                ) : (
                  <div className='space-y-3'>
                    {consultancyApplications.map((app) => (
                      <div
                        key={app.id}
                        className='flex flex-col md:flex-row md:items-center justify-between border rounded-lg px-3 py-3 gap-2'
                      >
                        <div className='flex-1 flex items-start gap-3'>
                          <div className='flex-shrink-0'>
                            {app?.consultancy?.logo ? (
                              <img
                                src={app.consultancy.logo}
                                alt={app?.consultancy?.title || 'Logo'}
                                className='w-12 h-12 object-contain rounded'
                              />
                            ) : (
                              <div className='w-12 h-12 bg-gray-100 rounded flex items-center justify-center'>
                                <Handshake className='w-6 h-6 text-gray-400' />
                              </div>
                            )}
                          </div>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-1'>
                              <p className='font-semibold text-gray-900'>
                                {app?.consultancy?.title || 'Unnamed Consultancy'}
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

                            <div className='text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2'>
                              {app?.consultancy?.address && (
                                <span className='flex items-center gap-1'>
                                  <MapPin className='w-3 h-3' />
                                  {typeof app.consultancy.address === 'string'
                                    ? app.consultancy.address
                                    : Array.isArray(app.consultancy.address)
                                      ? app.consultancy.address[0]?.city || app.consultancy.address[0]
                                      : 'Address listed'}
                                </span>
                              )}
                            </div>

                            {app?.createdAt && (
                              <p className='text-xs text-gray-500 mt-1'>
                                Applied:{' '}
                                {new Date(app.createdAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        {app?.consultancy?.slugs && (
                          <Link
                            href={`/consultancy/${app.consultancy.slugs}`}
                            className='inline-flex items-center text-sm font-medium text-blue-600 hover:underline'
                          >
                            View Consultancy
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
  const { setHeading } = usePageHeading()
  const user = useSelector((state) => state.user?.data)
  const [applicationsCount, setApplicationsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setHeading('Dashboard')
  }, [setHeading])

  useEffect(() => {
    let isMounted = true

    const loadApplicationsCount = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await authFetch(
          `${process.env.baseUrl}/referral/institution/applications`,
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

const ConsultancyDashboard = () => {
  const { setHeading } = usePageHeading()
  const user = useSelector((state) => state.user?.data)
  const [applicationsCount, setApplicationsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setHeading('Dashboard')
  }, [setHeading])

  useEffect(() => {
    let isMounted = true

    const loadApplicationsCount = async () => {
      if (!user?.consultancyId) return

      try {
        setLoading(true)
        setError(null)
        const res = await authFetch(
          `${process.env.baseUrl}/consultancy-application/mine`,
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
  }, [user?.consultancyId])

  return (
    <div className='p-4 space-y-6'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h1 className='text-2xl font-bold'>
            Welcome{user?.firstName ? `, ${user.firstName}` : ''} 👋
          </h1>
          <p className='text-gray-600 text-sm mt-1'>Manage your consultancy.</p>
        </div>
      </div>

      <div className='flex gap-4 justify-between flex-wrap'>
        <UserCard
          type='Total Applications'
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
  const rawRole = useSelector((state) => state.user?.data?.roles || state.user?.data?.role)
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

  if (role?.consultancy) {
    return <ConsultancyDashboard />
  }

  else if (role?.admin) {
    return <AdminDashboard />
  }

  return <>Loading...</>
}

export default DashboardPage
