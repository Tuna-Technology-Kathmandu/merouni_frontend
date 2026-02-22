'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Plus, X, Loader2, Check, ChevronDown } from 'lucide-react'
import { Input } from '@/ui/shadcn/input'
import { Button } from '@/ui/shadcn/button'
import { cn } from '@/app/lib/utils'

/**
 * A reusable Search-Select-Create component.
 * 
 * @param {Object} props
 * @param {Function} props.onSearch - Function to call for searching: (query) => Promise<items[]>
 * @param {Function} props.onCreate - Optional: Function to call for creating: (query) => Promise<newItem>
 * @param {Function} props.onSelect - Function to call when an item is selected: (item) => void
 * @param {Function} props.onRemove - Function to call when an item is removed: (item) => void
 * @param {Array|Object} props.selectedItems - Currently selected item(s)
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.createLabel - Label for the create button
 * @param {string} props.displayKey - Key to use for displaying the item text
 * @param {string} props.valueKey - Key to use for uniquely identifying the item
 * @param {string} props.className - Additional class names for the container
 * @param {boolean} props.isMulti - Whether multiple items can be selected (default: true)
 * @param {boolean} props.allowCreate - Whether to show the create option (default: false)
 */
export default function SearchSelectCreate({
    onSearch,
    onCreate,
    onSelect,
    onRemove,
    selectedItems = [],
    placeholder = 'Search...',
    createLabel = 'Create',
    displayKey = 'title',
    valueKey = 'id',
    className = '',
    isMulti = true,
    allowCreate = false
}) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const searchTimeout = useRef(null)

    // Helper to get selected item(s) regardless of input format
    const currentSelected = Array.isArray(selectedItems) ? selectedItems : (selectedItems ? [selectedItems] : [])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = async (val) => {
        setQuery(val)
        if (searchTimeout.current) clearTimeout(searchTimeout.current)

        setShowDropdown(true)
        setIsSearching(true)

        searchTimeout.current = setTimeout(async () => {
            try {
                if (onSearch) {
                    const data = await onSearch(val)
                    setResults(data || [])
                }
            } catch (error) {
                console.error('Search failed:', error)
            } finally {
                setIsSearching(false)
            }
        }, val.length === 0 ? 0 : 300)
    }

    const handleSelect = (item) => {
        onSelect(item)
        setQuery('')
        setResults([])
        setShowDropdown(false)
    }

    const handleCreate = async () => {
        if (!query.trim()) return
        if (onCreate) {
            setIsSearching(true)
            try {
                const newItem = await onCreate(query)
                if (newItem) {
                    handleSelect(newItem)
                }
            } catch (error) {
                console.error('Creation failed:', error)
            } finally {
                setIsSearching(false)
            }
        }
    }

    const isItemSelected = (item) => {
        return currentSelected.some(selected => {
            const selectedVal = selected[valueKey] || selected
            const itemVal = item[valueKey] || item
            return selectedVal === itemVal
        })
    }

    return (
        <div className={cn('relative w-full', className)} ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => handleSearch(query)}
                    placeholder={!isMulti && currentSelected.length > 0 ? (currentSelected[0][displayKey] || currentSelected[0]) : placeholder}
                    className={cn(
                        "pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:ring-[#387cae]/20 transition-all",
                        !isMulti && currentSelected.length > 0 && query.length === 0 && "placeholder:text-gray-900 placeholder:font-semibold"
                    )}
                />

                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#387cae]" />
                    ) : !isMulti && currentSelected.length > 0 && query.length === 0 ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(currentSelected[0]);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    ) : (
                        <ChevronDown className={cn(
                            "h-4 w-4 text-gray-400 transition-transform duration-200",
                            showDropdown && "rotate-180"
                        )} />
                    )}
                </div>
            </div>

            {showDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {results.length > 0 ? (
                            results.map((item, index) => {
                                const isSelected = isItemSelected(item)
                                return (
                                    <div
                                        key={item[valueKey] || index}
                                        onClick={() => !isSelected && handleSelect(item)}
                                        className={cn(
                                            'px-4 py-3 flex items-center justify-between cursor-pointer transition-colors border-b border-gray-50 last:border-0',
                                            isSelected ? 'bg-gray-50 cursor-default opacity-60' : 'hover:bg-[#387cae]/5'
                                        )}
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {item[displayKey] || item.name || item}
                                        </span>
                                        {isSelected && <Check className="h-4 w-4 text-[#387cae]" />}
                                    </div>
                                )
                            })
                        ) : !isSearching && query.length > 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                No results found
                            </div>
                        ) : null}
                    </div>

                    {allowCreate && onCreate && query.length > 0 && !results.some(r => {
                        const rTitle = (r[displayKey] || r).toString().toLowerCase()
                        return rTitle === query.toLowerCase()
                    }) && (
                            <div
                                onClick={handleCreate}
                                className="p-2 border-t border-gray-100 bg-gray-50/50"
                            >
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-start gap-2 h-10 text-[#387cae] hover:text-[#387cae]/90 hover:bg-[#387cae]/5 rounded-lg text-xs font-bold"
                                >
                                    <Plus className="h-4 w-4" />
                                    {createLabel} "{query}"
                                </Button>
                            </div>
                        )}
                </div>
            )}

            {isMulti && currentSelected.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {currentSelected.map((item, index) => (
                        <div
                            key={item[valueKey] || index}
                            className="bg-[#387cae]/10 text-[#387cae] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#387cae]/20 flex items-center gap-2 group animate-in slide-in-from-left-2 duration-200"
                        >
                            {item[displayKey] || item.name || item}
                            <button
                                type="button"
                                onClick={() => onRemove(item)}
                                className="text-[#387cae]/40 hover:text-[#387cae] transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
