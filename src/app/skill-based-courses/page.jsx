'use client'
import React, { useEffect, useState } from 'react'
import { Search, Award, X, BookOpen, Newspaper } from 'lucide-react'
import { IoSearch } from 'react-icons/io5'
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
                    {/* Filters Bar - Aligned with blogs */}
                    <div className='flex flex-col md:flex-row justify-between items-center gap-6 mb-12'>
                        {/* Header Section Inline */}
                        <div className='relative'>
                            <h2 className='text-3xl font-extrabold text-gray-800'>
                                Explore <span style={{ color: THEME_BLUE }}>Courses</span>
                            </h2>
                            <div 
                                className='absolute -bottom-2 left-0 w-12 h-1 rounded-full'
                                style={{ backgroundColor: THEME_BLUE }}
                            ></div>
                        </div>

                        {/* Search Input - Matched with blogs */}
                        <div className='w-full md:w-[400px]'>
                            <div className='relative group'>
                                <IoSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#387cae] transition-colors text-lg' />
                                <input
                                    type='text'
                                    placeholder='Search courses...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full py-3.5 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl outline-none text-sm font-semibold text-gray-900 shadow-[0_2px_15px_rgba(0,0,0,0.02)] focus:ring-2 focus:ring-[#387cae]/10 focus:border-[#387cae] transition-all placeholder-gray-400'
                                />
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
                        <div className='space-y-12'>
                            {/* Featured Courses */}
                            {courses.filter(c => c.is_featured).length > 0 && (
                                <div>
                                    <div className='flex items-center gap-2 mb-6 border-l-4 border-[#387cae] pl-4'>
                                        <h2 className='text-2xl font-bold text-gray-800'>Featured Courses</h2>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr'>
                                        {courses.filter(c => c.is_featured).map((course) => (
                                            <SkillCourseCard
                                                key={course.id}
                                                course={course}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Remaining Courses */}
                            {courses.filter(c => !c.is_featured).length > 0 && (
                                <div>
                                    <div className='flex items-center gap-2 mb-6 border-l-4 border-[#387cae] pl-4'>
                                        <h2 className='text-2xl font-bold text-gray-800'>
                                            {searchTerm ? "All Courses" : "Recent Courses"}
                                        </h2>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr'>
                                        {courses.filter(c => !c.is_featured).map((course) => (
                                            <SkillCourseCard
                                                key={course.id}
                                                course={course}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
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
