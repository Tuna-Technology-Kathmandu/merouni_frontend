'use client'

import { useState, useEffect, useMemo } from 'react'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Eye, Plus } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
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

  const fetchDegrees = async (page = 1, query = searchQuery) => {
    setTableLoading(true)
    try {
      let url = `${process.env.baseUrl}/degree?page=${page}`
      if (query) {
        url += `&q=${encodeURIComponent(query)}`
      }
      const response = await authFetch(url)
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
    fetchDegrees(1, query)
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

  const columns = useMemo(() => [
    {
      header: 'Cover',
      id: 'cover',
      cell: ({ row }) => {
        const url = row.original.featured_image
        if (!url) return <span className='text-gray-400'>—</span>
        return <img src={url} alt='' className='h-8 w-12 object-cover rounded border' />
      }
    },
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.title}</span>
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ getValue }) => {
        const v = getValue()
        if (!v) return <span className="text-gray-400 italic text-xs">—</span>
        return <span className="text-gray-600 text-sm">{v.substring(0, 80)}{v.length > 80 ? '…' : ''}</span>
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button variant="ghost" size="icon" onClick={() => handleView(row.original)} className='hover:bg-blue-50 text-blue-600' title="View" type='button'>
            <Eye className='w-4 h-4' />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} className='hover:bg-amber-50 text-amber-600' title="Edit" type='button'>
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row.original.id)} className='hover:bg-red-50 text-red-600' title="Delete" type='button'>
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )
    }
  ], [])

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      {/* Header */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          <SearchInput value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)} placeholder='Search degrees...' className='max-w-md w-full' />
          <Button onClick={() => { setEditingDegree(null); setIsOpen(true) }} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Degree
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table loading={tableLoading} data={degrees} columns={columns} pagination={pagination} onPageChange={(p) => fetchDegrees(p)} showSearch={false} />
      </div>

      <CreateUpdateDegree
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialData={editingDegree}
        onSuccess={() => fetchDegrees(pagination.currentPage, searchQuery)}
      />

      <ViewDegree
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        degree={viewingDegree}
      />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this degree? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />
    </div>
  )
}
