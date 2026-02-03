'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'

/**
 * DegreeDropdown - A searchable dropdown component for selecting degrees
 *
 * @param {Object} props
 * @param {string|number} props.value - Selected degree ID
 * @param {Function} props.onChange - Callback when degree is selected (receives degree ID as string or '')
 * @param {string} props.placeholder - Placeholder text (default: "Select degree (optional)")
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.minWidth - Minimum width in pixels (default: 200)
 */
const DegreeDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select degree (optional)',
  className = '',
  minWidth = 200
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [degrees, setDegrees] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Fetch degrees on mount
  useEffect(() => {
    const loadDegrees = async () => {
      try {
        setLoading(true)
        const response = await authFetch(
          `${process.env.baseUrl}/degree?limit=500`,
          { cache: 'no-store' }
        )
        if (response.ok) {
          const data = await response.json()
          setDegrees(data.items || [])
        }
      } catch (err) {
        console.error('Error loading degrees:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDegrees()
  }, [])

  // Filter degrees based on search term (title + short_name)
  const filteredDegrees = useMemo(() => {
    if (!searchTerm) return degrees
    const term = searchTerm.toLowerCase()
    return degrees.filter(
      (degree) =>
        (degree.title && degree.title.toLowerCase().includes(term)) ||
        (degree.short_name && degree.short_name.toLowerCase().includes(term))
    )
  }, [degrees, searchTerm])

  // Get selected degree display label
  const selectedDegreeLabel = useMemo(() => {
    if (!value) return placeholder
    const degree = degrees.find((d) => d.id === parseInt(value))
    if (!degree) return placeholder
    return degree.short_name ? `${degree.short_name} – ${degree.title}` : degree.title
  }, [degrees, value, placeholder])

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

  const handleSelect = (degreeId) => {
    onChange(degreeId)
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
          {loading ? 'Loading...' : selectedDegreeLabel}
        </span>
      </button>
      <ChevronDown
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
          isOpen ? 'rotate-180' : ''
        } ${loading ? 'opacity-50' : ''}`}
      />

      {isOpen && !loading && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden'>
          <div className='p-2 border-b border-gray-200'>
            <div className='relative'>
              <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search degree...'
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
              className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                !value
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'text-gray-700'
              }`}
            >
              {placeholder}
            </button>
            {filteredDegrees.length > 0 ? (
              filteredDegrees.map((degree) => (
                <button
                  key={degree.id}
                  type='button'
                  onClick={() => handleSelect(String(degree.id))}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                    value === String(degree.id)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {degree.short_name ? `${degree.short_name} – ${degree.title}` : degree.title}
                </button>
              ))
            ) : (
              <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                No degree found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DegreeDropdown
