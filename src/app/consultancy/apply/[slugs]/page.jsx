'use client'

import React, { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/Frontpage/Header'
import Navbar from '../../../../components/Frontpage/Navbar'
import FormSection from './components/formSection'
import { getConsultancyBySlug } from '../../actions'
import { ArrowLeft } from 'lucide-react'

const ApplyPage = ({ params }) => {
  const router = useRouter()
  const headerRef = useRef(null)
  const [consultancy, setConsultancy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { slugs } = use(params)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getConsultancyBySlug(slugs)
        if (data) {
          setConsultancy(data)
        } else {
          setError('No data found')
        }
      } catch (error) {
        console.error('Error fetching consultancy details:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (slugs) {
      fetchDetails()
    }
  }, [slugs])

  return (
    <>
      <main className='w-full min-h-screen bg-gray-50 flex flex-col'>
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
              <FormSection consultancy={consultancy} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ApplyPage
