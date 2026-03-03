'use client'
import React from 'react'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Featured from './components/Featured'
import Body from './components/Body'

const Page = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Featured />
      <Body />
      <Footer />
    </>
  )
}

export default Page
