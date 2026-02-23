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
import TipTapEditor from '@/ui/shadcn/tiptap-editor'

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
            reset({
                type: config.type,
                value: config.value || ''
            })
        }
    }, [isOpen, config, reset])

    const selectedType = watch('type')

    const getSelectedTypeConfig = (typeValue) => {
        return CONFIG_TYPES.find(ct => ct.value === typeValue)
    }

    const selectedTypeConfig = getSelectedTypeConfig(selectedType)

    const onSubmit = async (data) => {
        setSaving(true)
        try {
            await updateSiteConfig({ type: data.type, value: data.value })
            const label = CONFIG_TYPES.find(ct => ct.value === data.type)?.label || data.type
            toast.success(`Configuration for "${label}" updated successfully`)
            onSuccess && onSuccess()
            onClose()
        } catch (error) {
            toast.error('Failed to update configuration')
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
            <DialogContent className='max-w-4xl max-h-[90vh] flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        Edit Configuration
                    </DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6'>
                    <form id="site-control-edit-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Configuration Details</h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label required>Configuration Type</Label>
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onChange={field.onChange}
                                                disabled={true}
                                                className="w-full bg-slate-50"
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
                                    <input type="hidden" {...register('type')} />
                                </div>

                                <div className="space-y-2">
                                    <Label required>Value</Label>
                                    {selectedTypeConfig?.inputType === 'richtext' ? (
                                        <Controller
                                            name="value"
                                            control={control}
                                            rules={{ required: 'Value is required' }}
                                            render={({ field }) => (
                                                <div className="mt-1">
                                                    <TipTapEditor
                                                        key={`edit-editor-${config?.type}-${isOpen}`}
                                                        value={field.value}
                                                        onChange={(data) => field.onChange(data)}
                                                        placeholder={`Enter ${selectedTypeConfig.label.toLowerCase()}...`}
                                                        height="300px"
                                                    />
                                                </div>
                                            )}
                                        />
                                    ) : (
                                        <Input
                                            type={selectedTypeConfig?.inputType || 'text'}
                                            placeholder={selectedTypeConfig ? `Enter ${selectedTypeConfig.label.toLowerCase()}...` : 'Enter value...'}
                                            {...register('value', { required: 'Value is required' })}
                                        />
                                    )}
                                    {errors.value && <span className="text-xs text-red-500">{errors.value.message}</span>}
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        form="site-control-edit-form"
                        disabled={saving}
                        className='bg-[#387cae] hover:bg-[#387cae]/90 text-white min-w-[120px]'
                    >
                        {saving ? 'Processing...' : 'Save Configuration'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

