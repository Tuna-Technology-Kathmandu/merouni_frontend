'use client'
import Footer from '@/components/Frontpage/Footer'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import SkillCourseCard from '@/ui/molecules/cards/SkillCourseCard'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import EmptyState from '@/ui/shadcn/EmptyState'
import { BookOpen, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchPublicSkillCourses } from './actions'
import { THEME_BLUE } from '@/constants/constants'

import { fetchDisciplines } from '../(dashboard)/dashboard/discipline/action'

const SkillCoursesPage = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [disciplines, setDisciplines] = useState([])
    const [selectedDiscipline, setSelectedDiscipline] = useState('')

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)

        return () => clearTimeout(handler)
    }, [searchTerm])

    // Fetch disciplines
    useEffect(() => {
        const getDisciplines = async () => {
            try {
                const response = await fetchDisciplines(1, 100)
                setDisciplines(response.items || [])
            } catch (error) {
                console.error('Error fetching disciplines:', error)
            }
        }
        getDisciplines()
    }, [])

    // Fetch courses
    useEffect(() => {
        const getCourses = async () => {
            setLoading(true)
            try {
                const response = await fetchPublicSkillCourses({
                    q: debouncedSearch,
                    discipline: selectedDiscipline
                })
                setCourses(response.items || [])
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        getCourses()
    }, [debouncedSearch, selectedDiscipline])

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedDiscipline('')
    }


    return (
        <>
            <Header />
            <Navbar />

            <div className='min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 font-sans'>
                <div className='max-w-7xl mx-auto'>
                    {/* Header Section */}
                    <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10'>
                        <div>
                            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3'>
                                Skill Based <span className='text-[#387cae]'>Courses</span>
                            </h1>
                            <p className='text-gray-600 max-w-2xl text-lg'>
                                Enhance your skills with our curated collection of professional courses.
                            </p>
                        </div>

                        {/* Clear All Button */}
                        {(searchTerm || selectedDiscipline) && (
                            <button
                                onClick={clearFilters}
                                className='flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors bg-red-50 px-4 py-2 rounded-lg'
                            >
                                <X className='w-4 h-4' />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Filters Bar */}
                    <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10'>
                        <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
                            <div className='md:col-span-8'>
                                <div className='relative'>
                                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                                    <input
                                        type='text'
                                        placeholder='Search courses by title...'
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        value={searchTerm}
                                        className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#387cae]/20 focus:border-[#387cae] focus:bg-white transition-all text-gray-900 placeholder-gray-400'
                                    />
                                </div>
                            </div>
                            <div className='md:col-span-4'>
                                <select
                                    value={selectedDiscipline}
                                    onChange={(e) => setSelectedDiscipline(e.target.value)}
                                    className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#387cae]/20 focus:border-[#387cae] focus:bg-white transition-all text-gray-900 cursor-pointer appearance-none'
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                        backgroundPosition: `right 1rem center`,
                                        backgroundRepeat: `no-repeat`,
                                        backgroundSize: `1.5em 1.5em`,
                                        paddingRight: `2.5rem`
                                    }}
                                >
                                    <option value="">All Disciplines</option>
                                    {disciplines.map((discipline) => (
                                        <option key={discipline.id} value={discipline.slug || discipline.id}>
                                            {discipline.name || discipline.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Summary */}
                    {!loading && (
                        <div className='mb-6'>
                            <p className='text-sm text-gray-500 font-medium'>
                                Found <span className='text-gray-900 font-bold'>{courses.length}</span> courses
                            </p>
                        </div>
                    )}

                    {/* Courses Grid */}
                    {loading ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                            {Array(8)
                                .fill('')
                                .map((_, index) => (
                                    <CardSkeleton key={index} />
                                ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className='bg-white rounded-2xl border border-gray-100 border-dashed py-20'>
                            <EmptyState
                                icon={BookOpen}
                                title='No Courses Found'
                                description={
                                    searchTerm || selectedDiscipline
                                        ? 'No courses match your search criteria'
                                        : 'No courses are currently available'
                                }
                                action={
                                    searchTerm || selectedDiscipline
                                        ? {
                                            label: 'Clear Filters',
                                            onClick: clearFilters
                                        }
                                        : null
                                }
                            />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
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
