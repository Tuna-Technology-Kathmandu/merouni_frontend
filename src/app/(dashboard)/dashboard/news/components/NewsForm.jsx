'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '../../../../../components/UserModal'
import { Button } from '../../../../../components/ui/button'
import { Input } from '../../../../../components/ui/input'
import { Label } from '../../../../../components/ui/label'
import FileUpload from '../../addCollege/FileUpload'


// Helper component for required label
const RequiredLabel = ({ children, htmlFor }) => (
    <Label htmlFor={htmlFor}>
        {children} <span className='text-red-500'>*</span>
    </Label>
)

export default function NewsForm({
    isOpen,
    onClose,
    editing,
    initialData,
    onSubmit,
    submitting
}) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            featuredImage: '',
            status: 'draft',
            visibility: 'private'
        }
    })


    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset({
                title: '',
                description: '',
                featuredImage: '',
                status: 'draft',
                visibility: 'private'
            })
        }
    }, [isOpen, reset])

    // Populate form when editing
    useEffect(() => {
        if (editing && initialData && isOpen) {
            setValue('title', initialData.title || '')
            setValue('description', initialData.description || '')
            setValue('featuredImage', initialData.featuredImage || '')
            setValue('status', initialData.status || 'draft')
            setValue('visibility', initialData.visibility || 'private')
        }
    }, [editing, initialData, isOpen, setValue])


    const handleFormSubmit = (data) => {
        onSubmit(data)
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editing ? 'Edit News' : 'Add News'}
            className='max-w-5xl'
        >
            <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className='flex flex-col flex-1 overflow-hidden'
                >
                    <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                        {/* Basic Information */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>News Information</h2>
                            <div className='space-y-4'>
                                {/* Title */}
                                <div>
                                    <RequiredLabel htmlFor='title'>News Title</RequiredLabel>
                                    <Input
                                        id='title'
                                        placeholder='News Title'
                                        {...register('title', {
                                            required: 'Title is required'
                                        })}
                                        aria-invalid={errors.title ? 'true' : 'false'}
                                    />
                                    {errors.title && (
                                        <p className='text-sm font-medium text-destructive mt-1'>
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>


                                {/* Description */}
                                <div>
                                    <RequiredLabel htmlFor='description'>
                                        Description
                                    </RequiredLabel>
                                    <textarea
                                        id='description'
                                        {...register('description', {
                                            required: 'Description is required'
                                        })}
                                        placeholder='Brief description of the news...'
                                        rows={3}
                                        className='flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    />
                                    {errors.description && (
                                        <p className='text-sm font-medium text-destructive mt-1'>
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Right Column - Featured Image & Settings */}
                        <div className='space-y-6'>
                            {/* Featured Image */}
                            <div className='bg-white p-6 rounded-lg shadow-md'>
                                <h2 className='text-xl font-semibold mb-4'>Featured Image</h2>
                                <FileUpload
                                    label='Featured Image'
                                    onUploadComplete={(url) => {
                                        setValue('featuredImage', url)
                                    }}
                                    defaultPreview={watch('featuredImage')}
                                />
                            </div>

                            {/* Additional Settings */}
                            <div className='bg-white p-6 rounded-lg shadow-md'>
                                <h2 className='text-xl font-semibold mb-4'>
                                    Additional Settings
                                </h2>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <Label htmlFor='visibility'>Visibility</Label>
                                        <select
                                            id='visibility'
                                            {...register('visibility')}
                                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                        >
                                            <option value='private'>Private</option>
                                            <option value='public'>Public</option>
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor='status'>Status</Label>
                                        <select
                                            id='status'
                                            {...register('status')}
                                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                        >
                                            <option value='draft'>Draft</option>
                                            <option value='published'>Published</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button - Sticky Footer */}
                    <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end'>
                        <Button
                            type='submit'
                            disabled={submitting}
                        >
                            {submitting
                                ? editing
                                    ? 'Updating...'
                                    : 'Adding...'
                                : editing
                                    ? 'Update News'
                                    : 'Create News'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
