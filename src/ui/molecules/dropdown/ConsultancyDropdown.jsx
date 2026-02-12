'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'

/**
 * ConsultancyDropdown - A searchable dropdown component for selecting consultancies
 * 
 * @param {Object} props
 * @param {string|number} props.value - Selected consultancy ID
 * @param {Function} props.onChange - Callback when consultancy is selected (receives consultancy ID and selected object)
 * @param {string} props.placeholder - Placeholder text (default: "Select Consultancy")
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.minWidth - Minimum width in pixels (default: 200)
 * @param {string} props.error - Error message to display
 */
const ConsultancyDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select Consultancy',
  className = '',
  minWidth = 200,
  error = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [consultancies, setConsultancies] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Fetch consultancies on mount
  useEffect(() => {
    const loadConsultancies = async () => {
      try {
        setLoading(true)
        const response = await authFetch(
          `${process.env.baseUrl}/consultancy?limit=1000`, 
          { cache: 'no-store' }
        )
        if (response.ok) {
          const data = await response.json()
          // Handle both array and paginated response format
          const items = Array.isArray(data) ? data : (data.items || [])
          setConsultancies(items)
        }
      } catch (err) {
        console.error('Error loading consultancies:', err)
      } finally {
        setLoading(false)
      }
    }

    loadConsultancies()
  }, [])

  // Filter consultancies based on search term
  const filteredConsultancies = useMemo(() => {
    if (!searchTerm) return consultancies
    return consultancies.filter((consultancy) =>
      (consultancy.title || consultancy.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [consultancies, searchTerm])

  // Get selected consultancy name
  const selectedConsultancyName = useMemo(() => {
    if (!value) return placeholder
    const consultancy = consultancies.find((c) => String(c.id) === String(value))
    return consultancy?.title || consultancy?.name || placeholder
  }, [consultancies, value, placeholder])

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

  const handleSelect = (consultancyId) => {
    const selectedConsul = consultancies.find((c) => String(c.id) === String(consultancyId))
    if (onChange) {
      onChange(consultancyId, selectedConsul)
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
        <span className={value ? 'text-gray-900' : 'text-gray-500 truncate block'}>
          {loading ? 'Loading...' : selectedConsultancyName}
        </span>
        <ChevronDown
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
            } ${loading ? 'opacity-50' : ''}`}
        />
      </button>

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
                placeholder='Search consultancy...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className='w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
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
            {filteredConsultancies.length > 0 ? (
              filteredConsultancies.map((consultancy) => (
                <button
                  key={consultancy.id}
                  type='button'
                  onClick={() => handleSelect(String(consultancy.id))}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${String(value) === String(consultancy.id)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700'
                    }`}
                >
                  {consultancy.title || consultancy.name}
                </button>
              ))
            ) : (
              <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                No consultancy found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ConsultancyDropdown
