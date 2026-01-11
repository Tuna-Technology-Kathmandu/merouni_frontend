'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Modal } from '../../../../components/CreateUserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'

export default function LevelForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const [isOpen, setIsOpen] = useState(false)
  const [levels, setLevels] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditingId] = useState(null)
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
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      author: author_id
    }
  })

  const { requireAdmin } = useAdminPermission()

  useEffect(() => {
    setHeading('Level Management')
    fetchLevels()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const fetchLevels = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/level?page=${page}`
      )
      const data = await response.json()
      setLevels(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      toast.error('Failed to fetch levels')
    } finally {
      setTableLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const url = `${process.env.baseUrl}${process.env.version}/level`
      const method = editing ? 'PUT' : 'POST'

      if (editing) {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/level?level_id=${editId}`,
          {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }
        )
        await response.json()
      } else {
        const response = await authFetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        await response.json()
      }

      toast.success(
        editing ? 'Level updated successfully!' : 'Level created successfully!'
      )
      setEditing(false)
      reset()
      fetchLevels()
      setIsOpen(false)
      setEditingId(null)
      setSubmitting(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save level')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (level) => {
    setEditing(true)
    setIsOpen(true)
    setEditingId(level.id)
    setValue('title', level.title)
    setValue('author', level.author)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    reset()
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (value === '') {
      handleSearch('')
    } else {
      const timeoutId = setTimeout(() => {
        handleSearch(value)
      }, 300)
      setSearchTimeout(timeoutId)
    }
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/level?id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchLevels()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title'
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleEdit(row.original)}
            className='p-1 text-blue-600 hover:text-blue-800'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]

  const handleSearch = async (query) => {
    if (!query) {
      fetchLevels()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/level?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setLevels(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching levels:', response.statusText)
        setLevels([])
      }
    } catch (error) {
      console.error('Error fetching levels search results:', error.message)
      setLevels([])
    }
  }

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}
          <div className='relative w-full max-w-md'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-4 h-4 text-gray-500' />
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search levels...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <button
              className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setEditingId(null)
                reset()
              }}
            >
              Add Level
            </button>
          </div>
        </div>
        <ToastContainer />

        {/* Table */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={levels}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchLevels(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={editing ? 'Edit Level' : 'Add Level'}
        className='max-w-md'
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label className='block mb-2'>Level Title *</label>
              <input
                {...register('title', {
                  required: 'Level title is required',
                  minLength: {
                    value: 2,
                    message: 'Title must be at least 2 characters long'
                  }
                })}
                className='w-full p-2 border rounded'
              />
              {errors.title && (
                <span className='text-red-500'>{errors.title.message}</span>
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
            <button
              type='submit'
              disabled={submitting}
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
            >
              {submitting
                ? 'Processing...'
                : editing
                  ? 'Update Level'
                  : 'Create Level'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this level? This action cannot be undone.'
      />
    </>
  )
}
