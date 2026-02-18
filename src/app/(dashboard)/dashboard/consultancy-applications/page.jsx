'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import { fetchConsultancyApplications, updateApplicationStatus } from './action'
import { FaEdit } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import ShimmerEffect from '../../../../ui/molecules/ShimmerEffect'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/ui/shadcn/table-primitives'
import { Button } from '@/ui/shadcn/button'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import SearchInput from '@/ui/molecules/SearchInput'

const ConsultancyApplicationsPage = () => {
  const { setHeading } = usePageHeading()
  const [applications, setApplications] = useState([])
  const [allApplications, setAllApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusForm, setStatusForm] = useState({
    status: 'IN_PROGRESS',
    remarks: ''
  })

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [statusSearchTerm, setStatusSearchTerm] = useState('')

  useEffect(() => {
    setHeading('Consultancy Applications')
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await fetchConsultancyApplications()
        setAllApplications(data)
        setApplications(data)
      } catch (err) {
        setError(err.message)
        console.error('Error loading applications:', err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [])

  // Refs for dropdown click outside
  const statusDropdownRef = useRef(null)

  // Status options
  const statusOptions = useMemo(
    () => [
      { value: '', label: 'All Status' },
      { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
      { value: 'ACCEPTED', label: 'ACCEPTED' },
      { value: 'REJECTED', label: 'REJECTED' }
    ],
    []
  )

  // Filtered status options
  const filteredStatusOptions = useMemo(() => {
    if (!statusSearchTerm) return statusOptions
    return statusOptions.filter((option) =>
      option.label.toLowerCase().includes(statusSearchTerm.toLowerCase())
    )
  }, [statusOptions, statusSearchTerm])

  // Get selected status label
  const selectedStatusLabel = useMemo(
    () =>
      statusOptions.find((opt) => opt.value === statusFilter)?.label ||
      'All Status',
    [statusOptions, statusFilter]
  )

  // Filter applications based on search and filters
  useEffect(() => {
    let filtered = [...allApplications]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((app) => {
        const studentName = (app.student_name || '').toLowerCase()
        const studentEmail = (app.student_email || '').toLowerCase()
        const studentPhone = (app.student_phone_no || '').toLowerCase()
        const consultancyTitle = (app.consultancy?.title || '').toLowerCase()

        return (
          studentName.includes(query) ||
          studentEmail.includes(query) ||
          studentPhone.includes(query) ||
          consultancyTitle.includes(query)
        )
      })
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setApplications(filtered)
  }, [searchQuery, statusFilter, allApplications])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpenStatusModal = (application) => {
    setSelectedApplication(application)
    setStatusForm({
      status: application.status || 'IN_PROGRESS',
      remarks: application.remarks || ''
    })
    setStatusModalOpen(true)
  }

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false)
    setSelectedApplication(null)
    setStatusForm({
      status: 'IN_PROGRESS',
      remarks: ''
    })
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    if (!selectedApplication) return

    try {
      setUpdatingId(selectedApplication.id)
      await updateApplicationStatus(
        selectedApplication.id,
        statusForm.status,
        statusForm.remarks || null
      )
      setAllApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApplication.id
            ? {
              ...app,
              status: statusForm.status,
              remarks: statusForm.remarks || null
            }
            : app
        )
      )
      handleCloseStatusModal()
    } catch (err) {
      setError(err.message || 'Failed to update application status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setStatusSearchTerm('')
  }

  const hasActiveFilters = searchQuery || statusFilter

  if (loading) return <ShimmerEffect />
  if (error)
    return (
      <p className='flex items-center justify-center text-center'>
        Error: {error}
      </p>
    )

  return (
    <div className='p-4 bg-white min-h-screen'>
      {/* Search and Filter Section */}
      <div className='mb-6 space-y-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          {/* Search Input */}
                                 <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search applications...'
            className='max-w-md'
          />

          {/* Status Filter - Searchable Dropdown */}
          <div className='relative' ref={statusDropdownRef}>
            <Filter className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10' />
            <button
              type='button'
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className='w-full pl-10 pr-8 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[180px] hover:bg-gray-50 transition-colors'
            >
              <span
                className={statusFilter ? 'text-gray-900' : 'text-gray-500'}
              >
                {selectedStatusLabel}
              </span>
            </button>
            <ChevronDown
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''
                }`}
            />

            {statusDropdownOpen && (
              <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden'>
                <div className='p-2 border-b border-gray-200'>
                  <div className='relative'>
                    <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <input
                      type='text'
                      placeholder='Search status...'
                      value={statusSearchTerm}
                      onChange={(e) => setStatusSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className='w-full pl-8 pr-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
                      autoFocus
                    />
                  </div>
                </div>
                <div className='max-h-48 overflow-y-auto'>
                  {filteredStatusOptions.length > 0 ? (
                    filteredStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        type='button'
                        onClick={() => {
                          setStatusFilter(option.value)
                          setStatusSearchTerm('')
                          setStatusDropdownOpen(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${statusFilter === option.value
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'text-gray-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))
                  ) : (
                    <div className='px-3 py-2 text-sm text-gray-500 text-center'>
                      No status found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant='outline'
              onClick={handleClearFilters}
              className='whitespace-nowrap'
            >
              <X className='w-4 h-4 mr-1' />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Count */}
        {hasActiveFilters && (
          <div className='text-sm text-gray-600'>
            Showing {applications.length} of {allApplications.length} applications
          </div>
        )}
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[60px] text-gray-600'>S.N.</TableHead>
              <TableHead className='text-gray-600'>Student Details</TableHead>
              <TableHead className='text-gray-600'>Consultancy</TableHead>
              <TableHead className='text-gray-600'>Status</TableHead>
              <TableHead className='text-gray-600'>Remarks</TableHead>
              <TableHead className='text-center text-gray-600'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-8 text-muted-foreground'
                >
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app, index) => (
                <TableRow key={app.id}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>
                    <div className='flex flex-col space-y-1'>
                      <div className='font-medium'>
                        {app.student_name || 'N/A'}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {app.student_email || 'N/A'}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {app.student_phone_no || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {app.consultancy?.title || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${app.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-800'
                          : app.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {app.status || 'IN_PROGRESS'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {app.remarks
                        ? app.remarks.length > 50
                          ? `${app.remarks.substring(0, 50)}...`
                          : app.remarks
                        : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center justify-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleOpenStatusModal(app)}
                        disabled={updatingId === app.id}
                        title='Update Status'
                      >
                        <FaEdit className='h-4 w-4 text-blue-600' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Update Status Modal */}
      <Dialog
        isOpen={statusModalOpen}
        onClose={handleCloseStatusModal}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
          </DialogHeader>
        <form onSubmit={handleStatusSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status <span className='text-red-500'>*</span>
            </label>
            <select
              className='w-full p-2 border rounded'
              value={statusForm.status}
              onChange={(e) =>
                setStatusForm({ ...statusForm, status: e.target.value })
              }
              required
            >
              <option value='IN_PROGRESS'>IN_PROGRESS</option>
              <option value='ACCEPTED'>ACCEPTED</option>
              <option value='REJECTED'>REJECTED</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Remarks
            </label>
            <textarea
              className='w-full p-2 border rounded'
              rows={4}
              value={statusForm.remarks}
              onChange={(e) =>
                setStatusForm({ ...statusForm, remarks: e.target.value })
              }
              placeholder='Enter remarks (optional)'
            />
          </div>

          {error && <div className='text-red-500 text-sm'>{error}</div>}

          <div className='flex justify-end gap-2 pt-2'>
            <button
              type='button'
              onClick={handleCloseStatusModal}
              className='px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={updatingId === selectedApplication?.id}
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50'
            >
              {updatingId === selectedApplication?.id ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ConsultancyApplicationsPage
