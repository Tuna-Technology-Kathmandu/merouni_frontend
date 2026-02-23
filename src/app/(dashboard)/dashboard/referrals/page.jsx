'use client'

import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { fetchReferrals, updateReferralStatus, deleteReferral } from './action'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/ui/shadcn/dialog'
import Loading from '../../../../ui/molecules/Loading'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import Table from '@/ui/shadcn/DataTable'
import { Button } from '@/ui/shadcn/button'
import { Search, X, Filter, ChevronDown, Edit2, Trash2, Eye } from 'lucide-react'
import CollegesDropdown from '@/ui/molecules/dropdown/CollegesDropdown'
import { Select } from '@/ui/shadcn/select'
import { Label } from '@/ui/shadcn/label'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'
import { Textarea } from '@/ui/shadcn/textarea'

const ReferralsPage = () => {
  const { setHeading } = usePageHeading()
  const [referrals, setReferrals] = useState([])
  const [allReferrals, setAllReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
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

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false)

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
    loadReferrals()
    return () => setHeading(null)
  }, [setHeading, isStudent])

  const loadReferrals = async (page = 1) => {
    setTableLoading(true)
    try {
      const data = await fetchReferrals(page, isStudent)
      // For students, the API returns an array directly
      // For admin, it returns { items, pagination }
      if (isStudent) {
        const referralsArray = Array.isArray(data) ? data : data.items || []
        setAllReferrals(referralsArray)
        setReferrals(referralsArray)
        setPagination({
          currentPage: 1,
          totalPages: 1,
          total: referralsArray.length
        })
      } else {
        const referralsArray = data.items || data.referrals || []
        setAllReferrals(referralsArray)
        setReferrals(referralsArray)
        setPagination({
          currentPage: data.pagination?.currentPage || 1,
          totalPages: data.pagination?.totalPages || 1,
          total: data.pagination?.totalCount || referralsArray.length
        })
      }
    } catch (err) {
      setError(err.message)
      console.error('Error loading referrals:', err)
      toast.error('Failed to load referrals')
    } finally {
      setLoading(false)
      setTableLoading(false)
    }
  }

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

  // Filter referrals based on search and filters (Local filtering for now)
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

      const updatedItem = {
        ...selectedReferral,
        status: statusForm.status,
        remarks: statusForm.remarks || null
      }

      setAllReferrals((prev) =>
        prev.map((ref) => ref.id === selectedReferral.id ? updatedItem : ref)
      )

      toast.success('Referral status updated successfully')
      handleCloseStatusModal()
    } catch (err) {
      const errorMsg = err.message || 'Failed to update referral status'
      setError(errorMsg)
      toast.error(errorMsg)
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
      toast.success('Referral deleted successfully')
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete referral'
      setError(errorMsg)
      toast.error(errorMsg)
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

  const columns = useMemo(() => {
    const cols = [
      {
        header: 'S.N.',
        accessorKey: 'id',
        cell: ({ row }) => <span className="text-gray-500 font-medium">{row.index + 1}</span>
      },
      {
        header: 'Student Details',
        accessorKey: 'student_name',
        cell: ({ row }) => (
          <div className='flex flex-col space-y-1 py-1'>
            <div className='font-semibold text-gray-900'>
              {row.original.student_name || 'N/A'}
            </div>
            <div className='text-xs text-slate-500 flex items-center gap-1'>
              <span className="opacity-70">Email:</span> {row.original.student_email || 'N/A'}
            </div>
            <div className='text-xs text-slate-500 flex items-center gap-1'>
              <span className="opacity-70">Phone:</span> {row.original.student_phone_no || 'N/A'}
            </div>
          </div>
        )
      },
      {
        header: 'Applied College',
        accessorKey: 'referralCollege.name',
        cell: ({ row }) => (
          <div className="font-medium text-blue-700">
            {row.original.referralCollege?.name || 'N/A'}
          </div>
        )
      }
    ]

    if (!isInstitution) {
      cols.push(
        {
          header: 'Referred By',
          accessorKey: 'referralAgent',
          cell: ({ row }) => {
            if (row.original.referralAgent) {
              const agent = row.original.referralAgent
              return (
                <div className="text-sm font-medium">
                  {`${agent.firstName} ${agent.middleName || ''} ${agent.lastName}`.trim()}
                </div>
              )
            }
            return row.original.application_type === 'self' ? (
              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">Self</span>
            ) : (
              <span className="text-gray-400">N/A</span>
            )
          }
        },
        {
          header: 'Type',
          accessorKey: 'application_type',
          cell: ({ row }) => (
            <span className='capitalize text-xs font-medium px-2 py-1 bg-gray-100 rounded-md'>
              {row.original.application_type}
            </span>
          )
        }
      )
    }

    cols.push(
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'IN_PROGRESS'
          const styles = {
            ACCEPTED: 'bg-green-100 text-green-700 border-green-200',
            REJECTED: 'bg-red-100 text-red-700 border-red-200',
            IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200'
          }
          return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles[status] || styles.IN_PROGRESS}`}>
              {status}
            </span>
          )
        }
      },
      {
        header: 'Remarks',
        accessorKey: 'remarks',
        cell: ({ row }) => (
          <div className='text-sm text-slate-600 max-w-[200px] truncate' title={row.original.remarks}>
            {row.original.remarks || <span className="text-gray-400 italic">No remarks</span>}
          </div>
        )
      }
    )

    if (!isStudent) {
      cols.push({
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleOpenStatusModal(row.original)}
              className='h-8 w-8 text-blue-600 hover:bg-blue-50'
              title='Update Status'
            >
              <Edit2 className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => handleDeleteClick(row.original.id)}
              className='h-8 w-8 text-red-600 hover:bg-red-50'
              title='Delete'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        )
      })
    }

    return cols
  }, [isInstitution, isStudent])

  const hasActiveFilters = searchQuery || statusFilter || collegeFilter

  if (loading) return <Loading />

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      {/* Sticky Filter Header */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          <div className="flex flex-1 flex-col md:flex-row gap-4 w-full">
            <SearchInput
              className='flex-1'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder='Search by student name, email, phone, college, or agent...'
            />

            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div className='relative min-w-[180px]' ref={statusDropdownRef}>
                <Filter className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10' />
                <button
                  type='button'
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className='w-full pl-10 pr-8 py-2 text-left border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white text-sm transition-all hover:bg-gray-50'
                >
                  <span className={statusFilter ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                    {selectedStatusLabel}
                  </span>
                </button>
                <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />

                {statusDropdownOpen && (
                  <div className='absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200'>
                    <div className='p-2 border-b border-gray-100'>
                      <div className='relative'>
                        <Search className='absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                        <input
                          type='text'
                          placeholder='Search status...'
                          value={statusSearchTerm}
                          onChange={(e) => setStatusSearchTerm(e.target.value)}
                          className='w-full pl-8 pr-2 py-1.5 text-xs border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className='max-h-48 overflow-y-auto p-1'>
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
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${statusFilter === option.value
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            {option.label}
                          </button>
                        ))
                      ) : (
                        <div className='px-3 py-4 text-xs text-gray-400 text-center italic'>
                          No status found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* College Filter */}
              <CollegesDropdown
                value={collegeFilter}
                onChange={setCollegeFilter}
                placeholder='All Colleges'
                minWidth={200}
                className="rounded-lg border-gray-200 text-sm h-[42px]"
              />

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant='ghost'
                  onClick={handleClearFilters}
                  className='text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2 h-[42px]'
                >
                  <X className='w-4 h-4' />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          loading={tableLoading}
          data={referrals}
          columns={columns}
          pagination={pagination}
          onPageChange={(page) => loadReferrals(page)}
          showSearch={false}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No referrals found</h3>
              <p className="text-slate-500 max-w-sm mt-1">
                {hasActiveFilters
                  ? "Try adjusting your filters or search query to find what you're looking for."
                  : "There are no referral records to display at this time."}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                  Reset All Filters
                </Button>
              )}
            </div>
          }
        />
      </div>

      {/* Update Status Modal */}
      <Dialog
        isOpen={statusModalOpen}
        closeOnOutsideClick={false}
        onClose={handleCloseStatusModal}
        className='max-w-2xl'
      >
        <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">Update Referral Status</DialogTitle>
            <DialogClose onClick={handleCloseStatusModal} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6 bg-slate-50/30'>
            <form id="status-update-form" onSubmit={handleStatusSubmit} className='space-y-6'>
              <div className='bg-white p-6 rounded-xl border shadow-sm space-y-5'>
                <div className="space-y-2">
                  <Label required>Referral Status</Label>
                  <Select
                    className='w-full'
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    required
                  >
                    <option value='IN_PROGRESS'>IN_PROGRESS</option>
                    <option value='ACCEPTED'>ACCEPTED</option>
                    <option value='REJECTED'>REJECTED</option>
                  </Select>
                  <p className="text-[11px] text-slate-500">Select the current progress of this student referral.</p>
                </div>

                <div className="space-y-2">
                  <Label>Admin Remarks</Label>
                  <Textarea
                    className='min-h-[120px] resize-none'
                    value={statusForm.remarks}
                    onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                    placeholder='Enter notes about this status update...'
                  />
                  <p className="text-[11px] text-slate-500">These remarks will be visible to the referral source.</p>
                </div>

                {error && (
                  <div className='p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm flex items-center gap-2'>
                    <X className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCloseStatusModal}
              disabled={updatingId}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form="status-update-form"
              disabled={updatingId}
              className="min-w-[120px]"
            >
              {updatingId ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this referral? This action cannot be undone and will remove the record permanently.'
      />
    </div>
  )
}

export default ReferralsPage
