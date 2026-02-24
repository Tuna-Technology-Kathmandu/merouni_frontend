'use client'

import { usePageHeading } from '@/contexts/PageHeadingContext'
import Loading from '@/ui/molecules/Loading'
import { Button } from '@/ui/shadcn/button'
import { Edit2, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import { getSiteConfig } from '../../../actions/siteConfigActions'
import Table from '@/ui/shadcn/DataTable'
import { CONFIG_TYPES } from './siteControlConstants'
import SiteControlCreateModal from './SiteControlCreateModal'
import SiteControlEditModal from './SiteControlEditModal'
import SiteControlDeleteModal from './SiteControlDeleteModal'
import SearchInput from '@/ui/molecules/SearchInput'

export default function SiteControlPage() {
    const { setHeading } = usePageHeading()
    const [loading, setLoading] = useState(true)
    const [configs, setConfigs] = useState([])
    const [filteredConfigs, setFilteredConfigs] = useState([])

    // Modal State
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState(null)
    const [deletingConfig, setDeletingConfig] = useState(null)

    // Search State
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
            filtered = configs.filter(c => {
                const typeDef = CONFIG_TYPES.find(ct => ct.value === c.type)
                const label = typeDef ? typeDef.label : c.type
                return (
                    c.type.toLowerCase().includes(query) ||
                    label.toLowerCase().includes(query) ||
                    (c.value && c.value.toLowerCase().includes(query))
                )
            })
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

    const handleAdd = () => setIsCreateOpen(true)
    const handleEdit = (config) => setEditingConfig(config)
    const handleDelete = (config) => setDeletingConfig(config)
    const handleCloseCreate = () => setIsCreateOpen(false)
    const handleCloseEdit = () => setEditingConfig(null)
    const handleCloseDelete = () => setDeletingConfig(null)
    const handleSuccess = () => loadConfig()

    const handleSearchInput = (value) => {
        setSearchQuery(value)
        setPagination(prev => ({ ...prev, currentPage: 1 }))
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
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">{label}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{config.type}</span>
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
                if (displayValue.length > 150) displayValue = displayValue.substring(0, 150) + '...'
                return (
                    <div className="max-w-md">
                        <span className="text-sm text-slate-600 line-clamp-2">{displayValue || <em className="text-slate-300">No value set</em>}</span>
                    </div>
                )
            }
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className='flex gap-1'>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(row.original)}
                        className='hover:bg-blue-50 text-blue-600 h-8 w-8'
                        title="Edit"
                    >
                        <Edit2 className='w-4 h-4' />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row.original)}
                        className='hover:bg-red-50 text-red-600 h-8 w-8'
                        title="Delete"
                    >
                        <Trash2 className='w-4 h-4' />
                    </Button>
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
        <div className='w-full space-y-4 p-4'>
            {/* Header Section */}
            <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
                    {/* Search Bar */}
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder='Search configurations...'
                        className='max-w-md w-full'
                    />

                    {/* Button */}
                    <Button onClick={handleAdd} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        Add Configuration
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table
                    loading={loading}
                    data={paginatedData}
                    columns={columns}
                    pagination={pagination}
                    onPageChange={(p) => setPagination(prev => ({ ...prev, currentPage: p }))}
                    onSearch={handleSearchInput}
                    showSearch={false}
                />
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
        </div>
    )
}

