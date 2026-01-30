'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PackageOpen } from 'lucide-react'

const EmptyState = ({
    icon: Icon = PackageOpen,
    title = "No results found",
    description = "We couldn't find what you're looking for. Please try adjusting your filters or search terms.",
    action,
    className = ""
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col items-center justify-center text-center p-8 md:p-16 min-h-[400px] bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm ${className}`}
        >
            <div className='mb-6 relative'>
                <div className='absolute inset-0 bg-blue-50 rounded-full scale-150 blur-xl opacity-50'></div>
                <div className='relative bg-white p-6 rounded-3xl shadow-md text-[#0A70A7] border border-gray-50'>
                    {React.isValidElement(Icon) ? (
                        Icon
                    ) : (
                        <Icon size={48} strokeWidth={1.5} />
                    )}
                </div>
            </div>

            <h3 className='text-2xl font-bold text-gray-900 mb-3 tracking-tight'>
                {title}
            </h3>

            <p className='text-gray-500 max-w-sm mx-auto text-base leading-relaxed mb-8'>
                {description}
            </p>

            {action && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.onClick}
                    className='px-8 py-3.5 bg-[#0A70A7] text-white text-sm font-bold rounded-2xl hover:bg-[#085a86] transition-all shadow-lg shadow-blue-100 uppercase tracking-widest'
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    )
}

export default EmptyState
