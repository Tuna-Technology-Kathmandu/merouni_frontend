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
      <div className='flex flex-col max-w-[1600px] mx-auto px-8 mt-12'>
        <div className='text-center mb-16'>
          <h1 className='text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight'>
            Academic <span className='text-[#0A70A7]'>Library</span>
          </h1>
          <div className='w-20 h-1.5 bg-[#0A70A7] mx-auto mt-4 rounded-full'></div>
          <p className='mt-6 text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed'>
            Access a comprehensive collection of curated study materials, guides, and resources designed to accelerate your learning journey.
          </p>
        </div>

        <CategoryGrid
          categories={categories}
          onCategoryClick={handleCategoryClick}
          loading={loading}
        />
      </div>
      <Footer />
    </>
  )
}

export default Materials
