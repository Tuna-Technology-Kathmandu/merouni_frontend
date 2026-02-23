'use client'
import React, { useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown } from 'lucide-react'
import SearchInput from '../molecules/SearchInput'
import CircularLoader from '../molecules/CircularLoader'
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './table-primitives'
import { Button } from '@/ui/shadcn/button'

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
        pageSize: 10
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
      onSearch('')
    } else {
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
    <div className='w-full space-y-4'>
      {/* Search Input */}
      {showSearch && (
        <div>
          <SearchInput
            className='max-w-md'
            value={filtering}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search...'
          />
        </div>
      )}

      {/* Table Container */}
      {loading ? (
        <div className='flex justify-center items-center py-24 bg-white border rounded-md'>
          <CircularLoader size='w-8 h-8' />
        </div>
      ) : (
        <div className='rounded-md border bg-white'>
          <ShadcnTable>
            <TableHeader className='bg-white'>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='hover:bg-white'>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    >
                      <div className='flex items-center space-x-1'>
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className='inline-block w-4'>
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className='w-4 h-4' />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className='w-4 h-4' />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className='bg-white'>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className='hover:bg-gray-50'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className='hover:bg-white'>
                  <TableCell
                    colSpan={columns.length}
                    className='py-24 text-center text-muted-foreground'
                  >
                    {emptyContent || 'No results found.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ShadcnTable>
        </div>
      )}

      {/* Pagination Controls */}
      <div className='flex items-center justify-between px-4 py-2 border-t bg-white rounded-b-md'>
        <div className='text-sm text-gray-600'>
          Page {pagination?.currentPage} of {pagination?.totalPages}
          {' '}({pagination?.total || 0} total items)
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(1)}
            disabled={pagination?.currentPage === 1 || !pagination?.total}
          >
            First
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(pagination?.currentPage - 1)}
            disabled={pagination?.currentPage === 1 || !pagination?.total}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(pagination?.currentPage + 1)}
            disabled={pagination?.currentPage === pagination?.totalPages || !pagination?.total}
          >
            Next
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(pagination?.totalPages)}
            disabled={pagination?.currentPage === pagination?.totalPages || !pagination?.total}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Table
