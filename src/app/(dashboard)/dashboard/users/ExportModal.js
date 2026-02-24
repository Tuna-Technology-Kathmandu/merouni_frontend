'use client'
import { useState } from 'react'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose
} from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Download } from 'lucide-react'

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

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      setError('Start date cannot be after end date.')
      return
    }

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        limit: formData.limit || 100,
        startDate: formData.startDate,
        endDate: formData.endDate
      })

      if (formData.role !== 'All') {
        queryParams.set('role', formData.role)
      }

      const response = await fetch(
        `${process.env.baseUrl}/users/export?${queryParams}`,
        { method: 'GET' }
      )

      if (!response.ok) {
        throw new Error('Failed to export users. Please try again.')
      }

      const responseText = await response.text()
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
    } catch (err) {
      console.error('Error exporting users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className='max-w-md'>
      <DialogContent className='max-w-md max-h-[90vh] flex flex-col p-0'>

        {/* Sticky Header */}
        <DialogHeader className='px-6 py-4 border-b shrink-0'>
          <DialogTitle className='text-lg font-semibold text-gray-900'>
            Export Users
          </DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>

        {/* Body */}
        <div className='flex-1 overflow-y-auto p-6'>
          <form id='export-form' onSubmit={handleSubmit} className='space-y-8'>

            {/* Filters */}
            <section className='space-y-5'>
              <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>
                Export Filters
              </h3>

              <div className='space-y-1.5'>
                <Label htmlFor='limit' required>
                  Number of Records
                </Label>
                <Input
                  type='number'
                  id='limit'
                  name='limit'
                  value={formData.limit}
                  onChange={handleChange}
                  placeholder='e.g. 100'
                  min='1'
                  required
                />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='role'>Role</Label>
                <select
                  id='role'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387cae] focus-visible:ring-offset-2'
                >
                  <option value='All'>All Roles</option>
                  <option value='Agent'>Agent</option>
                  <option value='Student'>Student</option>
                </select>
              </div>
            </section>

            {/* Date Range */}
            <section className='space-y-5'>
              <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>
                Date Range
              </h3>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1.5'>
                  <Label htmlFor='startDate' required>Start Date</Label>
                  <Input
                    type='date'
                    id='startDate'
                    name='startDate'
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='endDate' required>End Date</Label>
                  <Input
                    type='date'
                    id='endDate'
                    name='endDate'
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600'>
                {error}
              </div>
            )}

          </form>
        </div>

        {/* Sticky Footer */}
        <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 shrink-0'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='export-form'
            disabled={loading}
            className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 min-w-[120px]'
          >
            {loading ? (
              <span className='flex items-center gap-2'>
                <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                Exporting...
              </span>
            ) : (
              <>
                <Download className='w-4 h-4' />
                Export CSV
              </>
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}
