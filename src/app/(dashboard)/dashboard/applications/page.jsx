'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/ui/shadcn/dialog'
import ShimmerEffect from '../../../../ui/molecules/ShimmerEffect'
import Table from '@/ui/shadcn/Table'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { usePageHeading } from '@/contexts/PageHeadingContext'

const ApplicationsPage = () => {
  const { setHeading } = usePageHeading()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  
  const rawRole = useSelector((state) => state.user?.data?.roles || state.user?.data?.role)
  const role = typeof rawRole === 'string' ? destr(rawRole) || {} : rawRole || {}
  const isConsultancy = role?.consultancy
  const isInstitution = role?.institution
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusForm, setStatusForm] = useState({
    status: 'IN_PROGRESS',
    remarks: ''
  })

  useEffect(() => {
    setHeading('Applications')
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const endpoint = isConsultancy 
        ? `${process.env.baseUrl}/consultancy-application/mine`
        : `${process.env.baseUrl}/referral/institution/applications`

      const res = await authFetch(endpoint, { cache: 'no-store' })

      if (!res.ok) {
        throw new Error('Failed to load applications')
      }

      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error loading applications:', err)
      setError(err.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

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
      
      const endpoint = isConsultancy
        ? `${process.env.baseUrl}/consultancy-application/${selectedApplication.id}/status`
        : `${process.env.baseUrl}/referral/${selectedApplication.id}/status`

      const response = await authFetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: statusForm.status,
          remarks: statusForm.remarks || null
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update application status')
      }

      // Reload applications
      await loadApplications()
      handleCloseStatusModal()
    } catch (err) {
      setError(err.message || 'Failed to update application status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return
    }

    try {
      setDeletingId(id)
      
      const endpoint = isConsultancy
        ? `${process.env.baseUrl}/consultancy-application/${id}`
        : `${process.env.baseUrl}/referral/${id}`

      const response = await authFetch(endpoint, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete application')
      }

      await loadApplications()
    } catch (err) {
      setError(err.message || 'Failed to delete application')
    } finally {
      setDeletingId(null)
    }
  }

  const columns = useMemo(() => {
    const cols = [
      {
        header: 'Student Name',
        accessorKey: 'student_name',
        cell: ({ row }) => row.original.student_name || 'N/A'
      },
      {
        header: 'Email',
        accessorKey: 'student_email',
        cell: ({ row }) => row.original.student_email || 'N/A'
      },
      {
        header: 'Phone',
        accessorKey: 'student_phone_no',
        cell: ({ row }) => row.original.student_phone_no || 'N/A'
      }
    ]

    if (!isConsultancy) {
      cols.push({
        header: 'Course',
        accessorKey: 'course.title',
        cell: ({ row }) => row.original?.course?.title || 'N/A'
      })
    }

    cols.push(
      {
        header: 'Description',
        accessorKey: 'student_description',
        cell: ({ row }) => (
          <span className='text-sm text-gray-600'>
            {row.original.student_description
              ? row.original.student_description.length > 50
                ? `${row.original.student_description.substring(0, 50)}...`
                : row.original.student_description
              : 'N/A'}
          </span>
        )
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'IN_PROGRESS'
          return (
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                status === 'ACCEPTED'
                  ? 'bg-green-100 text-green-800'
                  : status === 'REJECTED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {status}
            </span>
          )
        }
      },
      {
        header: 'Remarks',
        accessorKey: 'remarks',
        cell: ({ row }) => (
          <span className='text-sm text-gray-600'>
            {row.original.remarks
              ? row.original.remarks.length > 30
                ? `${row.original.remarks.substring(0, 30)}...`
                : row.original.remarks
              : 'N/A'}
          </span>
        )
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex items-center justify-center gap-2'>
            <button
              onClick={() => handleOpenStatusModal(row.original)}
              disabled={updatingId === row.original.id}
              className='text-blue-600 hover:text-blue-800 disabled:opacity-50'
              title='Update Status'
            >
              <FaEdit className='inline w-4 h-4' />
            </button>
            {!isInstitution && (
              <button
                onClick={() => handleDelete(row.original.id)}
                disabled={deletingId === row.original.id}
                className='text-red-600 hover:text-red-800 disabled:opacity-50'
                title='Delete'
              >
                <FaTrashAlt className='inline w-4 h-4' />
              </button>
            )}
          </div>
        )
      }
    )

    return cols
  }, [isConsultancy, isInstitution, updatingId, deletingId])

  if (loading && applications.length === 0) return <ShimmerEffect />
  if (error && applications.length === 0)
    return (
      <div className='p-4'>
        <p className='flex items-center justify-center text-center text-red-600'>
          Error: {error}
        </p>
      </div>
    )

  return (
    <div className='p-4'>
      
      <Table
        data={applications}
        columns={columns}
        loading={loading}
        showSearch={true}
        emptyContent='No applications found.'
      />

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
              {updatingId === selectedApplication?.id
                ? 'Updating...'
                : 'Update'}
            </button>
          </div>
        </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApplicationsPage
