'use client'

import React, { useState, useEffect, use } from 'react'
import Navbar from '../../../../components/Frontpage/Navbar'
import Header from '../../../../components/Frontpage/Header'
import Footer from '../../../../components/Frontpage/Footer'
import ApplyImageSection from './components/ApplyUpperSection'
import ApplyFormSection from './components/ApplyFormSection'
import { getSchoolBySlug } from '../../actions'

const ApplyPage = ({ params }) => {
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { slugs } = use(params)

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const schoolData = await getSchoolBySlug(slugs)

        if (schoolData) {
          setSchool(schoolData)
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
  }, [slugs])

  return (
    <main className='w-full'>
      <Header />
      <Navbar />
      <ApplyImageSection college={college} loading={loading} />
      <ApplyFormSection college={college} />
      <Footer />
    </main>
  )
}

export default ApplyPage
