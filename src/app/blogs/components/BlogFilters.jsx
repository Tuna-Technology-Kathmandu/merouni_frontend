import React from 'react'
import { IoSearch } from 'react-icons/io5'

const BlogFilters = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories
}) => {
    return (
        <div className='flex flex-col gap-8 mb-10'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-6'>
                {/* Header */}
                <div className='relative'>
                    <h2 className='text-3xl font-extrabold text-gray-800'>
                        Explore <span className='text-[#0A70A7]'>Blogs</span>
                    </h2>
                    <div className='absolute -bottom-2 left-0 w-12 h-1 bg-[#0A70A7] rounded-full'></div>
                </div>

                {/* Search Input */}
                <div className='w-full md:w-[320px]'>
                    <div className='relative group'>
                        <IoSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0A70A7] transition-colors text-lg' />
                        <input
                            type='text'
                            placeholder='Search articles...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full py-3 pl-12 pr-4 bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-700 shadow-sm focus:border-[#0A70A7] focus:ring-2 focus:ring-[#0A70A7]/20 transition-all'
                        />
                    </div>
                </div>
            </div>

            {/* Category Filter Pills */}
            <div className='flex flex-wrap gap-2'>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat.id
                                ? 'bg-[#0A70A7] text-white shadow-md shadow-blue-500/20'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0A70A7] hover:text-[#0A70A7]'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default BlogFilters
