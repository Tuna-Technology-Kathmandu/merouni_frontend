'use client'

import { useRouter } from 'next/navigation'
import { use, useEffect, useRef, useState } from 'react'
import Header from '../../../../../components/Frontpage/Header'
import Navbar from '../../../../../components/Frontpage/Navbar'
import { getCollegeBySlug } from '../../../actions'
import FormSection from './components/formSection'
import ActionCard from '@/ui/molecules/ActionCard'

import { THEME_BLUE } from '@/constants/constants'
import { Button } from '@/ui/shadcn/button'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { checkIfApplied } from '../../../actions'



const ApplyPage = ({ params }) => {
  const router = useRouter()
  const user = useSelector((state) => state.user?.data)
  const headerRef = useRef(null)
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { slugs, rest } = use(params)
  const id = rest?.[0]


  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const collegeData = await getCollegeBySlug(slugs)
        if (collegeData) {
          setCollege(collegeData)
          // Check if already applied
          console.log(user?.id && collegeData.id, "user?.id && collegeData.id")
          if (user?.id && collegeData.id) {
            console.log("hi hi","RNNING",collegeData.id, user.id)
            const status = await checkIfApplied(collegeData.id, user.id)
            console.log(status, "TANKS")
            if ( status.hasApplied) {
              setHasApplied(true)
            }
          }
        } else {
          setError('No data found')
        }
      } catch (error) {
        console.error('Error fetching college details:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (slugs) {
      fetchCollegeDetails()
    }
  }, [slugs, user?.id])

  return (
    <>
      <style jsx global>{`
        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <main className='w-full min-h-screen bg-gray-50 flex flex-col'>
        {/* Header and Navbar */}
        <div ref={headerRef} className='sticky top-0 z-50 bg-white border-b border-gray-100'>
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

            {/* Form Section - Centered */}
            <div className='flex justify-center'>
              {hasApplied ? (
                <ActionCard
                  variant='centered'
                  icon={<CheckCircle2 className='w-full h-full' />}
                  title='Already Applied!'
                  description={
                    <>
                      You have already submitted an application for{' '}
                      <span className='font-semibold text-gray-900'>
                        {college?.name}
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
              ) : (
                <FormSection college={college} id={id} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


export default ApplyPage
