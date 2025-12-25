'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Featured from './components/Featured'
import Body from './components/Body'
import { getBanner } from '../[[...home]]/action'
import AdLayout from '../../components/Frontpage/AdLayout'

const Page = () => {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBanner(1, 99999999)
        setBanners(data.items)
      } catch (err) {
        console.error('Error loading banners', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Header />
      <Navbar />
      <AdLayout banners={banners} size='medium' loading={loading} />
      <Featured />
      <Body />
      <Footer />
    </>
  )
}

export default Page
