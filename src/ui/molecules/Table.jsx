'use client'
import React, { useEffect, useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown } from 'lucide-react'
import SearchInput from './SearchInput'
import ShimmerEffect from './ShimmerEffect'

const Table = ({
  data,
  columns,
  pagination,
  onPageChange,
  onSearch,
  loading = false,
  showSearch = true,
  emptyContent = null
}) => {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages,
    state: {
      sorting: sorting,
      pagination: {
        pageIndex: pagination?.currentPage - 1,
        pageSize: 9
      }
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPageIndex = updater(table.getState().pagination).pageIndex
        onPageChange(newPageIndex + 1)
      }
    }
  })

  const handleSearch = (value) => {
    setFiltering(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (value === '') {
      // Immediately call onSearch with an empty query
      onSearch('')
    } else {
      // Debounce the search for non-empty queries
      const timeoutId = setTimeout(() => {
        onSearch(value)
      }, 300)
      setSearchTimeout(timeoutId)
    }
  }

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  return (
    <div className='w-full p-4 space-y-4'>
      {/* Search Input */}
      {showSearch && (
        <SearchInput
          className='max-w-md'
          value={filtering}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search...'
        />
      )}

      {/* Table Container */}
      {loading ? (
        <ShimmerEffect />
      ) : (
        <div className='overflow-x-auto rounded-lg border shadow'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                    >
                      <div className='flex items-center space-x-1'>
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        <span className='inline-block w-4'>
                          {header.column.getIsSorted() === 'asc' ? (
                            <ChevronUp className='w-4 h-4' />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <ChevronDown className='w-4 h-4' />
                          ) : null}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className='hover:bg-gray-50'>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='px-6 py-12 text-center text-gray-500'
                  >
                    {emptyContent || 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='text-sm text-gray-700'>
          Page {pagination?.currentPage} of {pagination?.totalPages}
          (Showing{' '}
          {Math.min(
            (pagination?.currentPage - 1) * 10 + 1,
            pagination?.total
          )}{' '}
          - {Math.min(pagination?.currentPage * 10, pagination?.total)} of{' '}
          {pagination?.total} items)
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination?.currentPage === 1 || !pagination?.total || pagination?.total === 0}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            First
          </button>

          <button
            onClick={() => onPageChange(pagination?.currentPage - 1)}
            disabled={pagination?.currentPage === 1 || !pagination?.total || pagination?.total === 0}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Previous
          </button>

          <button
            onClick={() => onPageChange(pagination?.currentPage + 1)}
            disabled={pagination?.currentPage === pagination?.totalPages || !pagination?.total || pagination?.total === 0}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Next
          </button>

          <button
            onClick={() => onPageChange(pagination?.totalPages)}
            disabled={pagination?.currentPage === pagination?.totalPages || !pagination?.total || pagination?.total === 0}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Last
          </button>
        </div>
      </div>
    </div>
  )
}

export default Table
