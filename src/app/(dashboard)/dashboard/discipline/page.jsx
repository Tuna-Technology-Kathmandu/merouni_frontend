'use client'

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Edit2, Eye, Trash2, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Table from '@/ui/shadcn/DataTable'
import { fetchDisciplines } from './action'
import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import CreateUpdateDiscipline from '@/ui/molecules/dialogs/CreateUpdateDiscipline'
import { formatDate } from '@/utils/date.util'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'

export default function DisciplineManager() {
    const { setHeading } = usePageHeading()
    const author_id = useSelector((state) => state.user.data?.id)

    const [disciplines, setDisciplines] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const [editingDiscipline, setEditingDiscipline] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const [deleteId, setDeleteId] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [viewingDiscipline, setViewingDiscipline] = useState(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
    const [searchQuery, setSearchQuery] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(null)

    useEffect(() => {
        setHeading('Discipline Management')
        loadDisciplines()
        return () => setHeading(null)
    }, [setHeading])

    useEffect(() => {
        return () => { if (searchTimeout) clearTimeout(searchTimeout) }
    }, [searchTimeout])

    const loadDisciplines = async (page = 1) => {
        try {
            setTableLoading(true)
            const response = await fetchDisciplines(page)
            setDisciplines(response.items)
            setPagination({
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                total: response.pagination.totalCount
            })
        } catch (err) {
            toast.error('Failed to load disciplines')
        } finally {
            setTableLoading(false)
        }
    }

    const handleView = (discipline) => { setViewingDiscipline(discipline); setIsViewModalOpen(true) }
    const handleEdit = (discipline) => { setEditingDiscipline(discipline); setIsOpen(true) }
    const handleDeleteClick = (id) => { setDeleteId(id); setIsDialogOpen(true) }

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        try {
            const res = await authFetch(`${process.env.baseUrl}/discipline/${deleteId}`, {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json()
            toast.success(data.message || 'Discipline deleted')
            loadDisciplines(pagination.currentPage)
        } catch (err) {
            toast.error(err.message || 'Failed to delete')
        } finally {
            setIsDialogOpen(false)
            setDeleteId(null)
        }
    }

    const handleSearch = async (query) => {
        if (!query) { loadDisciplines(); return }
        try {
            const res = await authFetch(`${process.env.baseUrl}/discipline?q=${query}`)
            if (res.ok) {
                const data = await res.json()
                setDisciplines(data.items)
                if (data.pagination) setPagination({ currentPage: data.pagination.currentPage, totalPages: data.pagination.totalPages, total: data.pagination.totalCount })
            } else setDisciplines([])
        } catch { setDisciplines([]) }
    }

    const handleSearchInput = (value) => {
        setSearchQuery(value)
        if (searchTimeout) clearTimeout(searchTimeout)
        if (value === '') handleSearch('')
        else setSearchTimeout(setTimeout(() => handleSearch(value), 300))
    }

    const columns = useMemo(() => [
        {
            header: 'Title',
            accessorKey: 'title',
            cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.title}</span>
        },
        {
            header: 'Image',
            accessorKey: 'featured_image',
            cell: ({ getValue }) => getValue()
                ? <img src={getValue()} alt='Discipline' className='w-10 h-10 object-cover rounded-md border' />
                : <span className="text-gray-400 italic text-xs">—</span>
        },
        {
            header: 'Description',
            accessorKey: 'description',
            cell: ({ getValue }) => {
                const v = getValue()
                if (!v) return <span className="text-gray-400 italic text-xs">—</span>
                return <span className="text-gray-600 text-sm line-clamp-2">{v}</span>
            }
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            cell: ({ getValue }) => <span className="text-gray-500 text-sm">{formatDate(getValue())}</span>
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className='flex gap-1'>
                    <Button variant="ghost" size="icon" onClick={() => handleView(row.original)} className='hover:bg-blue-50 text-blue-600' title="View">
                        <Eye className='w-4 h-4' />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} className='hover:bg-amber-50 text-amber-600' title="Edit">
                        <Edit2 className='w-4 h-4' />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row.original.id)} className='hover:bg-red-50 text-red-600' title="Delete">
                        <Trash2 className='w-4 h-4' />
                    </Button>
                </div>
            )
        }
    ], [])

    return (
        <div className='w-full space-y-4 p-4'>
            <ToastContainer />

            {/* Header */}
            <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
                    <SearchInput value={searchQuery} onChange={(e) => handleSearchInput(e.target.value)} placeholder='Search disciplines...' className='max-w-md w-full' />
                    <Button onClick={() => { setEditingDiscipline(null); setIsOpen(true) }} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
                        <Plus className="w-4 h-4" /> Add Discipline
                    </Button>
                </div>
            </div>

            {/* Create/Edit uses the existing modal component */}
            <CreateUpdateDiscipline
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={() => loadDisciplines(pagination.currentPage)}
                initialData={editingDiscipline}
                authorId={author_id}
            />

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table data={disciplines} columns={columns} pagination={pagination} onPageChange={(p) => loadDisciplines(p)} showSearch={false} loading={tableLoading} />
            </div>

            {/* View Modal */}
            <Dialog isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setViewingDiscipline(null) }} className="max-w-lg">
                <DialogContent className='max-w-lg max-h-[90vh] flex flex-col p-0'>
                    <DialogHeader className='px-6 py-4 border-b'>
                        <DialogTitle className="text-lg font-semibold text-gray-900">Discipline Details</DialogTitle>
                        <DialogClose onClick={() => { setIsViewModalOpen(false); setViewingDiscipline(null) }} />
                    </DialogHeader>
                    <div className='flex-1 overflow-y-auto p-6 space-y-4'>
                        {viewingDiscipline?.featured_image && (
                            <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={viewingDiscipline.featured_image} alt={viewingDiscipline.title} className="w-full h-full object-contain" />
                            </div>
                        )}
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Title</p>
                            <p className="text-lg font-bold text-gray-900">{viewingDiscipline?.title}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{viewingDiscipline?.description || 'No description provided.'}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Created At</p>
                            <p className="text-sm text-gray-600">{viewingDiscipline?.createdAt ? formatDate(viewingDiscipline.createdAt) : '—'}</p>
                        </div>
                    </div>
                    <div className='px-6 py-4 border-t flex justify-end'>
                        <Button variant='outline' onClick={() => setIsViewModalOpen(false)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={isDialogOpen}
                onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
                onConfirm={handleDeleteConfirm}
                title='Confirm Deletion'
                message='Are you sure you want to delete this discipline? This action cannot be undone.'
                confirmText='Delete'
                cancelText='Cancel'
            />
        </div>
    )
}
