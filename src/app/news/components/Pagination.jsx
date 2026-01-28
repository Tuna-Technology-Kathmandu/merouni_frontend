'use client'
import React from 'react'

const Pagination = ({ pagination, onPageChange }) => {
    const { currentPage, totalPages } = pagination
    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    return (
        <div className='flex items-center justify-center mt-8 mb-10'>
            <button
                className='px-4 py-2 bg-gray-300 rounded-full mx-2 disabled:opacity-50'
                onClick={handlePrevious}
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button
                className='px-4 py-2 bg-gray-300 rounded-full mx-2 disabled:opacity-50'
                onClick={handleNext}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    )
}

export default Pagination
