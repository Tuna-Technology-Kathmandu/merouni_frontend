'use client'

import { authFetch } from '@/app/utils/authFetch'
import { cn } from '@/app/lib/utils'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import Table from '@/ui/shadcn/DataTable'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import { Edit2, Plus, Trash2, FileText, Info, Loader2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import FileUpload from '../addCollege/FileUpload'
import Loading from '@/ui/molecules/Loading'

export default function MaterialForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [materials, setMaterials] = useState([])

  const [categories, setCategories] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    image: '',
    file: ''
  })
  const [deleteId, setDeleteId] = useState(null)
  const [editId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [fileError, setFileError] = useState(false)
  const abortControllerRef = useRef(null)
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
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
      author: author_id,
      tags: [],
      file: '',
      image: '',
      category_id: ''
    }
  })

  const { requireAdmin } = useAdminPermission()

  useEffect(() => {
    setHeading('Material Management')
    const page = searchParams.get('page') || 1
    fetchMaterials(page)
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      handleAddClick()
      router.replace('/dashboard/material', { scroll: false })
    }
  }, [searchParams, router])

  const fetchTags = async (query) => {
    try {
      const response = await authFetch(`${process.env.baseUrl}/tag?q=${query}`)
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Tag Search Error:', error)
      return []
    }
  }

  const fetchCategoriesSearch = async (query) => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/category?type=MATERIAL&limit=100${query ? `&q=${query}` : ''}`
      )
      const data = await response.json()
      return data.items || []
    } catch (error) {
      console.error('Category Search Error:', error)
      return []
    }
  }

  const fetchMaterials = async (page = 1) => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      if (params.get('page') !== String(page)) {
        params.set('page', page)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }

      if (abortControllerRef.current) abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()

      setTableLoading(true)
      const response = await authFetch(
        `${process.env.baseUrl}/material?page=${page}${searchQuery ? `&q=${searchQuery}` : ''}`,
        { signal: abortControllerRef.current.signal }
      )
      const data = await response.json()
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
      setMaterials(data.materials || [])
    } catch (error) {
      if (error.name === 'AbortError') return
      toast.error('Failed to fetch materials')
    } finally {
      if (!abortControllerRef.current?.signal?.aborted) {
        setTableLoading(false)
      }
    }
  }

  const onSubmit = async (data) => {
    if (!uploadedFiles.file?.trim()) {
      setFileError(true)
      return
    }
    setFileError(false)
    setLoading(true)

    try {
      const payload = {
        title: data.title?.trim(),
        tags: selectedTags.map(t => t.id),
        image: uploadedFiles.image || null,
        file: uploadedFiles.file,
        category_id: selectedCategory?.id ? parseInt(selectedCategory.id, 10) : null
      }

      const url = editing
        ? `${process.env.baseUrl}/material?id=${editId}`
        : `${process.env.baseUrl}/material`

      const method = editing ? 'PUT' : 'POST'

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Failed to save material')

      toast.success(editing ? 'Material updated successfully!' : 'Material created successfully!')
      handleCloseModal()
      fetchMaterials(editing ? pagination.currentPage : 1)
    } catch (error) {
      toast.error(error.message || 'Failed to save material')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (editdata) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(`${process.env.baseUrl}/material/${editdata.id}`)
      const data = await response.json()
      const material = data.material
      setEditingId(material.id)

      setValue('title', material.title)

      if (material.tags) {
        setSelectedTags(material.tags.map(t => ({ id: t.id, title: t.title })))
      } else {
        setSelectedTags([])
      }

      if (material.category) {
        setSelectedCategory({ id: material.category.id, title: material.category.title })
      } else {
        setSelectedCategory(null)
      }

      setUploadedFiles({
        image: material.image || '',
        file: material.file || ''
      })
    } catch (error) {
      toast.error('Failed to fetch material details')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const response = await authFetch(`${process.env.baseUrl}/material?id=${deleteId}`, { method: 'DELETE' })
      const res = await response.json()
      toast.success(res.message || 'Deleted successfully')
      fetchMaterials(pagination.currentPage)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <FileText size={16} />
          </div>
          <span className="font-medium text-slate-900">{row.original.title}</span>
        </div>
      )
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => {
        const category = row.original.category
        return category ? (
          <span className='px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold'>
            {category.title}
          </span>
        ) : (
          <span className='text-slate-400 text-xs italic'>No Category</span>
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
            onClick={() => handleEdit(row.original)}
            className='hover:bg-blue-50 text-blue-600'
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
  ], [requireAdmin])

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)

    const timeoutId = setTimeout(() => {
      fetchMaterials(1)
    }, 500)
    setSearchTimeout(timeoutId)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ image: '', file: '' })
    setSelectedTags([])
    setSelectedCategory(null)
    setFileError(false)
  }

  const handleAddClick = () => {
    handleCloseModal()
    setIsOpen(true)
  }

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      {/* Sticky Header */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search materials by title...'
            className='max-w-md w-full'
          />

          <Button onClick={handleAddClick} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 h-11 px-6 shadow-md shadow-[#387cae]/20 transition-all active:scale-95">
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog isOpen={isOpen} onClose={handleCloseModal} className='max-w-2xl'>
        <DialogContent className='max-w-2xl p-0'>
          <DialogHeader className='px-6 py-4 border-b bg-slate-50/50 rounded-t-lg'>
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#387cae] flex items-center justify-center text-white">
                <FileText size={18} />
              </div>
              {editing ? 'Edit Material' : 'Add New Material'}
            </DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          <div className='p-6'>
            <form id="material-form" onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-1 gap-6'>
                <div className="space-y-2">
                  <Label required className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</Label>
                  <Input
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 3, message: 'Title must be at least 3 characters long' }
                    })}
                    placeholder='Enter a descriptive title for this material'
                    className={cn("h-11", errors.title && "border-red-500 focus:ring-red-500/10")}
                  />
                  {errors.title && <p className='text-[10px] font-bold text-red-500 uppercase mt-1'>{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</Label>
                    <SearchSelectCreate
                      onSearch={fetchCategoriesSearch}
                      onSelect={(item) => setSelectedCategory(item)}
                      onRemove={() => setSelectedCategory(null)}
                      selectedItems={selectedCategory}
                      placeholder="Select Category"
                      isMulti={false}
                      displayKey="title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags</Label>
                    <SearchSelectCreate
                      onSearch={fetchTags}
                      onSelect={(item) => {
                        if (!selectedTags.find(t => t.id === item.id)) {
                          setSelectedTags([...selectedTags, item])
                        }
                      }}
                      onRemove={(item) => setSelectedTags(selectedTags.filter(t => t.id !== item.id))}
                      selectedItems={selectedTags}
                      placeholder="Add tags..."
                      isMulti={true}
                      displayKey="title"
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed'>
                <div className="space-y-3">
                  <Label required className="text-xs font-bold text-slate-500 uppercase tracking-wider">Material File</Label>
                  <FileUpload
                    accept='application/pdf,image/*'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, file: url }))
                      if (url) setFileError(false)
                    }}
                    defaultPreview={uploadedFiles.file}
                  />
                  {fileError && <p className='text-[10px] font-bold text-red-500 uppercase'>File is required</p>}
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thumbnail <span className="text-slate-400 normal-case font-medium">(Optional)</span></Label>
                  <FileUpload
                    onUploadComplete={(url) => setUploadedFiles((prev) => ({ ...prev, image: url }))}
                    defaultPreview={uploadedFiles.image}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3 rounded-b-lg'>
            <Button type='button' variant='outline' onClick={handleCloseModal} className="h-11 px-6">
              Cancel
            </Button>
            <Button
              type='submit'
              form="material-form"
              disabled={loading}
              className='bg-[#387cae] hover:bg-[#387cae]/90 text-white min-w-[140px] h-11 px-6 font-bold shadow-lg shadow-[#387cae]/20'
            >
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {loading ? 'Processing...' : (editing ? 'Update Content' : 'Publish Material')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          loading={tableLoading}
          data={materials}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => fetchMaterials(newPage)}
          showSearch={false}
          emptyContent={searchQuery ? "No materials found matching your search." : "No materials available."}
        />
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Delete Material'
        message='Are you sure you want to delete this material? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />
    </div>
  )
}
