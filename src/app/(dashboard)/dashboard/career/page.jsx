// eslint-disable-next-line react-hooks/rules-of-hooks

'use client'

/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import dynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import SearchInput from '@/ui/molecules/SearchInput'

// Dynamically import CKEditor to avoid SSR issues
const CKBlogs = dynamic(() => import('../component/CKBlogs'), {
  ssr: false
})

export default function CareerForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const [isOpen, setIsOpen] = useState(false)
  const [careers, setCareers] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    featured: ''
  })
  const [deleteId, setDeleteId] = useState(null)
  const [editId, setEditingId] = useState(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewCareerData, setViewCareerData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    getValues,
    watch
  } = useForm({
    defaultValues: {
      title: '',
      author_id: author_id,
      description: '',
      content: '',
      featuredImage: '',
      status: 'active'
    }
  })

  useEffect(() => {
    setHeading('Career Management')
    fetchCareers()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const { requireAdmin } = useAdminPermission()

  const fetchCareers = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/career?page=${page}`
      )
      const data = await response.json()
      setCareers(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      toast.error('Failed to fetch careers')
    } finally {
      setTableLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      fetchCareers()
      return
    }

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/career?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setCareers(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching careers:', response.statusText)
        setCareers([])
      }
    } catch (error) {
      console.error('Error fetching careers search results:', error.message)
      setCareers([])
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

  const onSubmit = async (data) => {
    try {
      data.featuredImage = uploadedFiles.featured

      const url = `${process.env.baseUrl}/career`
      const method = editing ? 'PUT' : 'POST'

      if (editing) {
        const response = await authFetch(
          `${process.env.baseUrl}/career?id=${editId}`,
          {
            method,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          }
        )
        const result = await response.json()
      } else {
        const response = await authFetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const result = await response.json()
      }

      toast.success(
        editing
          ? 'Career updated successfully!'
          : 'Career created successfully!'
      )
      setEditing(false)
      reset()
      setUploadedFiles({ featured: '' })
      fetchCareers()
      setIsOpen(false)
    } catch (error) {
      toast.error(error.message || 'Failed to save career')
    }
  }

  const handleEdit = async (slug) => {
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)
      const response = await authFetch(
        `${process.env.baseUrl}/career/${slug}`
      )
      const data = await response.json()
      const career = data.item
      setEditingId(career.id)

      // Set form fields
      setValue('title', career.title)
      setValue('description', career.description)
      setValue('content', career.content)
      setValue('status', career.status || 'active')

      // Set featured image
      setUploadedFiles({
        featured: career.featuredImage || ''
      })
    } catch (error) {
      toast.error('Failed to fetch career details')
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

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const response = await authFetch(
        `${process.env.baseUrl}/career/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (!response.ok) throw new Error('Failed to fetch career details')
      const data = await response.json()
      setViewCareerData(data.item ?? data)
    } catch (err) {
      toast.error(err.message ?? 'Failed to load career details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewCareerData(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}/career?id=${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      const res = await response.json()
      toast.success(res.message)
      await fetchCareers()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const columns = [
    {
      header: 'S.N',
      id: 'sn',
      cell: ({ row }) =>
        (pagination.currentPage - 1) * (pagination.limit ?? 10) + row.index + 1
    },
    {
      header: 'Title',
      accessorKey: 'title'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status = row.original.status || 'active'
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
              }`}
          >
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        )
      }
    },
    {
      header: 'Description',
      accessorKey: 'description'
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleView(row.original.slugs)}
            className='p-1 text-purple-600 hover:text-purple-800'
            title='View Details'
          >
            <Eye className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleEdit(row.original.slugs)}
            className='p-1 text-blue-600 hover:text-blue-800'
            title='Edit'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
            title='Delete'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search careers...'
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
                setUploadedFiles({ featured: '' })
              }}
            >
              Add Career
            </Button>
          </div>
        </div>
        <ToastContainer />

        <Dialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
            setEditing(false)
            setEditingId(null)
            reset()
            setUploadedFiles({ featured: '' })
          }}
          className='max-w-5xl'
        >
          <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
            <DialogHeader className='px-6 py-4 border-b'>
              <DialogTitle>{editing ? 'Edit Career' : 'Add Career'}</DialogTitle>
              <DialogClose
                onClick={() => {
                  setIsOpen(false)
                  setEditing(false)
                  setEditingId(null)
                  reset()
                  setUploadedFiles({ featured: '' })
                }}
              />
            </DialogHeader>
          <div className='flex-1 overflow-y-auto p-6'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                {/* Basic Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <div className='grid grid-cols-1 gap-4'>
                    <div>
                      <label className='block mb-2'>
                        Job Title <span className='text-red-500'>*</span>
                      </label>
                      <input
                        {...register('title', {
                          required: 'Job title is required',
                          minLength: {
                            value: 3,
                            message: 'Title must be at least 3 characters long'
                          }
                        })}
                        className='w-full p-2 border rounded'
                      />
                      {errors.title && (
                        <span className='text-red-500'>
                          {errors.title.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className='block mb-2'>Status</label>
                      <select
                        {...register('status')}
                        className='w-full p-2 border rounded bg-white'
                      >
                        <option value='active'>Active</option>
                        <option value='inactive'>Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className='block mb-2'>Description</label>
                      <textarea
                        {...register('description')}
                        className='w-full p-2 border rounded'
                        rows='3'
                      />
                    </div>

                    <div>
                      <label className='block mb-2'>Content</label>
                      <CKBlogs
                        initialData={getValues('content')}
                        onChange={(data) => setValue('content', data)}
                        id='editor1'
                      />
                    </div>

                    <div>
                      <FileUpload
                        label='Featured Image'
                        onUploadComplete={(url) => {
                          setUploadedFiles((prev) => ({
                            ...prev,
                            featured: url
                          }))
                          setValue('featuredImage', url)
                        }}
                        defaultPreview={uploadedFiles.featured}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
                <Button type='submit' disabled={loading}>
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update Career'
                      : 'Create Career'}
                </Button>
              </div>
            </form>
          </div>
          </DialogContent>
        </Dialog>

        {/* Table Section */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={careers}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchCareers(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this career? This action cannot be undone.'
      />

      {/* View Career Details Modal */}
      {/* View Career Details Modal */}
      <Dialog
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        className='max-w-3xl'
      >
        <DialogContent className='max-w-3xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Career Details</DialogTitle>
            <DialogClose onClick={handleCloseViewModal} />
          </DialogHeader>
        {loadingView ? (
          <div className='flex justify-center items-center h-48'>
            Loading...
          </div>
        ) : viewCareerData ? (
          <div className='space-y-4 max-h-[70vh] overflow-y-auto p-2'>
            {viewCareerData.featuredImage && (
              <div className='w-full h-64 rounded-lg overflow-hidden'>
                <img
                  src={viewCareerData.featuredImage}
                  alt={viewCareerData.title}
                  className='w-full h-full object-cover'
                />
              </div>
            )}

            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {viewCareerData.title}
              </h2>
              {viewCareerData.status && (
                <span
                  className={`inline-flex mt-2 px-2 py-1 text-xs font-semibold rounded-full ${viewCareerData.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {viewCareerData.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>

            {viewCareerData.description && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                <p className='text-gray-700 whitespace-pre-wrap'>
                  {viewCareerData.description}
                </p>
              </div>
            )}

            {viewCareerData.content && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Content</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{ __html: viewCareerData.content }}
                />
              </div>
            )}
          </div>
        ) : (
          <p className='text-center text-gray-500'>No career data available.</p>
        )}
        </DialogContent>
      </Dialog>
    </>
  )
}
