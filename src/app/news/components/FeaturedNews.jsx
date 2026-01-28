'use client'

import React from 'react'
import NewsCard from './NewsCard'
import Pagination from './Pagination'
import NewsShimmer from './NewsShimmer'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

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
                <EmptyState
                    icon={Newspaper}
                    title='No News Found'
                    description="We couldn't find any news matching your criteria. Please check back later or try a different category."
                    className='mb-12'
                />
            )}

            {pagination && pagination.totalCount > 0 && (
                <Pagination pagination={pagination} onPageChange={onPageChange} />
            )}
        </div>
    )
}

export default FeaturedNews
