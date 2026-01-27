'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Table from '../../../../components/Table'
import FileUpload from '../addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { Modal } from '../../../../components/CreateUserModal'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Search, Eye } from 'lucide-react'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'

const VacancyManager = () => {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const { requireAdmin } = useAdminPermission()

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
      content: '',
      featuredImage: '',
      author_id
    }
  })

  const [vacancies, setVacancies] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState({
    featuredImage: ''
  })
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewVacancyData, setViewVacancyData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  const loadVacancies = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/vacancy?page=${page}`
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
      toast.error('Failed to load vacancies')
      console.error('Error loading vacancies:', err)
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    setHeading('Vacancy Management')
    loadVacancies()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = {
        ...data,
        author_id,
        featuredImage: uploadedFiles.featuredImage || data.featuredImage
      }

      const method = editing ? 'PUT' : 'POST'
      const url = editing
        ? `${DotenvConfig.NEXT_APP_API_BASE_URL}/vacancy?id=${editingId}`
        : `${DotenvConfig.NEXT_APP_API_BASE_URL}/vacancy`

      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save vacancy')
      }

      toast.success(
        editing
          ? 'Vacancy updated successfully'
          : 'Vacancy created successfully'
      )

      reset()
      setEditing(false)
      setEditingId(null)
      setUploadedFiles({ featuredImage: '' })
      setIsOpen(false)
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

      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/vacancy/${slugs}`
      )
      const data = await response.json()
      const vacancy = data.item

      setEditingId(vacancy.id)
      setValue('title', vacancy.title)
      setValue('description', vacancy.description || '')
      setValue('content', vacancy.content || '')
      setValue('featuredImage', vacancy.featuredImage || '')
      setUploadedFiles({
        featuredImage: vacancy.featuredImage || ''
      })
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
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/vacancy?id=${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const res = await response.json()
      if (!response.ok) {
        throw new Error(res.message || 'Failed to delete vacancy')
      }
      toast.success(res.message || 'Vacancy deleted')
      loadVacancies(pagination.currentPage)
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

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/vacancy/${slug}`,
        { headers: { 'Content-Type': 'application/json' } }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch vacancy details')
      }
      const data = await response.json()
      setViewVacancyData(data.item)
    } catch (err) {
      toast.error(err.message || 'Failed to load vacancy details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleCloseViewModal = () => {
    setViewModalOpen(false)
    setViewVacancyData(null)
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadVacancies()
      return
    }
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/vacancy?q=${query}`
      )
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
      console.error('Error fetching vacancy search results:', error.message)
      setVacancies([])
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
      accessorKey: 'description',
      cell: ({ getValue }) => {
        const text = getValue()
        return text?.length > 80 ? `${text.substring(0, 80)}...` : text || 'N/A'
      }
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
          >
            <span className='sr-only'>Edit</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z' />
              <path d='M11.379 5.793L4 13.172V16h2.828l7.379-7.379-2.828-2.828z' />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
          >
            <span className='sr-only'>Delete</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM8 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
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
          <div className='relative w-full max-w-md'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-4 h-4 text-gray-500' />
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search vacancies...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <button
              className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
              onClick={() => {
                setIsOpen(true)
                setEditing(false)
                setEditingId(null)
                reset()
                setUploadedFiles({ featuredImage: '' })
              }}
            >
              Add Vacancy
            </button>
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
            setUploadedFiles({ featuredImage: '' })
          }}
          title={editing ? 'Edit Vacancy' : 'Add Vacancy'}
          className='max-w-5xl'
        >
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                {/* Basic Information */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>
                    Vacancy Information
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <label className='block mb-2'>Vacancy Title *</label>
                      <input
                        type='text'
                        placeholder='Vacancy Title'
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
                      <label className='block mb-2'>Short Description</label>
                      <textarea
                        placeholder='Short description'
                        {...register('description')}
                        className='w-full p-2 border rounded'
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className='block mb-2'>Content</label>
                      <textarea
                        placeholder='Detailed content'
                        {...register('content')}
                        className='w-full p-2 border rounded'
                        rows={6}
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h2 className='text-xl font-semibold mb-4'>Media</h2>
                  <FileUpload
                    label='Featured Image'
                    onUploadComplete={(url) => {
                      setUploadedFiles((prev) => ({
                        ...prev,
                        featuredImage: url
                      }))
                      setValue('featuredImage', url)
                    }}
                    defaultPreview={uploadedFiles.featuredImage}
                  />
                </div>
              </div>

              {/* Submit Button - Sticky Footer */}
              <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
                <button
                  type='submit'
                  disabled={loading}
                  className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
                >
                  {loading
                    ? 'Processing...'
                    : editing
                      ? 'Update Vacancy'
                      : 'Create Vacancy'}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Table Section */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={vacancies}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadVacancies(newPage)}
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
        message='Are you sure you want to delete this vacancy? This action cannot be undone.'
      />

      {/* View Vacancy Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        title='Vacancy Details'
        className='max-w-3xl'
      >
        {loadingView ? (
          <div className='flex justify-center items-center h-48'>
            Loading...
          </div>
        ) : viewVacancyData ? (
          <div className='space-y-4 max-h-[70vh] overflow-y-auto p-2'>
            {viewVacancyData.featuredImage && (
              <div className='w-full h-64 rounded-lg overflow-hidden'>
                <img
                  src={viewVacancyData.featuredImage}
                  alt={viewVacancyData.title}
                  className='w-full h-full object-cover'
                />
              </div>
            )}

            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {viewVacancyData.title}
              </h2>
            </div>

            {viewVacancyData.description && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewVacancyData.description
                  }}
                />
              </div>
            )}

            {viewVacancyData.content && (
              <div>
                <h3 className='text-lg font-semibold mb-2'>Content</h3>
                <div
                  className='text-gray-700 prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: viewVacancyData.content
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <p className='text-center text-gray-500'>
            No vacancy data available.
          </p>
        )}
      </Modal>
    </>
  )
}

export default VacancyManager
