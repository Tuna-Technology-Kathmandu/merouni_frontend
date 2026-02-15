'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'

/**
 * ProgramDropdown - A searchable dropdown component for selecting programs
 *
 * @param {Object} props
 * @param {string|number} props.value - Selected program ID
 * @param {Function} props.onChange - Callback when program is selected (receives program ID as string or '')
 * @param {string} props.placeholder - Placeholder text (default: "Select Program")
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.minWidth - Minimum width in pixels (default: 200)
 */
const ProgramDropdown = ({
  value = '',
  onChange,
  placeholder = 'Select Program',
  className = '',
  minWidth = 200,
  valueKey = 'id'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Fetch programs on mount
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true)
        const response = await authFetch(
          `${process.env.baseUrl}/program?limit=1000`,
          { cache: 'no-store' }
        )
        if (response.ok) {
          const data = await response.json()
          setPrograms(data.items || [])
        }
      } catch (err) {
        console.error('Error loading programs:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPrograms()
  }, [])

  // Filter programs based on search term (title)
  const filteredPrograms = useMemo(() => {
    if (!searchTerm) return programs
    const term = searchTerm.toLowerCase()
    return programs.filter(
      (program) =>
        program.title && program.title.toLowerCase().includes(term)
    )
  }, [programs, searchTerm])

  // Get selected program display label
  const selectedProgramLabel = useMemo(() => {
    if (!value) return placeholder
    const program = programs.find((p) => String(p[valueKey]) === String(value))
    if (!program) return placeholder
    return program.title
  }, [programs, value, placeholder, valueKey])

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

  const handleSelect = (programId) => {
    onChange(programId)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className='w-full pl-4 pr-8 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed text-sm'
        style={{ minWidth: `${minWidth}px` }}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {loading ? 'Loading...' : selectedProgramLabel}
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
                placeholder='Search Program...'
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
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((program) => (
                <button
                  key={program.id}
                  type='button'
                  onClick={() => handleSelect(String(program[valueKey]))}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${
                    value === String(program[valueKey])
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {program.title}
                </button>
              ))
            ) : (
              <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                No program found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgramDropdown
