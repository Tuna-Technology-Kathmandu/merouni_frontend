'use client'
import { Search, X } from 'lucide-react'

const SearchInput = ({
    value,
    onChange,
    onClear,
    placeholder = 'Search...',
    icon: Icon = Search,
    showIcon = true,
    className = '',
    inputClassName = '',
    ...props
}) => {
    return (
        <div className={`relative w-full ${className}`}>
            {showIcon && (
                <Icon className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none' />
            )}
            <input
                type='text'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full ${showIcon ? 'pl-10' : 'pl-4'} ${onClear && value ? 'pr-9' : 'pr-4'} py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A6FA7]/20 focus:border-[#0A6FA7] transition-all bg-white ${inputClassName}`}
                {...props}
            />
            {onClear && value && (
                <button
                    onClick={onClear}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors'
                    aria-label='Clear search'
                >
                    <X className='w-3.5 h-3.5' />
                </button>
            )}
        </div>
    )
}

export default SearchInput
