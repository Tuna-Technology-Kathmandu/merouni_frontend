'use client'

import React from 'react'
import BlogCard from '@/ui/molecules/cards/BlogCard'
import Pagination from './Pagination'
import FeaturedBlogsShimmer from './FeaturedBlogShimmer'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import { formatDate } from '@/utils/date.util'

const FeaturedBlogs = ({ blogs, loading, pagination, onPageChange, searchQuery }) => {
  const truncateString = (str, maxLength) => {
    if (str?.length > maxLength) {
      return str.slice(0, maxLength) + '...'
    }
    return str || ''
  }

  // Split blogs into featured and regular
  const featuredBlogs = blogs?.filter(blog => blog.is_featured) || []
  const regularBlogs = blogs?.filter(blog => !blog.is_featured) || []

  // Helper to render a grid of blogs
  const renderBlogGrid = (title, blogList) => (
    <div className="mb-12">
      <div className='flex items-center gap-2 mb-6 border-l-4 border-[#0A70A7] pl-4'>
        <h2 className='text-2xl font-bold text-gray-800'>{title}</h2>
        <span className='px-2 py-0.5 rounded-full bg-blue-50 text-[#0A70A7] text-xs font-semibold'>
          {blogList.length}
        </span>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full'>
        {blogList.map((blog, index) => (
          <Link href={`/blogs/${blog.slug}`} key={index} className='h-full'>
            <div className='h-full'>
              <BlogCard
                date={formatDate(blog.createdAt)}
                description={truncateString(blog.description, 100)}
                image={blog.featuredImage || 'https://placehold.co/600x400'}
                title={truncateString(blog.title, 60)}
                slug={blog.slug}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <div className='max-w-[1600px] mx-auto px-4 sm:px-8 mb-8'>
      {loading ? (
        <FeaturedBlogsShimmer />
      ) : blogs && blogs.length > 0 ? (
        <>
          {/* Featured Section - Only show when not searching or if featured items match search */}
          {featuredBlogs.length > 0 && renderBlogGrid("Featured Blogs", featuredBlogs)}
          
          {/* Regular Section */}
          {regularBlogs.length > 0 && renderBlogGrid(searchQuery ? "All Blogs" : "Recent Blogs", regularBlogs)}
        </>
      ) : (
        <EmptyState
          icon={Newspaper}
          title='No Blogs Found'
          description="We couldn't find any articles matching your criteria. Please check back later or try a different category."
          className='mb-12'
        />
      )}

      {pagination && pagination.totalCount > 0 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  )
}

export default FeaturedBlogs
