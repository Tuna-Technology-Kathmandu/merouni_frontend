'use client'
import { useState } from 'react'

export default function ExportModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    limit: '',
    role: 'All',
    startDate: '',
    endDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (
        formData.startDate &&
        formData.endDate &&
        formData.startDate > formData.endDate
      ) {
        throw new Error('Start date cannot be after end date.')
      }

      const queryParams = new URLSearchParams({
        limit: formData.limit || 100, // Default to 100 if empty
        startDate: formData.startDate,
        endDate: formData.endDate
      })

      // Exclude role if "All" is selected
      if (formData.role !== 'All') {
        queryParams.set('role', formData.role)
      }

      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/users/export?${queryParams}`,
        { method: 'GET' }
      )

      if (!response.ok) {
        throw new Error('Failed to export users. Please try again.')
      }

      const responseText = await response.text()
      console.log('Response text:', responseText)

      // Trigger CSV download
      const blob = new Blob([responseText], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'users.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      onClose()
    } catch (error) {
      console.error('Error exporting users:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md relative'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
        >
          &times;
        </button>
        <h2 className='text-xl font-bold mb-4'>Export Users</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='limit'
              className='block text-sm font-medium text-gray-700'
            >
              Number of Persons
            </label>
            <input
              type='number'
              id='limit'
              name='limit'
              value={formData.limit}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='Enter limit'
              min='1'
              required
            />
          </div>

          <div>
            <label
              htmlFor='role'
              className='block text-sm font-medium text-gray-700'
            >
              Role
            </label>
            <select
              id='role'
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            >
              <option value='All'>All</option>
              <option value='Agent'>Agent</option>
              <option value='Student'>Student</option>
            </select>
          </div>

          <div>
            <label
              htmlFor='startDate'
              className='block text-sm font-medium text-gray-700'
            >
              Start Date
            </label>
            <input
              type='date'
              id='startDate'
              name='startDate'
              value={formData.startDate}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label
              htmlFor='endDate'
              className='block text-sm font-medium text-gray-700'
            >
              End Date
            </label>
            <input
              type='date'
              id='endDate'
              name='endDate'
              value={formData.endDate}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}

          <div className='flex justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='mr-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
              disabled={loading}
            >
              {loading ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
