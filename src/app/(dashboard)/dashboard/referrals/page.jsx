'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { fetchReferrals, updateReferralStatus, deleteReferral } from './action'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import { Modal } from '../../../../components/CreateUserModal'
import ShimmerEffect from '../../../../components/ShimmerEffect'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const ReferralsPage = () => {
  const { setHeading } = usePageHeading()
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState(null)
  const [statusForm, setStatusForm] = useState({
    status: 'IN_PROGRESS',
    remarks: ''
  })

  // Get user role from Redux
  const rawRole = useSelector((state) => state.user?.data?.role)

  // Check if user is an institution/college (has institution role but not admin/editor)
  const isInstitution = useMemo(() => {
    const role = typeof rawRole === 'string' ? destr(rawRole) : rawRole || {}
    return !!(role?.institution && !role?.admin && !role?.editor)
  }, [rawRole])

  useEffect(() => {
    setHeading('Referrals')
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    const loadReferrals = async () => {
      try {
        const data = await fetchReferrals()
        setReferrals(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadReferrals()
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
      handleCloseStatusModal()
    } catch (err) {
      setError(err.message || 'Failed to update referral status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this referral?')) {
      return
    }

    try {
      setDeletingId(id)
      await deleteReferral(id)
      setReferrals((prev) => prev.filter((ref) => ref.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete referral')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <ShimmerEffect />
  if (error)
    return (
      <p className='flex items-center justify-center text-center'>
        Error: {error}
      </p>
    )

  return (
    <div className='p-4 bg-white min-h-screen'>
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
              <TableHead className='text-center text-gray-600'>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referrals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isInstitution ? 5 : 7}
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
                          ? `${referral.referralAgent.firstName} ${
                              referral.referralAgent.middleName || ''
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
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        referral.status === 'ACCEPTED'
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
                        onClick={() => handleDelete(referral.id)}
                        disabled={deletingId === referral.id}
                        title='Delete'
                      >
                        <FaTrashAlt className='h-4 w-4 text-red-600' />
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
      <Modal
        isOpen={statusModalOpen}
        onClose={handleCloseStatusModal}
        title='Update Referral Status'
        className='max-w-md'
      >
        <form onSubmit={handleStatusSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
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
              disabled={updatingId === selectedReferral?.id}
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50'
            >
              {updatingId === selectedReferral?.id ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ReferralsPage
