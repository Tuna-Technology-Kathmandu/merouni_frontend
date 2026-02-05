'use client'

import { Modal } from '@/ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'
import { Edit2, Eye, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Table from '../../../../ui/molecules/Table'
import { fetchDisciplines } from './action'

import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import CreateUpdateDiscipline from '@/ui/molecules/modals/CreateUpdateDiscipline'
import { formatDate } from '@/utils/date.util'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'

export default function DisciplineManager() {
    const { setHeading } = usePageHeading()
    const author_id = useSelector((state) => state.user.data.id)

    const [disciplines, setDisciplines] = useState([])
    const [loading, setLoading] = useState(true)

    // Edit/Create Modal State
    const [editingDiscipline, setEditingDiscipline] = useState(null)
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
        setEditingDiscipline(discipline)
        setIsOpen(true)
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

    const handleDeleteClick = (id) => {
        setDeleteId(id)
        setIsDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/discipline/${deleteId}`,
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
                `${process.env.baseUrl}/discipline?q=${query}`
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
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder='Search discipline...'
                        className='max-w-md'
                    />

                    {/* Button */}
                    <div className='flex gap-2'>
                        <Button
                            onClick={() => {
                                setEditingDiscipline(null)
                                setIsOpen(true)
                            }}
                        >
                            Add Discipline
                        </Button>
                    </div>
                </div>

                <CreateUpdateDiscipline
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSuccess={() => {
                        loadDisciplines()
                    }}
                    initialData={editingDiscipline}
                    authorId={author_id}
                />

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
