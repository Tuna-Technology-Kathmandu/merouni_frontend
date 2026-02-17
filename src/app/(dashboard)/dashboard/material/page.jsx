'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'


import { X } from 'lucide-react'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from '@/ui/shadcn/button'
import SearchInput from '@/ui/molecules/SearchInput'
import { formatDate } from '@/utils/date.util'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'

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
  const abortControllerRef = useRef(null)
  const [pagination, setPagination] = useState({
    currentPage: parseInt(searchParams.get('page')) || 1,
    totalPages: 1,
    total: 0
  })


  const searchCollege = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/tag?q=${query}`
      )
      const data = await response.json()
      setSearchResults(data.items || [])
    } catch (error) {
      console.error('College Search Error:', error)
      toast.error('Failed to search tags')
    }
  }
  const addCollege = (college) => {
    if (!selectedColleges.some((c) => c.id === college.id)) {
      setSelectedColleges((prev) => [...prev, college])
      // Update form value
      const collegeIds = [...selectedColleges, college].map((c) => c.id)
      setValue('tags', collegeIds)
    }
    setCollegeSearch('')
    setSearchResults([])
  }

  // Add function to remove college
  const removeCollege = (collegeId) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== collegeId))
    // Update form value
    const updatedCollegeIds = selectedColleges
      .filter((c) => c.id !== collegeId)
      .map((c) => c.id)
    setValue('tags', updatedCollegeIds)
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
    try {
      // Validate file is provided
      if (!uploadedFiles.file || !uploadedFiles.file.trim()) {
        toast.error('Material file is required')
        return
      }

      const payload = {
        title: data.title?.trim() || '',
        tags: data.tags || [],
        visibility: data.visibility,
        image: uploadedFiles.image || null,
        file: uploadedFiles.file
      }

      // Handle category_id - convert empty string to null, or parse to integer
      if (
        data.category_id === '' ||
        data.category_id === null ||
        data.category_id === undefined
      ) {
        payload.category_id = null
      } else {
        payload.category_id = parseInt(data.category_id, 10)
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
      setValue('category_id', '')
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

      // setValue("tags", JSON.parse(material.tags));
      setValue('visibility', material.visibility)
      // Extract category_id from material (could be direct field or from category association)
      const categoryId = material.category_id || material.category?.id || ''
      setValue('category_id', categoryId)

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

  const columns = [
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
          <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
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
        <div className='flex gap-2'>
          <button
            onClick={() => handleEdit(row.original)}
            className='p-1 text-blue-600 hover:text-blue-800'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]

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
  }

  const handleAddClick = () => {
    setIsOpen(true)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ image: '', file: '' })
    setSelectedColleges([])
    setSearchResults([])
    fetchCategories()
  }

  return (
    <div className='w-full space-y-2'>
      {/* Header Section */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] flex items-center justify-between px-4 pt-4'>
        {/* Search Bar */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder='Search materials...'
          className='max-w-md'
        />

        {/* Button */}
        <div className='flex items-center gap-4'>
          <Button onClick={handleAddClick}>Add Material</Button>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleCloseModal}
        className='max-w-4xl'
      >
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Material' : 'Add Material'}</DialogTitle>
          <DialogClose onClick={handleCloseModal} />
        </DialogHeader>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <div className='container mx-auto p-1 flex flex-col'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col space-y-6'
            >
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-xl font-semibold mb-4'>
                  Material Information
                </h2>
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label className='block mb-2'>
                      Title <span className='text-red-500'>*</span>
                    </label>
                    <input
                      {...register('title', {
                        required: 'Title is required',
                        minLength: {
                          value: 3,
                          message: 'Title must be at least 3 characters long'
                        }
                      })}
                      className='w-full p-2 border rounded'
                    />
                    {errors.title && (
                      <span className='text-red-500'>{errors.title.message}</span>
                    )}
                  </div>

                  <div className='mb-4'>
                    <label className='block mb-2'>Tags</label>
                    <div className='flex flex-wrap gap-2 mb-2'>
                      {selectedColleges.map((college) => (
                        <div
                          key={college.id}
                          className='flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full'
                        >
                          <span>{college.title}</span>
                          <button
                            type='button'
                            onClick={() => removeCollege(college.id)}
                            className='text-blue-600 hover:text-blue-800'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className='relative'>
                      <input
                        type='text'
                        value={collegeSearch}
                        onChange={searchCollege}
                        className='w-full p-2 border rounded'
                        placeholder='Search tags...'
                      />

                      {searchResults.length > 0 && (
                        <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
                          {searchResults.map((college) => (
                            <div
                              key={college.id}
                              onClick={() => addCollege(college)}
                              className='p-2 hover:bg-gray-100 cursor-pointer'
                            >
                              {college.title}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className='block mb-2'>Category</label>
                    <select
                      {...register('category_id')}
                      className='w-full p-2 border rounded'
                    >
                      <option value=''>No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>



                  <div>
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
                      }}
                      defaultPreview={uploadedFiles.file}
                    />
                    {!uploadedFiles.file && (
                      <p className='text-red-500 text-sm mt-1'>
                        Material file is required
                      </p>
                    )}
                  </div>

                  <div>
                    <FileUpload
                      label={
                        <>
                          Material Image{' '}
                          <span className='text-gray-500 text-sm'>
                            (Optional)
                          </span>
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
              </div>

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  disabled={loading}
                  className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
                >
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update Material'
                      : 'Create Material'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <div className='px-4 pt-4'>
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
