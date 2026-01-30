'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/ui/shadcn/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Select } from '@/ui/shadcn/select'
import dynamic from 'next/dynamic'

const CKEditor = dynamic(
  () => import('@/app/(dashboard)/dashboard/component/CKStable'),
  {
    ssr: false
  }
)

const ScholarshipFormDialog = ({
  open: isOpen,
  onOpenChange,
  onSubmit,
  editingScholarship = null,
  categories = [],
  authorId,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eligibilityCriteria: '',
    amount: '',
    applicationDeadline: '',
    renewalCriteria: '',
    contactInfo: '',
    categoryId: ''
  })
  const [error, setError] = useState(null)

  // Initialize form when editing or opening
  useEffect(() => {
    if (editingScholarship) {
      setFormData({
        name: editingScholarship.name || '',
        description: editingScholarship.description || '',
        eligibilityCriteria: editingScholarship.eligibilityCriteria || '',
        amount: editingScholarship.amount || '',
        applicationDeadline:
          formatDateForInput(editingScholarship.applicationDeadline) || '',
        renewalCriteria: editingScholarship.renewalCriteria || '',
        contactInfo: editingScholarship.contactInfo || '',
        categoryId: editingScholarship.categoryId || ''
      })
    } else if (isOpen && !editingScholarship) {
      // Reset form when opening for new scholarship
      setFormData({
        name: '',
        description: '',
        eligibilityCriteria: '',
        amount: '',
        applicationDeadline: '',
        renewalCriteria: '',
        contactInfo: '',
        categoryId: ''
      })
    }
    setError(null)
  }, [isOpen, editingScholarship])

  const formatDateForInput = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  const formatDate = (date) => {
    return date.split('-').join('/')
  }

  const handleEditorChange = useCallback((content) => {
    setFormData((prev) => ({
      ...prev,
      description: content
    }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      const formattedData = {
        ...formData,
        amount: Number(formData.amount),
        applicationDeadline: formatDate(formData.applicationDeadline),
        author: authorId,
        categoryId: formData.categoryId || null
      }

      await onSubmit(formattedData, editingScholarship?.id)

      // Reset form on success
      setFormData({
        name: '',
        description: '',
        eligibilityCriteria: '',
        amount: '',
        applicationDeadline: '',
        renewalCriteria: '',
        contactInfo: '',
        categoryId: ''
      })
      onOpenChange(false)
    } catch (err) {
      setError(err.message || 'Failed to save scholarship')
    }
  }

  const handleClose = () => {
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} className='max-w-4xl'>
      <DialogContent className='max-h-[90vh] flex flex-col overflow-hidden p-0'>
        <DialogClose onClick={handleClose} />
        <div className='px-6 pt-6 flex-shrink-0'>
          <DialogHeader>
            <DialogTitle>
              {editingScholarship ? 'Edit Scholarship' : 'Add Scholarship'}
            </DialogTitle>
          </DialogHeader>
        </div>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col flex-1 min-h-0 overflow-hidden'
        >
          <div className='px-6 space-y-6 overflow-y-auto flex-1 pr-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2 col-span-2'>
                <Label htmlFor='name'>
                  Scholarship Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='name'
                  placeholder='Scholarship Name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className='space-y-2 col-span-2'>
                <Label>Description</Label>
                <CKEditor
                  value={formData.description}
                  onChange={handleEditorChange}
                  id='scholarship-description-editor'
                />
              </div>

              <div className='space-y-2 col-span-2'>
                <Label htmlFor='categoryId'>
                  Category <span className='text-red-500'>*</span>
                </Label>
                <Select
                  id='categoryId'
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  required
                >
                  <option value=''>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='eligibilityCriteria'>
                  Eligibility Criteria <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='eligibilityCriteria'
                  placeholder='Eligibility Criteria'
                  value={formData.eligibilityCriteria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      eligibilityCriteria: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='amount'>
                  Amount <span className='text-red-500'>(Rs.) *</span>
                </Label>
                <Input
                  id='amount'
                  type='number'
                  placeholder='Amount'
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='applicationDeadline'>
                  Application Deadline <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='applicationDeadline'
                  type='date'
                  value={formData.applicationDeadline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationDeadline: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='renewalCriteria'>
                  Renewal Criteria <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='renewalCriteria'
                  placeholder='Renewal Criteria'
                  value={formData.renewalCriteria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      renewalCriteria: e.target.value
                    })
                  }
                  required
                />
              </div>

              <div className='space-y-2 col-span-2'>
                <Label htmlFor='contactInfo'>
                  Contact Information <span className='text-red-500'>*</span>
                </Label>
                <Input
                  id='contactInfo'
                  placeholder='Contact Information'
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, contactInfo: e.target.value })
                  }
                  required
                />
              </div>

              {error && (
                <div className='text-red-500 text-sm col-span-2'>{error}</div>
              )}
            </div>
          </div>

          <DialogFooter className='gap-2 pt-4 border-t flex-shrink-0 px-6 pb-6 bg-background sticky bottom-0'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? 'Processing...'
                : editingScholarship
                  ? 'Update Scholarship'
                  : 'Create Scholarship'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ScholarshipFormDialog
