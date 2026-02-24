'use client'
import { Search, X } from 'lucide-react'
import { THEME_BLUE } from '@/constants/constants'

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
                className={`w-full ${showIcon ? 'pl-10' : 'pl-4'} ${onClear && value ? 'pr-9' : 'pr-4'} py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all bg-white ${inputClassName}`}
                style={{
                    '--tw-ring-color': `${THEME_BLUE}33`,
                    borderColor: value ? THEME_BLUE : undefined
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = THEME_BLUE;
                    e.target.style.boxShadow = `0 0 0 2px ${THEME_BLUE}33`;
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '';
                    e.target.style.boxShadow = '';
                }}
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
