'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SkillCourseCard = ({ course }) => {
    return (
        <article className='bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col hover:border-gray-300 hover:shadow-lg transition-all duration-300 group h-full'>
            <div className='relative h-48 w-full bg-gray-100 overflow-hidden'>
                {course.thumbnail_image ? (
                    <Image
                        src={course.thumbnail_image}
                        alt={course.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-500'
                    />
                ) : (
                    <div className='flex items-center justify-center h-full text-gray-400 bg-gray-200'>
                        <span className='text-sm'>No Image</span>
                    </div>
                )}
                {course.is_featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400/90 backdrop-blur-sm text-yellow-950 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold shadow-sm">
                        Featured
                    </div>
                )}
            </div>

            <div className='p-5 flex flex-col flex-grow'>
                <h2 className='text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-[#387cae] transition-colors'>
                    {course.title}
                </h2>

                <div className='mt-auto space-y-2 mb-5'>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-500'>Price</span>
                        <span className='font-bold text-gray-900'>
                            {course.price ? `Rs. ${parseFloat(course.price).toLocaleString()}` : 'Free'}
                        </span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-500'>Duration</span>
                        <span className='font-medium text-gray-700'>{course.duration || 'Flexible'}</span>
                    </div>
                </div>

                <div className='mt-auto pt-4 border-t border-gray-100'>
                    <Link
                        href={`/skill-based-courses/${course.slugs || course.id}`}
                        className='block w-full py-2.5 rounded-lg text-center text-sm font-semibold text-white bg-[#387cae] hover:bg-[#2c6590] transition-colors shadow-sm hover:shadow active:scale-[0.98]'
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default SkillCourseCard
