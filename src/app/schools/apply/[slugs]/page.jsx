'use client'

import React, { useState, useEffect, use } from 'react'
import Navbar from '../../../../components/Frontpage/Navbar'
import Header from '../../../../components/Frontpage/Header'
import Footer from '../../../../components/Frontpage/Footer'
import ImageSection from './components/upperSection'
import FormSection from './components/formSection'
import { getCollegeBySlug } from '../../actions'

const ApplyPage = ({ params }) => {
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { slugs } = use(params)

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        console.log('Fetching college apply details for slug:', slugs)
        const collegeData = await getCollegeBySlug(slugs)

        if (collegeData) {
          setCollege(collegeData)
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
      <ImageSection college={college} loading={loading} />
      <FormSection college={college} />
      <Footer />
    </main>
  )
}

export default ApplyPage
