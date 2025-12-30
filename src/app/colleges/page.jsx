'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Featured from './components/Featured'
import Body from './components/Body'
import AdLayout from '../../components/Frontpage/AdLayout'

const Page = () => {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState([])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    async function fetchData() {
      try {
        // Use direct fetch instead of server action to avoid SSR issues
        const response = await fetch(
          `${process.env.baseUrl}${process.env.version}/banner?page=1&limit=100`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          }
        )

        if (response.ok) {
          const data = await response.json()
          setBanners(data.items || [])
        } else {
          console.error('Failed to fetch banners:', response.statusText)
          setBanners([])
        }
      } catch (err) {
        console.error('Error loading banners', err)
        setBanners([])
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
