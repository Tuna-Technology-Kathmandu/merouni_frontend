'use client'

import { usePageHeading } from '@/contexts/PageHeadingContext'
import Loading from '@/ui/molecules/Loading'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import {
    Select
} from '@/ui/shadcn/select'
import { Edit2, Search, Plus } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { getSiteConfig, updateSiteConfig } from '../../../actions/siteConfigActions'
import dynamic from 'next/dynamic'
import Table from '../../../../ui/molecules/Table'
import { Modal } from '../../../../ui/molecules/Modal'


const CKUni = dynamic(() => import('@/app/(dashboard)/dashboard/component/CKUni'), {
    ssr: false
})


// Define the expected configuration keys and their metadata
const CONFIG_TYPES = [
    // Social Media
    { value: 'social_facebook', label: 'Facebook URL', section: 'Social', inputType: 'text' },
    { value: 'social_twitter', label: 'Twitter (X) URL', section: 'Social', inputType: 'text' },
    { value: 'social_linkedin', label: 'LinkedIn URL', section: 'Social', inputType: 'text' },
    { value: 'social_instagram', label: 'Instagram URL', section: 'Social', inputType: 'text' },
    { value: 'social_youtube', label: 'YouTube URL', section: 'Social', inputType: 'text' },

    // Contact Information
    { value: 'contact_email', label: 'Contact Email', section: 'Contact', inputType: 'email' },
    { value: 'contact_phone', label: 'Phone Number', section: 'Contact', inputType: 'text' },
    { value: 'contact_address', label: 'Physical Address', section: 'Contact', inputType: 'text' },

    // Legal & Policies
    { value: 'legal_disclaimer', label: 'Site Disclaimer', section: 'Legal', inputType: 'richtext' },
    { value: 'legal_privacy_policy', label: 'Privacy Policy', section: 'Legal', inputType: 'richtext' },
    { value: 'legal_terms_conditions', label: 'Terms & Conditions', section: 'Legal', inputType: 'richtext' },
]

export default function SiteControlPage() {
    const { setHeading } = usePageHeading()
    const [loading, setLoading] = useState(true)
    const [configs, setConfigs] = useState([])
    const [filteredConfigs, setFilteredConfigs] = useState([])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState(null) // null = adding new
    const [saving, setSaving] = useState(false)

    // Search & Pagination State for Table Molecule
    const [searchQuery, setSearchQuery] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    })

    // React Hook Form
    const { control, handleSubmit, reset, watch, register, formState: { errors } } = useForm({
        defaultValues: {
            type: '',
            value: ''
        }
    })

    const selectedType = watch('type')

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
        setEditingConfig(null)
        reset({ type: '', value: '' })
        setIsModalOpen(true)
    }

    const handleEdit = (config) => {
        setEditingConfig(config)
        reset({ type: config.type, value: config.value || '' })
        setIsModalOpen(true)
    }

    const handleModalClose = () => {
        setIsModalOpen(false)
        reset()
    }

    const onSubmit = async (data) => {
        setSaving(true)
        try {
            await updateSiteConfig({ type: data.type, value: data.value })
            toast.success('Configuration saved successfully')
            loadConfig()
            handleModalClose()
        } catch (error) {
            toast.error('Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    const handleSearchInput = (value) => {
        setSearchQuery(value)
        // Since we are doing client side filtering for now (API returns all), direct update is fine.
        // Keeping structure similar to Tags page if server-side search is added later.
    }

    // Helper to get logic for selected type
    const getSelectedTypeConfig = (typeValue) => {
        return CONFIG_TYPES.find(ct => ct.value === typeValue)
    }

    const selectedTypeConfig = getSelectedTypeConfig(selectedType)

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
                    {/* Delete not implemented yet for configs as per previous reqs */}
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

            {/* Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={editingConfig ? 'Edit Configuration' : 'Add Configuration'}
                className='max-w-4xl' // Keeping wide modal for CKEditor
            >
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Configuration Type <span className="text-red-500">*</span></Label>
                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: 'Configuration type is required' }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={!!editingConfig}
                                    >
                                        <option value="" disabled>Select a type...</option>
                                        {CONFIG_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.type && <span className="text-sm text-red-500">{errors.type.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label>Value <span className="text-red-500">*</span></Label>
                            {selectedTypeConfig?.inputType === 'richtext' ? (
                                <Controller
                                    name="value"
                                    control={control}
                                    rules={{ required: 'Value is required' }}
                                    render={({ field }) => (
                                        <CKUni
                                            key={selectedType || 'editor'}
                                            initialData={field.value}
                                            onChange={(data) => field.onChange(data)}
                                            id={`site-control-config-editor`}
                                        />
                                    )}
                                />
                            ) : (
                                <Input
                                    type={selectedTypeConfig?.inputType || 'text'}
                                    placeholder={selectedTypeConfig ? `Enter ${selectedTypeConfig.label.toLowerCase()}...` : 'Enter value...'}
                                    {...register('value', { required: 'Value is required' })}
                                />
                            )}
                            {errors.value && <span className="text-sm text-red-500">{errors.value.message}</span>}
                        </div>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <button
                            type='button'
                            onClick={handleModalClose}
                            className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
                        >
                            Cancel
                        </button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
