'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Table from '@/app/components/Table'
import { Edit2, Trash2 } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'

export default function LevelForm() {
  const author_id = useSelector((state) => state.user.data.id)
  const [isOpen, setIsOpen] = useState(false)
  const [levels, setLevels] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
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

  useEffect(() => {
    fetchLevels()
  }, [])

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
    } catch (error) {
      toast.error(error.message || 'Failed to save level')
    }
  }

  const handleEdit = (level) => {
    setEditing(true)
    setIsOpen(true)
    setEditingId(level.id)
    setValue('title', level.title)
    setValue('author', level.author)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
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
      header: 'ID',
      accessorKey: 'id'
    },
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
      <div className='text-2xl mr-auto p-4 ml-14 font-bold'>
        <div className='text-center'>Level Management</div>
        <div className='flex justify-left mt-2'>
          <button
            className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide form' : 'Show form'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='container mx-auto p-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Level Information</h2>
              <div className='grid grid-cols-1 gap-4'>
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
            </div>

            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={loading}
                className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
              >
                {loading
                  ? 'Processing...'
                  : editing
                    ? 'Update Level'
                    : 'Create Level'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='mt-8'>
        <Table
          loading={tableLoading}
          data={levels}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => fetchLevels(newPage)}
          onSearch={handleSearch}
        />
      </div>

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
