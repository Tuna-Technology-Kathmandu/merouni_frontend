'use client'
import React, { useState, useEffect } from 'react'
import { getNewsBySlug, getRelatedNews } from '../action'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Hero from './components/Hero'
import Description from './components/Description'
import Cardlist from './components/Cardlist'
import Loading from '../../components/Loading'

const NewsDetailsPage = ({ params }) => {
  const [news, setNews] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs // No need to await params.slugs
        console.log('NEws slug:', slugs)
        // const [newsData, allNews] = await Promise.all([
        //   getNewsBySlug(slugs),
        //   getRelatedNews(),
        // ]);
        const newsData = await getNewsBySlug(slugs)

        setNews(newsData.blog || null) // Set eventData directly
        // setRelatedNews(allNews);
        setRelatedNews(newsData.similarBlogs || [])
        // console.log("News Description:",news)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsDetails()
  }, [params]) // Add params.slugs to dependency array

  useEffect(() => {
    console.log('News:', news)
  }, [news])

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
          <div className='p-12 px-18 flex w-full gap-16'>
            <Description news={news} />
            {/* <Cardlist news={relatedNews} /> */}
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}

export default NewsDetailsPage
