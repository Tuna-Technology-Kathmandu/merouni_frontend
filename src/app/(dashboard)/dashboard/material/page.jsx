'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { X } from 'lucide-react'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Modal } from '../../../../components/UserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function MaterialForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [materials, setMaterials] = useState([])
  const [tags, setTags] = useState([])
  const [categories, setCategories] = useState([])
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const visibilityOptions = ['public', 'private']

  const searchCollege = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/tag?q=${query}`
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
      visibility: 'public',
      category_id: ''
    }
  })

  useEffect(() => {
    setHeading('Material Management')
    fetchMaterials()
    fetchTags()
    fetchCategories()
    return () => setHeading(null)
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
      // Remove query parameter from URL
      router.replace('/dashboard/material', { scroll: false })
    }
  }, [searchParams, router, reset])

  const { requireAdmin } = useAdminPermission()

  const fetchTags = async () => {
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/tag`
      )
      const data = await response.json()
      setTags(data.items)
    } catch (error) {
      toast.error('Failed to fetch tags')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/material-category?limit=100`
      )
      const data = await response.json()
      setCategories(data.items || [])
    } catch (error) {
      console.error('Failed to fetch material categories:', error)
    }
  }

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    setAddingCategory(true)
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/material-category`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim() || null
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create category')
      }

      const data = await response.json()
      toast.success('Category created successfully!')

      // Refresh categories list
      await fetchCategories()

      // Set the newly created category as selected
      setValue('category_id', data.category.id)

      // Reset form
      setNewCategoryName('')
      setNewCategoryDescription('')
      setShowAddCategory(false)
    } catch (error) {
      toast.error(error.message || 'Failed to create category')
    } finally {
      setAddingCategory(false)
    }
  }

  const fetchMaterials = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/material?page=${page}`
      )
      const data = await response.json()
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
      setMaterials(data.materials)
    } catch (error) {
      toast.error('Failed to fetch materials')
    } finally {
      setTableLoading(false)
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

      const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/material`
      const method = editing ? 'PUT' : 'POST'
      console.log('before submit', payload)
      if (editing) {
        const response = await authFetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/material?id=${editId}`,
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
      fetchMaterials()
      setIsOpen(false)
      setEditingId(null)
    } catch (error) {
      toast.error(error.message || 'Failed to save material')
    }
  }

  const handleEdit = async (editdata) => {
    // console.log("coming from table", data)
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)
      console.log('editdata', editdata)
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/material/${editdata.id}`
      )
      const data = await response.json()
      const material = data.material
      console.log('indivi', material)
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/material?id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchMaterials()
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
            {category.name}
          </span>
        ) : (
          <span className='text-gray-400 text-sm'>-</span>
        )
      }
    },
    {
      header: 'Visibility',
      accessorKey: 'visibility'
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/material?q=${query}`
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
    handleSearch(value)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ image: '', file: '' })
    setSelectedColleges([])
    setSearchResults([])
    setShowAddCategory(false)
    setNewCategoryName('')
    setNewCategoryDescription('')
  }

  const handleAddClick = () => {
    setIsOpen(true)
    setEditing(false)
    setEditingId(null)
    reset()
    setUploadedFiles({ image: '', file: '' })
    setSelectedColleges([])
    setSearchResults([])
  }

  return (
    <>
      {/* Header Section */}
      <div className='sticky top-0 z-30 bg-[#F7F8FA] flex items-center justify-between p-4'>
        {/* Search Bar */}
        <div className='relative w-full max-w-md'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <Search className='w-4 h-4 text-gray-500' />
          </div>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Search materials...'
          />
        </div>
        {/* Button */}
        <div className='flex items-center gap-4'>
          <Button
            onClick={handleAddClick}
          >
            Add Material
          </Button>
        </div>
      </div>

      {/* Modal Dialog */}
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={editing ? 'Edit Material' : 'Add Material'}
        className='max-w-4xl max-h-[90vh] overflow-y-auto'
      >
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
                  <div className='flex items-center justify-between mb-2'>
                    <label className='block'>Category</label>
                    <button
                      type='button'
                      onClick={() => setShowAddCategory(!showAddCategory)}
                      className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                    >
                      {showAddCategory ? 'Cancel' : '+ Add New Category'}
                    </button>
                  </div>

                  {showAddCategory ? (
                    <div className='mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50'>
                      <div className='space-y-3'>
                        <div>
                          <label className='block mb-1 text-sm font-medium'>
                            Category Name{' '}
                            <span className='text-red-500'>*</span>
                          </label>
                          <input
                            type='text'
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className='w-full p-2 border rounded text-sm'
                            placeholder='Enter category name'
                            disabled={addingCategory}
                          />
                        </div>
                        <div>
                          <label className='block mb-1 text-sm font-medium'>
                            Description
                          </label>
                          <textarea
                            value={newCategoryDescription}
                            onChange={(e) =>
                              setNewCategoryDescription(e.target.value)
                            }
                            className='w-full p-2 border rounded text-sm'
                            placeholder='Enter category description'
                            rows={2}
                            disabled={addingCategory}
                          />
                        </div>
                        <button
                          type='button'
                          onClick={handleAddNewCategory}
                          disabled={addingCategory || !newCategoryName.trim()}
                          className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 text-sm font-medium'
                        >
                          {addingCategory ? 'Creating...' : 'Create Category'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      {...register('category_id')}
                      className='w-full p-2 border rounded'
                    >
                      <option value=''>No Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className='block mb-2'>Visibility</label>
                  <select
                    {...register('visibility')}
                    className='w-full p-2 border rounded'
                  >
                    {visibilityOptions.map((visibility) => (
                      <option key={visibility} value={visibility}>
                        {visibility.charAt(0).toUpperCase() +
                          visibility.slice(1)}
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
      </Modal>

      {/* Table */}
      <div className='p-4'>
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
    </>
  )
}
