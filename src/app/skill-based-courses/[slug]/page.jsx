'use client'

import EmptyState from '@/ui/shadcn/EmptyState'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
    FaArrowLeft,
    FaAward,
    FaCheckCircle,
    FaClock,
    FaMoneyBillWave
} from 'react-icons/fa'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import Loading from '../../../ui/molecules/Loading'
import { fetchSkillCourseBySlug } from '../actions'

const SkillCourseDetailsPage = ({ params }) => {
    const router = useRouter()
    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const resolvedParams = await params
                const slug = resolvedParams.slug

                const data = await fetchSkillCourseBySlug(slug)
                setCourse(data || null)
            } catch (err) {
                console.error('Error fetching course details:', err)
                setError(err.message || 'Failed to load course details')
                setCourse(null)
            } finally {
                setLoading(false)
            }
        }

        fetchDetails()
    }, [params])

    if (loading) {
        return (
            <div className='bg-white min-h-screen'>
                <Header />
                <Navbar />
                <div className='min-h-[60vh] flex items-center justify-center'>
                    <Loading />
                </div>
                <Footer />
            </div>
        )
    }

    if (error || !course) {
        return (
            <div className='bg-white min-h-screen'>
                <Header />
                <Navbar />
                <div className='min-h-[60vh] flex items-center justify-center px-6'>
                    <EmptyState
                        icon={FaAward}
                        title='Course Not Found'
                        description={
                            error || 'The course you are looking for does not exist.'
                        }
                        action={{
                            label: 'Back to Courses',
                            onClick: () => router.push('/skill-based-courses')
                        }}
                    />
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className='bg-white min-h-screen'>
            <Header />
            <Navbar />

            <main className='max-w-7xl mx-auto px-6 py-12'>
                {/* Navigation */}
                <div className='mb-8'>
                    <Link
                        href='/skill-based-courses'
                        className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors'
                    >
                        <FaArrowLeft className='w-3 h-3' />
                        <span>Back to Courses</span>
                    </Link>
                </div>

                <div className='flex flex-col lg:flex-row gap-12'>
                    {/* Main Content */}
                    <div className='flex-1'>
                        {/* Header */}
                        <div className='mb-8'>
                            <div className='flex items-start gap-4 mb-6'>
                                <div className='flex-1'>
                                    <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight leading-tight'>
                                        {course.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {course.status === 'active' && (
                                            <span className='inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold border border-green-100'>
                                                <FaCheckCircle className="w-3 h-3" /> Active
                                            </span>
                                        )}
                                        {course.is_featured && (
                                            <span className='inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-semibold border border-yellow-100'>
                                                <FaAward className="w-3 h-3" /> Featured
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail */}
                            {course.thumbnail_image && (
                                <div className="mb-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative h-[300px] md:h-[400px] w-full">
                                    <Image
                                        src={course.thumbnail_image}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {course.description && (
                            <div className='mb-12'>
                                <h2 className='text-2xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-100'>
                                    Course Overview
                                </h2>
                                <div
                                    className='text-gray-600 leading-relaxed text-lg prose prose-gray max-w-none'
                                    dangerouslySetInnerHTML={{ __html: course.description }}
                                />
                            </div>
                        )}

                        {/* Additional Metadata/Sections can be added here if the API provides more fields like curriculum, instructors etc */}

                    </div>

                    {/* Sidebar */}
                    <div className='lg:w-80 space-y-6'>
                        <div className='bg-gray-50 rounded-2xl p-8 sticky top-24 border border-gray-100 shadow-sm'>
                            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4'>
                                Course Details
                            </h3>
                            <div className='space-y-6'>
                                <div className='flex flex-col border-b border-gray-100 pb-4 last:border-0 last:pb-0'>
                                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2'>
                                        <FaMoneyBillWave className='w-3 h-3' />
                                        Price
                                    </span>
                                    <span className='text-2xl font-bold text-[#30ad8f]'>
                                        {course.price ? `Rs. ${parseFloat(course.price).toLocaleString()}` : 'Free'}
                                    </span>
                                </div>

                                <div className='flex flex-col border-b border-gray-100 pb-4 last:border-0 last:pb-0'>
                                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2'>
                                        <FaClock className='w-3 h-3' />
                                        Duration
                                    </span>
                                    <span className='text-base font-medium text-gray-900'>
                                        {course.duration || 'Flexible'}
                                    </span>
                                </div>
                                {/* Author info could go here if available */}
                            </div>


                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default SkillCourseDetailsPage
