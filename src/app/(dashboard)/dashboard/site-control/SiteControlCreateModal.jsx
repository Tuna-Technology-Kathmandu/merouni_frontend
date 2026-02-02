'use client'
import React, { useState } from 'react'
import { Modal } from '../../../../ui/molecules/Modal'
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

export default function SiteControlCreateModal({ isOpen, onClose, onSuccess }) {
    const [saving, setSaving] = useState(false)

    const { control, handleSubmit, reset, watch, register, formState: { errors } } = useForm({
        shouldUnregister: true,
        defaultValues: {
            type: '',
            value: ''
        }
    })

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
            handleClose()
        } catch (error) {
            toast.error('Failed to save configuration')
        } finally {
            setSaving(false)
        }
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title='Add Configuration'
            className='max-w-4xl'
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
                                    <CKSiteControl
                                        key={`create-editor-${selectedType}`}
                                        value={field.value}
                                        onChange={(data) => field.onChange(data)}
                                        id={`site-control-create-editor-${selectedType}`}
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
                        onClick={handleClose}
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
    )
}
