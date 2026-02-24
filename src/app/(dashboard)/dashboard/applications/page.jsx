'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { cn } from '@/app/lib/utils'
import { Edit2, Trash2, Search, FileText, CheckCircle, Clock, XCircle, MoreVertical, RefreshCw, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/ui/shadcn/dialog'
import Table from '@/ui/shadcn/DataTable'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Select } from '@/ui/shadcn/select'
import Loading from '@/ui/molecules/Loading'
import SearchInput from '@/ui/molecules/SearchInput'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { toast, ToastContainer } from 'react-toastify'

const ApplicationsPage = () => {
  const { setHeading } = usePageHeading()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const rawRole = useSelector((state) => state.user?.data?.role)
  const role = typeof rawRole === 'string' ? destr(rawRole) || {} : rawRole || {}
  const isConsultancy = role?.consultancy
  const isInstitution = role?.institution
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusForm, setStatusForm] = useState({
    status: 'IN_PROGRESS',
    remarks: ''
  })

  useEffect(() => {
    setHeading('Applications')
    loadApplications()
    return () => setHeading(null)
  }, [setHeading])

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
      toast.error(err.message || 'Failed to load applications')
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

      toast.success('Status updated successfully')
      await loadApplications()
      handleCloseStatusModal()
    } catch (err) {
      toast.error(err.message || 'Failed to update application status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      setDeletingId(deleteId)

      const endpoint = isConsultancy
        ? `${process.env.baseUrl}/consultancy-application/${deleteId}`
        : `${process.env.baseUrl}/referral/${deleteId}`

      const response = await authFetch(endpoint, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete application')
      }

      toast.success('Application deleted successfully')
      await loadApplications()
    } catch (err) {
      toast.error(err.message || 'Failed to delete application')
    } finally {
      setDeletingId(null)
      setIsConfirmOpen(false)
      setDeleteId(null)
    }
  }

  const filteredApplications = useMemo(() => {
    if (!searchQuery) return applications
    const query = searchQuery.toLowerCase()
    return applications.filter(app =>
      (app.student_name || '').toLowerCase().includes(query) ||
      (app.student_email || '').toLowerCase().includes(query) ||
      (app.student_phone_no || '').toLowerCase().includes(query)
    )
  }, [applications, searchQuery])

  const columns = useMemo(() => {
    const cols = [
      {
        header: 'Student Info',
        accessorKey: 'student_name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">{row.original.student_name || 'N/A'}</span>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-[10px] text-slate-500 font-medium">{row.original.student_email}</span>
              <span className="text-[10px] text-slate-500 font-medium">{row.original.student_phone_no}</span>
            </div>
          </div>
        )
      }
    ]

    if (!isConsultancy) {
      cols.push({
        header: 'Course',
        accessorKey: 'course.title',
        cell: ({ row }) => (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            {row.original?.course?.title || 'N/A'}
          </span>
        )
      })
    }

    cols.push(
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.original.status || 'IN_PROGRESS'
          const configs = {
            ACCEPTED: { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: CheckCircle },
            REJECTED: { color: 'bg-rose-50 text-rose-700 border-rose-100', icon: XCircle },
            IN_PROGRESS: { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock }
          }
          const config = configs[status] || configs.IN_PROGRESS
          const Icon = config.icon

          return (
            <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider', config.color)}>
              <Icon className="w-3 h-3" />
              {status}
            </span>
          )
        }
      },
      {
        header: 'Remarks',
        accessorKey: 'remarks',
        cell: ({ row }) => (
          <div className="max-w-[200px]" title={row.original.remarks}>
            <p className='text-xs text-slate-600 truncate'>
              {row.original.remarks || <span className="text-slate-400 italic">No remarks</span>}
            </p>
          </div>
        )
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-1'>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenStatusModal(row.original)}
              className='hover:bg-blue-50 text-blue-600 h-8 w-8'
              title='Update Status'
              disabled={updatingId === row.original.id}
            >
              <Edit2 className='w-3.5 h-3.5' />
            </Button>
            {!isInstitution && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(row.original.id)}
                className='hover:bg-red-50 text-red-600 h-8 w-8'
                title='Delete'
                disabled={deletingId === row.original.id}
              >
                <Trash2 className='w-3.5 h-3.5' />
              </Button>
            )}
          </div>
        )
      }
    )

    return cols
  }, [isConsultancy, isInstitution, updatingId, deletingId])

  if (loading && applications.length === 0) return <Loading />

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      {/* Sticky Header */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          <div className="flex items-center gap-3 w-full max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search applications...'
              className='w-full'
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={loadApplications}
              className="gap-2 text-slate-600 hover:text-[#387cae] hover:border-[#387cae] h-11 px-6 rounded-lg font-bold text-xs uppercase tracking-wider"
            >
              <RefreshCw size={14} className={cn(loading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          data={filteredApplications}
          columns={columns}
          loading={loading}
          showSearch={false}
          emptyContent='No applications found matching your search.'
        />
      </div>

      {/* Update Status Modal */}
      <Dialog
        isOpen={statusModalOpen}
        onClose={handleCloseStatusModal}
        className='max-w-md'
      >
        <DialogContent className='max-w-md p-0'>
          <DialogHeader className="px-6 py-4 border-b bg-slate-50/50 rounded-t-lg">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#387cae] flex items-center justify-center text-white">
                <RefreshCw size={16} />
              </div>
              Update Application Status
            </DialogTitle>
            <DialogClose onClick={handleCloseStatusModal} />
          </DialogHeader>

          <div className='p-6'>
            <form id="status-form" onSubmit={handleStatusSubmit} className='space-y-6'>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label required className="text-xs font-bold tracking-wider">Select Status</Label>
                  <Select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="h-11 w-full"
                  >
                    <option value='IN_PROGRESS'>IN_PROGRESS</option>
                    <option value='ACCEPTED'>ACCEPTED</option>
                    <option value='REJECTED'>REJECTED</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold tracking-wider">Internal Remarks</Label>
                  <Textarea
                    rows={4}
                    value={statusForm.remarks}
                    onChange={(e) => setStatusForm({ ...statusForm, remarks: e.target.value })}
                    placeholder='Add any internal notes or remarks...'
                    className="resize-none focus:ring-[#387cae]/10 h-32"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3 rounded-b-lg'>
            <Button
              type='button'
              variant="outline"
              onClick={handleCloseStatusModal}
              className="h-11 px-6 font-bold text-xs uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form="status-form"
              disabled={updatingId === selectedApplication?.id}
              className="bg-[#387cae] hover:bg-[#387cae]/90 text-white min-w-[140px] h-11 px-6 font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#387cae]/20"
            >
              {updatingId === selectedApplication?.id ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Application'
        message='Are you sure you want to permanently delete this application? This action cannot be undone.'
        confirmText='Delete Application'
        cancelText='Keep Application'
      />
    </div>
  )
}

export default ApplicationsPage
