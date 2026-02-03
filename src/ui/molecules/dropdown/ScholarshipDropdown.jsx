'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'

/**
 * ScholarshipDropdown - A searchable dropdown component for selecting scholarships
 *
 * @param {Object} props
 * @param {string|number} props.value - Selected scholarship ID
 * @param {Function} props.onChange - Callback when scholarship is selected (receives scholarship ID as string or '')
 * @param {string} props.placeholder - Placeholder text (default: "Select scholarship (optional)")
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.minWidth - Minimum width in pixels (default: 200)
 */
const ScholarshipDropdown = ({
    value = '',
    onChange,
    placeholder = 'Select scholarship (optional)',
    className = '',
    minWidth = 200
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [scholarships, setScholarships] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dropdownRef = useRef(null)

    // Fetch scholarships on mount
    useEffect(() => {
        const loadScholarships = async () => {
            try {
                setLoading(true)
                const response = await authFetch(
                    `${process.env.baseUrl}/scholarship?limit=500`,
                    { cache: 'no-store' }
                )
                if (response.ok) {
                    const data = await response.json()
                    // Note: Based on program/actions.js, the response data structure for scholarship has a 'scholarships' key, or sometimes 'items'
                    // Checking program/actions.js: return data.scholarships
                    // But generic pagination usually is data.items.
                    // I will check if data.scholarships exists, else data.items, else data itself.
                    setScholarships(data.scholarships || data.items || [])
                }
            } catch (err) {
                console.error('Error loading scholarships:', err)
            } finally {
                setLoading(false)
            }
        }

        loadScholarships()
    }, [])

    // Filter scholarships based on search term (name)
    const filteredScholarships = useMemo(() => {
        if (!searchTerm) return scholarships
        const term = searchTerm.toLowerCase()
        return scholarships.filter(
            (scholarship) =>
                (scholarship.name && scholarship.name.toLowerCase().includes(term))
        )
    }, [scholarships, searchTerm])

    // Get selected scholarship display label
    const selectedScholarshipLabel = useMemo(() => {
        if (!value) return placeholder
        const scholarship = scholarships.find((s) => s.id === parseInt(value))
        if (!scholarship) return placeholder
        return scholarship.name
    }, [scholarships, value, placeholder])

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

    const handleSelect = (scholarshipId) => {
        onChange(scholarshipId)
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
                    {loading ? 'Loading...' : selectedScholarshipLabel}
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
                                placeholder='Search scholarship...'
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
                        {filteredScholarships.length > 0 ? (
                            filteredScholarships.map((scholarship) => (
                                <button
                                    key={scholarship.id}
                                    type='button'
                                    onClick={() => handleSelect(String(scholarship.id))}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${value === String(scholarship.id)
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'text-gray-700'
                                        }`}
                                >
                                    {scholarship.name}
                                </button>
                            ))
                        ) : (
                            <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                                No scholarship found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ScholarshipDropdown
