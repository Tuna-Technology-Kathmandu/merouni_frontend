'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, MapPin, Info, GraduationCap, Tag } from 'lucide-react'
import { THEME_BLUE } from '@/constants/constants'

const SkillCourseCard = ({ course }) => {
    const name = course.title
    const slug = course.slug
    const collegeImage = course.thumbnail_image
    const location = course.location
    const price = course.price
    const duration = course.duration

    return (
        <div
            className='group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col h-full'
        >
            <Link href={`/short-term-courses/${slug}`} className='flex flex-col h-full'>
                <div className='relative aspect-[16/10] overflow-hidden bg-gray-100'>
                    {collegeImage ? (
                        <Image
                            src={collegeImage}
                            alt={name || 'Course'}
                            fill
                            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                        />
                    ) : (
                        <div className='flex items-center justify-center h-full bg-slate-50'>
                            <Tag className='w-8 h-8 text-slate-300' />
                        </div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none' />

                    <div className='absolute top-3 left-3 flex gap-2 z-10'>
                        <span className='bg-white px-2.5 py-1 rounded-md text-[10px] font-bold text-[#0A70A7] uppercase tracking-wider shadow-sm'>
                            {course.course_type || 'Skill Certification'}
                        </span>
                        {course.is_featured && (
                            <span className='bg-amber-400 px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-950 uppercase tracking-wider shadow-sm'>
                                Featured
                            </span>
                        )}
                    </div>

                    <div className='absolute bottom-3 left-4 right-4 z-10 flex justify-between items-center'>
                        {location && (
                            <div className='flex items-center gap-1 text-white/90 text-[10px] font-bold uppercase tracking-wider'>
                                <MapPin className='w-3 h-3 text-blue-400 flex-shrink-0' />
                                <span className='line-clamp-1'>{location}</span>
                            </div>
                        )}
                        <div className='bg-[#0A70A7] px-3 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider shadow-sm'>
                            {price ? `Rs. ${parseFloat(price).toLocaleString()}` : 'Free'}
                        </div>
                    </div>
                </div>

                <div className='p-6 flex flex-col flex-1'>
                    <h3 className='font-semibold text-base text-gray-800 mb-2 group-hover:text-[#0A70A7] transition-colors leading-tight line-clamp-2 min-h-[2.5rem]'>
                        {name}
                    </h3>

                    <div className='flex items-center gap-4 mb-4'>
                        <div className='flex items-center gap-1.5 text-xs text-gray-500 font-medium'>
                            <Clock className='w-3.5 h-3.5 text-blue-500' />
                            <span>{duration || 'Flexible'}</span>
                        </div>
                        {course.institution_name && (
                            <div className='text-xs text-gray-400 font-medium truncate italic'>
                                by {course.institution_name}
                            </div>
                        )}
                    </div>

                    <div className='mt-auto pt-5 flex items-center gap-3 border-t border-gray-100'>
                        <Link
                            href={`/short-term-courses/${slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className='flex-1 py-2.5 px-3 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-[10px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider'
                        >
                            <Info className='w-3.5 h-3.5' />
                            Details
                        </Link>
                        <Link
                            href={`/short-term-courses/${slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className='flex-1 py-2.5 px-3 text-white rounded-md hover:opacity-90 transition-all text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider'
                            style={{ backgroundColor: THEME_BLUE }}
                        >
                            <GraduationCap className='w-3.5 h-3.5' />
                            Enroll
                        </Link>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default SkillCourseCard
