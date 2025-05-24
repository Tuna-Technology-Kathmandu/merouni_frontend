'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import ImageSection from './components/upperSection'
import Syllabus from './components/syllabus'
import ApplyNow from './components/applyNow'
import RelatedCourses from './components/RelatedCourses'
import { getDegreeBySlug } from '../actions'
import Loading from '../../components/Loading'
import CollegeTeach from './components/collegeTeach'

const CourseDescription = ({ params }) => {
  const [degree, setDegree] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(true)

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        console.log('SLUGS degree:', slugs)
        fetchDegreeDetails(slugs)
      } catch (error) {
        console.error('Error resolving params:', error)
      }
    }
    fetchDegree()
  }, [])

  const fetchDegreeDetails = async (slugs) => {
    try {
      console.log('Fetching degree details for slug:', slugs)
      const degreeData = await getDegreeBySlug(slugs)
      console.log('Fetched data:', degreeData)

      if (degreeData) {
        setDegree(degreeData)
      } else {
        setError('No data found')
      }
    } catch (error) {
      console.error('Error fetching degree details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Degree data:', degree)
  }, [degree])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div>
        <Header />
        <Navbar />
        <ImageSection degree={degree} />
        <CollegeTeach degree={degree} />
        <Syllabus degree={degree} />
        {/* <ApplyNow degree={degree} /> */}
        <RelatedCourses degree={degree} />
        <Footer />
      </div>
    </>
  )
}

export default CourseDescription
