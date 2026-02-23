'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'

import Table from '@/ui/shadcn/DataTable'
import FileUpload from '../addCollege/FileUpload'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Eye, Edit2, Trash2, Plus } from 'lucide-react'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import SearchInput from '@/ui/molecules/SearchInput'

const VacancyManager = () => {
  const { setHeading } = usePageHeading()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const author_id = useSelector((state) => state.user.data?.id)
  const { requireAdmin } = useAdminPermission()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      featuredImage: '',
      associated_organization_name: '',
      author_id
    }
  })

  const [vacancies, setVacancies] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState({ featuredImage: '' })
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewVacancyData, setViewVacancyData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)
  const abortControllerRef = useRef(null)

  const loadVacancies = async (page = 1) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const params = new URLSearchParams(searchParams.toString())
      const currentPage = params.get('page') || '1'

      if (currentPage !== String(page)) {
        params.set('page', page)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }

      setTableLoading(true)
      const response = await authFetch(
        `${process.env.baseUrl}/vacancy?page=${page}`,
        { signal: abortControllerRef.current.signal }
      )
      const data = await response.json()
      setVacancies(data.items || [])
      if (data.pagination) {
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
          total: data.pagination.totalCount
        })
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      toast.error('Failed to load vacancies')
    } finally {
      if (abortControllerRef.current?.signal?.aborted === false) {
        setTableLoading(false)
      }
    }
  }

  useEffect(() => {
    setHeading('Vacancy Management')
    const page = searchParams.get('page') || 1
    loadVacancies(page)
    return () => setHeading(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeading])

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleAddClick()
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTimeout])

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ featuredImage: '' })
  }

  const handleAddClick = () => {
    setIsOpen(true)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ featuredImage: '' })
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const payload = {
        ...data,
        author_id,
        featuredImage: uploadedFiles.featuredImage || data.featuredImage
      }

      const method = editing ? 'PUT' : 'POST'
      const url = editing
        ? `${process.env.baseUrl}/vacancy?id=${editingId}`
        : `${process.env.baseUrl}/vacancy`

      const response = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save vacancy')
      }

      toast.success(editing ? 'Vacancy updated successfully' : 'Vacancy created successfully')
      handleCloseModal()
      loadVacancies(pagination.currentPage)
    } catch (error) {
      toast.error(error.message || 'Failed to save vacancy')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (slugs) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(`${process.env.baseUrl}/vacancy/${slugs}`)
      const data = await response.json()
      const vacancy = data.item

      setEditingId(vacancy.id)
      setValue('title', vacancy.title)
      setValue('description', vacancy.description || '')
      setValue('content', vacancy.content || '')
      setValue('featuredImage', vacancy.featuredImage || '')
      setValue('associated_organization_name', vacancy.associated_organization_name || '')
      setUploadedFiles({ featuredImage: vacancy.featuredImage || '' })
    } catch (error) {
      toast.error('Failed to fetch vacancy details')
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
      const response = await authFetch(
        `${process.env.baseUrl}/vacancy?id=${deleteId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      )
      const res = await response.json()
      if (!response.ok) throw new Error(res.message || 'Failed to delete vacancy')
      toast.success(res.message || 'Vacancy deleted')
      loadVacancies(pagination.currentPage)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const response = await authFetch(`${process.env.baseUrl}/vacancy/${slug}`)
      if (!response.ok) throw new Error('Failed to fetch vacancy details')
      const data = await response.json()
      setViewVacancyData(data.item)
    } catch (err) {
      toast.error(err.message || 'Failed to load vacancy details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadVacancies(pagination.currentPage)
      return
    }
    try {
      const response = await authFetch(`${process.env.baseUrl}/vacancy?q=${query}`)
      if (response.ok) {
        const data = await response.json()
        setVacancies(data.items || [])
        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        setVacancies([])
      }
    } catch (error) {
      setVacancies([])
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    if (value === '') {
      handleSearch('')
    } else {
      const id = setTimeout(() => handleSearch(value), 300)
      setSearchTimeout(id)
    }
  }

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.title}</div>
      )
    },
    {
      header: 'Organization / Institution',
      accessorKey: 'associated_organization_name',
      cell: ({ row }) => {
        const org = row.original.associated_organization_name
        return org ? (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
            {org}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )
      }
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ getValue }) => {
        const text = getValue()
        return (
          <span className="text-gray-600 text-sm">
            {text?.length > 80 ? `${text.substring(0, 80)}...` : text || '—'}
          </span>
        )
      }
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original.slugs)}
            className="hover:bg-blue-50 text-blue-600"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original.slugs)}
            className="hover:bg-amber-50 text-amber-600"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original.id)}
            className="hover:bg-red-50 text-red-600"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ], [requireAdmin])

  return (
    <div className="w-full space-y-4 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-[#F7F8FA] py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search vacancies..."
            className="max-w-md w-full"
          />
          <Button
            onClick={handleAddClick}
            className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Vacancy
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          loading={tableLoading}
          data={vacancies}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => loadVacancies(newPage)}
          showSearch={false}
        />
      </div>

      {/* Add / Edit Modal */}
      <Dialog
        isOpen={isOpen}
        onClose={handleCloseModal}
        closeOnOutsideClick={false}
        className="max-w-4xl"
      >
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editing ? 'Edit Vacancy' : 'Add New Vacancy'}
            </DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <form id="vacancy-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Basic Information */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Vacancy Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label required>Vacancy Title</Label>
                    <Input
                      placeholder="Enter vacancy title"
                      {...register('title', { required: 'Title is required' })}
                      className={errors.title ? 'border-red-400' : ''}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Associated Organization / Institution</Label>
                    <Input
                      placeholder="Enter organization or institution name"
                      {...register('associated_organization_name')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Textarea
                    placeholder="Enter a brief summary of the vacancy..."
                    {...register('description')}
                    className="min-h-[100px]"
                  />
                </div>
              </section>

              {/* Content */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Detailed Content</h3>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <TipTapEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter detailed vacancy content, requirements, responsibilities..."
                      />
                    )}
                  />
                </div>
              </section>

              {/* Media */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Media</h3>
                <div className="space-y-2">
                  <FileUpload
                    label="Featured Image (Optional)"
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, featuredImage: url }))
                      setValue('featuredImage', url)
                    }}
                    defaultPreview={uploadedFiles.featuredImage}
                  />
                </div>
              </section>
            </form>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="vacancy-form"
              disabled={loading}
              className="bg-[#387cae] hover:bg-[#387cae]/90 text-white"
            >
              {loading ? 'Saving...' : editing ? 'Update Vacancy' : 'Create Vacancy'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this vacancy? This action cannot be undone."
      />

      {/* View Vacancy Modal */}
      <Dialog
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewVacancyData(null) }}
        className="max-w-3xl"
      >
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-lg font-semibold text-gray-900">Vacancy Details</DialogTitle>
            <DialogClose onClick={() => { setViewModalOpen(false); setViewVacancyData(null) }} />
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {loadingView ? (
              <div className="flex justify-center items-center h-48 text-gray-400">
                Loading...
              </div>
            ) : viewVacancyData ? (
              <div className="space-y-6">
                {viewVacancyData.featuredImage && (
                  <div className="w-full h-56 rounded-xl overflow-hidden border">
                    <img
                      src={viewVacancyData.featuredImage}
                      alt={viewVacancyData.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{viewVacancyData.title}</h2>
                  {viewVacancyData.associated_organization_name && (
                    <span className="mt-2 inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                      {viewVacancyData.associated_organization_name}
                    </span>
                  )}
                </div>

                {viewVacancyData.description && (
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: viewVacancyData.description }}
                    />
                  </div>
                )}

                {viewVacancyData.content && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Content</h3>
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: viewVacancyData.content }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-12">No vacancy data available.</p>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => { setViewModalOpen(false); setViewVacancyData(null) }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default VacancyManager
