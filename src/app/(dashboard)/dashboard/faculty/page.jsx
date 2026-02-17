'use client'
import { useState, useEffect, useMemo } from 'react'
import {
  getAllFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty
} from './action'
import { useSelector } from 'react-redux'
import Loader from '../../../../ui/molecules/Loading'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import useAdminPermission from '@/hooks/useAdminPermission'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { Button } from '@/ui/shadcn/button'
import ViewFaculty from '@/ui/molecules/dialogs/ViewFaculty'
import SearchInput from '@/ui/molecules/SearchInput'

export default function FacultyManager() {
  const { setHeading } = usePageHeading()
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  })
  const [editingId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  // View Modal State
  const [viewingFaculty, setViewingFaculty] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const author_id = useSelector((state) => state.user.data?.id)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  // Define columns with actionsSchool",
  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title'
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ getValue }) => {
          const description = getValue()
          if (!description) return '-'
          // Show only first 50 characters with ellipsis
          return description.length > 50
            ? `${description.substring(0, 50)}...`
            : description
        }
      },
      {
        header: 'Author',
        accessorFn: (row) =>
          `${row.authorDetails.firstName} ${row.authorDetails.lastName}`
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
              onClick={() => handleView(row.original)}
              className='p-1 text-gray-600 hover:text-gray-900'
              title="View Details"
            >
              <Eye className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className='p-1 text-blue-600 hover:text-blue-800'
              title="Edit"
            >
              <Edit2 className='w-4 h-4' />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original.id)}
              className='p-1 text-red-600 hover:text-red-800'
              title="Delete"
            >
              <Trash2 className='w-4 h-4' />
            </button>
          </div>
        )
      }
    ],
    []
  )

  const { requireAdmin } = useAdminPermission()

  useEffect(() => {
    setHeading('Faculty Management')
    loadFaculties()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const loadFaculties = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await getAllFaculty(page)
      setFaculties(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (error) {
      console.error('Error loading faculties:', error)
      toast.error('Failed to fetch faculties')
    } finally {
      setTableLoading(false)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const requestData = { ...formData, author: author_id }

      if (editingId) {
        await updateFaculty(editingId, requestData)
        toast.success('Faculty updated successfully!')
      } else {
        await createFaculty(requestData)
        toast.success('Faculty created successfully!')
      }

      setFormData({ title: '', description: '' })
      setEditingId(null)
      setIsOpen(false)
      loadFaculties()
      setSubmitting(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save faculty')
      setSubmitting(false)
    }
  }

  const handleEdit = (faculty) => {
    setFormData({
      title: faculty.title,
      description: faculty.description
    })
    setEditingId(faculty.id)
    setIsOpen(true)
  }

  const handleView = (faculty) => {
    setViewingFaculty(faculty)
    setIsViewOpen(true)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditingId(null)
    setFormData({ title: '', description: '' })
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
      await deleteFaculty(deleteId)
      toast.success('Faculty deleted successfully!')
      await loadFaculties()
    } catch (err) {
      toast.error(err.message || 'Failed to delete faculty')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadFaculties()
      return
    }
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/faculty?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setFaculties(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setFaculties([])
      }
    } catch (error) {
      console.error('Error fetching faculty search results:', error.message)
      setFaculties([])
    }
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

  if (loading)
    return (
      <div className='mx-auto'>
        <Loader />
      </div>
    )

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search faculties...'
            className='max-w-md'
          />
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditingId(null)
                setFormData({ title: '', description: '' })
              }}
            >
              Add Faculty
            </Button>
          </div>
        </div>
        <ToastContainer />

        {/* Table */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={faculties}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadFaculties(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* Form Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={handleModalClose}
        className='max-w-md'
      >
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <DialogTitle>{editingId ? 'Edit Faculty' : 'Add Faculty'}</DialogTitle>
            <DialogClose onClick={handleModalClose} />
          </div>
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-4'>
              <div>
                <label className='block mb-2'>
                  Faculty Title <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className='w-full p-2 border rounded'
                  placeholder='Enter faculty title'
                  required
                />
              </div>
              <div>
                <label className='block mb-2'>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='w-full p-2 border rounded min-h-[150px]'
                  rows={6}
                  placeholder='Enter faculty description'
                />
              </div>
            </div>

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={submitting}
              >
                {submitting
                  ? 'Processing...'
                  : editingId
                    ? 'Update Faculty'
                    : 'Create Faculty'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ViewFaculty
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        faculty={viewingFaculty}
      />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this faculty? This action cannot be undone.'
      />
    </>
  )
}
