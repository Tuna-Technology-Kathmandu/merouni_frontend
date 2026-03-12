'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Award,
    Calendar,
    Clock,
    MapPin,
    Users,
    Bookmark,
    ClipboardList,
    DollarSign,
    BadgeCheck,
    Building2,
    MessageSquare,
    CheckCircle
} from 'lucide-react'
import Image from 'next/image'
import Footer from '@/components/Frontpage/Footer'
import Header from '@/components/Frontpage/Header'
import Navbar from '@/components/Frontpage/Navbar'
import Loading from '@/ui/molecules/Loading'
import EmptyState from '@/ui/shadcn/EmptyState'

import { formatDate } from '@/utils/date.util'
import { Button } from '@/ui/shadcn/button'
import { THEME_BLUE } from '@/constants/constants'
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
                console.error('Error:', err)
                setError(err.message || 'Failed to load course details')
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
                <div className='min-h-[60vh] flex items-center justify-center font-sans'>
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
                <div className='min-h-[60vh] flex items-center justify-center px-6 font-sans'>
                    <EmptyState
                        icon={Award}
                        title='Course Not Found'
                        description={error || 'The course you are looking for does not exist.'}
                        action={{
                            label: 'Back to Courses',
                            onClick: () => router.push('/short-term-courses')
                        }}
                    />
                </div>
                <Footer />
            </div>
        )
    }

    const DetailItem = ({ icon, label, value }) => (
        <div className='flex items-center gap-4 py-4 border-b border-gray-100 last:border-0'>
            <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-50'>
                {React.cloneElement(icon, { className: 'w-5 h-5', style: { color: THEME_BLUE } })}
            </div>
            <div className='flex flex-col'>
                <span className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5'>{label}</span>
                <span className='text-sm font-bold text-gray-800 tracking-tight'>{value}</span>
            </div>
        </div>
    )

    return (
        <div className='bg-white min-h-screen font-sans'>
            <Header />
            <Navbar />

            <main className='max-w-7xl mx-auto px-6 py-12'>
                {/* Navigation */}
                <div className='mb-8'>
                    <button
                        onClick={() => router.push('/short-term-courses')}
                        className='inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        <span>Back to Skill Courses</span>
                    </button>
                </div>

                <div className='flex flex-col lg:flex-row gap-12'>
                    {/* Main Content */}
                    <div className='flex-1'>
                        {/* Header Section */}
                        <div className='mb-8'>
                            <div className='flex items-start gap-4 mb-6'>
                                <div className='p-4 rounded-2xl' style={{ backgroundColor: `${THEME_BLUE}15` }}>
                                    <Award className='w-8 h-8' style={{ color: THEME_BLUE }} />
                                </div>
                                <div className='flex-1'>
                                    <h1 className='text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight'>
                                        {course.title}
                                    </h1>
                                    <div className='flex flex-wrap items-center gap-4'>
                                        {course.institution_name && (
                                            <div className='flex items-center gap-1.5 font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg'>
                                                <Building2 className='w-4 h-4' style={{ color: THEME_BLUE }} />
                                                <span className='text-xs'>{course.institution_name}</span>
                                                <CheckCircle className='w-3.5 h-3.5 text-blue-500 fill-blue-50' />
                                            </div>
                                        )}
                                        <div className='flex gap-2'>
                                            <span className='inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black border border-blue-100 uppercase tracking-wider'>
                                                {course.course_type || 'Skill Certification'}
                                            </span>
                                            {course.is_featured && (
                                                <span className='inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black border border-amber-100 uppercase tracking-wider'>
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Image */}
                        {course.thumbnail_image && (
                            <div className='mb-12 relative aspect-video rounded-[2rem] overflow-hidden border-8 border-gray-50 bg-gray-50 shadow-sm'>
                                <Image
                                    src={course.thumbnail_image}
                                    alt={course.title}
                                    fill
                                    className='object-cover'
                                    priority
                                />
                            </div>
                        )}

                        {/* Description / Content */}
                        <div className='space-y-12'>
                            {course.description && (
                                <div>
                                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>About This Course</h2>
                                    <p className='text-gray-600 leading-relaxed text-lg whitespace-pre-line'>
                                        {course.description}
                                    </p>
                                </div>
                            )}

                            {course.content && (
                                <div>
                                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>Curriculum & Requirements</h2>
                                    <div
                                        className='prose prose-blue max-w-none text-gray-600 leading-relaxed text-lg'
                                        dangerouslySetInnerHTML={{ __html: course.content }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className='lg:w-80 space-y-6'>
                        <div className='bg-gray-50 rounded-2xl p-8 sticky top-24'>
                            <h3 className='text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 border-b border-gray-200 pb-4'>
                                Course Logistics
                            </h3>

                            <div className='space-y-4'>
                                <div className='flex flex-col border-b border-gray-100 pb-4'>
                                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2'>
                                        Investment
                                    </span>
                                    <span className='text-2xl font-bold text-green-700'>
                                        {course.price ? `Rs. ${parseFloat(course.price).toLocaleString()}` : 'Free'}
                                    </span>
                                </div>

                                <DetailItem
                                    icon={<Clock className='w-3 h-3' />}
                                    label="Duration"
                                    value={course.duration || 'Flexible'}
                                />

                                {course.class_time && (
                                    <DetailItem
                                        icon={<Clock className='w-3 h-3' />}
                                        label="Time"
                                        value={course.class_time}
                                    />
                                )}

                                {course.start_date && (
                                    <DetailItem
                                        icon={<Calendar className='w-3 h-3' />}
                                        label="Starts From"
                                        value={formatDate(course.start_date)}
                                    />
                                )}

                                {course.location && (
                                    <DetailItem
                                        icon={<MapPin className='w-3 h-3' />}
                                        label="Location"
                                        value={course.location}
                                    />
                                )}

                                {course.seats_available && (
                                    <DetailItem
                                        icon={<Users className='w-3 h-3' />}
                                        label="Availability"
                                        value={`${course.seats_available} Seats Available`}
                                    />
                                )}

                                <div className='pt-6 space-y-3'>
                                    <Button
                                        className='w-full py-6 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-0.5'
                                        style={{ backgroundColor: THEME_BLUE }}
                                    >
                                        Enroll Now
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default SkillCourseDetailsPage
