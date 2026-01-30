'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import {
  fetchStudentScholarshipApplications,
  deleteScholarshipApplication
} from './actions'
import {
  Award,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Trash2
} from 'lucide-react'
import Loading from '@/ui/molecules/Loading'
import EmptyState from '@/ui/shadcn/EmptyState'
import { Select } from '@/ui/shadcn/select'
import Table from '@/ui/molecules/Table'
import { Button } from '@/ui/shadcn/button'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'

const AppliedScholarshipsPage = () => {
  const { setHeading, setSubheading } = usePageHeading()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    setHeading({
      heading: 'Applied Scholarships',
      subheading: 'View and track your scholarship applications'
    })
    return () => {
      setHeading(null)
      setSubheading(null)
    }
  }, [setHeading, setSubheading])

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchStudentScholarshipApplications({
          page: pagination.currentPage,
          limit: 10,
          status: statusFilter || undefined
        })

        setApplications(data.applications || [])
        setPagination(
          data.pagination || {
            currentPage: 1,
            totalPages: 1,
            total: 0
          }
        )
      } catch (err) {
        setError(err.message || 'Failed to load applications')
      } finally {
        setLoading(false)
      }
    }

    loadApplications()
  }, [pagination.currentPage, statusFilter])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className='w-4 h-4 text-green-600' />
      case 'REJECTED':
        return <XCircle className='w-4 h-4 text-red-600' />
      case 'PENDING':
      default:
        return <Clock className='w-4 h-4 text-yellow-600' />
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'REJECTED':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'PENDING':
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (e) {
      return dateString
    }
  }

  const handleDeleteClick = useCallback((id) => {
    console.log('Delete clicked for application:', id)
    setDeleteId(id)
    setIsDialogOpen(true)
  }, [])

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      setDeletingId(deleteId)
      await deleteScholarshipApplication(deleteId)
      toast.success('Application deleted successfully!')

      // Reload applications
      const data = await fetchStudentScholarshipApplications({
        page: pagination.currentPage,
        limit: 10,
        status: statusFilter || undefined
      })

      setApplications(data.applications || [])
      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          total: 0
        }
      )

      setError(null)
      setIsDialogOpen(false)
      setDeleteId(null)
    } catch (error) {
      toast.error(error.message || 'Failed to delete application')
      setError(error.message || 'Failed to delete application')
    } finally {
      setDeletingId(null)
    }
  }

  const columns = useMemo(
    () => [
      {
        header: 'Scholarship Name',
        accessorKey: 'scholarship',
        cell: ({ getValue }) => {
          const scholarship = getValue()
          return scholarship?.name || 'N/A'
        }
      },
      {
        header: 'Category',
        accessorKey: 'scholarship',
        cell: ({ getValue }) => {
          const scholarship = getValue()
          return scholarship?.scholarshipCategory?.title || 'N/A'
        }
      },
      {
        header: 'Amount',
        accessorKey: 'scholarship',
        cell: ({ getValue }) => {
          const scholarship = getValue()
          return scholarship?.amount
            ? `$${parseFloat(scholarship.amount).toLocaleString()}`
            : 'N/A'
        }
      },
      {
        header: 'Deadline',
        accessorKey: 'scholarship',
        cell: ({ getValue }) => {
          const scholarship = getValue()
          return scholarship?.applicationDeadline
            ? formatDate(scholarship.applicationDeadline)
            : 'N/A'
        }
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue()
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(status)}`}
            >
              {getStatusIcon(status)}
              {status}
            </span>
          )
        }
      },
      {
        header: 'Applied Date',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => formatDate(getValue())
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex items-center justify-center'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteClick(row.original.id)}
              disabled={deletingId === row.original.id}
              className='p-1 text-red-600 hover:text-red-800 hover:bg-red-50'
              title='Delete Application'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        )
      }
    ],
    [handleDeleteClick, deletingId]
  )

  if (loading && applications.length === 0) {
    return (
      <div className='p-4'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='p-4 w-full'>
      {/* Filter */}
      <div className='mb-6'>
        <div className='flex gap-4 items-center'>
          <div className='w-64'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Filter by Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPagination((prev) => ({ ...prev, currentPage: 1 }))
              }}
            >
              <option value=''>All Status</option>
              <option value='PENDING'>Pending</option>
              <option value='APPROVED'>Approved</option>
              <option value='REJECTED'>Rejected</option>
            </Select>
          </div>
        </div>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
          <p className='text-sm text-red-600'>Error: {error}</p>
        </div>
      )}

      {applications.length === 0 && !loading ? (
        <div className='bg-white rounded-lg border border-gray-200 p-12'>
          <EmptyState
            icon={Award}
            title='No Applications Found'
            description={
              statusFilter
                ? `No ${statusFilter.toLowerCase()} applications found.`
                : "You haven't applied for any scholarships yet."
            }
          />
        </div>
      ) : (
        <>
          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
            <Table
              loading={loading}
              data={applications}
              columns={columns}
              pagination={pagination}
              onPageChange={(newPage) =>
                setPagination((prev) => ({ ...prev, currentPage: newPage }))
              }
              showSearch={false}
            />
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Delete Application'
        message='Are you sure you want to delete this scholarship application? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />

      <ToastContainer position='top-right' autoClose={3000} />
    </div>
  )
}

export default AppliedScholarshipsPage
