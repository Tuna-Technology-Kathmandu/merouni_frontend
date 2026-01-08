'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Footer from '../../components/Frontpage/Footer'
import { getMaterialCategories } from './action'
import CategoryGrid from './components/CategoryGrid'

const Materials = () => {
  const router = useRouter()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getMaterialCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryClick = (category) => {
    const categoryId = category.id === 'unlisted' ? 'unlisted' : category.id
    router.push(`/materials/category/${categoryId}`)
  }

  return (
    <>
      <Header />
      <Navbar />
      <div className='flex flex-col max-w-[1600px] mx-auto px-8 mt-10'>
        {!loading && (
          <div className='text-center mb-12'>
            <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
              Explore Our <span className='text-[#0A70A7]'>Materials</span>
            </h1>
            <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
              Discover a materials to help you achieve your academic and career
              goals.
            </p>
          </div>
        )}
        <CategoryGrid
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      <Footer />
    </>
  )
}

export default Materials
