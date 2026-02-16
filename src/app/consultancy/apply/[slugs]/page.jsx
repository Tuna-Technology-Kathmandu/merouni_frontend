'use client'

import React, { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/Frontpage/Header'
import Navbar from '../../../../components/Frontpage/Navbar'
import FormSection from './components/formSection'
import { getConsultancyBySlug, checkIfConsultancyApplied } from '../../actions'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import ActionCard from '@/ui/molecules/ActionCard'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Button } from '@/ui/shadcn/button'
import { THEME_BLUE } from '@/constants/constants'

const ApplyPage = ({ params }) => {
  const router = useRouter()
  const user = useSelector((state) => state.user?.data)
  const headerRef = useRef(null)
  const [consultancy, setConsultancy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { slugs } = use(params)
  const [hasApplied, setHasApplied] = useState(false)

  // Parse user role
  const userRole = user?.role ? (typeof user.role === 'string' ? JSON.parse(user.role) : user.role) : {}

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          setIsAuthenticated(true)
          const data = await getConsultancyBySlug(slugs)
          if (data) {
            setConsultancy(data)
            // Check if already applied
            if (user?.id && data.id) {
              const status = await checkIfConsultancyApplied(data.id)
              if (status.hasApplied) {
                setHasApplied(true)
              }
            }
          }
        } else {
          setIsAuthenticated(false)
          // Still fetch consultancy details to show the name in ActionCard if needed
          const data = await getConsultancyBySlug(slugs)
          if (data) {
            setConsultancy(data)
          }
        }
      } catch (error) {
        console.error('Error in checkAuthAndFetchData:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slugs) {
      checkAuthAndFetchData()
    }
  }, [slugs, user?.id])

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return (
        <ActionCard
          variant='centered'
          icon={<CheckCircle2 className='w-full h-full text-blue-500' />}
          title='Sign in to Apply'
          description={
            <>
              Please login or create an account to submit your application for{' '}
              <span className='font-semibold text-gray-900'>
                {consultancy?.name || 'this consultancy'}
              </span>
              .
            </>
          }
        >
          <Link href='/login'>
            <Button
              variant='outline'
              className='min-w-[160px] h-12 text-base font-medium'
            >
              Login
            </Button>
          </Link>
          <Link href='/sign-in?mode=signup'>
            <Button
              className='min-w-[160px] h-12 text-base font-medium text-white shadow-md'
              style={{ backgroundColor: THEME_BLUE }}
            >
              Sign Up
            </Button>
          </Link>
        </ActionCard>
      )
    }

    // Role-based restrictions
    if (userRole?.admin) {
      return (
        <ActionCard
          variant='centered'
          icon={<CheckCircle2 className='w-full h-full text-red-500' />}
          title='Admin Access'
          description='You are logged in as an Admin. Admins cannot submit consultancy applications.'
        >
          <Link href='/dashboard'>
            <Button
              className='min-w-[160px] h-12 text-base font-medium text-white shadow-md'
              style={{ backgroundColor: THEME_BLUE }}
            >
              Go to Dashboard
            </Button>
          </Link>
        </ActionCard>
      )
    }

    if (userRole?.agent) {
      return (
        <ActionCard
          variant='centered'
          icon={<CheckCircle2 className='w-full h-full text-orange-500' />}
          title='Agent Access'
          description='You are logged in as an Agent. Agents are not eligible to apply for consultancies directly.'
        >
          <Link href='/dashboard'>
            <Button
              className='min-w-[160px] h-12 text-base font-medium text-white shadow-md'
              style={{ backgroundColor: THEME_BLUE }}
            >
              Go to Dashboard
            </Button>
          </Link>
        </ActionCard>
      )
    }

    if (hasApplied) {
      return (
        <ActionCard
          variant='centered'
          icon={<CheckCircle2 className='w-full h-full' />}
          title='Already Applied!'
          description={
            <>
              You have already submitted an application for{' '}
              <span className='font-semibold text-gray-900'>
                {consultancy?.name}
              </span>
              . You can track your application status in your dashboard.
            </>
          }
        >
          <Link href='/'>
            <Button
              variant='outline'
              className='min-w-[160px] h-12 text-base font-medium'
            >
              Go Home
            </Button>
          </Link>
          <Link href='/dashboard'>
            <Button
              className='min-w-[160px] h-12 text-base font-medium text-white shadow-md transition-all hover:-translate-y-0.5'
              style={{ backgroundColor: THEME_BLUE }}
            >
              Go to Dashboard
            </Button>
          </Link>
        </ActionCard>
      )
    }

    return <FormSection consultancy={consultancy} />
  }

  return (
    <>
      <main className='w-full min-h-screen bg-gray-50 flex flex-col'>
        <div
          ref={headerRef}
          className='sticky top-0 z-50 bg-white border-b border-gray-100'
        >
          <Header />
          <Navbar />
        </div>

        <div className='flex-1 py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-7xl mx-auto'>
            {/* Back Button */}
            <div className='mb-8 max-w-2xl mx-auto'>
              <button
                onClick={() => router.back()}
                className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium'
              >
                <ArrowLeft className='w-4 h-4' />
                <span>Back</span>
              </button>
            </div>

            {/* Content Section - Centered */}
            <div className='flex justify-center'>{renderContent()}</div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ApplyPage
