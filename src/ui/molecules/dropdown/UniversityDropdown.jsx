'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'

/**
 * UniversityDropdown - A searchable dropdown component for selecting universities
 * 
 * @param {Object} props
 * @param {string|number} props.value - Selected university ID
 * @param {Function} props.onChange - Callback when university is selected (receives university ID and selected object)
 * @param {string} props.placeholder - Placeholder text (default: "Select University")
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.minWidth - Minimum width in pixels (default: 200)
 */
const UniversityDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select University',
  className = '',
  minWidth = 200,
  error = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Fetch universities on mount
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        setLoading(true)
        const response = await authFetch(
          `${process.env.baseUrl}/university?limit=1000`,
          { cache: 'no-store' }
        )
        if (response.ok) {
          const data = await response.json()
          setUniversities(data.items || [])
        }
      } catch (err) {
        console.error('Error loading universities:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUniversities()
  }, [])

  // Filter universities based on search term
  const filteredUniversities = useMemo(() => {
    if (!searchTerm) return universities
    return universities.filter((university) =>
      university.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [universities, searchTerm])

  // Get selected university name
  const selectedUniversityName = useMemo(() => {
    if (!value) return placeholder
    const university = universities.find((u) => String(u.id) === String(value))
    return university?.fullname || placeholder
  }, [universities, value, placeholder])

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

  const handleSelect = (universityId) => {
    const selectedUni = universities.find((u) => String(u.id) === String(universityId))
    if (onChange) {
      onChange(universityId, selectedUni)
    }
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`w-full pl-4 pr-8 py-2 text-left border ${error ? 'border-destructive' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed`}
        style={{ minWidth: `${minWidth}px` }}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {loading ? 'Loading...' : selectedUniversityName}
        </span>
      </button>
      <ChevronDown
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
          } ${loading ? 'opacity-50' : ''}`}
      />

      {error && (
        <span className='text-sm font-medium text-destructive mt-1 block'>
          {error}
        </span>
      )}

      {isOpen && !loading && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden'>
          <div className='p-2 border-b border-gray-200'>
            <div className='relative'>
              <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search university...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className='w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                autoFocus
              />
            </div>
          </div>
          <div className='max-h-48 overflow-y-auto'>
            {placeholder && (
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
            )}
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((university) => (
                <button
                  key={university.id}
                  type='button'
                  onClick={() => handleSelect(String(university.id))}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${String(value) === String(university.id)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700'
                    }`}
                >
                  {university.fullname}
                </button>
              ))
            ) : (
              <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                No university found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UniversityDropdown
