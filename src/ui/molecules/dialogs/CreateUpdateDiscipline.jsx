'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Select } from '@/ui/shadcn/select'
import FileUpload from '@/app/(dashboard)/dashboard/addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'

export default function CreateUpdateDiscipline({
    isOpen,
    onClose,
    onSuccess,
    initialData = null,
    authorId
}) {
    const [uploadedFiles, setUploadedFiles] = useState({
        featured_image: ''
    })

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            content: '',
            featured_image: '',
            author: authorId
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Edit mode
                setValue('title', initialData.title)
                setValue('description', initialData.description || '')
                setValue('content', initialData.content || '')
                setValue('featured_image', initialData.featured_image || '')
                setUploadedFiles({ featured_image: initialData.featured_image || '' })
            } else {
                // Create mode - reset to defaults
                reset({
                    title: '',
                    description: '',
                    content: '',
                    featured_image: '',
                    author: authorId
                })
                setUploadedFiles({ featured_image: '' })
            }
        }
    }, [isOpen, initialData, setValue, reset, authorId])

    const createDiscipline = async (data) => {
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/discipline`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
            if (!response.ok) {
                throw new Error('Failed to create discipline')
            }
            
            return await response.json()
        } catch (error) {
            console.error('Error creating discipline:', error)
            throw error
        }
    }

    const updateDiscipline = async (data, id) => {
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/discipline?discipline_id=${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
            if (!response.ok) {
                throw new Error('Failed to update discipline')
            }
            return await response.json()
        } catch (error) {
            console.error('Error updating discipline:', error)
            throw error
        }
    }

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            featured_image: uploadedFiles.featured_image
        }
        try {
            if (initialData?.id) {
                // Update
                await updateDiscipline(formattedData, initialData.id)
                toast.success('Discipline updated successfully')
            } else {
                // Create
                await createDiscipline(formattedData)
                toast.success('Discipline created successfully')
            }
            onSuccess?.()
            onClose()
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Network error occurred'
            toast.error(
                `Failed to ${initialData ? 'update' : 'create'} discipline: ${errorMsg}`
            )
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-2xl'
        >
            <DialogHeader>
                <DialogTitle>{initialData ? 'Edit Discipline' : 'Add Discipline'}</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
            <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col flex-1 overflow-hidden'
                >
                    <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                          
                            <div className='space-y-4'>
                                <div>
                                    <Label>
                                        Discipline Title <span className='text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        type='text'
                                        placeholder='Discipline Title'
                                        {...register('title', {
                                            required: 'Title is required'
                                        })}
                                        className='w-full p-2 border rounded'
                                    />
                                    {errors.title && (
                                        <span className='text-red-500 text-sm'>
                                            {errors.title.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <textarea
                                        placeholder='Short description'
                                        {...register('description')}
                                        className='w-full p-2 border rounded'
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label>Content</Label>
                                    <Controller
                                        name='content'
                                        control={control}
                                        render={({ field }) => (
                                            <TipTapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder='Enter detailed content with rich formatting...'
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <Label>Image</Label>
                                    <FileUpload
                                        defaultPreview={uploadedFiles.featured_image}
                                        onUploadComplete={(url) => {
                                            setUploadedFiles((prev) => ({
                                                ...prev,
                                                featured_image: url
                                            }))
                                            setValue('featured_image', url)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button - Sticky Footer */}
                    <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type='submit'>
                            {initialData ? 'Update Discipline' : 'Create Discipline'}
                        </Button>
                    </div>
                </form>
            </div>
            </DialogContent>
        </Dialog>
    )
}
