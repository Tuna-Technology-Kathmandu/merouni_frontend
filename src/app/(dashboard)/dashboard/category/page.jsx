'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { fetchCategories, deleteCategory } from './action'
import Loader from '../../../../ui/molecules/Loading'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { Modal } from '../../../../ui/molecules/Modal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'

export default function CategoryManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      author: author_id
    }
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title'
      },
      {
        header: 'Description',
        accessorKey: 'description'
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
    ],
    []
  )

  useEffect(() => {
    setHeading('Category Management')
    loadCategories()
    return () => setHeading(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const loadCategories = async (page = 1) => {
    try {
      const response = await fetchCategories(page)
      setCategories(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (err) {
      toast.error('Failed to load categories')
      console.error('Error loading categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (data) => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/category`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to create category')
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  const updateCategory = async (data, id) => {
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/category?category_id=${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update category')
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  // Use react-hook-form's handleSubmit to process the form data.
  const onSubmit = async (data) => {
    try {
      if (editingId) {
        // Update category if in edit mode
        await updateCategory(data, editingId)
        toast.success('Category updated successfully')
      } else {
        // Otherwise, create a new category
        await createCategory(data)
        toast.success('Category created successfully')
      }
      reset() // Clear form
      setEditingId(null)
      setEditing(false)
      setIsOpen(false)
      loadCategories()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Network error occurred'
      toast.error(
        `Failed to ${editingId ? 'update' : 'create'} category: ${errorMsg}`
      )
      console.error('Error saving category:', err)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category.id)
    setEditing(true)
    setIsOpen(true)
    setValue('title', category.title)
    setValue('description', category.description || '')
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {

      const response = await authFetch(
        `${process.env.baseUrl}/category?category_id=${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      toast.success(res.message)
      loadCategories()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadCategories()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/category?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setCategories(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching results:', response.statusText)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching category search results:', error.message)
      setCategories([])
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

  if (loading)
    return (
      <div className='mx-auto'>
        <Loader />
      </div>
    )

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
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
              placeholder='Search categories...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setEditingId(null)
                reset()
              }}
            >
              Add Category
            </Button>
          </div>
        </div>
        <ToastContainer />

        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            setEditing(false)
            setEditingId(null)
            reset()
          }}
          title={editing ? 'Edit Category' : 'Add Category'}
          className='max-w-2xl'
        >
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Category Information
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <label className='block mb-2'>
                        Category Title <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        placeholder='Category Title'
                        {...register('title', {
                          required: 'Title is required'
                        })}
                        className='w-full p-2 border rounded'
                      />
                      {errors.title && (
                        <span className='text-red-500 text-sm'>
                          {errors.title.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className='block mb-2'>Description</label>
                      <textarea
                        placeholder='Description'
                        {...register('description')}
                        className='w-full p-2 border rounded'
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
                <Button type='submit'>
                  {editing ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Table */}
        <div className='mt-8'>
          <Table
            data={categories}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadCategories(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this category? This action cannot be undone.'
      />
    </>
  )
}
