'use client'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Frontpage/Navbar'
import Header from '../../components/Frontpage/Header'
import Footer from '../../components/Frontpage/Footer'
import BannerLayout from '../../components/Frontpage/BannerLayout'
import FeaturedAdmission from '../../components/Frontpage/FeaturedAdmission'
// import LargeBanner from '../components/Frontpage/LargeBanner'
import FeaturedDegree from '../../components/Frontpage/FeaturedDegree'
import DisciplineList from '../../components/Frontpage/DisciplineList'
import Colleges from '../../components/Frontpage/Colleges'
import CollegeRankings from '../../components/Frontpage/CollegeRankings'
import Degree from '../../components/Frontpage/Degree'
import Event from '../../components/Frontpage/Event'
import ScrollToTop from '../../ui/molecules/ScrollToTop'
import SideBanner from '../../components/Frontpage/SideBanner'

const Page = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    async function fetchData() {
      try {
        // Use direct fetch instead of server action to avoid SSR issues
        const response = await fetch(
          `${process.env.baseUrl}/banner?page=1&limit=100`,
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
      <div className='py-2 md:py-4'>
        <div className='container px-4 sm:px-6 md:px-8 mx-auto'>
          <BannerLayout banners={banners} loading={loading} />
          <div className='flex gap-4 md:gap-6'>
            <div className='flex flex-col md:w-4/5 w-full sm:w-full'>
              <FeaturedAdmission />
            </div>
            <div className='w-full md:w-1/5 hidden md:block mt-4 md:mt-6'>
              <SideBanner banners={banners} loading={loading} />
            </div>
          </div>
        </div>
      </div>
      <div className='w-full md:w-1/5 block md:hidden mt-4 px-4'>
        <SideBanner banners={banners} loading={loading} />
      </div>

      {/* Top Picks is already above in FeaturedAdmission */}
      {/* Reordered sections: Top Picks, College Rankings, Events, Degree, Field of Study */}
      <CollegeRankings />
      <Event />
      <FeaturedDegree />
      <DisciplineList />
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default Page
