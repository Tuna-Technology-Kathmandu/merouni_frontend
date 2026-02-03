'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'

/**
 * CourseDropdown - A searchable dropdown component for selecting courses
 *
 * @param {Object} props
 * @param {string|number} props.value - Selected course ID
 * @param {Function} props.onChange - Callback when course is selected (receives course ID and full object)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.minWidth - Minimum width in pixels
 */
const CourseDropdown = ({
    value = '',
    onChange,
    placeholder = 'Select course',
    className = '',
    minWidth = 200
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef(null)

    // Fetch courses on mount
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true)
                const response = await authFetch(
                    `${process.env.baseUrl}/course?limit=500`,
                    { cache: 'no-store' }
                )
                if (response.ok) {
                    const data = await response.json()
                    setCourses(data.items || [])
                }
            } catch (err) {
                console.error('Error loading courses:', err)
            } finally {
                setLoading(false)
            }
        }

        loadCourses()
    }, [])

    // Filter courses based on search term (title)
    const filteredCourses = useMemo(() => {
        if (!searchTerm) return courses
        const term = searchTerm.toLowerCase()
        return courses.filter(
            (course) =>
                (course.title && course.title.toLowerCase().includes(term))
        )
    }, [courses, searchTerm])

    // Get selected course name
    const selectedCourseLabel = useMemo(() => {
        if (!value) return placeholder
        const course = courses.find((c) => c.id === parseInt(value))
        return course?.title || placeholder
    }, [courses, value, placeholder])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
                setSearchTerm('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (courseId) => {
        const selectedCourse = courses.find((c) => String(c.id) === String(courseId))
        onChange(courseId, selectedCourse)
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                disabled={loading}
                className='w-full pl-4 pr-8 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
                style={{ minWidth: `${minWidth}px` }}
            >
                <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                    {loading ? 'Loading...' : selectedCourseLabel}
                </span>
            </button>
            <ChevronDown
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
                    } ${loading ? 'opacity-50' : ''}`}
            />

            {isOpen && !loading && (
                <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden'>
                    <div className='p-2 border-b border-gray-200'>
                        <div className='relative'>
                            <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search course...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className='w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className='max-h-48 overflow-y-auto'>
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <button
                                    key={course.id}
                                    type='button'
                                    onClick={() => handleSelect(String(course.id))}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${value === String(course.id)
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-700'
                                        }`}
                                >
                                    {course.title}
                                </button>
                            ))
                        ) : (
                            <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                                No course found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CourseDropdown
