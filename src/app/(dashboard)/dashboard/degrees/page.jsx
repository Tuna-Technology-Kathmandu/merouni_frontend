'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import FileUpload from '../addCollege/FileUpload'
import { Modal } from '../../../../ui/molecules/Modal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'
import { Button } from '@/ui/shadcn/button'

export default function DegreePage() {
  const { setHeading } = usePageHeading()
  const [isOpen, setIsOpen] = useState(false)
  const [degrees, setDegrees] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cover_image: '',
      short_name: '',
      title: ''
    }
  })

  useEffect(() => {
    setHeading('Degree Management')
    fetchDegrees()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTimeout])

  const fetchDegrees = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/degree?page=${page}`
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch degrees')
      setDegrees(data.items || [])
      setPagination({
        currentPage: data.pagination?.currentPage ?? 1,
        totalPages: data.pagination?.totalPages ?? 1,
        total: data.pagination?.totalCount ?? 0
      })
    } catch (error) {
      toast.error(error.message || 'Failed to fetch degrees')
    } finally {
      setTableLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const baseUrl = DotenvConfig.NEXT_APP_API_BASE_URL
      const payload = {
        cover_image: data.cover_image?.trim() || null,
        short_name: data.short_name.trim(),
        title: data.title.trim()
      }

      if (editing && editId) {
        const response = await authFetch(`${baseUrl}/degree/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Update failed')
        toast.success('Degree updated successfully!')
      } else {
        const response = await authFetch(`${baseUrl}/degree`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Create failed')
        toast.success('Degree created successfully!')
      }

      reset()
      setEditing(false)
      setEditId(null)
      setIsOpen(false)
      fetchDegrees()
    } catch (error) {
      toast.error(error.message || 'Failed to save degree')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (degree) => {
    setEditing(true)
    setEditId(degree.id)
    setIsOpen(true)
    setValue('cover_image', degree.cover_image || '')
    setValue('short_name', degree.short_name || '')
    setValue('title', degree.title || '')
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditing(false)
    setEditId(null)
    reset()
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    if (value === '') {
      handleSearch('')
    } else {
      setSearchTimeout(setTimeout(() => handleSearch(value), 300))
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      fetchDegrees()
      return
    }
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/degree?q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      if (response.ok) {
        setDegrees(data.items || [])
        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        setDegrees([])
      }
    } catch {
      setDegrees([])
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/degree/${deleteId}`,
        { method: 'DELETE' }
      )
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Delete failed')
      toast.success(result.message || 'Degree deleted')
      fetchDegrees()
    } catch (error) {
      toast.error(error.message || 'Failed to delete degree')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const columns = [
    {
      header: 'Short Name',
      accessorKey: 'short_name'
    },
    {
      header: 'Title',
      accessorKey: 'title'
    },
    {
      header: 'Slug',
      accessorKey: 'slug'
    },
    {
      header: 'Cover',
      id: 'cover',
      cell: ({ row }) => {
        const url = row.original.cover_image
        if (!url) return <span className='text-gray-400'>—</span>
        return (
          <img
            src={url}
            alt=''
            className='h-8 w-12 object-cover rounded'
          />
        )
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleEdit(row.original)}
            className='p-1 text-blue-600 hover:text-blue-800'
            type='button'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
            type='button'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          <div className='relative w-full max-w-md'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-4 h-4 text-gray-500' />
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search degrees...'
            />
          </div>
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setEditId(null)
                reset()
              }}
            >
              Add Degree
            </Button>
          </div>
        </div>
        <ToastContainer />

        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={degrees}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchDegrees(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={editing ? 'Edit Degree' : 'Add Degree'}
        className='max-w-md'
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <FileUpload
                label='Cover Image'
                onUploadComplete={(url) => setValue('cover_image', url || '')}
                defaultPreview={watch('cover_image')}
              />
            </div>
            <div>
              <label className='block mb-2'>
                Short Name <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('short_name', {
                  required: 'Short name is required',
                  minLength: { value: 1, message: 'Short name is required' }
                })}
                className='w-full p-2 border rounded'
                placeholder='e.g. BCS'
              />
              {errors.short_name && (
                <span className='text-red-500 text-sm'>{errors.short_name.message}</span>
              )}
            </div>
            <div>
              <label className='block mb-2'>
                Title <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 2, message: 'Title must be at least 2 characters' }
                })}
                className='w-full p-2 border rounded'
                placeholder='e.g. Bachelor of Computer Science'
              />
              {errors.title && (
                <span className='text-red-500 text-sm'>{errors.title.message}</span>
              )}
            </div>
          </div>

          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={handleModalClose}
              className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <Button type='submit' disabled={submitting}>
              {submitting
                ? 'Processing...'
                : editing
                  ? 'Update Degree'
                  : 'Create Degree'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setDeleteId(null)
        }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this degree? This action cannot be undone.'
      />
    </>
  )
}
