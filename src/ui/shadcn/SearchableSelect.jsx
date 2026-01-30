'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Input } from './input'
import { Label } from './label'
import { ChevronDown, X, Loader2 } from 'lucide-react'
import { cn } from '@/app/lib/utils'

/**
 * A reusable searchable dropdown component.
 * 
 * @param {Object} props
 * @param {Array} props.options - Array of items to filter
 * @param {string|number} props.value - Current selected value (id)
 * @param {string} props.searchValue - Current search text
 * @param {Function} props.onChange - Selection handler (receives option object)
 * @param {string} props.displayKey - Property to display in the list (default: 'name')
 * @param {string} props.valueKey - Property to use as the value (default: 'id')
 * @param {string} props.label - Field label
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether the field is required
 * @param {boolean} props.loading - Loading state
 */
export function SearchableSelect({
    options = [],
    value = '',
    onChange,
    displayKey = 'name',
    valueKey = 'id',
    label,
    id,
    placeholder = 'Search and select...',
    error,
    required = false,
    loading = false,
    onSearchChange,
    className = ''
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const containerRef = useRef(null)

    // Robust way to get display value from an option
    const getDisplayValue = (option) => {
        if (!option) return ''
        if (typeof option === 'string' || typeof option === 'number') return String(option)
        if (typeof displayKey === 'function') return displayKey(option)

        // Try specified displayKey
        if (option[displayKey] !== undefined && option[displayKey] !== null) return String(option[displayKey])

        // Fallbacks for common naming conventions
        const fallbacks = ['name', 'title', 'label', 'text']
        for (const key of fallbacks) {
            if (option[key] !== undefined && option[key] !== null) return String(option[key])
        }

        // If all else fails, stringify the option or return empty
        return ''
    }

    // Sync search term with initial value if provided
    useEffect(() => {
        if (value && options.length > 0) {
            const selected = options.find((opt) => String(opt[valueKey]) === String(value))
            if (selected) {
                setSearchTerm(getDisplayValue(selected))
            }
        } else if (!value) {
            setSearchTerm('')
        }
    }, [value, options, valueKey])

    const filteredOptions = useMemo(() => {
        return options.filter((option) =>
            (getDisplayValue(option) || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [options, searchTerm])

    const handleSelect = (option) => {
        setSearchTerm(getDisplayValue(option))
        setIsOpen(false)
        setActiveIndex(-1)
        if (onChange) {
            onChange(option)
        }
    }

    const handleClear = (e) => {
        e.stopPropagation()
        setSearchTerm('')
        if (onChange) {
            onChange(null)
        }
        setIsOpen(false)
    }

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true)
            }
            return
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
                break
            case 'ArrowUp':
                e.preventDefault()
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0))
                break
            case 'Enter':
                e.preventDefault()
                if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
                    handleSelect(filteredOptions[activeIndex])
                }
                break
            case 'Escape':
                setIsOpen(false)
                break
            case 'Tab':
                setIsOpen(false)
                break
        }
    }

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={cn('relative space-y-2', className)} ref={containerRef} onKeyDown={handleKeyDown}>
            {label && (
                <Label htmlFor={id} className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
                    {label}
                </Label>
            )}

            <div className='relative group'>
                <Input
                    id={id}
                    type='text'
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => {
                        const val = e.target.value
                        setSearchTerm(val)
                        setIsOpen(true)
                        setActiveIndex(-1)
                        if (onSearchChange) {
                            onSearchChange(val)
                        }
                        if (!val && onChange) {
                            onChange(null)
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    className={cn(
                        'pr-10 transition-all duration-200',
                        isOpen && 'ring-2 ring-primary/20 border-primary',
                        error && 'border-destructive focus-visible:ring-destructive'
                    )}
                    autoComplete='off'
                />

                <div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1'>
                    {searchTerm && (
                        <button
                            type='button'
                            onClick={handleClear}
                            className='p-1 rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
                        >
                            <X className='h-3.5 w-3.5' />
                        </button>
                    )}
                    <ChevronDown className={cn(
                        'h-4 w-4 text-muted-foreground/60 transition-transform duration-200 mr-1',
                        isOpen && 'rotate-180 text-primary'
                    )} />
                </div>
            </div>

            {isOpen && (
                <div className='absolute z-50 w-full bg-white border border-input rounded-md shadow-lg mt-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200'>
                    {loading ? (
                        <div className='p-4 flex items-center justify-center gap-2 text-muted-foreground text-sm'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Loading...
                        </div>
                    ) : filteredOptions.length > 0 ? (
                        <div className='max-h-60 overflow-y-auto thin-scrollbar'>
                            {filteredOptions.map((option, index) => (
                                <div
                                    key={option[valueKey]}
                                    className={cn(
                                        'p-2.5 cursor-pointer flex items-center transition-colors border-b border-muted/20 last:border-0 text-sm',
                                        activeIndex === index ? 'bg-primary/5 text-primary font-medium' : 'hover:bg-muted font-normal text-muted-foreground hover:text-foreground',
                                        String(option[valueKey]) === String(value) && 'bg-primary/[0.03] text-primary'
                                    )}
                                    onClick={() => handleSelect(option)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    {getDisplayValue(option)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='p-4 text-muted-foreground text-sm text-center italic bg-muted/10'>
                            No options found.
                        </div>
                    )}
                </div>
            )}

            {error && (
                <span className='text-[12px] font-medium text-destructive animate-in fade-in slide-in-from-top-1'>
                    {error}
                </span>
            )}
        </div>
    )
}
