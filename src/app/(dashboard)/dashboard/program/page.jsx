'use client'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Button } from '@/ui/shadcn/button'
import { Edit2, Eye, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import Table from '@/ui/shadcn/DataTable'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import CreateUpdateProgram from '@/ui/molecules/dialogs/CreateUpdateProgram'
import ViewProgram from '@/ui/molecules/dialogs/ViewProgram'
import SearchInput from '@/ui/molecules/SearchInput'

export default function ProgramForm() {
  const { setHeading } = usePageHeading()
  const [programs, setPrograms] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState(null)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  // Fetch all necessary data on component mount
  useEffect(() => {
    setHeading('Program Management')
    fetchPrograms()
    return () => setHeading(null)
  }, [setHeading])

  // Handle query parameter to open add form
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('add') === 'true') {
      setShowCreateModal(true)
      setSelectedSlug(null)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const { requireAdmin } = useAdminPermission()

  const fetchPrograms = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/program?page=${page}`
      )
      const data = await response.json()
      setPrograms(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      toast.error('Failed to fetch programs')
    } finally {
      setTableLoading(false)
    }
  }

  const handleEdit = (slug) => {
    setSelectedSlug(slug)
    setShowCreateModal(true)
  }

  const handleCreate = () => {
    setSelectedSlug(null)
    setShowCreateModal(true)
  }

  const handleView = (slug) => {
    setSelectedSlug(slug)
    setShowViewModal(true)
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    }, 'You do not have permission to delete this item.')
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/program/${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      await response.json()
      toast.success('Program deleted successfully')
      await fetchPrograms()
    } catch (error) {
      toast.error('Failed to delete program')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
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

  const handleSearch = async (query) => {
    if (!query) {
      fetchPrograms()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/program?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching levels:', response.statusText)
        setPrograms([])
      }
    } catch (error) {
      console.error('Error fetching levels search results:', error.message)
      setPrograms([])
    }
  }

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title'
    },
    {
      header: 'Duration',
      accessorKey: 'duration'
    },
    {
      header: 'Degree',
      accessorKey: 'programdegree.title',
      cell: ({ row }) => row.original.programdegree?.title || '—'
    },
    {
      header: 'Level',
      accessorKey: 'programlevel.title',
      cell: ({ row }) => row.original.programlevel?.title || '—'
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleView(row.original.slugs)}
            className='p-1 text-gray-600 hover:text-gray-800'
            title='View'
          >
            <Eye className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleEdit(row.original.slugs)}
            className='p-1 text-blue-600 hover:text-blue-800'
            title='Edit'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
            title='Delete'
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
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search programs...'
            className='max-w-md'
          />
          {/* Button */}
          <div className='flex gap-2'>
            <Button onClick={handleCreate}>
              Add Program
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={programs}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchPrograms(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      <CreateUpdateProgram
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        slug={selectedSlug}
        onSuccess={fetchPrograms}
      />

      <ViewProgram
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        slug={selectedSlug}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this program? This action cannot be undone.'
      />
    </>
  )
}
