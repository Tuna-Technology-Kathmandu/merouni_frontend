'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { fetchConsultancyApplications, fetchAllConsultancies, updateConsultancyApplicationStatus, deleteConsultancyApplication } from './action'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { Button } from '@/ui/shadcn/button'
import { Search, X, ChevronDown } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import Table from '../../../../ui/molecules/Table'
import SearchInput from '@/ui/molecules/SearchInput'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const ConsultancyReferralsPage = () => {
  const { setHeading } = usePageHeading()

  // Data State
  const [applications, setApplications] = useState([])
  const [consultancies, setConsultancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Action States
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [statusForm, setStatusForm] = useState({ status: 'PENDING', remarks: '' })

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [consultancyFilter, setConsultancyFilter] = useState('') // IDs as string

  const debouncedSearch = useDebounce(searchQuery, 500)

  // UI States
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)
  const [consultancyDropdownOpen, setConsultancyDropdownOpen] = useState(false)
  const statusDropdownRef = useRef(null)
  const consultancyDropdownRef = useRef(null)

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  useEffect(() => {
    setHeading('Consultancy Referrals')
    return () => setHeading(null)
  }, [setHeading])

  // Initial Load (Consultancies list only needs to load once)
  useEffect(() => {
    loadConsultancies()
  }, [])

  // Main Data Load Trigger
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, statusFilter, consultancyFilter, pagination.currentPage])

  const loadConsultancies = async () => {
    try {
      const consulData = await fetchAllConsultancies()
      const consulList = Array.isArray(consulData) ? consulData : (consulData.items || [])
      setConsultancies(consulList)
    } catch (err) {
      console.error("Failed to load consultancies", err)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.currentPage,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter && { status: statusFilter }),
        ...(consultancyFilter && { consultancy_id: consultancyFilter })
      }

      const response = await fetchConsultancyApplications(params)

      const appList = response.data || []
      const meta = response.pagination || {}

      setApplications(appList)

      setPagination(prev => ({
        ...prev,
        totalPages: meta.totalPages || (meta.totalPages) || Math.ceil((meta.totalItems || appList.length) / 10) || 1,
        total: meta.totalItems || (meta.total) || appList.length
      }))

    } catch (err) {
      console.error(err)
      toast.error('Failed to load data')
      setApplications([])
      setPagination(prev => ({ ...prev, total: 0, totalPages: 1 }))
    } finally {
      setLoading(false)
    }
  }

  // Handlers for Actions
  const handleOpenStatusModal = (app) => {
    setSelectedApp(app)
    setStatusForm({
      status: app.status || 'IN_PROGRESS',
      remarks: app.remarks || ''
    })
    setStatusModalOpen(true)
  }

  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    if (!selectedApp) return

    try {
      setUpdatingId(selectedApp.id)
      await updateConsultancyApplicationStatus(selectedApp.id, statusForm.status, statusForm.remarks)

      // Optimistic Update locally to avoid full reload
      setApplications(prev => prev.map(app =>
        app.id === selectedApp.id ? { ...app, status: statusForm.status, remarks: statusForm.remarks } : app
      ))

      toast.success('Status updated successfully')
      setStatusModalOpen(false)
    } catch (err) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteClick = (id) => {
    setApplicationToDelete(id)
    setDeleteConfirmationOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return

    try {
      setDeletingId(applicationToDelete)
      await deleteConsultancyApplication(applicationToDelete)
      setApplications((prev) => prev.filter((app) => app.id !== applicationToDelete))
      toast.success('Deleted successfully')
    } catch (err) {
      toast.error('Failed to delete')
    } finally {
      setDeletingId(null)
      setDeleteConfirmationOpen(false)
      setApplicationToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmationOpen(false)
    setApplicationToDelete(null)
  }

  // Handlers for Filters
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setPagination(prev => ({ ...prev, currentPage: 1 })) // Reset page on search
  }

  const handleStatusSelect = (status) => {
    setStatusFilter(status)
    setStatusDropdownOpen(false)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleConsultancySelect = (id) => {
    setConsultancyFilter(id)
    setConsultancyDropdownOpen(false)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('')
    setConsultancyFilter('')
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  // Click Outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setStatusDropdownOpen(false)
      }
      if (consultancyDropdownRef.current && !consultancyDropdownRef.current.contains(event.target)) {
        setConsultancyDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const statusOptions = ['IN_PROGRESS', 'ACCEPTED', 'REJECTED']
  const hasActiveFilters = searchQuery || statusFilter || consultancyFilter

  // Columns
  const columns = useMemo(() => [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Student Info',
      accessorKey: 'student_name',
      cell: ({ row }) => {
        const app = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{app.student_name}</span>
            <span className="text-xs text-gray-500">{app.student_email}</span>
            <span className="text-xs text-gray-500">{app.student_phone_no}</span>
          </div>
        )
      }
    },
    {
      header: 'Consultancy',
      accessorKey: 'consultancy.title',
      cell: ({ row }) => row.original.consultancy?.title || row.original.consultancy?.consultany_details?.name || 'N/A'
    },
    {
      header: 'Description',
      accessorKey: 'student_description',
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.student_description}>
          {row.original.student_description || '-'}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
              status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'}
                `}>
            {status || 'IN_PROGRESS'}
          </span>
        )
      }
    },
    {
      header: 'Remarks',
      accessorKey: 'remarks',
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.original.remarks}>
          {row.original.remarks || '-'}
        </div>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" onClick={() => handleOpenStatusModal(row.original)}>
            <FaEdit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(row.original.id)}>
            <FaTrashAlt className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ], [])

  if (error) {
    // Just log or toast, don't block
    console.error(error)
  }

  return (
    <div className='p-4 bg-white min-h-screen'>

      <div className='flex flex-col md:flex-row gap-4 mb-6'>
        {/* Search Filter */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)}
          placeholder='Search consultancy referrals...'
          className='max-w-md'
        />

        {/* Status Filter Dropdown */}
        <div className='relative' ref={statusDropdownRef}>
          <button
            type='button'
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className='w-full md:w-48 pl-4 pr-10 py-2 text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50'
          >
            <span className={statusFilter ? 'text-gray-900' : 'text-gray-500'}>
              {statusFilter || 'All Status'}
            </span>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {statusDropdownOpen && (
            <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden'>
              <button onClick={() => handleStatusSelect('')} className='w-full text-left px-4 py-2 hover:bg-gray-50 text-sm'>All Status</button>
              {statusOptions.map(option => (
                <button key={option} onClick={() => handleStatusSelect(option)} className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${statusFilter === option ? 'bg-blue-50 text-blue-600' : ''}`}>
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Consultancy Filter Dropdown */}
        <div className='relative' ref={consultancyDropdownRef}>
          <button
            type='button'
            onClick={() => setConsultancyDropdownOpen(!consultancyDropdownOpen)}
            className='w-full md:w-64 pl-4 pr-10 py-2 text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50'
          >
            <span className={consultancyFilter ? 'text-gray-900' : 'text-gray-500 truncate block'}>
              {consultancyFilter
                ? (consultancies.find(c => c.id === parseInt(consultancyFilter))?.title || 'Selected')
                : 'All Consultancies'}
            </span>
            <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${consultancyDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {consultancyDropdownOpen && (
            <div className='absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
              <button onClick={() => handleConsultancySelect('')} className='w-full text-left px-4 py-2 hover:bg-gray-50 text-sm'>All Consultancies</button>
              {consultancies.map(c => (
                <button key={c.id} onClick={() => handleConsultancySelect(c.id.toString())} className={`w-full text-left px-4 py-2 hover:bg-blue-50 text-sm ${consultancyFilter === c.id.toString() ? 'bg-blue-50 text-blue-600' : ''}`}>
                  {c.title || 'Unknown Consultancy'}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters}>
            <X className="w-4 h-4 mr-2" /> Clear
          </Button>
        )}
      </div>

      {/* Table Component */}
      <Table
        data={applications}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
        showSearch={false}
        emptyContent="No applications found."
      />

      {/* Status Modal */}
      <Dialog
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      >
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
        <form onSubmit={handleStatusSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="w-full border rounded p-2"
              value={statusForm.status}
              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Remarks</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={statusForm.remarks}
              onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
              placeholder="Add remarks..."
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={!!updatingId}>
              {updatingId ? 'Updating...' : 'Update'}
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
        message='Are you sure you want to delete this application? This action cannot be undone.'
      />
    </div >
  )
}

export default ConsultancyReferralsPage
