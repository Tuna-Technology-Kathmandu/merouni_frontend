// export default Blogs;
'use client'
import React from 'react'
import Header from '../components/Frontpage/Header'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import MaterialCard from './components/MaterialCard'

const Materials = () => {
  return (
    <>
      <Header />
      <Navbar />
      <MaterialCard />
      <Footer />
    </>
  )
}

export default Materials
