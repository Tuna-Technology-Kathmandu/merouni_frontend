'use client'

import { useState, useEffect, useMemo } from 'react'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { toast } from 'react-toastify'
import { Modal } from '@/ui/molecules/Modal'
import Loading from '@/ui/molecules/Loading'
import Table from '@/ui/molecules/Table'
import { Search } from 'lucide-react'
import { getContacts, deleteContact, updateContact } from '../../../actions/contactActions'
import { createColumns } from './columns'
import ViewContactModal from './ViewContactModal'
import { Button } from '@/ui/shadcn/button'
import { Label } from '@/ui/shadcn/label'

import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'

export default function ContactUsManager() {
    const { setHeading } = usePageHeading()
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    })

    const [selectedContact, setSelectedContact] = useState(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

    const [searchTimeout, setSearchTimeout] = useState(null)

    const [updatingStatusId, setUpdatingStatusId] = useState(null)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [selectedStatusContact, setSelectedStatusContact] = useState(null)
    const [newStatus, setNewStatus] = useState('new')

    // Confirmation Dialog State
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    useEffect(() => {
        setHeading('Contact Us Messages')
        return () => setHeading(null)
    }, [setHeading])

    useEffect(() => {
        loadContacts()
    }, [pagination.currentPage, statusFilter, debouncedSearchQuery])

    const loadContacts = async () => {
        setLoading(true)
        try {
            const data = await getContacts(pagination.currentPage, statusFilter, debouncedSearchQuery)
            setContacts(data.items)
            setPagination(prev => ({
                ...prev,
                ...data.pagination
            }))
        } catch (error) {
            toast.error('Failed to load messages')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        const query = e.target.value
        setSearchQuery(query)

        if (searchTimeout) clearTimeout(searchTimeout)

        const timeout = setTimeout(() => {
            setPagination(prev => ({ ...prev, currentPage: 1 }))
            setDebouncedSearchQuery(query)
        }, 500)

        setSearchTimeout(timeout)
    }

    const handleView = (contact) => {
        setSelectedContact(contact)
        setIsViewModalOpen(true)
    }

    const handleStatusUpdate = (contact) => {
        setSelectedStatusContact(contact)
        setNewStatus(contact.status || 'new')
        setStatusModalOpen(true)
    }

    const confirmStatusUpdate = async () => {
        if (!selectedStatusContact) return

        setUpdatingStatusId(selectedStatusContact.id)
        try {
            await updateContact(selectedStatusContact.id, { status: newStatus })
            toast.success(`Status updated to ${newStatus}`)

            // Update local state to reflect change immediately
            setContacts(prev => prev.map(c =>
                c.id === selectedStatusContact.id ? { ...c, status: newStatus } : c
            ))

            setStatusModalOpen(false)
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setUpdatingStatusId(null)
        }
    }

    const handleDelete = (id) => {
        setDeleteId(id)
        setDeleteConfirmationOpen(true)
    }

    const confirmDelete = async () => {
        if (!deleteId) return

        try {
            await deleteContact(deleteId)
            toast.success('Message deleted successfully')
            loadContacts()
        } catch (error) {
            toast.error('Failed to delete message')
        } finally {
            setDeleteConfirmationOpen(false)
            setDeleteId(null)
        }
    }

    const columns = useMemo(() => createColumns({ handleView, handleDelete, handleStatusUpdate }), [])

    if (loading && contacts.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loading />
            </div>
        )
    }

    return (
        <div className='p-6 w-full space-y-6'>
            <div className='flex justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100'>
                {/* Search */}
                    {/* Search Bar */}
                         <SearchInput
                           value={searchQuery}
                           onChange={(e) => handleSearch(e.target.value)}
                           placeholder='Search courses...'
                           className='max-w-md'
                         />

                {/* Filters */}
                <div className='min-w-[180px]'>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value)
                            setPagination(prev => ({ ...prev, currentPage: 1 }))
                        }}
                        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer'
                    >
                        <option value='all'>All Status</option>
                        <option value='unread'>UnRead</option>
                        <option value='in_progress'>In Progress</option>
                        <option value='resolved'>Resolved</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <Table
                    data={contacts}
                    columns={columns}
                    pagination={pagination}
                    onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                    showSearch={false} // We have custom search above
                />
            </div>

            <ViewContactModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false)
                    setSelectedContact(null)
                }}
                contact={selectedContact}
                onUpdate={() => {
                    loadContacts() // Refresh list to update status in table
                    setIsViewModalOpen(false)
                }}
            />

            {/* Status Update Modal */}
            <Modal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                title="Update Contact Status"
                className="max-w-md"
            >
                <div className="space-y-4">
                    <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </Label>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="new">New</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setStatusModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmStatusUpdate}
                            disabled={updatingStatusId}
                        >
                            {updatingStatusId ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <ConfirmationDialog
                open={deleteConfirmationOpen}
                onClose={() => {
                    setDeleteConfirmationOpen(false)
                    setDeleteId(null)
                }}
                onConfirm={confirmDelete}
                title="Delete Message"
                message="Are you sure you want to delete this message? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    )
}
