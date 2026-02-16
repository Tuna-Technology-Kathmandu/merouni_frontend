'use client'
import React, { useState, useEffect } from 'react'
// import AdLayout from '../../components/Frontpage/AdLayout'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
// import Featured from './components/Featured'
import Body from './components/Body'

const UniversityPage = () => {
  return (
    <>
      <Header />
      <Navbar />
      {/* <Featured /> */}
      <Body />
      <Footer />
    </>
  )
}

export default UniversityPage
