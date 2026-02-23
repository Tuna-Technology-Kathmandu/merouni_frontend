'use client'
import { authFetch } from '@/app/utils/authFetch'
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
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import FileUpload from '../addCollege/FileUpload'


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
  const [collegeSearch, setCollegeSearch] = useState('')
  const [selectedColleges, setSelectedColleges] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [fileError, setFileError] = useState(false)
  const abortControllerRef = useRef(null)
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  })


  const fetchTags = async (query) => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/tag?q=${query}`
      )
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

  useEffect(() => {
    setHeading('Material Management')
    const page = searchParams.get('page') || 1
    fetchMaterials(page)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeading])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditing(false)
      setEditingId(null)
      reset()
      setUploadedFiles({ image: '', file: '' })
      setSelectedColleges([])
      setSearchResults([])
      fetchCategories()
      // Remove query parameter from URL
      router.replace('/dashboard/material', { scroll: false })
    }
  }, [searchParams, router, reset])

  const { requireAdmin } = useAdminPermission()



  const fetchCategories = async () => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/category?type=MATERIAL&limit=100`
      )
      const data = await response.json()
      setCategories(data.items || [])
    } catch (error) {
      console.error('Failed to fetch material categories:', error)
    }
  }



  const fetchMaterials = async (page = 1) => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      const currentPage = params.get('page') || '1'

      if (currentPage !== String(page)) {
        params.set('page', page)
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setTableLoading(true)
      const response = await authFetch(
        `${process.env.baseUrl}/material?page=${page}`,
        { signal: abortControllerRef.current.signal }
      )
      const data = await response.json()
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
      setMaterials(data.materials)
    } catch (error) {
      if (error.name === 'AbortError') return
      toast.error('Failed to fetch materials')
    } finally {
      if (abortControllerRef.current?.signal?.aborted === false) {
        setTableLoading(false)
      }
    }
  }

  const onSubmit = async (data) => {
    // Validate file is provided
    if (!uploadedFiles.file || !uploadedFiles.file.trim()) {
      setFileError(true)
      return
    }
    setFileError(false)
    setLoading(true)
    try {

      const payload = {
        title: data.title?.trim() || '',
        tags: data.tags || [],
        visibility: data.visibility,
        image: uploadedFiles.image || null,
        file: uploadedFiles.file
      }

      // Handle category_id — use selectedCategory if available, fallback to form value
      const resolvedCategoryId = selectedCategory?.id ?? data.category_id
      if (!resolvedCategoryId || resolvedCategoryId === '') {
        payload.category_id = null
      } else {
        payload.category_id = parseInt(resolvedCategoryId, 10)
      }

      const url = `${process.env.baseUrl}/material`
      const method = editing ? 'PUT' : 'POST'
      if (editing) {
        const response = await authFetch(
          `${process.env.baseUrl}/material?id=${editId}`,
          {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          }
        )
        await response.json()
      } else {
        const response = await authFetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        await response.json()
      }

      toast.success(
        editing
          ? 'Material updated successfully!'
          : 'Material created successfully!'
      )
      setEditing(false)
      reset()
      setUploadedFiles({ image: '', file: '' })
      setSelectedColleges([])
      setSearchResults([])
      setSelectedCategory(null)
      setFileError(false)
      setValue('category_id', '')
      if (editing) {
        fetchMaterials(pagination.currentPage)
      } else {
        fetchMaterials()
      }
      setIsOpen(false)
      setEditingId(null)
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
      fetchCategories()
      const response = await authFetch(
        `${process.env.baseUrl}/material/${editdata.id}`
      )
      const data = await response.json()
      const material = data.material
      setEditingId(material.id)

      setValue('title', material.title)
      let tagg = JSON.parse(editdata.tags)
      if (material.tags) setValue('tags', tagg)

      if (material.tags) {
        const tagData = tagg.map((tag, index) => ({
          id: tag,
          title: material.tags[index].title
        }))
        setSelectedColleges(tagData)
        setValue(
          'tags',
          tagData.map((t) => t.id)
        )
      }

      // Extract category_id from material
      const categoryId = material.category_id || material.category?.id || ''
      setValue('category_id', categoryId)
      if (material.category) {
        setSelectedCategory({
          id: material.category.id,
          title: material.category.title
        })
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

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/material?id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchMaterials(pagination.currentPage)
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
      accessorKey: 'title'
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: ({ row }) => {
        const category = row.original.category
        return category ? (
          <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium'>
            {category.title}
          </span>
        ) : (
          <span className='text-gray-400 text-sm'>-</span>
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
  ], [requireAdmin])

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query) {
      fetchMaterials()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/material?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setMaterials(data.materials)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching materials:', response.statusText)
        setMaterials([])
      }
    } catch (error) {
      console.error('Error fetching materials search results:', error.message)
      setMaterials([])
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

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ image: '', file: '' })
    setSelectedColleges([])
    setSearchResults([])
    setSelectedCategory(null)
    setFileError(false)
  }

  const handleAddClick = () => {
    setIsOpen(true)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ image: '', file: '' })
    setSelectedColleges([])
    setSearchResults([])
    setSelectedCategory(null)
    setFileError(false)
    fetchCategories()
  }

  return (
    <div className='w-full space-y-4 p-4'>
      {/* Header Section */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search materials...'
            className='max-w-md w-full'
          />

          {/* Button */}
          <Button onClick={handleAddClick} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleCloseModal}
        className='max-w-4xl'
      >
        <DialogContent className='max-w-4xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editing ? 'Edit Material' : 'Add New Material'}
            </DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form id="material-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* Basic Information */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Material Details</h3>

                <div className='grid grid-cols-1 gap-6'>
                  <div className="space-y-2">
                    <Label required>Title</Label>
                    <Input
                      {...register('title', {
                        required: 'Title is required',
                        minLength: {
                          value: 3,
                          message: 'Title must be at least 3 characters long'
                        }
                      })}
                      placeholder='Enter material title'
                    />
                    {errors.title && (
                      <p className='text-xs text-red-500'>{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <SearchSelectCreate
                      onSearch={fetchTags}
                      onSelect={(item) => {
                        if (!selectedColleges.some((c) => c.id === item.id)) {
                          const updated = [...selectedColleges, item]
                          setSelectedColleges(updated)
                          setValue('tags', updated.map(t => t.id))
                        }
                      }}
                      onRemove={(item) => {
                        const updated = selectedColleges.filter((c) => (c.id !== item.id))
                        setSelectedColleges(updated)
                        setValue('tags', updated.map(t => t.id))
                      }}
                      selectedItems={selectedColleges}
                      placeholder="Search tags..."
                      isMulti={true}
                      displayKey="title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <SearchSelectCreate
                      onSearch={fetchCategoriesSearch}
                      onSelect={(item) => {
                        setSelectedCategory(item)
                        setValue('category_id', item.id)
                      }}
                      onRemove={() => {
                        setSelectedCategory(null)
                        setValue('category_id', '')
                      }}
                      selectedItems={selectedCategory}
                      placeholder="Search or select category..."
                      isMulti={false}
                      displayKey="title"
                    />
                  </div>
                </div>
              </section>

              {/* Files Section */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Files & Media</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className="space-y-3">
                    <FileUpload
                      label={
                        <>
                          Material File <span className='text-red-500'>*</span>
                        </>
                      }
                      accept='application/pdf,image/*'
                      onUploadComplete={(url) => {
                        setUploadedFiles((prev) => ({ ...prev, file: url }))
                        setValue('file', url)
                        if (url) setFileError(false)
                      }}
                      defaultPreview={uploadedFiles.file}
                    />
                    {fileError && (
                      <p className='text-red-500 text-xs mt-1'>
                        Material file is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <FileUpload
                      label={
                        <>
                          Material Image <span className='text-gray-500 text-sm'>(Optional)</span>
                        </>
                      }
                      onUploadComplete={(url) => {
                        setUploadedFiles((prev) => ({ ...prev, image: url }))
                        setValue('image', url)
                      }}
                      defaultPreview={uploadedFiles.image}
                    />
                  </div>
                </div>
              </section>
            </form>
          </div>

          <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form="material-form"
              disabled={loading}
              className='bg-[#387cae] hover:bg-[#387cae]/90 text-white'
            >
              {loading
                ? 'Processing...'
                : editing
                  ? 'Update Material'
                  : 'Create Material'}
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
          onSearch={handleSearch}
          showSearch={false}
        />
      </div>
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this material? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />
    </div>
  )
}
