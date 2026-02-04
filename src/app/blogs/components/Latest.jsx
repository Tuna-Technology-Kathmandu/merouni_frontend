'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBlogs } from '@/app/action'
import LatestBlogsShimmer from '../components/LatestBlogShimmer'
import LatestBlogs from './LatestBlogs'
import { formatDate } from '@/utils/date.util'

const Latest = ({ blogs }) => {
  // Get top 5 blogs from props
  const heroBlogs = blogs || []
  const mainBlog = heroBlogs[0]
  const sideBlogs = heroBlogs.slice(1, 5)

  if (!blogs || blogs.length === 0) {
    return null
  }



  return (
    <div className='bg-gray-50 w-full relative py-12'>
      <div className='max-w-[1600px] mx-auto px-4 sm:px-8'>
        <div className='relative mb-8'>
          <h2 className='text-3xl font-extrabold text-gray-800'>
            Latest <span className='text-[#0A70A7]'>Blogs</span>
          </h2>
          <div className='absolute -bottom-2 left-0 w-12 h-1 bg-[#0A70A7] rounded-full'></div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]'>
          {/* Main Hero Blog (Left - spans 7 cols) */}
          {mainBlog && (
            <div className='lg:col-span-7 h-full'>
              <Link href={mainBlog.slug ? `/blogs/${mainBlog.slug}` : '#'} className='group relative block w-full h-full min-h-[400px] overflow-hidden rounded-2xl'>
                <img
                  src={mainBlog.featuredImage || 'https://placehold.co/800x600'}
                  alt={mainBlog.title}
                  className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                />

                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent' />

                <div className='absolute bottom-0 left-0 p-6 md:p-8 w-full z-10'>
                  <span className='inline-block px-3 py-1 bg-[#0A70A7] text-white text-xs font-semibold rounded-md mb-3'>
                    Featured
                  </span>
                  <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-blue-100 transition-colors'>
                    {mainBlog.title}
                  </h3>
                  <div className='flex items-center text-gray-300 text-sm gap-4'>
                    <span>{formatDate(mainBlog.createdAt)}</span>
                    <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                    <span className='flex items-center gap-1 text-[#387CAE] font-medium'>
                      Read Article →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Side Grid (Right - spans 5 cols) */}
          <div className='lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 h-full'>
            {sideBlogs.map((blog, index) => (
              <Link key={index} href={blog.slug ? `/blogs/${blog.slug}` : '#'} className='h-full'>
                <LatestBlogs
                  image={blog.featuredImage || 'https://placehold.co/600x400'}
                  title={blog.title}
                  date={formatDate(blog.createdAt)}
                  description={blog.description}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Latest
