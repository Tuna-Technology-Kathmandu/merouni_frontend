'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search, PackageOpen, AlertCircle } from 'lucide-react'

const EmptyState = ({
    icon: Icon = PackageOpen,
    title = "No results found",
    description = "We couldn't find what you're looking for. Please try adjusting your filters or search terms.",
    action,
    className = ""
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center p-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 ${className}`}
        >
            <div className='bg-white p-5 rounded-full shadow-sm mb-6 text-gray-200'>
                <Icon className="w-10 h-10" />
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>{title}</h3>
            <p className='text-gray-500 max-w-sm mx-auto text-sm leading-relaxed'>
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className='mt-8 px-6 py-2.5 bg-[#0A70A7] text-white text-sm font-bold rounded-xl hover:bg-[#085a86] transition-all shadow-sm uppercase tracking-wider'
                >
                    {action.label}
                </button>
            )}
        </motion.div>
    )
}

export default EmptyState
