'use client'

import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Featured from './components/Featured'
import Body from './components/Body'
import AdLayout from '../../components/Frontpage/AdLayout'
import { useEffect, useState } from 'react'
import { getBanners } from '@/app/action'

const page = () => {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState([])

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    async function fetchData() {
      try {
        // The instruction "use getBanners action" is already fulfilled by the line below.
        // The comment about "direct fetch" might be misleading, as getBanners is imported from '@/app/action'.
        const response = await getBanners()
        if (response && response.items) {
          setBanners(response.items)
        } else {
          console.error('Failed to fetch banners:', response)
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

export default page
