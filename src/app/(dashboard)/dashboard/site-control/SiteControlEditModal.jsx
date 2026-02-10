'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/ui/shadcn/button'
import { Label } from '@/ui/shadcn/label'
import { Input } from '@/ui/shadcn/input'
import { Select } from '@/ui/shadcn/select'
import { updateSiteConfig } from '../../../actions/siteConfigActions'
import { toast } from 'react-toastify'
import { CONFIG_TYPES } from './siteControlConstants'
import dynamic from 'next/dynamic'

const CKSiteControl = dynamic(() => import('./CKSiteControl'), {
    ssr: false
})

export default function SiteControlEditModal({ isOpen, onClose, onSuccess, config }) {
    const [saving, setSaving] = useState(false)

    const { control, handleSubmit, reset, watch, register, setValue, formState: { errors } } = useForm({
        shouldUnregister: true,
        defaultValues: {
            type: '',
            value: ''
        }
    })

    // Reset and initialize form when modal opens or config changes
    useEffect(() => {
        if (isOpen && config) {
            // ShouldUnregister is enabled, so we simply set the values.
            // But we must reset first to clear any potential persistent state.
            reset({
                type: config.type,
                value: config.value || ''
            })
        }
    }, [isOpen, config, reset])

    // Watch type to determine input rendering
    // Note: since it's an EDIT modal, type usually doesn't change, but we allow it if the user wants?
    // Usually Edit restricts key changes. But for now, let's assume Type is read-only or selectable based on req.
    // The previous implementation allowed selecting type in Edit mode (disabled={!!editingConfig} in page.jsx)
    // So here we should probably disable the type select.

    // Actually, in page.jsx: disabled={!!editingConfig} was properly disabling the select.
    // So we will simulate that behavior.

    const selectedType = watch('type')

    const getSelectedTypeConfig = (typeValue) => {
        return CONFIG_TYPES.find(ct => ct.value === typeValue)
    }

    const selectedTypeConfig = getSelectedTypeConfig(selectedType)

    const onSubmit = async (data) => {
        setSaving(true)
        try {
            await updateSiteConfig({ type: data.type, value: data.value })
            toast.success('Configuration saved successfully')
            onSuccess && onSuccess()
            onClose()
        } catch (error) {
            toast.error('Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-4xl'
        >
            <DialogHeader>
                <DialogTitle>Edit Configuration</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 mt-4'>
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
                                        disabled={true} // Always disabled in Edit mode
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
                            {/* Hidden input to ensure value is submitted if disabled select doesn't submit */}
                            <input type="hidden" {...register('type')} />
                        </div>

                        <div className="space-y-2">
                            <Label>Value <span className="text-red-500">*</span></Label>
                            {selectedTypeConfig?.inputType === 'richtext' ? (
                                <Controller
                                    name="value"
                                    control={control}
                                    rules={{ required: 'Value is required' }}
                                    render={({ field }) => (
                                        <CKSiteControl
                                            // Using specific key for EDIT to ensure separation from Create
                                            key={`edit-editor-${config?.type || 'unknown'}-${isOpen ? 'open' : 'closed'}`}
                                            value={field.value}
                                            onChange={(data) => field.onChange(data)}
                                            id={`site-control-edit-editor-${config?.type || 'generic'}`}
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
                            onClick={onClose}
                            className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
                        >
                            Cancel
                        </button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
