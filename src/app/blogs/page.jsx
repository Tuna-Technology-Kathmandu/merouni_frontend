import React from 'react'
import Header from '../components/Frontpage/Header'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import Latest from './components/Latest'
import FeaturedBlogs from './components/FeaturedBlogs'

const Blogs = () => {
  return (
    <>
      <Header />
      <Navbar />
      <Latest />
      <div className='px-4 py-4'>
        <FeaturedBlogs />
      </div>
      <Footer />
    </>
  )
}

export default Blogs
