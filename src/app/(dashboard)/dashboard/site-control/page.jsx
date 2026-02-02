'use client'

import { usePageHeading } from '@/contexts/PageHeadingContext'
import Loading from '@/ui/molecules/Loading'
import { Button } from '@/ui/shadcn/button'
import { Edit2, Search, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { getSiteConfig, deleteSiteConfig } from '../../../actions/siteConfigActions'
import Table from '../../../../ui/molecules/Table'
import { CONFIG_TYPES } from './siteControlConstants'
import SiteControlCreateModal from './SiteControlCreateModal'
import SiteControlEditModal from './SiteControlEditModal'
import SiteControlDeleteModal from './SiteControlDeleteModal'

export default function SiteControlPage() {
    const { setHeading } = usePageHeading()
    const [loading, setLoading] = useState(true)
    const [configs, setConfigs] = useState([])
    const [filteredConfigs, setFilteredConfigs] = useState([])

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState(null) // Object when editing, null when closed
    const [deletingConfig, setDeletingConfig] = useState(null) // Object when deleting

    // Search & Pagination State for Table Molecule
    const [searchQuery, setSearchQuery] = useState('')
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    })

    useEffect(() => {
        setHeading('Site Control')
        return () => setHeading(null)
    }, [setHeading])

    useEffect(() => {
        loadConfig()
    }, [])

    useEffect(() => {
        // Client-side filtering
        let filtered = configs
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = configs.filter(c =>
                c.type.toLowerCase().includes(query) ||
                (c.value && c.value.toLowerCase().includes(query))
            )
        }
        setFilteredConfigs(filtered)
        setPagination(prev => ({
            ...prev,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / 10) || 1
        }))

    }, [configs, searchQuery])


    const loadConfig = async () => {
        setLoading(true)
        try {
            const data = await getSiteConfig()
            const configItems = Array.isArray(data) ? data : (data?.items || [])
            setConfigs(configItems)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load site configuration')
        } finally {
            setLoading(false)
        }
    }

    const handleAdd = () => {
        setIsCreateOpen(true)
    }

    const handleEdit = (config) => {
        setEditingConfig(config)
    }

    const handleDelete = (config) => {
        setDeletingConfig(config)
    }

    const handleCloseCreate = () => {
        setIsCreateOpen(false)
    }

    const handleCloseEdit = () => {
        setEditingConfig(null)
    }

    const handleCloseDelete = () => {
        setDeletingConfig(null)
    }

    const handleSuccess = () => {
        loadConfig()
    }

    const handleSearchInput = (value) => {
        setSearchQuery(value)
    }

    const columns = useMemo(() => [
        {
            header: 'Configuration Type',
            accessorKey: 'type',
            cell: ({ row }) => {
                const config = row.original;
                const typeDef = CONFIG_TYPES.find(ct => ct.value === config.type)
                const label = typeDef ? typeDef.label : config.type
                return (
                    <div>
                        <span className="font-medium">{label}</span>
                        <span className="block text-xs text-gray-400 font-normal">{config.type}</span>
                    </div>
                )
            }
        },
        {
            header: 'Value',
            accessorKey: 'value',
            cell: ({ row }) => {
                const config = row.original;
                const typeDef = CONFIG_TYPES.find(ct => ct.value === config.type)
                let displayValue = config.value || ''
                if (typeDef?.inputType === 'richtext') {
                    displayValue = displayValue.replace(/<[^>]*>?/gm, '') // Simple strip tags
                }
                if (displayValue.length > 100) displayValue = displayValue.substring(0, 100) + '...'
                return <span className="text-gray-600">{displayValue}</span>
            }
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
                        onClick={() => handleDelete(row.original)}
                        className='p-1 text-red-600 hover:text-red-800'
                    >
                        <Trash2 className='w-4 h-4' />
                    </button>
                </div>
            )
        }
    ], [])


    const paginatedData = useMemo(() => {
        const startIndex = (pagination.currentPage - 1) * 10
        const endIndex = startIndex + 10
        return filteredConfigs.slice(startIndex, endIndex)
    }, [filteredConfigs, pagination.currentPage])


    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loading />
            </div>
        )
    }

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
                            placeholder='Search configurations...'
                        />
                    </div>
                    {/* Button */}
                    <div className='flex gap-2'>
                        <Button onClick={handleAdd}>
                            <Plus className="w-4 h-4 mr-2" /> Add Configuration
                        </Button>
                    </div>
                </div>
                <ToastContainer />

                {/* Table */}
                <div className='mt-8'>
                    <Table
                        loading={loading}
                        data={paginatedData}
                        columns={columns}
                        pagination={pagination}
                        onPageChange={(p) => setPagination(prev => ({ ...prev, currentPage: p }))}
                        onSearch={handleSearchInput}
                        showSearch={false} // We implemented external search bar above to match Tag UI
                    />
                </div>
            </div>

            {/* Create Modal */}
            <SiteControlCreateModal
                isOpen={isCreateOpen}
                onClose={handleCloseCreate}
                onSuccess={handleSuccess}
            />

            {/* Edit Modal */}
            <SiteControlEditModal
                isOpen={!!editingConfig}
                onClose={handleCloseEdit}
                onSuccess={handleSuccess}
                config={editingConfig}
            />

            {/* Delete Modal */}
            <SiteControlDeleteModal
                isOpen={!!deletingConfig}
                onClose={handleCloseDelete}
                onSuccess={handleSuccess}
                config={deletingConfig}
            />
        </>
    )
}
