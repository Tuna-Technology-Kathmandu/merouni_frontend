'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Plus, Search, Edit2, Trash2, Eye, Key } from 'lucide-react'

import { Button } from '@/ui/shadcn/button'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import Table from '@/ui/shadcn/DataTable'
import SearchInput from '@/ui/molecules/SearchInput'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import CreateUpdateConsultancy from '@/ui/molecules/dialogs/CreateUpdateConsultancy'
import ViewConsultancy from '@/ui/molecules/dialogs/ViewConsultancy'
import CreateConsultencyUser from '@/ui/molecules/dialogs/CreateConsultencyUser'
import EditConsultancyPage from './EditConsultancyPage'
import { authFetch } from '@/app/utils/authFetch'
import { deleteConsultancy } from './actions'
import { formatDate } from '@/utils/date.util'

export default function ConsultancyManager() {
  const { role } = useAdminPermission()

  // If user is consultancy, show the edit page
  if (role.consultancy) {
    return <EditConsultancyPage />
  }

  const { setHeading } = usePageHeading()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [consultancies, setConsultancies] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingData, setEditingData] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [viewSlug, setViewSlug] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false)
  const [selectedConsultancy, setSelectedConsultancy] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  useEffect(() => {
    setHeading('Consultancy Management')
    loadConsultancies()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      handleAdd()
      router.replace('/dashboard/consultancy', { scroll: false })
    }
  }, [searchParams, router])

  const loadConsultancies = async (page = 1, query = searchQuery) => {
    setTableLoading(true)
    try {
      const url = new URL(`${process.env.baseUrl}/consultancy`)
      url.searchParams.append('page', page)
      if (query) url.searchParams.append('q', query)

      const response = await authFetch(url.toString())
      const data = await response.json()

      setConsultancies(data.items || [])
      setPagination({
        currentPage: data.pagination?.currentPage || 1,
        totalPages: data.pagination?.totalPages || 1,
        totalCount: data.pagination?.totalCount || 0
      })
    } catch (error) {
      toast.error('Failed to load consultancies')
    } finally {
      setTableLoading(false)
      setLoading(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    loadConsultancies(1, value)
  }

  const handleAdd = () => {
    setEditingData(null)
    setIsOpen(true)
  }

  const handleEdit = (item) => {
    setEditingData(item)
    setIsOpen(true)
  }

  const handleView = (slug) => {
    setViewSlug(slug)
    setIsViewOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteConsultancy(deleteId)
      toast.success('Consultancy deleted successfully')
      loadConsultancies(pagination.currentPage)
    } catch (error) {
      toast.error(error.message || 'Failed to delete')
    } finally {
      setIsConfirmOpen(false)
      setDeleteId(null)
    }
  }

  const handleOpenCredentialsModal = (consultancy) => {
    setSelectedConsultancy(consultancy)
    setCredentialsModalOpen(true)
  }

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.logo && (
            <img src={row.original.logo} alt="" className="w-8 h-8 rounded-md object-contain border bg-gray-50" />
          )}
          <span className="font-medium text-gray-900">{row.original.title}</span>
        </div>
      )
    },
    {
      header: 'Locations',
      accessorKey: 'destination',
      cell: ({ row }) => {
        let dests = row.original.destination
        if (typeof dests === 'string') {
          try { dests = JSON.parse(dests) } catch { dests = [] }
        }
        if (!Array.isArray(dests)) dests = []

        return (
          <div className="flex flex-wrap gap-1">
            {dests.slice(0, 2).map((d, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-tight">
                {typeof d === 'string' ? d : d.country}
              </span>
            ))}
            {dests.length > 2 && <span className="text-[10px] text-gray-400 font-medium">+{dests.length - 2} more</span>}
            {dests.length === 0 && <span className="text-gray-400 italic text-xs">N/A</span>}
          </div>
        )
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original.slug || row.original.slugs)}
            className='hover:bg-blue-50 text-blue-600'
            title="View Details"
          >
            <Eye className='w-4 h-4' />
          </Button>
          {!row.original.userId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleOpenCredentialsModal(row.original)}
              className='hover:bg-indigo-50 text-indigo-600'
              title="Create Credentials"
            >
              <Key className='w-4 h-4' />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            className='hover:bg-amber-50 text-amber-600'
            title="Edit"
          >
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original.id)}
            className='hover:bg-red-50 text-red-600'
            title="Delete"
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )
    }
  ], [])

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder='Search consultancies by name...'
          className='max-w-md w-full'
        />
        <Button onClick={handleAdd} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Consultancy
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          loading={tableLoading}
          data={consultancies}
          columns={columns}
          pagination={pagination}
          onPageChange={(page) => loadConsultancies(page)}
          showSearch={false}
        />
      </div>

      <CreateUpdateConsultancy
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setEditingData(null)
        }}
        onSuccess={() => loadConsultancies(pagination.currentPage)}
        initialData={editingData}
      />

      <ViewConsultancy
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        slug={viewSlug}
      />

      <CreateConsultencyUser
        isOpen={credentialsModalOpen}
        onClose={() => setCredentialsModalOpen(false)}
        selectedConsultancy={selectedConsultancy}
        onSuccess={() => loadConsultancies(pagination.currentPage)}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this consultancy? This action cannot be undone.'
      />
    </div>
  )
}
