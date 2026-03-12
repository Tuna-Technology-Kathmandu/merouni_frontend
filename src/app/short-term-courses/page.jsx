'use client'
import Footer from '@/components/Frontpage/Footer'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import SkillCourseCard from '@/ui/molecules/cards/SkillCourseCard'
import { CardSkeleton } from '@/ui/shadcn/CardSkeleton'
import EmptyState from '@/ui/shadcn/EmptyState'
import { Search, BookOpen, X, Filter, DollarSign, ChevronDown, Layers, CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { fetchPublicSkillCourses } from './actions'
import { THEME_BLUE } from '@/constants/constants'

const SkillCoursesPage = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [type, setType] = useState('')
    const [price, setPrice] = useState('')

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
                    type,
                    price
                })
                setCourses(response.items || [])
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        getCourses()
    }, [debouncedSearch, type, price])

    const clearFilters = () => {
        setSearchTerm('')
        setType('')
        setPrice('')
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
                                    <span style={{ color: THEME_BLUE }}>Short-Term Courses</span>
                                </h1>
                                <div className='absolute -bottom-2 left-0 w-16 h-1 rounded-full' style={{ backgroundColor: THEME_BLUE }}></div>
                            </div>
                        </div>

                        {/* Clear All Button */}
                        {(searchTerm || type || price) && (
                            <button
                                onClick={clearFilters}
                                className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
                            >
                                <X className='w-4 h-4' />
                                Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* Filters Bar */}
                    <div className='bg-white rounded-[32px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-12'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6'>
                            {/* Search */}
                            <div className='lg:col-span-6'>
                                <label className='block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-gray-400 ml-1'>
                                    Search Courses
                                </label>
                                <div className='relative group'>
                                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300 group-focus-within:text-blue-500 transition-colors' />
                                    <input
                                        type='text'
                                        placeholder='Search by skills, topics, or courses...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='w-full px-5 py-4 pl-12 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-bold text-gray-900 placeholder-gray-300 shadow-sm'
                                    />
                                </div>
                            </div>

                            {/* Mode Filter */}
                            <div className='lg:col-span-3'>
                                <label className='block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-gray-400 ml-1'>
                                    Mode
                                </label>
                                <div className='relative group'>
                                    <Layers className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-blue-500 transition-colors' />
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className='w-full px-5 py-4 pl-11 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-bold text-gray-900 appearance-none shadow-sm cursor-pointer'
                                    >
                                        <option value="">All Modes</option>
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                        <option value="both">Both</option>
                                    </select>
                                    <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none' />
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className='lg:col-span-3'>
                                <label className='block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-gray-400 ml-1'>
                                    Price
                                </label>
                                <div className='relative group'>
                                    <CreditCard className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-blue-500 transition-colors' />
                                    <select
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className='w-full px-5 py-4 pl-11 rounded-2xl border border-gray-100 bg-gray-50/30 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all text-sm font-bold text-gray-900 appearance-none shadow-sm cursor-pointer'
                                    >
                                        <option value="">Any Price</option>
                                        <option value="free">Free Only</option>
                                        <option value="paid">Paid Only</option>
                                    </select>
                                    <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none' />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results count */}
                    {!loading && (
                        <div className='mb-8 px-2'>
                            <p className='text-sm text-gray-500 font-semibold'>
                                Showing <span className='text-gray-900'>{courses.length}</span> programs
                            </p>
                        </div>
                    )}

                    {/* Grid */}
                    {loading ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {Array(6).fill('').map((_, index) => (
                                <CardSkeleton key={index} />
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className='bg-white rounded-[32px] border border-gray-100 border-dashed py-20'>
                            <EmptyState
                                icon={BookOpen}
                                title='No Courses Found'
                                description='Try adjusting your search or filters to find what you are looking for.'
                                action={searchTerm || type || price ? { label: 'Clear All Filters', onClick: clearFilters } : null}
                            />
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
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
