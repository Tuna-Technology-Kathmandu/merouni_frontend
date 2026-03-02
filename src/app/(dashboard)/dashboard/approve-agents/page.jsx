'use client'

import { useEffect, useState } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import Table from '@/ui/shadcn/DataTable'
import { useMemo } from 'react'
import { Check, X, UserCheck, Loader2 } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { formatDate } from '@/utils/date.util'

export default function ApproveAgentsPage() {
  const { setHeading } = usePageHeading()
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [actioningId, setActioningId] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmUserId, setConfirmUserId] = useState(null)

  useEffect(() => {
    setHeading('Approve Agents')
    loadPendingAgents()
    return () => setHeading(null)
  }, [setHeading])

  const loadPendingAgents = async (page = 1) => {
    try {
      setLoading(true)
      const res = await authFetch(
        `${process.env.baseUrl}/users/pending-agents?page=${page}&limit=10`
      )
      if (!res.ok) throw new Error('Failed to load pending agents')
      const data = await res.json()
      setAgents(data.items || [])
      setPagination({
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1,
        total: data.pagination?.totalCount || 0
      })
    } catch (err) {
      toast.error(err.message || 'Failed to load pending agents')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = (user) => {
    setConfirmUserId(user.id)
    setConfirmAction('approve')
    setConfirmOpen(true)
  }

  const handleReject = (user) => {
    setConfirmUserId(user.id)
    setConfirmAction('reject')
    setConfirmOpen(true)
  }

  const handleConfirm = async () => {
    if (!confirmUserId || !confirmAction) return
    try {
      setActioningId(confirmUserId)
      const res = await authFetch(`${process.env.baseUrl}/users/review-agent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: confirmUserId,
          action: confirmAction
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to update')
      toast.success(
        confirmAction === 'approve'
          ? 'Agent approved successfully'
          : 'Agent request rejected'
      )
      loadPendingAgents(pagination.currentPage)
    } catch (err) {
      toast.error(err.message || 'Failed to update')
    } finally {
      setActioningId(null)
      setConfirmOpen(false)
      setConfirmUserId(null)
      setConfirmAction(null)
    }
  }

  const handleCloseConfirm = () => {
    setConfirmOpen(false)
    setConfirmUserId(null)
    setConfirmAction(null)
  }

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'firstName',
        cell: ({ row }) => {
          const { firstName, lastName } = row.original
          return (
            <span className='font-medium text-gray-900'>
              {[firstName, lastName].filter(Boolean).join(' ') || '—'}
            </span>
          )
        }
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: ({ getValue }) => (
          <span className='text-gray-600 text-sm'>{getValue() || '—'}</span>
        )
      },
      {
        header: 'Phone',
        accessorKey: 'phoneNo',
        cell: ({ getValue }) => (
          <span className='text-gray-600 text-sm'>{getValue() || '—'}</span>
        )
      },
      {
        header: 'Experience / About',
        accessorKey: 'agentExperience',
        cell: ({ row }) => {
          const exp = row.original.agentExperience
          if (!exp) return <span className='text-gray-400 text-sm italic'>—</span>
          return (
            <div className='max-w-xs text-sm text-gray-600 line-clamp-3' title={exp}>
              {exp}
            </div>
          )
        }
      },
      {
        header: 'Applied At',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => (
          <span className='text-gray-500 text-sm'>
            {getValue() ? formatDate(getValue()) : '—'}
          </span>
        )
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original
          const isActioning = actioningId === user.id
          return (
            <div className='flex gap-1'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleApprove(user)}
                disabled={isActioning}
                className='hover:bg-green-50 text-green-600'
                title='Approve'
              >
                {isActioning ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Check className='w-4 h-4' />
                )}
              </Button>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => handleReject(user)}
                disabled={isActioning}
                className='hover:bg-red-50 text-red-600'
                title='Reject'
              >
                <X className='w-4 h-4' />
              </Button>
            </div>
          )
        }
      }
    ],
    [actioningId]
  )

  return (
    <div className='w-full'>
      <ToastContainer position='bottom-right' />

      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-3 mb-3'>
        <div className='bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex items-center gap-3'>
          <div className='w-9 h-9 rounded-md bg-[#387cae]/10 flex items-center justify-center shrink-0'>
            <UserCheck size={17} className='text-[#387cae]' />
          </div>
          <div>
            <p className='text-sm font-bold text-gray-800'>Pending Agent Requests</p>
            <p className='text-xs text-gray-400'>
              {loading ? 'Loading…' : `${pagination.total} pending`}
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-md shadow-sm border overflow-hidden'>
        <Table
          data={agents}
          columns={columns}
          pagination={pagination}
          onPageChange={loadPendingAgents}
          showSearch={false}
          loading={loading}
          emptyContent='No pending agent requests.'
        />
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
        title={confirmAction === 'approve' ? 'Approve Agent' : 'Reject Request'}
        message={
          confirmAction === 'approve'
            ? 'Are you sure you want to approve this agent? They will be able to access the dashboard.'
            : 'Are you sure you want to reject this agent request?'
        }
        confirmText={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        cancelText='Cancel'
      />
    </div>
  )
}
