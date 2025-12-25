'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Frontpage/Navbar'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import ImageSection from './components/upperSection'
import Syllabus from './components/syllabus'
import ApplyNow from './components/applyNow'
import RelatedCourses from './components/RelatedCourses'

const CourseDescription = () => {
  return (
    <>
      <div>
        <Header />
        <Navbar />
        {/* <AdLayout banners={banner} size="medium" number={3} /> */}
        <ImageSection />
        <Syllabus />
        <ApplyNow />
        <RelatedCourses />
        <Footer />
      </div>
    </>
  )
}

export default CourseDescription
