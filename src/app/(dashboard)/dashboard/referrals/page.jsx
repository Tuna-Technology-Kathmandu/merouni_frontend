'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { fetchReferrals, updateReferralStatus, deleteReferral } from './action'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
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
} from '@/ui/shadcn/table'
import { Button } from '@/ui/shadcn/button'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import CollegesDropdown from '@/ui/molecules/dropdown/CollegesDropdown'
import { Select } from '@/ui/shadcn/select'
import { Label } from '@/ui/shadcn/label'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'

const ReferralsPage = () => {
  const { setHeading } = usePageHeading()
  const [referrals, setReferrals] = useState([])
  const [allReferrals, setAllReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [referralToDelete, setReferralToDelete] = useState(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState(null)
  const [statusForm, setStatusForm] = useState({
    status: 'IN_PROGRESS',
    remarks: ''
  })

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [collegeFilter, setCollegeFilter] = useState('')

  // Dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [statusSearchTerm, setStatusSearchTerm] = useState('')

  // Get user role from Redux
  const rawRole = useSelector((state) => state.user?.data?.role)

  // Check if user is an institution/college (has institution role but not admin/editor)
  const isInstitution = useMemo(() => {
    const role = typeof rawRole === 'string' ? destr(rawRole) : rawRole || {}
    return !!(role?.institution && !role?.admin && !role?.editor)
  }, [rawRole])

  // Check if user is a student (has student role but not admin/editor)
  const isStudent = useMemo(() => {
    const role = typeof rawRole === 'string' ? destr(rawRole) : rawRole || {}
    return !!(role?.student && !role?.admin && !role?.editor)
  }, [rawRole])

  useEffect(() => {
    setHeading(isStudent ? 'Applied Colleges' : 'Referrals')
    return () => setHeading(null)
  }, [setHeading, isStudent])

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const data = await fetchReferrals(1, isStudent)
        // For students, the API returns an array directly
        const referralsArray = Array.isArray(data)
          ? data
          : data.items || data.referrals || []
        setAllReferrals(referralsArray)
        setReferrals(referralsArray)
      } catch (err) {
        setError(err.message)
        console.error('Error loading referrals:', err)
      } finally {
        setLoading(false)
      }
    }

    loadReferrals()
  }, [isStudent])

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

  // Filter referrals based on search and filters
  useEffect(() => {
    let filtered = [...allReferrals]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((referral) => {
        const studentName = (referral.student_name || '').toLowerCase()
        const studentEmail = (referral.student_email || '').toLowerCase()
        const studentPhone = (referral.student_phone_no || '').toLowerCase()
        const collegeName = (referral.referralCollege?.name || '').toLowerCase()
        const agentName = referral.referralAgent
          ? `${referral.referralAgent.firstName || ''} ${referral.referralAgent.lastName || ''}`.toLowerCase()
          : ''

        return (
          studentName.includes(query) ||
          studentEmail.includes(query) ||
          studentPhone.includes(query) ||
          collegeName.includes(query) ||
          agentName.includes(query)
        )
      })
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((referral) => referral.status === statusFilter)
    }

    // College filter
    if (collegeFilter) {
      filtered = filtered.filter(
        (referral) => referral.referralCollege?.id === parseInt(collegeFilter)
      )
    }

    setReferrals(filtered)
  }, [searchQuery, statusFilter, collegeFilter, allReferrals])

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

  const handleOpenStatusModal = (referral) => {
    setSelectedReferral(referral)
    setStatusForm({
      status: referral.status || 'IN_PROGRESS',
      remarks: referral.remarks || ''
    })
    setStatusModalOpen(true)
  }

  const handleCloseStatusModal = () => {
    setStatusModalOpen(false)
    setSelectedReferral(null)
    setStatusForm({
      status: 'IN_PROGRESS',
      remarks: ''
    })
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    if (!selectedReferral) return

    try {
      setUpdatingId(selectedReferral.id)
      await updateReferralStatus(
        selectedReferral.id,
        statusForm.status,
        statusForm.remarks || null
      )
      setAllReferrals((prev) =>
        prev.map((ref) =>
          ref.id === selectedReferral.id
            ? {
              ...ref,
              status: statusForm.status,
              remarks: statusForm.remarks || null
            }
            : ref
        )
      )
      setReferrals((prev) =>
        prev.map((ref) =>
          ref.id === selectedReferral.id
            ? {
              ...ref,
              status: statusForm.status,
              remarks: statusForm.remarks || null
            }
            : ref
        )
      )
      toast.success('Referral status updated successfully')
      handleCloseStatusModal()
    } catch (err) {
      setError(err.message || 'Failed to update referral status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteClick = (id) => {
    setReferralToDelete(id)
    setDeleteConfirmationOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!referralToDelete) return

    try {
      setDeletingId(referralToDelete)
      await deleteReferral(referralToDelete)
      setAllReferrals((prev) => prev.filter((ref) => ref.id !== referralToDelete))
      setReferrals((prev) => prev.filter((ref) => ref.id !== referralToDelete))
      toast.success('Referral deleted successfully')
    } catch (err) {
      setError(err.message || 'Failed to delete referral')
    } finally {
      setDeletingId(null)
      setDeleteConfirmationOpen(false)
      setReferralToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false)
    setReferralToDelete(null)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setCollegeFilter('')
    setStatusSearchTerm('')
  }

  const hasActiveFilters = searchQuery || statusFilter || collegeFilter

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
          {/* Search Input */}
          <SearchInput
            className='flex-1'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder='Search by student name, email, phone, college, or agent...'
          />

          {/* Status Filter - Searchable Dropdown */}
          <div className='relative' ref={statusDropdownRef}>
            <Filter className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10' />
            <button
              type='button'
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen)
                setCollegeDropdownOpen(false)
              }}
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

          {/* College Filter - Searchable Dropdown */}
          <CollegesDropdown
            value={collegeFilter}
            onChange={setCollegeFilter}
            placeholder='All Colleges'
            minWidth={200}
          />

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
            Showing {referrals.length} of {allReferrals.length} referrals
          </div>
        )}
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[60px] text-gray-600'>S.N.</TableHead>
              <TableHead className='text-gray-600'>Student Details</TableHead>
              <TableHead className='text-gray-600'>Applied College</TableHead>
              {!isInstitution && (
                <>
                  <TableHead className='text-gray-600'>Referred By</TableHead>
                  <TableHead className='text-gray-600'>
                    Application Type
                  </TableHead>
                </>
              )}
              <TableHead className='text-gray-600'>Status</TableHead>
              <TableHead className='text-gray-600'>Remarks</TableHead>
              {!isStudent && (
                <TableHead className='text-center text-gray-600'>
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    isStudent
                      ? isInstitution
                        ? 5
                        : 7
                      : isInstitution
                        ? 6
                        : 8
                  }
                  className='text-center py-8 text-muted-foreground'
                >
                  No referrals found
                </TableCell>
              </TableRow>
            ) : (
              referrals.map((referral, index) => (
                <TableRow key={referral.id}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell>
                    <div className='flex flex-col space-y-1'>
                      <div className='font-medium'>
                        {referral.student_name || 'N/A'}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {referral.student_email || 'N/A'}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {referral.student_phone_no || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {referral.referralCollege?.name || 'N/A'}
                  </TableCell>
                  {!isInstitution && (
                    <>
                      <TableCell>
                        {referral.referralAgent
                          ? `${referral.referralAgent.firstName} ${referral.referralAgent.middleName || ''
                            } ${referral.referralAgent.lastName}`.trim()
                          : referral.application_type === 'self'
                            ? 'Self'
                            : 'N/A'}
                      </TableCell>
                      <TableCell className='capitalize'>
                        {referral.application_type}
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${referral.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800'
                        : referral.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {referral.status || 'IN_PROGRESS'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {referral.remarks
                        ? referral.remarks.length > 50
                          ? `${referral.remarks.substring(0, 50)}...`
                          : referral.remarks
                        : 'N/A'}
                    </span>
                  </TableCell>
                  {!isStudent && (
                    <TableCell>
                      <div className='flex items-center justify-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleOpenStatusModal(referral)}
                          disabled={updatingId === referral.id}
                          title='Update Status'
                        >
                          <FaEdit className='h-4 w-4 text-blue-600' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteClick(referral.id)}
                          disabled={deletingId === referral.id}
                          title='Delete'
                        >
                          <FaTrashAlt className='h-4 w-4 text-red-600' />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Update Status Modal */}
      {/* Update Status Modal */}
      <Dialog
        isOpen={statusModalOpen}
        onClose={handleCloseStatusModal}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Update Referral Status</DialogTitle>
          </DialogHeader>
        <form onSubmit={handleStatusSubmit} className='space-y-4'>
          <div>
            <Label className='block text-sm font-medium text-gray-700 mb-1'>
              Status <span className='text-red-500'>*</span>
            </Label>
            <Select
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
            </Select>
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
            <Button
              type='button'
              onClick={handleCloseStatusModal}
              variant='outline'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={updatingId === selectedReferral?.id}
            >
              {updatingId === selectedReferral?.id ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </form>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this referral? This action cannot be undone.'
      />
    </div>
  )
}

export default ReferralsPage
