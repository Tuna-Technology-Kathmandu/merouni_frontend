'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
import { Search, Eye } from 'lucide-react'
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
      console.error('Error loading vacancies:', err)
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

  // Open add vacancy dialog when navigating from dashboard quick action (?add=true)
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setIsOpen(true)
      setEditing(false)
      setEditingId(null)
      reset()
      setUploadedFiles({ featuredImage: '' })
      router.replace(pathname, { scroll: false })
    }
  }, [searchParams])

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
        ? `${process.env.baseUrl}/vacancy?id=${editingId}`
        : `${process.env.baseUrl}/vacancy`

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
        `${process.env.baseUrl}/vacancy/${slugs}`
      )
      const data = await response.json()
      const vacancy = data.item

      setEditingId(vacancy.id)
      setValue('title', vacancy.title)
      setValue('description', vacancy.description || '')
      setValue('content', vacancy.content || '')
      setValue('featuredImage', vacancy.featuredImage || '')
      setValue(
        'associated_organization_name',
        vacancy.associated_organization_name || ''
      )
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
        `${process.env.baseUrl}/vacancy?id=${deleteId}`,
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
        `${process.env.baseUrl}/vacancy/${slug}`,
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
      loadVacancies(pagination.currentPage)
      return
    }
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/vacancy?q=${query}`
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
      header: 'Associated Organization / Institution',
      accessorKey: 'associated_organization_name',
      cell: ({ row }) => row.original.associated_organization_name || 'N/A'
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
      <div className='w-full space-y-2'>
        <div className='px-4 space-y-4'>
          <div className='flex justify-between items-center pt-4'>
            {/* Search Bar */}
            <SearchInput
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder='Search vacancies...'
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
                  setUploadedFiles({ featuredImage: '' })
                }}
              >
                Add Vacancy
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
              setUploadedFiles({ featuredImage: '' })
            }}
            className='max-w-5xl'
          >
            <DialogHeader>
              <div className='flex items-center justify-between'>
                <DialogTitle>{editing ? 'Edit Vacancy' : 'Add Vacancy'}</DialogTitle>
                <DialogClose
                  onClick={() => {
                    setIsOpen(false)
                    setEditing(false)
                    setEditingId(null)
                    reset()
                    setUploadedFiles({ featuredImage: '' })
                  }}
                />
              </div>
            </DialogHeader>
            <DialogContent>
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
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label
                            htmlFor='title'
                            className="after:content-['*'] after:ml-0.5 after:text-red-500"
                          >
                            Vacancy Title
                          </Label>
                          <Input
                            id='title'
                            placeholder='Enter vacancy title'
                            {...register('title', {
                              required: 'Title is required'
                            })}
                            className={errors.title ? 'border-destructive' : ''}
                          />
                          {errors.title && (
                            <span className='text-sm font-medium text-destructive'>
                              {errors.title.message}
                            </span>
                          )}
                        </div>

                        <div className='space-y-2'>
                          <Label htmlFor='associated_organization_name'>
                            Associated Organization / Institution Name
                          </Label>
                          <Input
                            id='associated_organization_name'
                            placeholder='Enter organization or institution name'
                            {...register('associated_organization_name')}
                          />
                        </div>
                      </div>

                      <div className='space-y-2 mt-4'>
                        <Label htmlFor='description'>Short Description</Label>
                        <Textarea
                          id='description'
                          placeholder='Enter short description'
                          {...register('description')}
                          className='min-h-[100px]'
                        />
                      </div>

                      <div className='space-y-2 mt-4'>
                        <Label htmlFor='content'>Content</Label>
                        <Controller
                          name='content'
                          control={control}
                          render={({ field }) => (
                            <TipTapEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder='Enter detailed content'
                            />
                          )}
                        />
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
                    <Button type='submit' disabled={loading}>
                      {loading
                        ? 'Processing...'
                        : editing
                          ? 'Update Vacancy'
                          : 'Create Vacancy'}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>

          {/* Table Section */}
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
      <Dialog
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
        className='max-w-3xl'
      >
        <DialogHeader>
          <div className='flex items-center justify-between'>
            <DialogTitle>Vacancy Details</DialogTitle>
            <DialogClose onClick={handleCloseViewModal} />
          </div>
        </DialogHeader>
        <DialogContent>
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
                {viewVacancyData.associated_organization_name && (
                  <p className='text-sm text-gray-500 mt-1'>
                    {viewVacancyData.associated_organization_name}
                  </p>
                )}
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
        </DialogContent>
      </Dialog>
    </>
  )
}

export default VacancyManager
