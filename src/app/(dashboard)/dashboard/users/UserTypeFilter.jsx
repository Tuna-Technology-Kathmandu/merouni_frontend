import React, { useState, useEffect, useRef } from 'react'
import { Filter, X, Check } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'

const ROLES = [
  { id: 'admin', label: 'Admin' },
  { id: 'editor', label: 'Editor' },
  { id: 'agent', label: 'Partner (Agent)' },
  { id: 'institution', label: 'Institution' },
  { id: 'student', label: 'Student' }
]

export default function UserTypeFilter({ selectedTypes, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleRole = (roleId) => {
    if (selectedTypes.includes(roleId)) {
      onChange(selectedTypes.filter((id) => id !== roleId))
    } else {
      onChange([...selectedTypes, roleId])
    }
  }

  const clearAll = () => {
    onChange([])
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <Button
        variant='outline'
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='gap-2 bg-white border-gray-200 h-10 w-full sm:w-auto justify-between sm:justify-start'
      >
        <div className='flex items-center gap-2'>
          <Filter className='w-4 h-4 text-gray-500' />
          <span>User Type</span>
          {selectedTypes.length > 0 && (
            <span className='ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#387cae] text-[10px] text-white'>
              {selectedTypes.length}
            </span>
          )}
        </div>
      </Button>

      {isOpen && (
        <div className='absolute z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in slide-in-from-top-2'>
          <div className='p-2'>
            <div className='flex items-center justify-between px-2 pb-2 mb-2 border-b border-gray-100'>
              <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                Filter by Role
              </span>
              {selectedTypes.length > 0 && (
                <button
                  type='button'
                  onClick={clearAll}
                  className='text-xs text-red-500 hover:text-red-700 transition-colors'
                >
                  Clear all
                </button>
              )}
            </div>
            
            <div className='space-y-1 max-h-60 overflow-y-auto'>
              {ROLES.map((role) => {
                const isSelected = selectedTypes.includes(role.id)
                return (
                  <button
                    key={role.id}
                    type='button'
                    onClick={() => toggleRole(role.id)}
                    className={`flex items-center w-full px-2 py-2 text-sm rounded-md transition-colors ${
                      isSelected ? 'bg-[#387cae]/5 text-[#387cae]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`mr-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
                      isSelected 
                        ? 'bg-[#387cae] border-[#387cae]' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check className='h-3 w-3 text-white' />}
                    </div>
                    <span>{role.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
