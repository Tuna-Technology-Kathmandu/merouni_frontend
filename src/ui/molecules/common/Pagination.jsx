'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const Pagination = ({ currentPage, totalPages }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    router.push(`?${params.toString()}`)
  }

  const renderPageButtons = () => {
    const buttons = []
    const range = 1 // Number of pages to show on each side of the current page

    // Previous button
    buttons.push(
      <button
        key='prev'
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200'
      >
        Previous
      </button>
    )

    // Always show the first page
    if (currentPage > range + 2) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className='px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'
        >
          1
        </button>
      )
      if (currentPage > range + 3) {
        buttons.push(
          <span key='ellipsis-start' className='px-2'>
            ...
          </span>
        )
      }
    }

    // Pages around the current page
    const startPage = Math.max(1, currentPage - range)
    const endPage = Math.min(totalPages, currentPage + range)

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${currentPage === i
              ? 'bg-[#0A6FA7] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          {i}
        </button>
      )
    }

    // Always show the last page
    if (currentPage < totalPages - range - 1) {
      if (currentPage < totalPages - range - 2) {
        buttons.push(
          <span key='ellipsis-end' className='px-2'>
            ...
          </span>
        )
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className='px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200'
        >
          {totalPages}
        </button>
      )
    }

    // Next button
    buttons.push(
      <button
        key='next'
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200'
      >
        Next
      </button>
    )

    return buttons
  }

  return (
    <div className='flex justify-center gap-2 mt-6 mb-4'>
      {renderPageButtons()}
    </div>
  )
}

export default Pagination
