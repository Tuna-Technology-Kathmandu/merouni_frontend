'use client'
import React, { useEffect, useState } from 'react'
import { Search, Award, X, BookOpen } from 'lucide-react'
import EmptyState from '@/ui/shadcn/EmptyState'
import { fetchPublicSkillCourses } from './actions'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import Navbar from '@/components/Frontpage/Navbar'
import Footer from '@/components/Frontpage/Footer'
import Header from '@/components/Frontpage/Header'
import SkillCourseCard from '@/ui/molecules/cards/SkillCourseCard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { THEME_BLUE, THEME_GREEN } from '@/constants/constants'

const SkillCoursesPage = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)

        return () => clearTimeout(handler)
    }, [searchTerm])

    // Fetch courses
    useEffect(() => {
        const getCourses = async () => {
            setLoading(true)
            try {
                const response = await fetchPublicSkillCourses({
                    q: debouncedSearch,
                })
                setCourses(response.items || [])
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        getCourses()
    }, [debouncedSearch])

    const clearFilters = () => {
        setSearchTerm('')
    }

    return (
        <>
            <Header />
            <Navbar />

            <div className='min-h-screen bg-gray-50/50 py-12 px-6 font-sans'>
                <div className='max-w-7xl mx-auto'>
                    {/* Header Section */}
                    <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
                        <div>
                            <div className='relative inline-block mb-3'>
                                <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight'>
                                    Explore &nbsp;
                                    <span style={{ color: THEME_BLUE }}>Skill Based Courses</span>
                                </h1>
                                <div
                                    className='absolute -bottom-2 left-0 w-16 h-1 rounded-full'
                                    style={{ backgroundColor: THEME_BLUE }}
                                ></div>
                            </div>
                            <p className='mt-4 text-gray-600 max-w-2xl'>
                                Enhance your skills with our curated collection of professional courses.
                            </p>
                        </div>

                        {/* Clear All Button */}
                        {searchTerm && (
                            <button
                                onClick={clearFilters}
                                className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
                            >
                                <X className='w-4 h-4' />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Filters Bar */}
                    <div className='bg-white rounded-[32px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-12'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6'>
                            {/* Search */}
                            <div className='lg:col-span-12'>
                                <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                                    Search Skill Based Courses
                                </label>
                                <div className='relative group'>
                                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#387cae] transition-colors' />
                                    <input
                                        type='text'
                                        placeholder='Search skill based courses by title...'
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        value={searchTerm}
                                        className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#387cae]/10 focus:border-[#387cae] focus:bg-white transition-all text-sm font-semibold text-gray-900 placeholder-gray-400'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    {!loading && (
                        <div className='mb-8 px-2'>
                            <p className='text-sm text-gray-500 font-semibold'>
                                Showing{' '}
                                <span className='text-gray-900'>{courses.length}</span>{' '}
                                results
                            </p>
                        </div>
                    )}

                    {/* Courses Grid */}
                    {loading ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                            {Array(8)
                                .fill('')
                                .map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className='bg-white rounded-[32px] border border-gray-100 border-dashed py-20'>
                            <EmptyState
                                icon={BookOpen}
                                title='No Courses Found'
                                description={
                                    searchTerm
                                        ? 'No courses match your search criteria'
                                        : 'No courses are currently available'
                                }
                                action={
                                    searchTerm
                                        ? {
                                            label: 'Clear Filters',
                                            onClick: clearFilters
                                        }
                                        : null
                                }
                            />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr'>
                            {courses.map((course) => (
                                <SkillCourseCard
                                    key={course.id}
                                    course={course}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
            <ToastContainer position='top-right' autoClose={3000} />
        </>
    )
}

export default SkillCoursesPage
