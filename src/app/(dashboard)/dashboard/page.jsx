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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <UserCard
          type='applied-colleges'
          value={applications.length}
          loading={loading}
        />
        <UserCard
          type='consultancy'
          value={consultancyApplications.length}
          loading={consultancyLoading}
        />
        <UserCard
          type='wishlist'
          value={wishlist.length}
          loading={wishlistLoading}
        />
      </div>

      {/* Error handling if any (optional display) */}
      {(error || consultancyError || wishlistError) && (
        <div className='space-y-2'>
           {error && <p className='text-sm text-red-600'>Applied Colleges Error: {error}</p>}
           {consultancyError && <p className='text-sm text-red-600'>Consultancy Error: {consultancyError}</p>}
           {wishlistError && <p className='text-sm text-red-600'>Wishlist Error: {wishlistError}</p>}
        </div>
      )}
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
