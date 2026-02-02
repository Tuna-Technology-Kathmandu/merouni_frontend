'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

/**
 * FacultyDropdown - A searchable dropdown component for selecting faculties
 *
 * @param {Object} props
 * @param {string|number} props.value - Selected faculty ID
 * @param {Function} props.onChange - Callback when faculty is selected (receives faculty ID as string or '')
 * @param {string} props.placeholder - Placeholder text (default: "Select faculty (optional)")
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.minWidth - Minimum width in pixels (default: 200)
 */
const FacultyDropdown = ({
    value = '',
    onChange,
    placeholder = 'Select faculty (optional)',
    className = '',
    minWidth = 200
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [faculties, setFaculties] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef(null)

    // Fetch faculties on mount
    useEffect(() => {
        const loadFaculties = async () => {
            try {
                setLoading(true)
                // Adjust endpoint limit if needed, defaulting to a reasonably high number
                const response = await authFetch(
                    `${DotenvConfig.NEXT_APP_API_BASE_URL}/faculty?limit=500`,
                    { cache: 'no-store' }
                )
                if (response.ok) {
                    const data = await response.json()
                    setFaculties(data.items || [])
                }
            } catch (err) {
                console.error('Error loading faculties:', err)
            } finally {
                setLoading(false)
            }
        }

        loadFaculties()
    }, [])

    // Filter faculties based on search term (title)
    const filteredFaculties = useMemo(() => {
        if (!searchTerm) return faculties
        const term = searchTerm.toLowerCase()
        return faculties.filter(
            (faculty) =>
                (faculty.title && faculty.title.toLowerCase().includes(term))
        )
    }, [faculties, searchTerm])

    // Get selected faculty display label
    const selectedFacultyLabel = useMemo(() => {
        if (!value) return placeholder
        const faculty = faculties.find((f) => f.id === parseInt(value))
        if (!faculty) return placeholder
        return faculty.title
    }, [faculties, value, placeholder])

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

    const handleSelect = (facultyId) => {
        onChange(facultyId)
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
                    {loading ? 'Loading...' : selectedFacultyLabel}
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
                                placeholder='Search faculty...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className='w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className='max-h-48 overflow-y-auto'>
                        <button
                            type='button'
                            onClick={() => handleSelect('')}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${!value
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-700'
                                }`}
                        >
                            {placeholder}
                        </button>
                        {filteredFaculties.length > 0 ? (
                            filteredFaculties.map((faculty) => (
                                <button
                                    key={faculty.id}
                                    type='button'
                                    onClick={() => handleSelect(String(faculty.id))}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${value === String(faculty.id)
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-700'
                                        }`}
                                >
                                    {faculty.title}
                                </button>
                            ))
                        ) : (
                            <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                                No faculty found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FacultyDropdown
