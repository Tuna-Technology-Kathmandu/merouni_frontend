'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import Header from '../components/Frontpage/Header'
import Featured from './components/Featured'
import Body from './components/Body'
import { getBanners } from '../action'
import AdLayout from '../components/Frontpage/AdLayout'

const Page = () => {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState([])
  const [error, setError] = useState('') // Added error state to handle errors

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await getBanners()
      setBanners(response.items)
    } catch (error) {
      console.error('Error fetching banners:', error)
      setError('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  console.log('parent bnner', banners)

  return (
    <>
      <Header />
      <Navbar />
      <AdLayout banners={banners} size='medium' number={3} loading={loading} />
      <Featured />
      <Body />
      <Footer />
    </>
  )
}

export default Page
