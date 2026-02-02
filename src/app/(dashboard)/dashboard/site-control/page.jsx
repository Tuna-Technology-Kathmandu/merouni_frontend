'use client'

import { usePageHeading } from '@/contexts/PageHeadingContext'
import Loading from '@/ui/molecules/Loading'
import { Button } from '@/ui/shadcn/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import {
    Select
} from '@/ui/shadcn/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/ui/shadcn/table'
import { Plus } from 'lucide-react'
import { FaEdit } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { getSiteConfig, updateSiteConfig } from '../../../actions/siteConfigActions'
import dynamic from 'next/dynamic'


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

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState(null) // null = adding new
    const [saving, setSaving] = useState(false)

    // React Hook Form
    const { control, handleSubmit, reset, watch, setValue, register, formState: { errors } } = useForm({
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

    const loadConfig = async () => {
        try {
            const data = await getSiteConfig()
            if (Array.isArray(data)) {
                setConfigs(data)
            } else {
                setConfigs([])
            }
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

    const onSubmit = async (data) => {
        setSaving(true)
        try {
            await updateSiteConfig({ type: data.type, value: data.value })
            toast.success('Configuration saved successfully')
            loadConfig()
            setIsModalOpen(false)
        } catch (error) {
            toast.error('Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    // Helper to get logic for selected type
    const getSelectedTypeConfig = (typeValue) => {
        return CONFIG_TYPES.find(ct => ct.value === typeValue)
    }

    const selectedTypeConfig = getSelectedTypeConfig(selectedType)

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loading />
            </div>
        )
    }

    return (
        <div className='p-4 bg-white min-h-screen'>
            <div className="flex justify-end mb-6">
                <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Add Configuration
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px] text-gray-600">Configuration Type</TableHead>
                            <TableHead className="text-gray-600">Value</TableHead>
                            <TableHead className="w-[100px] text-right text-gray-600">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {configs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                                    No configurations found. Click "Add Configuration" to start.
                                </TableCell>
                            </TableRow>
                        ) : (
                            configs.map((config) => {
                                const typeDef = CONFIG_TYPES.find(ct => ct.value === config.type)
                                const label = typeDef ? typeDef.label : config.type

                                // Truncate value for display, strip HTML tags if rich text
                                let displayValue = config.value || ''
                                if (typeDef?.inputType === 'richtext') {
                                    displayValue = displayValue.replace(/<[^>]*>?/gm, '') // Simple strip tags
                                }
                                if (displayValue.length > 100) displayValue = displayValue.substring(0, 100) + '...'

                                return (
                                    <TableRow key={config.id || config.type}>
                                        <TableCell className="font-medium">
                                            {label}
                                            <span className="block text-xs text-gray-400 font-normal">{config.type}</span>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {displayValue}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(config)}
                                                className="h-8 w-8"
                                            >
                                                <FaEdit className="w-4 h-4 text-blue-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingConfig ? 'Edit Configuration' : 'Add Configuration'}</DialogTitle>
                        <DialogDescription>
                            {editingConfig ? 'Update the value for this configuration.' : 'Select a type and enter a value.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4 py-4">
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
                                            disabled={!!editingConfig} // Lock type when editing
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
                                                initialData={field.value}
                                                onChange={field.onChange}
                                                id="config-editor"
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

                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Configuration'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
