'use client'

import React from 'react'
import BlogCard from './BlogCard'
import Pagination from './Pagination'
import FeaturedBlogsShimmer from './FeaturedBlogShimmer'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'

const FeaturedBlogs = ({ blogs, loading, pagination, onPageChange }) => {
  const truncateString = (str, maxLength) => {
    if (str?.length > maxLength) {
      return str.slice(0, maxLength) + '...'
    }
    return str || ''
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    try {
      return new Date(dateString).toLocaleDateString(undefined, options)
    } catch (e) {
      return ''
    }
  }

  return (
    <div className='max-w-[1600px] mx-auto px-4 sm:px-8 mb-8'>
      {loading ? (
        <FeaturedBlogsShimmer />
      ) : blogs && blogs.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-12'>
          {blogs.map((blog, index) => (
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
