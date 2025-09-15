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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(true)

  function slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // spaces → -
      .replace(/[^\w\-]+/g, '') // remove non-word chars
      .replace(/\-\-+/g, '-') // collapse multiple -
  }

  useEffect(() => {
    const fetchDegree = async () => {
      try {
        const resolvedParams = await params
        const slugs = decodeURIComponent(resolvedParams.slugs)
        const finalSlug = slugify(slugs)
        fetchDegreeDetails(finalSlug)
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

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div>
        <Header />
        <Navbar />
        <ImageSection degree={degree} />
        <Syllabus degree={degree} />
        <CollegeTeach degree={degree} />
        {/* <ApplyNow degree={degree} /> */}
        <RelatedCourses degree={degree} />
        <Footer />
      </div>
    </>
  )
}

export default CourseDescription
