'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Modal } from '@/ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'
import FileUpload from '@/app/(dashboard)/dashboard/addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'

export default function CreateUpdateDegree({
    isOpen,
    onClose,
    onSuccess,
    initialData = null
}) {
    const [submitting, setSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            featured_image: '',
            title: '',
            description: ''
        }
    })

    // Watch featured_image for preview
    const coverImage = watch('featured_image')

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('featured_image', initialData.featured_image || '')
                setValue('title', initialData.title || '')
                setValue('description', initialData.description || '')
            } else {
                reset({
                    featured_image: '',
                    title: '',
                    description: ''
                })
            }
        }
    }, [isOpen, initialData, setValue, reset])

    const onSubmit = async (data) => {
        try {
            setSubmitting(true)
            const baseUrl = DotenvConfig.NEXT_APP_API_BASE_URL
            const payload = {
                featured_image: data.featured_image?.trim() || null,
                title: data.title.trim(),
                description: data.description?.trim() || null
            }

            let response
            if (initialData?.id) {
                response = await authFetch(`${baseUrl}/degree/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            } else {
                response = await authFetch(`${baseUrl}/degree`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            }

            const result = await response.json()
            if (!response.ok) throw new Error(result.error || 'Operation failed')

            toast.success(`Degree ${initialData ? 'updated' : 'created'} successfully!`)
            onSuccess?.()
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to save degree')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Degree' : 'Add Degree'}
            className='max-w-md'
        >
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='space-y-4'>
                    <div>
                        <FileUpload
                            label='Cover Image'
                            onUploadComplete={(url) => setValue('featured_image', url || '')}
                            defaultPreview={coverImage}
                        />
                    </div>
                 
                    <div>
                        <Label className='block mb-2 text-sm font-medium'>
                            Title <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            {...register('title', {
                                required: 'Title is required',
                                minLength: { value: 2, message: 'Title must be at least 2 characters' }
                            })}
                            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
                            placeholder='e.g. Bachelor of Computer Science'
                        />
                        {errors.title && (
                            <span className='text-red-500 text-sm'>{errors.title.message}</span>
                        )}
                    </div>
                    <div>
                        <Label className='block mb-2 text-sm font-medium'>
                            Description
                        </Label>
                        <Textarea
                            {...register('description')}
                            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
                            placeholder='Enter degree description...'
                            rows={4}
                        />
                    </div>
                </div>

                <div className='flex justify-end gap-2 pt-2'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
                    >
                        Cancel
                    </button>
                    <Button type='submit' disabled={submitting}>
                        {submitting
                            ? 'Processing...'
                            : initialData
                                ? 'Update Degree'
                                : 'Create Degree'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
