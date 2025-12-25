'use client'

import React, { useEffect, useState } from 'react'
import { fetchReferrals, updateReferralStatus, deleteReferral } from './action'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import { Modal } from '../../../../components/CreateUserModal'
import ShimmerEffect from '../../../../components/ShimmerEffect'
import { usePageHeading } from '@/contexts/PageHeadingContext'

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
    <div className='p-4'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 shadow-md'>
          <thead>
            <tr className='bg-gray-100 border-b'>
              <th className='px-4 py-2 border'>Student Name</th>
              <th className='px-4 py-2 border'>Applied College</th>
              <th className='px-4 py-2 border'>Referred By</th>
              <th className='px-4 py-2 border'>Student Email</th>
              <th className='px-4 py-2 border'>Student Phone</th>
              <th className='px-4 py-2 border'>Application Type</th>
              <th className='px-4 py-2 border'>Status</th>
              <th className='px-4 py-2 border'>Remarks</th>
              <th className='px-4 py-2 border text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral.id} className='border-b'>
                <td className='px-4 py-2 border'>
                  {referral.student_name || 'N/A'}
                </td>
                <td className='px-4 py-2 border'>
                  {referral.referralCollege?.name || 'N/A'}
                </td>
                <td className='px-4 py-2 border'>
                  {referral.referralTeacher
                    ? `${referral.referralTeacher.firstName} ${
                        referral.referralTeacher.middleName || ''
                      } ${referral.referralTeacher.lastName}`.trim()
                    : referral.application_type === 'self'
                      ? 'Self'
                      : 'N/A'}
                </td>
                <td className='px-4 py-2 border'>
                  {referral.student_email || 'N/A'}
                </td>
                <td className='px-4 py-2 border'>
                  {referral.student_phone_no || 'N/A'}
                </td>
                <td className='px-4 py-2 border'>
                  {referral.application_type}
                </td>
                <td className='px-4 py-2 border'>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      referral.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800'
                        : referral.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {referral.status || 'IN_PROGRESS'}
                  </span>
                </td>
                <td className='px-4 py-2 border'>
                  <span className='text-sm text-gray-600'>
                    {referral.remarks
                      ? referral.remarks.length > 50
                        ? `${referral.remarks.substring(0, 50)}...`
                        : referral.remarks
                      : 'N/A'}
                  </span>
                </td>
                <td className='px-4 py-2 border text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <button
                      onClick={() => handleOpenStatusModal(referral)}
                      disabled={updatingId === referral.id}
                      className='text-blue-600 hover:text-blue-800 disabled:opacity-50'
                      title='Update Status'
                    >
                      <FaEdit className='inline w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(referral.id)}
                      disabled={deletingId === referral.id}
                      className='text-red-600 hover:text-red-800 disabled:opacity-50'
                      title='Delete'
                    >
                      <FaTrashAlt className='inline w-4 h-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
