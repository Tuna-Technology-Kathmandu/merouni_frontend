'use client'

import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '../../../../../components/UserModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import FileUpload from '../../addCollege/FileUpload'



export default function NewsForm({
    isOpen,
    onClose,
    editing,
    initialData,
    onSubmit,
    submitting,
    colleges = [],
    categories = [],
    loadingColleges = false,
    loadingCategories = false
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
            visibility: 'private',
            college_id: '',
            category_id: ''
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
                visibility: 'private',
                college_id: '',
                category_id: ''
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
            setValue('college_id', initialData.college_id || initialData.vacancyCollege?.id || '')
            setValue('category_id', initialData.category_id || initialData.category?.id || '')
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
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='title' className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                        News Title
                                    </Label>
                                    <Input
                                        id='title'
                                        placeholder='Enter news title'
                                        {...register('title', {
                                            required: 'Title is required'
                                        })}
                                        className={errors.title ? 'border-destructive' : ''}
                                    />
                                    {errors.title && (
                                        <span className='text-sm font-medium text-destructive'>
                                            {errors.title.message}
                                        </span>
                                    )}
                                </div>

                                <SearchableSelect
                                    id='category_id'
                                    label='Category'
                                    options={categories}
                                    displayKey='title'
                                    value={watch('category_id')}
                                    onChange={(option) => {
                                        setValue('category_id', option?.id || '', {
                                            shouldValidate: true,
                                            shouldDirty: true
                                        })
                                    }}  
                                    placeholder='Search and select category'
                                    error={errors.category_id?.message}
                                    required
                                    loading={loadingCategories}
                                />
                            </div>

                            <div className='mt-4'>
                                <SearchableSelect
                                    id='college_id'
                                    label='Associated College'
                                    options={colleges}
                                    value={watch('college_id')}
                                    onChange={(option) => {
                                        setValue('college_id', option?.id || '', {
                                            shouldValidate: true,
                                            shouldDirty: true
                                        })
                                    }}
                                    placeholder='Search and select college (optional)'
                                    error={errors.college_id?.message}
                                    loading={loadingColleges}
                                />
                            </div>

                            <div className='space-y-2 mt-4'>
                                <Label htmlFor='description' className="after:content-['*'] after:ml-0.5 after:text-red-500">
                                    Description
                                </Label>
                                <Textarea
                                    id='description'
                                    {...register('description', {
                                        required: 'Description is required'
                                    })}
                                    placeholder='Brief description of the news...'
                                    className='min-h-[100px]'
                                />
                                {errors.description && (
                                    <span className='text-sm font-medium text-destructive'>
                                        {errors.description.message}
                                    </span>
                                )}
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
                                    <div className='space-y-2'>
                                        <Label htmlFor='visibility'>Visibility</Label>
                                        <Select
                                            id='visibility'
                                            {...register('visibility')}
                                            className='w-full'
                                        >
                                            <option value='private'>Private</option>
                                            <option value='public'>Public</option>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='status'>Status</Label>
                                        <Select
                                            id='status'
                                            {...register('status')}
                                            className='w-full'
                                        >
                                            <option value='draft'>Draft</option>
                                            <option value='published'>Published</option>
                                        </Select>
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
