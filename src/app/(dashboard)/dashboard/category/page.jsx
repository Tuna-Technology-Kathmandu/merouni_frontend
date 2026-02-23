'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { fetchCategories } from './action'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Eye, Plus } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import SearchInput from '@/ui/molecules/SearchInput'

export default function CategoryManager() {
  const { setHeading } = usePageHeading()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { title: '', description: '', type: '' }
  })

  const [categories, setCategories] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingCategory, setViewingCategory] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  useEffect(() => {
    setHeading('Category Management')
    loadCategories()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => { if (searchTimeout) clearTimeout(searchTimeout) }
  }, [searchTimeout])

  const loadCategories = async (page = 1) => {
    try {
      setTableLoading(true)
      const response = await fetchCategories(page)
      setCategories(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      toast.error('Failed to load categories')
    } finally {
      setTableLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    reset()
  }

  const handleAddClick = () => {
    setIsOpen(true)
    setEditing(false)
    setEditingId(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        const res = await authFetch(`${process.env.baseUrl}/category?category_id=${editingId}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Failed to update category')
        toast.success('Category updated successfully')
      } else {
        const res = await authFetch(`${process.env.baseUrl}/category`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        })
        if (!res.ok) throw new Error('Failed to create category')
        toast.success('Category created successfully')
      }
      handleCloseModal()
      loadCategories(pagination.currentPage)
    } catch (err) {
      toast.error(err.message || `Failed to ${editingId ? 'update' : 'create'} category`)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setEditing(true)
    setIsOpen(true)
    setValue('title', category.title)
    setValue('description', category.description || '')
    setValue('type', category.type || '')
  }

  const handleView = (category) => {
    setViewingCategory(category)
    setIsViewOpen(true)
  }

  const handleDeleteClick = (id) => { setDeleteId(id); setIsDialogOpen(true) }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const res = await authFetch(`${process.env.baseUrl}/category?category_id=${deleteId}`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      toast.success(data.message || 'Category deleted')
      loadCategories(pagination.currentPage)
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleSearch = async (query) => {
    if (!query) { loadCategories(); return }
    try {
      const res = await authFetch(`${process.env.baseUrl}/category?q=${query}`)
      if (res.ok) {
        const data = await res.json()
        setCategories(data.items)
        if (data.pagination) setPagination({ currentPage: data.pagination.currentPage, totalPages: data.pagination.totalPages, total: data.pagination.totalCount })
      } else setCategories([])
    } catch { setCategories([]) }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    if (value === '') handleSearch('')
    else setSearchTimeout(setTimeout(() => handleSearch(value), 300))
  }

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.title}</span>
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ getValue }) => getValue()
        ? <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase">{getValue()}</span>
        : <span className="text-gray-400 italic text-xs">—</span>
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ getValue }) => {
        const v = getValue()
        if (!v) return <span className="text-gray-400 italic text-xs">—</span>
        return <span className="text-gray-600 text-sm">{v.length > 60 ? `${v.substring(0, 60)}…` : v}</span>
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button variant="ghost" size="icon" onClick={() => handleView(row.original)} className='hover:bg-blue-50 text-blue-600' title="View">
            <Eye className='w-4 h-4' />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} className='hover:bg-amber-50 text-amber-600' title="Edit">
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row.original.id)} className='hover:bg-red-50 text-red-600' title="Delete">
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
          <SearchInput value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)} placeholder='Search categories...' className='max-w-md w-full' />
          <Button onClick={handleAddClick} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Dialog isOpen={isOpen} onClose={handleCloseModal} className='max-w-lg'>
        <DialogContent className='max-w-lg max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editing ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form id="category-form" onSubmit={handleSubmit(onSubmit)} className='space-y-5'>

              <div className="space-y-2">
                <Label htmlFor="title" required>Title</Label>
                <Input
                  id="title"
                  placeholder='e.g. Technology'
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 2, message: 'Title must be at least 2 characters' }
                  })}
                  className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {errors.title && <p className='text-xs text-destructive mt-1'>{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" required>Type</Label>
                <select
                  id="type"
                  {...register('type', { required: 'Type is required' })}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387cae] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.type ? 'border-destructive' : 'border-input'}`}
                >
                  <option value=''>Select type…</option>
                  <option value='BLOG'>BLOG</option>
                  <option value='EVENT'>EVENT</option>
                  <option value='NEWS'>NEWS</option>
                  <option value='MATERIAL'>MATERIAL</option>
                </select>
                {errors.type && <p className='text-xs text-destructive mt-1'>{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder='Brief description of this category…'
                  {...register('description', { maxLength: { value: 500, message: 'Max 500 characters' } })}
                  rows={3}
                  className={`resize-none ${errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                />
                {errors.description && <p className='text-xs text-destructive mt-1'>{errors.description.message}</p>}
              </div>

            </form>
          </div>

          <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3'>
            <Button type='button' variant='outline' onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
            <Button type='submit' form="category-form" disabled={isSubmitting} className='bg-[#387cae] hover:bg-[#387cae]/90 text-white'>
              {isSubmitting ? 'Processing…' : editing ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table data={categories} columns={columns} pagination={pagination} onPageChange={(p) => loadCategories(p)} showSearch={false} loading={tableLoading} />
      </div>

      {/* View Modal */}
      <Dialog isOpen={isViewOpen} onClose={() => { setIsViewOpen(false); setViewingCategory(null) }} className='max-w-lg'>
        <DialogContent className='max-w-lg max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">Category Details</DialogTitle>
            <DialogClose onClick={() => { setIsViewOpen(false); setViewingCategory(null) }} />
          </DialogHeader>
          <div className='flex-1 overflow-y-auto p-6 space-y-4'>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Title</p>
              <p className="text-lg font-bold text-gray-900">{viewingCategory?.title}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Type</p>
              {viewingCategory?.type
                ? <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase">{viewingCategory.type}</span>
                : <span className="text-gray-400 italic text-sm">—</span>}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</p>
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{viewingCategory?.description || 'No description provided.'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Created</p>
                <p className="text-sm text-gray-600">{viewingCategory?.createdAt ? new Date(viewingCategory.createdAt).toLocaleDateString() : '—'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Updated</p>
                <p className="text-sm text-gray-600">{viewingCategory?.updatedAt ? new Date(viewingCategory.updatedAt).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>
          <div className='px-6 py-4 border-t flex justify-end'>
            <Button variant='outline' onClick={() => setIsViewOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this category? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />
    </div>
  )
}
