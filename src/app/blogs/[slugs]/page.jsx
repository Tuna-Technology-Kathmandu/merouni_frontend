'use client'
import services from '@/app/apiService'
import { useEffect, useState } from 'react'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../ui/molecules/Loading'
import Banner from './components/Banner'
import Description from './components/Description'
import Hero from './components/Hero'
import SmallCardList from './components/SmallCardList'

const NewsDetailsPage = ({ params }) => {
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        const newsData = await services.blogs.getBySlug(slugs)

        setBlog(newsData.blog || null) 
        setRelatedBlogs(newsData.similarBlogs || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogDetails()
  }, [params]) 

  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <Header />
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <>
          <Hero blog={blog} />
          <div className='px-16 max-sm:px-9 pt-10 max-w-[1600px] mx-auto'>
            <Banner />
          </div>
          <div className=' px-16 max-sm:px-9 max-w-[1600px] mx-auto mt-12'>
            <Description blog={blog} />
          </div>
          <div className='px-16 max-sm:px-9 max-w-[1600px] mx-auto mt-12'>
            {
              blog?.pdf_file && (
                  <a href={blog.pdf_file} target='_blank' rel='noopener noreferrer' className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'>
                      View PDF
                  </a>
              )
            }
          </div>  

{/* BIG BREAK LINE  */}
<div className='h-[1px] bg-gray-200 my-12'></div>
          <div className=' px-16 max-sm:px-9 my-14 max-w-[1600px] mx-auto'>
            <SmallCardList blogs={relatedBlogs} />
          </div>
        </>
      )}

      <Footer />
    </div>
  )
}

export default NewsDetailsPage
