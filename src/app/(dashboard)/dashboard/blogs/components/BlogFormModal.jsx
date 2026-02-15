import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import FileUpload from '../../addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import { Search } from 'lucide-react'
import { toast } from 'react-toastify'

const RequiredLabel = ({ children, htmlFor }) => (
    <Label htmlFor={htmlFor}>
        {children} <span className='text-red-500'>*</span>
    </Label>
)

const BlogFormModal = ({
    isOpen,
    onClose,
    isEditing,
    initialData,
    categories,
    onSave,
    submitting,
    authors
}) => {
    const [uploadedFiles, setUploadedFiles] = useState({
        featuredImage: ''
    })
    const [tagsSearch, setTagsSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const searchTimeout = useRef(null)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            category: '',
            tags: [],
            featuredImage: '',
            description: '',
            content: '',
            status: 'draft',
            visibility: 'private',
            is_featured: false
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (isEditing && initialData) {
                // Reset form to initialData
                reset({
                    title: initialData.title || '',
                    category: initialData.category?.id || initialData.category || '', // Handle object or ID
                    description: initialData.description || '',
                    content: initialData.content || '',
                    status: initialData.status || 'draft',
                    visibility: initialData.visibility || 'private',
                    is_featured: initialData.is_featured || false
                })
                setUploadedFiles({ featuredImage: initialData.featuredImage || '' })
                setValue('featuredImage', initialData.featuredImage || '')

                // Parse and set tags
                let blogTags = initialData.tags || []
                if (typeof blogTags === 'string') {
                    try {
                        blogTags = JSON.parse(blogTags)
                    } catch (e) {
                        blogTags = []
                    }
                }

                // Use initialData.tags directly if they are objects, otherwise we might need to fetch them
                // Assuming initialData passed from page.jsx acts as the source of truth.
                // If initialData.tags are IDs (numbers), we might display them differently or fetch them?
                // In page.jsx logic, it fetched missing tags.
                // For simplicity, we assume `initialData.tags` passed here are fully populated objects if possible,
                // or we handle what we have. If they are IDs, we can't show titles.
                // Let's rely on what's passed.

                if (Array.isArray(blogTags)) {
                    // Filter out IDs if we need objects for display, or accept what we have
                    // If we receive IDs only, we can't show names without fetching.
                    // Ideally parent passes full objects.
                    setSelectedTags(blogTags)
                    setValue('tags', blogTags.map(t => typeof t === 'object' ? t.id : t))
                } else {
                    setSelectedTags([])
                    setValue('tags', [])
                }

            } else {
                // Reset for create
                reset({
                    title: '',
                    category: '',
                    tags: [],
                    featuredImage: '',
                    description: '',
                    content: '',
                    status: 'draft',
                    visibility: 'private',
                    is_featured: false
                })
                setUploadedFiles({ featuredImage: '' })
                setSelectedTags([])
                setTagsSearch('')
                setSearchResults([])
            }
        }
    }, [isOpen, isEditing, initialData, reset, setValue])


    const handleTagsSearch = (e) => {
        const query = e.target.value
        setTagsSearch(query)

        if (searchTimeout.current) clearTimeout(searchTimeout.current)
        if (query.length < 2) {
            setSearchResults([])
            return
        }
        searchTimeout.current = setTimeout(async () => {
            try {
                const response = await authFetch(
                    `${process.env.baseUrl}/tag?q=${query}`
                )
                const data = await response.json()
                setSearchResults(data.items || [])
            } catch (error) {
                console.error('Tags Search Error:', error)
                toast.error('Failed to search tags')
            }
        }, 300)
    }

    const handleSelectTag = (tag) => {
        // Check if tag is already selected
        // Handle both object tags and ID tags if mixed, but prefer objects
        const isSelected = selectedTags.some((t) => (t.id || t) === tag.id)
        if (!isSelected) {
            const newTags = [...selectedTags, tag]
            setSelectedTags(newTags)
            setValue(
                'tags',
                newTags.map((t) => t.id)
            )
        }
        setTagsSearch('')
        setSearchResults([])
    }

    const onSubmitForm = (data) => {
        // Determine author if needed, but page.jsx handled it via selector or default.
        // We pass data back.
        const finalData = {
            ...data,
            tags: selectedTags, // Pass objects or let parent handle mapping to IDs
            featuredImage: uploadedFiles.featuredImage
        }
        onSave(finalData)
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-5xl'
        >
            <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
            <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
                <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    className='flex flex-col flex-1 overflow-hidden'
                >
                    <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                        {/* Basic Information */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Blog Information
                            </h2>
                            <div className='space-y-4'>
                                <div>
                                    <RequiredLabel htmlFor='title'>Blog Title</RequiredLabel>
                                    <Input
                                        id='title'
                                        placeholder='Blog Title'
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

                                <div>
                                    <RequiredLabel htmlFor='category'>Category</RequiredLabel>
                                    <select
                                        id='category'
                                        {...register('category', {
                                            required: 'Category is required'
                                        })}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    >
                                        <option value=''>Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className='text-sm font-medium text-destructive mt-1'>
                                            {errors.category.message}
                                        </p>
                                    )}
                                </div>

                                {/* Tags search input */}
                                <div className='relative'>
                                    <Label>Tags</Label>
                                    <Input
                                        type='text'
                                        placeholder='Search for tags...'
                                        value={tagsSearch}
                                        onChange={handleTagsSearch}
                                        className="mt-1"
                                    />

                                    {/* Display search results in a dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
                                            {searchResults.map((tag) => (
                                                <div
                                                    key={tag.id}
                                                    className='p-2 hover:bg-gray-100 cursor-pointer'
                                                    onClick={() => handleSelectTag(tag)}
                                                >
                                                    {tag.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Display selected tags */}
                                    <div className='mt-2 flex flex-wrap gap-2'>
                                        {selectedTags.map((tag) => (
                                            <span
                                                key={tag.id || tag}
                                                className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1'
                                            >
                                                {tag.title || tag.name || tag}
                                                <button
                                                    type='button'
                                                    onClick={() => {
                                                        const newTags = selectedTags.filter(
                                                            (t) => (t.id || t) !== (tag.id || tag)
                                                        )
                                                        setSelectedTags(newTags)
                                                        setValue(
                                                            'tags',
                                                            newTags.map((t) => t.id || t)
                                                        )
                                                    }}
                                                    className='text-blue-600 hover:text-blue-800 ml-1'
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description and Content */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Description & Content
                            </h2>
                            <div className='space-y-4'>
                                <div>
                                    <Label htmlFor='description'>Description</Label>
                                    <textarea
                                        id='description'
                                        placeholder='Description'
                                        {...register('description')}
                                        className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                        rows='4'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='content' className='block mb-2 font-medium text-sm'>
                                        Content
                                    </label>
                                    <TipTapEditor
                                        value={getValues('content')}
                                        onChange={(data) => setValue('content', data)}
                                        placeholder='Write your blog content here...'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Featured Image{' '}
                            </h2>
                            <FileUpload
                                label='Blog Image'
                                onUploadComplete={(url) => {
                                    setUploadedFiles((prev) => ({
                                        ...prev,
                                        featuredImage: url
                                    }))
                                    setValue('featuredImage', url)
                                }}
                                defaultPreview={uploadedFiles.featuredImage}
                            />
                        </div>

                        {/* Additional Settings */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Additional Settings
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                                <div>
                                    <Label htmlFor='status'>Status</Label>
                                    <select
                                        id='status'
                                        {...register('status')}
                                        className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                    >
                                        <option value='draft'>Draft</option>
                                        <option value='published'>Published</option>
                                        <option value='archived'>Archived</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-2 pt-8">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        {...register('is_featured')}
                                        className="h-4 w-4 text-[#0A70A7] focus:ring-[#0A70A7] border-gray-300 rounded"
                                    />
                                    <Label htmlFor="is_featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                                        Mark as Featured Blog
                                    </Label>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Submit Button - Sticky Footer */}
                    <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                        <Button
                            type='button'
                            onClick={onClose}
                            variant='outline'
                            size='sm'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={submitting}
                        >
                            {submitting
                                ? isEditing
                                    ? 'Updating...'
                                    : 'Adding...'
                                : isEditing
                                    ? 'Update Blog'
                                    : 'Create Blog'}
                        </Button>
                    </div>
                </form>
            </div>
            </DialogContent>
        </Dialog>
    )
}

export default BlogFormModal
