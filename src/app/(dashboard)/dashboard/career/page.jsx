'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import FileUpload from '../addCollege/FileUpload'
import Table from '@/app/components/Table'
import { Edit2, Trash2 } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default function CareerForm() {
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
    formState: { errors },
    getValues
  } = useForm({
    defaultValues: {
      title: '',
      author_id: author_id,
      description: '',
      content: '',
      featuredImage: ''
    }
  })

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/career?page=${page}`
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
        `${process.env.baseUrl}${process.env.version}/career?q=${query}`
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
  const onSubmit = async (data) => {
    try {
      data.featuredImage = uploadedFiles.featured

      const url = `${process.env.baseUrl}${process.env.version}/career`
      const method = editing ? 'PUT' : 'POST'

      if (editing) {
        const response = await authFetch(
          `${process.env.baseUrl}${process.env.version}/career?id=${editId}`,
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
        `${process.env.baseUrl}${process.env.version}/career/${slug}`
      )
      const data = await response.json()
      const career = data.item
      setEditingId(career.id)

      // Set form fields
      //   setValue("id", career.id);//because backend have put method and id shouldbe passed in query so not here
      setValue('title', career.title)
      setValue('description', career.description)
      setValue('content', career.content)

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
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${process.env.baseUrl}${process.env.version}/career?id=${deleteId}`,
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
      header: 'ID',
      accessorKey: 'id'
    },
    {
      header: 'Title',
      accessorKey: 'title'
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
            onClick={() => handleEdit(row.original.slugs)}
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

  return (
    <>
      <div className='text-2xl mr-auto p-4 ml-14 font-bold'>
        <div className='text-center'>Career Management</div>
        <div className='flex justify-left mt-2'>
          <button
            className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Hide form' : 'Show form'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className='container mx-auto p-4'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Career Information</h2>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label className='block mb-2'>Job Title *</label>
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
                    <span className='text-red-500'>{errors.title.message}</span>
                  )}
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
                  <CKEditor
                    editor={ClassicEditor}
                    data={getValues('content')}
                    config={{
                      licenseKey: process.env.ckeditor
                    }}
                    onChange={(event, editor) => {
                      const content = editor.getData()
                      setValue('content', content)
                    }}
                  />
                </div>

                <div>
                  <FileUpload
                    label='Featured Image'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({ ...prev, featured: url }))
                      setValue('featuredImage', url)
                    }}
                    defaultPreview={uploadedFiles.featured}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='flex justify-end'>
              <button
                type='submit'
                disabled={loading}
                className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
              >
                {loading
                  ? 'Processing...'
                  : editing
                    ? 'Update Career'
                    : 'Create Career'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className='mt-8'>
        <Table
          loading={tableLoading}
          data={careers}
          columns={columns}
          pagination={pagination}
          onPageChange={(newPage) => fetchCareers(newPage)}
          onSearch={handleSearch}
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this career? This action cannot be undone.'
      />
    </>
  )
}
