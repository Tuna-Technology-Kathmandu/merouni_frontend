'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Plus } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import SearchInput from '@/ui/molecules/SearchInput'

export default function LevelForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const { requireAdmin } = useAdminPermission()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({ defaultValues: { title: '', author: author_id } })

  const [isOpen, setIsOpen] = useState(false)
  const [levels, setLevels] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const abortControllerRef = useRef(null)

  useEffect(() => {
    setHeading('Level Management')
    fetchLevels()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => { if (searchTimeout) clearTimeout(searchTimeout) }
  }, [searchTimeout])

  const fetchLevels = async (page = 1) => {
    if (abortControllerRef.current) abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()
    setTableLoading(true)
    try {
      const res = await authFetch(`${process.env.baseUrl}/level?page=${page}`, { signal: abortControllerRef.current.signal })
      const data = await res.json()
      setLevels(data.items)
      setPagination({ currentPage: data.pagination.currentPage, totalPages: data.pagination.totalPages, total: data.pagination.totalCount })
    } catch (error) {
      if (error.name === 'AbortError') return
      toast.error('Failed to fetch levels')
    } finally {
      if (abortControllerRef.current?.signal?.aborted === false) setTableLoading(false)
    }
  }

  const handleCloseModal = () => { setIsOpen(false); setEditing(false); setEditingId(null); reset() }

  const onSubmit = async (data) => {
    try {
      if (editing) {
        const res = await authFetch(`${process.env.baseUrl}/level?level_id=${editId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Failed to update level')
        toast.success('Level updated successfully!')
      } else {
        const res = await authFetch(`${process.env.baseUrl}/level`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Failed to create level')
        toast.success('Level created successfully!')
      }
      handleCloseModal()
      fetchLevels(pagination.currentPage)
    } catch (error) {
      toast.error(error.message || 'Failed to save level')
    }
  }

  const handleEdit = (level) => {
    setEditing(true)
    setIsOpen(true)
    setEditingId(level.id)
    setValue('title', level.title)
    setValue('author', level.author || author_id)
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    if (value === '') handleSearch('')
    else setSearchTimeout(setTimeout(() => handleSearch(value), 300))
  }

  const handleDeleteClick = (id) => requireAdmin(() => { setDeleteId(id); setIsDialogOpen(true) })

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const res = await authFetch(`${process.env.baseUrl}/level?id=${deleteId}`, { method: 'DELETE' })
      const data = await res.json()
      toast.success(data.message || 'Level deleted')
      fetchLevels(pagination.currentPage)
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleSearch = async (query) => {
    if (!query) { fetchLevels(); return }
    try {
      const res = await authFetch(`${process.env.baseUrl}/level?q=${query}`)
      if (res.ok) {
        const data = await res.json()
        setLevels(data.items)
        if (data.pagination) setPagination({ currentPage: data.pagination.currentPage, totalPages: data.pagination.totalPages, total: data.pagination.totalCount })
      } else setLevels([])
    } catch { setLevels([]) }
  }

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.title}</span>
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} className='hover:bg-amber-50 text-amber-600' title="Edit">
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row.original.id)} className='hover:bg-red-50 text-red-600' title="Delete">
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )
    }
  ], [requireAdmin])

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      {/* Header */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          <SearchInput value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)} placeholder='Search levels...' className='max-w-md w-full' />
          <Button onClick={() => { setIsOpen(true); setEditing(false); setEditingId(null); reset() }} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Level
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table loading={tableLoading} data={levels} columns={columns} pagination={pagination} onPageChange={(p) => fetchLevels(p)} showSearch={false} />
      </div>

      {/* Create / Edit Modal */}
      <Dialog isOpen={isOpen} onClose={handleCloseModal} className='max-w-md'>
        <DialogContent className='max-w-md flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">{editing ? 'Edit Level' : 'Add Level'}</DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>
          <div className='p-6'>
            <form id="level-form" onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <input type="hidden" {...register('author')} />
              <div className="space-y-2">
                <Label htmlFor="title" required>Title</Label>
                <Input
                  id="title"
                  placeholder='e.g. Undergraduate'
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 2, message: 'Title must be at least 2 characters' }
                  })}
                  className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.title && <p className='text-xs text-destructive mt-1'>{errors.title.message}</p>}
              </div>
            </form>
          </div>
          <div className='px-6 py-4 border-t flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
            <Button type='submit' form="level-form" disabled={isSubmitting} className='bg-[#387cae] hover:bg-[#387cae]/90 text-white'>
              {isSubmitting ? 'Saving…' : editing ? 'Update Level' : 'Create Level'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this level? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />
    </div>
  )
}
