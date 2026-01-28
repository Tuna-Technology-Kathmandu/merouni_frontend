'use client'

import React, { useEffect, useState } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { Modal } from '../../../../components/UserModal'
import ShimmerEffect from '../../../../components/ShimmerEffect'
import { DotenvConfig } from '@/config/env.config'

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [statusForm, setStatusForm] = useState({
    status: 'IN_PROGRESS',
    remarks: ''
  })

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/referral/institution/applications`,
        { cache: 'no-store' }
      )

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
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/referral/${selectedApplication.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: statusForm.status,
            remarks: statusForm.remarks || null
          })
        }
      )

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
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/referral/${id}`,
        {
          method: 'DELETE'
        }
      )

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

  if (loading) return <ShimmerEffect />
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
      <h2 className='text-2xl font-bold mb-4'>Applications</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 shadow-md'>
          <thead>
            <tr className='bg-gray-100 border-b'>
              <th className='px-4 py-2 border'>Student Name</th>
              <th className='px-4 py-2 border'>Email</th>
              <th className='px-4 py-2 border'>Phone</th>
              <th className='px-4 py-2 border'>Course</th>
              <th className='px-4 py-2 border'>Description</th>
              <th className='px-4 py-2 border'>Status</th>
              <th className='px-4 py-2 border'>Remarks</th>
              <th className='px-4 py-2 border text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={8} className='px-4 py-8 text-center text-gray-500'>
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app.id} className='border-b'>
                  <td className='px-4 py-2 border'>
                    {app.student_name || 'N/A'}
                  </td>
                  <td className='px-4 py-2 border'>
                    {app.student_email || 'N/A'}
                  </td>
                  <td className='px-4 py-2 border'>
                    {app.student_phone_no || 'N/A'}
                  </td>
                  <td className='px-4 py-2 border'>
                    {app?.course?.title || 'N/A'}
                  </td>
                  <td className='px-4 py-2 border'>
                    <span className='text-sm text-gray-600'>
                      {app.student_description
                        ? app.student_description.length > 50
                          ? `${app.student_description.substring(0, 50)}...`
                          : app.student_description
                        : 'N/A'}
                    </span>
                  </td>
                  <td className='px-4 py-2 border'>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${app.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {app.status || 'IN_PROGRESS'}
                    </span>
                  </td>
                  <td className='px-4 py-2 border'>
                    <span className='text-sm text-gray-600'>
                      {app.remarks
                        ? app.remarks.length > 30
                          ? `${app.remarks.substring(0, 30)}...`
                          : app.remarks
                        : 'N/A'}
                    </span>
                  </td>
                  <td className='px-4 py-2 border text-center'>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        onClick={() => handleOpenStatusModal(app)}
                        disabled={updatingId === app.id}
                        className='text-blue-600 hover:text-blue-800 disabled:opacity-50'
                        title='Update Status'
                      >
                        <FaEdit className='inline w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                        className='text-red-600 hover:text-red-800 disabled:opacity-50'
                        title='Delete'
                      >
                        <FaTrashAlt className='inline w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={handleCloseStatusModal}
        title='Update Application Status'
        className='max-w-md'
      >
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
      </Modal>
    </div>
  )
}

export default ApplicationsPage
