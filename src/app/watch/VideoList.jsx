'use client'

import { PlayCircle, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { fetchVideos } from '../(dashboard)/dashboard/videos/action'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import EmptyState from '@/ui/shadcn/EmptyState'

export default function VideoList({ initialData }) {
    const [videos, setVideos] = useState(initialData?.items || [])
    const [pagination, setPagination] = useState(initialData?.pagination || {})
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)
        return () => clearTimeout(handler)
    }, [searchTerm])

    // Load Data Effect
    useEffect(() => {
        if (debouncedSearch !== '') {
            fetchVideosAPI(1, debouncedSearch, true)
        } else if (videos.length === 0 && initialData?.items?.length) {
            fetchVideosAPI(1, '', true)
        }
    }, [debouncedSearch])


    const fetchVideosAPI = async (page, search, reset = false) => {
        setLoading(true)
        try {
            const response = await fetchVideos(page, 20, search)
            if (reset) {
                setVideos(response.items || [])
            } else {
                setVideos(prev => [...prev, ...response.items])
            }
            setPagination(response.pagination || {})
        } catch (error) {
            console.error('Failed to load videos', error)
        } finally {
            setLoading(false)
        }
    }

    const loadMore = () => {
        if (loading || (pagination.currentPage >= pagination.totalPages)) return
        fetchVideosAPI(pagination.currentPage + 1, debouncedSearch, false)
    }

    const clearSearch = () => setSearchTerm('')

    return (
        <div className='flex flex-col-reverse lg:flex-row gap-8'>
            {/* Main Content Grid */}
            <main className='flex-1'>
                {loading && videos.length === 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {Array(6).fill('').map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : videos.length === 0 ? (
                    <div className='bg-white rounded-2xl border border-gray-100 border-dashed py-16'>
                        <EmptyState
                            title='No Videos found'
                            description={searchTerm ? `No results for "${searchTerm}"` : 'We are adding more content soon!'}
                        />
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                            {videos.map((video) => (
                                <Link href={`/watch/${video.slug}`} key={video.id} className='group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
                                    <div className='relative h-48 bg-gray-100 overflow-hidden'>
                                        {video.featured_image ? (
                                            <img
                                                src={video.featured_image}
                                                alt={video.title}
                                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full bg-slate-50 text-slate-400">
                                                <PlayCircle className="w-12 h-12 opacity-30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className='bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30 transform scale-75 group-hover:scale-100 transition-all duration-300'>
                                                <PlayCircle className="w-10 h-10 text-white fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-5'>
                                        <h2 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#387cae] transition-colors'>
                                            {video.title}
                                        </h2>
                                        <p className='text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed'>
                                            {video.description}
                                        </p>
                                        <div className='flex items-center justify-between text-xs text-gray-400 font-medium pt-3 border-t border-gray-50'>
                                            <span className='bg-gray-100 px-2 py-1 rounded-md text-gray-600'>Video</span>
                                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {pagination.currentPage < pagination.totalPages && (
                            <div className='mt-10 text-center'>
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className='px-8 py-3 bg-[#387cae] text-white rounded-xl font-semibold hover:bg-[#2c6590] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95'
                                >
                                    {loading ? 'Loading...' : 'Load More Videos'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Sidebar / Filters */}
            <aside className='w-full lg:w-1/4 space-y-6'>
                <div className='sticky top-24'>
                    <div className='relative group'>
                        <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#387cae] transition-colors' />
                        <input
                            type='text'
                            placeholder='Search videos...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:shadow-md outline-none focus:ring-2 focus:ring-[#387cae]/20 focus:border-[#387cae] transition-all text-sm font-medium'
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors'
                            >
                                <X className='h-4 w-4' />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    )
}
