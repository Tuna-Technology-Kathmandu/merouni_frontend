'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { fetchDisciplines } from './action'
import Loader from '../../../../ui/molecules/Loading'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { Button } from '@/ui/shadcn/button'
import { ToastContainer } from 'react-toastify'
import { Modal } from '@/ui/molecules/Modal'

import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { DotenvConfig } from '@/config/env.config'
import FileUpload from '../addCollege/FileUpload'
import { Label } from '@/ui/shadcn/label'
import { Input } from '@/ui/shadcn/input'
import { formatDate } from '@/utils/date.util'
import { Select } from '@/ui/shadcn/select'

export default function DisciplineManager() {
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
            featured_image: '',
            status: 'draft',
            author: author_id
        }
    })

    const [disciplines, setDisciplines] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [editing, setEditing] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // View Modal State
    const [viewingDiscipline, setViewingDiscipline] = useState(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState({
        featured_image: ''
    })

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title'
            },
            {
                header: 'Description',
                accessorKey: 'description',
                cell: ({ getValue }) => <span className="line-clamp-2">{getValue()}</span>
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ getValue }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getValue() === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {getValue() ? getValue().charAt(0).toUpperCase() + getValue().slice(1) : 'Draft'}
                    </span>
                )
            },
            {
                header: 'Image',
                accessorKey: 'featured_image',
                cell: ({ getValue }) => (
                    getValue() ? (
                        <img
                            src={getValue()}
                            alt='Discipline'
                            className='w-10 h-10 object-cover rounded-md'
                        />
                    ) : 'N/A'
                )
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: ({ getValue }) => formatDate(getValue())
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className='flex gap-2'>
                        <button
                            onClick={() => handleView(row.original)}
                            className='p-1 text-gray-600 hover:text-gray-900'
                            title="View Details"
                        >
                            <Eye className='w-4 h-4' />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className='p-1 text-blue-600 hover:text-blue-800'
                            title="Edit"
                        >
                            <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(row.original.id)}
                            className='p-1 text-red-600 hover:text-red-800'
                            title="Delete"
                        >
                            <Trash2 className='w-4 h-4' />
                        </button>
                    </div>
                )
            }
        ],
        []
    )
    const handleView = (discipline) => {
        setViewingDiscipline(discipline)
        setIsViewModalOpen(true)
    }

    const handleEdit = (discipline) => {
        setEditingId(discipline.id)
        setEditing(true)
        setIsOpen(true)
        setValue('title', discipline.title)
        setValue('description', discipline.description || '')
        setValue('featured_image', discipline.featured_image || '')
        setValue('status', discipline.status || 'draft')
        setUploadedFiles({ featured_image: discipline.featured_image || '' })
    }

    useEffect(() => {
        setHeading('Discipline Management')
        loadDisciplines()
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

    const loadDisciplines = async (page = 1) => {
        try {
            const response = await fetchDisciplines(page)
            setDisciplines(response.items)
            setPagination({
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                total: response.pagination.totalCount
            })
        } catch (err) {
            toast.error('Failed to load disciplines')
            console.error('Error loading disciplines:', err)
        } finally {
            setLoading(false)
        }
    }

    const createDiscipline = async (data) => {
        try {
            const response = await authFetch(
                `${DotenvConfig.NEXT_APP_API_BASE_URL}/discipline`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
            if (!response.ok) {
                throw new Error('Failed to create discipline')
            }
            return await response.json()
        } catch (error) {
            console.error('Error creating discipline:', error)
            throw error
        }
    }

    const updateDiscipline = async (data, id) => {
        try {
            const response = await authFetch(
                `${DotenvConfig.NEXT_APP_API_BASE_URL}/discipline?discipline_id=${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
            if (!response.ok) {
                throw new Error('Failed to update discipline')
            }
            return await response.json()
        } catch (error) {
            console.error('Error updating discipline:', error)
            throw error
        }
    }

    // Use react-hook-form's handleSubmit to process the form data.
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            featured_image: uploadedFiles.featured_image
        }
        try {
            if (editingId) {
                // Update discipline if in edit mode
                await updateDiscipline(formattedData, editingId)
                toast.success('Discipline updated successfully')
            } else {
                // Otherwise, create a new discipline
                await createDiscipline(formattedData)
                toast.success('Discipline created successfully')
            }
            reset() // Clear form
            setEditingId(null)
            setEditing(false)
            setIsOpen(false)
            setUploadedFiles({ featured_image: '' })
            loadDisciplines()
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Network error occurred'
            toast.error(
                `Failed to ${editingId ? 'update' : 'create'} discipline: ${errorMsg}`
            )
            console.error('Error saving discipline:', err)
        }
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id)
        setIsDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        try {
            const response = await authFetch(
                `${DotenvConfig.NEXT_APP_API_BASE_URL}/discipline/${deleteId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const res = await response.json()
            toast.success(res.message)
            loadDisciplines()
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
            loadDisciplines()
            return
        }

        try {
            const response = await authFetch(
                `${DotenvConfig.NEXT_APP_API_BASE_URL}/discipline?q=${query}`
            )
            if (response.ok) {
                const data = await response.json()
                setDisciplines(data.items)

                if (data.pagination) {
                    setPagination({
                        currentPage: data.pagination.currentPage,
                        totalPages: data.pagination.totalPages,
                        total: data.pagination.totalCount
                    })
                }
            } else {
                console.error('Error fetching results:', response.statusText)
                setDisciplines([])
            }
        } catch (error) {
            console.error('Error fetching discipline search results:', error.message)
            setDisciplines([])
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

    return (
        <>
            <div className='p-4 w-full'>
                {/* ... Header and Search ... */}
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
                            placeholder='Search disciplines...'
                        />
                    </div>
                    {/* Button */}
                    <div className='flex gap-2'>
                        <Button
                            onClick={() => {
                                setIsOpen(true)
                                setEditing(false)
                                setEditingId(null)
                                setEditingId(null)
                                reset()
                                setUploadedFiles({ featured_image: '' })
                            }}
                        >
                            Add Discipline
                        </Button>
                    </div>
                </div>
                {/* Add/Edit Modal */}
                <Modal
                    isOpen={isOpen}
                    onClose={() => {
                        setIsOpen(false)
                        setEditing(false)
                        setEditingId(null)
                        reset()
                        setUploadedFiles({ featured_image: '' })
                    }}
                    title={editing ? 'Edit Discipline' : 'Add Discipline'}
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
                                        Discipline Information
                                    </h2>
                                    <div className='space-y-4'>
                                        <div>
                                            <Label>
                                                Discipline Title <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                type='text'
                                                placeholder='Discipline Title'
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
                                            <Label>Status</Label>
                                            <Select
                                                {...register('status')}
                                                className='w-full p-2 border rounded'
                                            >
                                                <option value="inactive">Inactive</option>
                                                <option value="active">Active</option>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <textarea
                                                placeholder='Description'
                                                {...register('description')}
                                                className='w-full p-2 border rounded'
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <Label>Image</Label>
                                            <FileUpload
                                                defaultPreview={uploadedFiles.featured_image}
                                                onUploadComplete={(url) => {
                                                    setUploadedFiles((prev) => ({
                                                        ...prev,
                                                        featured_image: url
                                                    }))
                                                    setValue('featured_image', url)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button - Sticky Footer */}
                            <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => {
                                        setIsOpen(false)
                                        setEditing(false)
                                        setEditingId(null)
                                        reset()
                                        setUploadedFiles({ featured_image: '' })
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type='submit'>
                                    {editing ? 'Update Discipline' : 'Create Discipline'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Table */}
                <div className='mt-8'>
                    <Table
                        data={disciplines}
                        columns={columns}
                        pagination={pagination}
                        onPageChange={(newPage) => loadDisciplines(newPage)}
                        onSearch={handleSearch}
                        showSearch={false}
                    />
                </div>
            </div>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false)
                    setViewingDiscipline(null)
                }}
                title="Discipline Details"
                className="max-w-2xl"
            >
                <div className="p-6 space-y-6">
                    {/* Image */}
                    {viewingDiscipline?.featured_image && (
                        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-6 border border-gray-200">
                            <img
                                src={viewingDiscipline.featured_image}
                                alt={viewingDiscipline.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Title</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{viewingDiscipline?.title}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <span
                                className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${viewingDiscipline?.status === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {viewingDiscipline?.status ? viewingDiscipline.status.charAt(0).toUpperCase() + viewingDiscipline.status.slice(1) : 'Draft'}
                            </span>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Description</h3>
                            <div className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {viewingDiscipline?.description || "No description provided."}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                            <p className="mt-1 text-gray-900">{viewingDiscipline?.createdAt ? formatDate(viewingDiscipline.createdAt) : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t mt-6">
                        <Button onClick={() => setIsViewModalOpen(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmationDialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                onConfirm={handleDeleteConfirm}
                title='Confirm Deletion'
                message='Are you sure you want to delete this discipline? This action cannot be undone.'
            />
        </>
    )
}
