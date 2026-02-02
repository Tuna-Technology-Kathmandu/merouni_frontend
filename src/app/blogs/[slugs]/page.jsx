'use client'
import React, { useState, useEffect } from 'react'
import services from '@/app/apiService'
import Navbar from '../../../components/Frontpage/Navbar'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Hero from './components/Hero'
import Description from './components/Description'
import Cardlist from './components/Cardlist'
import Loading from '../../../ui/molecules/Loading'
import SmallCardList from './components/SmallCardList'
import Banner from './components/Banner'

const NewsDetailsPage = ({ params }) => {
  const [news, setNews] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        const newsData = await services.blogs.getBySlug(slugs)

        setNews(newsData.blog || null) // Set eventData directly
        setRelatedNews(newsData.similarBlogs || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetails()
  }, [params]) // Add params.slugs to dependency array

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>
  // if (!event) return <div>No event found</div>;

  return (
    <div>
      <Header />
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <Hero news={news} />
          <div className='px-16 max-sm:px-9 pt-10 max-w-[1600px] mx-auto'>
            <Banner />
          </div>
          <div className=' px-16 max-sm:px-9 max-w-[1600px] mx-auto mt-12'>
            <Description news={news} />
            {/* <Cardlist news={relatedNews} /> */}
          </div>

          <div className=' px-16 max-sm:px-9 my-14 max-w-[1600px] mx-auto'>
            <SmallCardList news={relatedNews} />
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}

export default NewsDetailsPage
