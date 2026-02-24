'use client'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Button } from '@/ui/shadcn/button'
import { Edit2, Eye, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Table from '@/ui/shadcn/DataTable'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
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

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState(null)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  useEffect(() => {
    setHeading('Program Management')
    fetchPrograms()
    return () => setHeading(null)
  }, [setHeading])

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

  const fetchPrograms = async (page = 1, query = searchQuery) => {
    setTableLoading(true)
    try {
      let url = `${process.env.baseUrl}/program?page=${page}`
      if (query) {
        url += `&q=${encodeURIComponent(query)}`
      }
      const response = await authFetch(url)
      const data = await response.json()
      setPrograms(data.items || [])
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
    fetchPrograms(1, query)
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
        <div className='flex gap-1'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original.slugs)}
            className='hover:bg-blue-50 text-blue-600'
            title='View'
          >
            <Eye className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original.slugs)}
            className='hover:bg-amber-50 text-amber-600'
            title='Edit'
          >
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original.id)}
            className='hover:bg-red-50 text-red-600'
            title='Delete'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )
    }
  ]

  console.log(programs, "programsprograms")
  return (
    <div className='w-full space-y-4 p-4'>
      {/* Header Section */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search programs...'
            className='max-w-md w-full'
          />

          <Button onClick={handleCreate} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Program
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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

      <CreateUpdateProgram
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        slug={selectedSlug}
        onSuccess={() => fetchPrograms(pagination.currentPage, searchQuery)}
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
        confirmText='Delete'
        cancelText='Cancel'
      />
    </div>
  )
}
