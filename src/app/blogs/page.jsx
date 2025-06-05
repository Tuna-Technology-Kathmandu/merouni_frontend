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
      <div>
        <>
          {/* <Latest /> */}
          <FeaturedBlogs />
        </>
      </div>
      <Footer />
    </>
  )
}

export default Blogs
