'use client'

import React from 'react'
import NewsCard from './NewsCard'
import Pagination from './Pagination'
import NewsShimmer from './NewsShimmer'
import Link from 'next/link'
import { IoSearch } from 'react-icons/io5'

const FeaturedNews = ({ news, loading, pagination, onPageChange }) => {
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
                <NewsShimmer />
            ) : news && news.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mb-12'>
                    {news.map((item, index) => (
                        <Link href={`/news/${item.slug}`} key={index} className='h-full'>
                            <div className='h-full'>
                                <NewsCard
                                    date={formatDate(item.createdAt)}
                                    description={truncateString(item.description, 100)}
                                    image={
                                        item.featuredImage || 'https://placehold.co/600x400'
                                    }
                                    title={truncateString(item.title, 60)}
                                    slug={item.slug}
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className='w-full py-20 text-center bg-gray-50 rounded-2xl border border-gray-100 mb-12'>
                    <div className='bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400'>
                        <IoSearch size={24} />
                    </div>
                    <h3 className='text-lg font-bold text-gray-800 mb-2'>No news found</h3>
                    <p className='text-gray-500 max-w-sm mx-auto'>
                        We couldn't find any news matching your criteria.
                    </p>
                </div>
            )}

            {pagination && pagination.totalCount > 0 && (
                <Pagination pagination={pagination} onPageChange={onPageChange} />
            )}
        </div>
    )
}

export default FeaturedNews
