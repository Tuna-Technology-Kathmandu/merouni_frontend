'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Loader from '../../../../ui/molecules/Loading'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import SearchInput from '@/ui/molecules/SearchInput'

export default function TagForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const [isOpen, setIsOpen] = useState(false)
  const [tags, setTags] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editId, setEditingId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
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
      author: author_id
    }
  })

  const { requireAdmin } = useAdminPermission()

  useEffect(() => {
    setHeading('Tag Management')
    fetchTags()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const fetchTags = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/tag?page=${page}&limit=50`
      )
      const data = await response.json()
      setTags(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      toast.error('Failed to fetch tags')
    } finally {
      setTableLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const url = `${process.env.baseUrl}/tag`
      const method = editing ? 'PUT' : 'POST'

      if (editing) {
        const response = await authFetch(
          `${process.env.baseUrl}/tag?tag_id=${editId}`,
          {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }
        )
        await response.json()
      } else {
        const response = await authFetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        await response.json()
      }

      toast.success(
        editing ? 'Tag updated successfully!' : 'Tag created successfully!'
      )
      setEditing(false)
      reset()
      fetchTags()
      setIsOpen(false)
      setEditingId(null)
      setSubmitting(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save tag')
      setSubmitting(false)
    }
  }

  const handleEdit = (tag) => {
    setEditing(true)
    setIsOpen(true)
    setEditingId(tag.id)
    setValue('title', tag.title)
    setValue('author', tag.author)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    reset()
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
        `${process.env.baseUrl}/tag?tag_id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchTags()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }



  const handleSearch = async (query) => {
    if (!query) {
      fetchTags()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/tag?q=${query}&limit=50`
      )
      if (response.ok) {
        const data = await response.json()
        setTags(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching levels:', response.statusText)
        setTags([])
      }
    } catch (error) {
      console.error('Error fetching levels search results:', error.message)
      setTags([])
    }
  }
  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search tags...'
            className='max-w-md'
          />
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
              Add Tag
            </Button>
          </div>
        </div>
        <ToastContainer />

        {/* Badge Layout */}
        <div className='mt-8'>
          {tableLoading ? (
            <div className='flex justify-center p-12'>
              <Loader />
            </div>
          ) : (
            <div className='space-y-8'>
              <div className='flex flex-wrap gap-3'>
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className='group flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md'
                  >
                    <span className='text-sm font-semibold text-gray-700 group-hover:text-blue-700'>
                      {tag.title}
                    </span>
                    <div className='flex items-center gap-1 ml-2 pl-2 border-l border-gray-100 group-hover:border-blue-200 transition-colors'>
                      <button
                        onClick={() => handleEdit(tag)}
                        className='p-1.5 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors'
                        title='Edit Tag'
                      >
                        <Edit2 className='w-3.5 h-3.5' />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tag.id)}
                        className='p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors'
                        title='Delete Tag'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>
                ))}

                {tags.length === 0 && (
                  <div className='w-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200'>
                    <div className='bg-white p-4 rounded-full shadow-sm mb-4'>
                      <Search className='w-8 h-8 text-gray-300' />
                    </div>
                    <p className='text-gray-500 font-medium'>No tags discovered yet</p>
                    <p className='text-gray-400 text-sm'>Try a different search or add a new tag</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className='flex items-center justify-between border-t border-gray-100 pt-6'>
                  <p className='text-sm text-gray-500'>
                    Showing <span className='font-semibold text-gray-900'>{tags.length}</span> tags of{' '}
                    <span className='font-semibold text-gray-900'>{pagination.total}</span> total
                  </p>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => fetchTags(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
                    >
                      Previous
                    </button>
                    <div className='flex items-center px-4 bg-gray-50 rounded-lg border border-gray-200'>
                      <span className='text-sm font-semibold text-blue-600'>
                        {pagination.currentPage}
                      </span>
                      <span className='text-sm text-gray-400 mx-1'>/</span>
                      <span className='text-sm text-gray-500'>
                        {pagination.totalPages}
                      </span>
                    </div>
                    <button
                      onClick={() => fetchTags(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleModalClose}
        className='max-w-md'
      >
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
          <DialogClose onClick={handleModalClose} />
        </DialogHeader>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
            <div>
              <Label
              required
               htmlFor='title'>Title</Label>
              <Input
                id='title'
                {...register('title', { required: 'Title is required' })}
                className='mt-1'
              />
              {errors.title && (
                <p className='mt-1 text-sm text-red-500'>
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={submitting}>
                {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Tag'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this tag? This action cannot be undone.'
      />
    </>
  )
}
