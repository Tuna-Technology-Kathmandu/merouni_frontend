'use client'

import { useState, useEffect } from 'react'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import CreateUpdateDegree from '@/ui/molecules/dialogs/CreateUpdateDegree'
import ViewDegree from '@/ui/molecules/dialogs/ViewDegree'
import SearchInput from '@/ui/molecules/SearchInput'

export default function DegreePage() {
  const { setHeading } = usePageHeading()
  const [degrees, setDegrees] = useState([])
  const [tableLoading, setTableLoading] = useState(false)

  // Create/Edit Modal State
  const [isOpen, setIsOpen] = useState(false)
  const [editingDegree, setEditingDegree] = useState(null)

  // View Modal State
  const [viewingDegree, setViewingDegree] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
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
        `${process.env.baseUrl}/degree?page=${page}`
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

  const handleEdit = (degree) => {
    setEditingDegree(degree)
    setIsOpen(true)
  }

  const handleView = (degree) => {
    setViewingDegree(degree)
    setIsViewOpen(true)
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
        `${process.env.baseUrl}/degree?q=${encodeURIComponent(query)}`
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
        `${process.env.baseUrl}/degree/${deleteId}`,
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
      header: 'Cover',
      id: 'cover',
      cell: ({ row }) => {
        const url = row.original.featured_image
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
      header: 'Title',
      accessorKey: 'title'
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ getValue }) => (
        <div className='max-w-xs overflow-hidden'>
          {getValue()?.substring(0, 100)}
          {getValue()?.length > 100 ? '...' : getValue() || '-'}
        </div>
      )
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
            type='button'
          >
            <Eye className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className='p-1 text-blue-600 hover:text-blue-800'
            title="Edit"
            type='button'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
            title="Delete"
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
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search degrees...'
            className='max-w-md'
          />
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setEditingDegree(null)
                setIsOpen(true)
              }}
            >
              Add Degree
            </Button>
          </div>
        </div>

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

      <CreateUpdateDegree
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={editingDegree}
        onSuccess={fetchDegrees}
      />

      <ViewDegree
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        degree={viewingDegree}
      />

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
