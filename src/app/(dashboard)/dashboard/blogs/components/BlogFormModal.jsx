import { authFetch } from '@/app/utils/authFetch'
import { Button } from '@/ui/shadcn/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import axios from 'axios'
import { Image as ImageIcon, Info, Layers, Loader2, Settings } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import FileUpload from '../../addCollege/FileUpload'
import { Textarea } from '@/ui/shadcn/textarea'

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#387cae]/10 flex items-center justify-center text-[#387cae] shadow-sm border border-[#387cae]/20">
            <Icon size={20} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5 font-medium">{subtitle}</p>}
        </div>
    </div>
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
        featured_image: '',
        pdf_file: ''
    })
    const [selectedTags, setSelectedTags] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)

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
            featured_image: '',
            pdf_file: '',
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
                reset({
                    title: initialData.title || '',
                    category: initialData.category?.id || initialData.category || '',
                    description: initialData.description || '',
                    content: initialData.content || '',
                    status: initialData.status || 'draft',
                    visibility: initialData.visibility || 'private',
                    is_featured: initialData.is_featured || false
                })
                setUploadedFiles({
                    featured_image: initialData.featured_image || '',
                    pdf_file: initialData.pdf_file || ''
                })
                setValue('featured_image', initialData.featured_image || '')
                setValue('pdf_file', initialData.pdf_file || '')

                let blogTags = initialData.tags || []
                if (typeof blogTags === 'string') {
                    try {
                        blogTags = JSON.parse(blogTags)
                    } catch (e) {
                        blogTags = []
                    }
                }

                if (Array.isArray(blogTags)) {
                    setSelectedTags(blogTags)
                    setValue('tags', blogTags.map(t => typeof t === 'object' ? t.id : t))
                } else {
                    setSelectedTags([])
                    setValue('tags', [])
                }

                // Handle Category Initialization
                if (initialData.category) {
                    const cat = typeof initialData.category === 'object'
                        ? initialData.category
                        : categories.find(c => c.id === initialData.category || c.id === parseInt(initialData.category))

                    if (cat) {
                        setSelectedCategory(cat)
                        setValue('category', cat.id)
                    }
                } else {
                    setSelectedCategory(null)
                }

            } else {
                reset({
                    title: '',
                    category: '',
                    tags: [],
                    featured_image: '',
                    pdf_file: '',
                    description: '',
                    content: '',
                    status: 'draft',
                    visibility: 'private',
                    is_featured: false
                })
                setUploadedFiles({ featured_image: '', pdf_file: '' })
                setSelectedTags([])
                setSelectedCategory(null)
            }
        }
    }, [isOpen, isEditing, initialData, reset, setValue])

    const onSearchTags = async (query) => {
        try {
            const url = query ? `${process.env.baseUrl}/tag?q=${query}` : `${process.env.baseUrl}/tag`
            const response = await authFetch(url)
            const data = await response.json()
            return data.items || []
        } catch (error) {
            console.error('Tags Search Error:', error)
            return []
        }
    }

    const onCreateTag = async (title) => {
        try {
            const response = await authFetch(`${process.env.baseUrl}/tag`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author: authors?.[0]?.id || 1 })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success('Tag created successfully')
                return data.tag || data.item || data
            }
            throw new Error(data.message || 'Failed to create tag')
        } catch (error) {
            toast.error(error.message)
            return null
        }
    }

    const onSearchCategories = async (query) => {
        try {
            const url = query ? `${process.env.baseUrl}/category?q=${query}&type=BLOG` : `${process.env.baseUrl}/category?type=BLOG`
            const response = await authFetch(url)
            const data = await response.json()
            return data.items || []
        } catch (error) {
            console.error('Categories Search Error:', error)
            return []
        }
    }


    const handleSelectCategory = (category) => {
        setSelectedCategory(category)
        setValue('category', category.id)
    }

    const handleRemoveCategory = () => {
        setSelectedCategory(null)
        setValue('category', '')
    }

    const handleSelectTag = (tag) => {
        const isSelected = selectedTags.some((t) => (t.id || t) === (tag.id || tag))
        if (!isSelected) {
            const newTags = [...selectedTags, tag]
            setSelectedTags(newTags)
            setValue('tags', newTags.map((t) => t.id || t))
        }
    }

    const handleRemoveTag = (tag) => {
        const newTags = selectedTags.filter((t) => (t.id || t) !== (tag.id || tag))
        setSelectedTags(newTags)
        setValue('tags', newTags.map((t) => t.id || t))
    }

    const onMediaUpload = async (file) => {
        const formData = new FormData()
        formData.append('title', file.name)
        formData.append('altText', file.name)
        formData.append('description', '')
        formData.append('file', file)
        formData.append('authorId', '1')

        try {
            const response = await axios.post(
                `${process.env.mediaUrl}${process.env.version}/media/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            return response.data?.media?.url
        } catch (error) {
            console.error('Image upload failed:', error)
            toast.error('Failed to upload image')
            throw error
        }
    }

    const onSubmitForm = (data) => {
        const finalData = {
            ...data,
            tags: selectedTags,
            featured_image: uploadedFiles.featured_image,
            pdf_file: uploadedFiles.pdf_file
        }
        onSave(finalData)
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} className='max-w-6xl'>
            <DialogHeader className="bg-white border-b border-gray-100 p-6">
                <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="text-[#387cae]" size={24} />
                    {isEditing ? 'Edit Blog' : 'Create New Blog Post'}
                </DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent className="p-0 bg-gray-50/50">
                <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    className='flex flex-col max-h-[calc(100vh-120px)]'
                >
                    <div className='flex-1 p-8 overflow-y-auto'>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-6">
                            {/* Left Column - Main Content (8/12) */}
                            <div className="lg:col-span-8 space-y-8">
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={Info} title="Blog Content" subtitle="Detailed information about your post" />
                                    <div className='space-y-6'>
                                        <div>
                                            <Label required={true} htmlFor='title'>Post Title</Label>
                                            <Input
                                                id='title'
                                                placeholder='Enter post title...'
                                                className="h-12 text-base rounded-xl border-gray-200"
                                                {...register('title', { required: 'Title is required' })}
                                            />
                                            {errors.title && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.title.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <Label required={true} htmlFor='category'>Category</Label>
                                                <SearchSelectCreate
                                                    onSearch={onSearchCategories}
                                                    onSelect={handleSelectCategory}
                                                    onRemove={handleRemoveCategory}
                                                    selectedItems={selectedCategory}
                                                    placeholder="Select or create category..."
                                                    createLabel="Create category"
                                                    displayKey="title"
                                                    valueKey="id"
                                                    isMulti={false}
                                                    allowCreate={false}
                                                />
                                                {errors.category && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.category.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="text-gray-700 font-semibold mb-1.5 block text-sm">Tags</Label>
                                                <SearchSelectCreate
                                                    onSearch={onSearchTags}
                                                    onCreate={onCreateTag}
                                                    onSelect={handleSelectTag}
                                                    onRemove={handleRemoveTag}
                                                    selectedItems={selectedTags}
                                                    placeholder="Search or create tags..."
                                                    createLabel="Create tag"
                                                    displayKey="title"
                                                    valueKey="id"
                                                    allowCreate={true}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor='description' className="text-gray-700 font-semibold mb-1.5 block text-sm">Short Description</Label>
                                            <Textarea
                                                id='description'
                                                placeholder='Enter a brief summary...'
                                                {...register('description')}
                                                className='flex min-h-[80px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#387cae]/5 focus:border-[#387cae] transition-all resize-none'
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <Label className="text-gray-700 font-semibold mb-2.5 block text-sm">Main Content Body</Label>
                                            <TipTapEditor
                                                onMediaUpload={onMediaUpload}
                                                showImageUpload={true}
                                                value={getValues('content')}
                                                onChange={(data) => setValue('content', data)}
                                                placeholder='Start writing your story here...'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Media & Settings (4/12) */}
                            <div className="lg:col-span-4 space-y-8">

                                {/* Featured Image Section */}
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={ImageIcon} title="Featured Media" subtitle="Image & PDF Uploads" />
                                    <div className="space-y-6">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Featured Post Image</Label>
                                            <FileUpload
                                                label=''
                                                onUploadComplete={(url) => {
                                                    setUploadedFiles(prev => ({ ...prev, featured_image: url }))
                                                    setValue('featured_image', url)
                                                }}
                                                defaultPreview={uploadedFiles.featured_image}
                                            />
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Attachment (PDF)</Label>
                                            <FileUpload
                                                label=''
                                                accept='application/pdf'
                                                onUploadComplete={(url) => {
                                                    setUploadedFiles(prev => ({ ...prev, pdf_file: url }))
                                                    setValue('pdf_file', url)
                                                }}
                                                defaultPreview={uploadedFiles.pdf_file}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Publishing Options */}
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={Settings} title="Publishing" subtitle="Visibility settings" />
                                    <div className='space-y-6'>
                                        <div>
                                            <Label htmlFor='status' className="text-gray-700 font-semibold mb-1.5 block text-sm">Post Status</Label>
                                            <select
                                                id='status'
                                                {...register('status')}
                                                className='flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[#387cae]/5 focus:border-[#387cae] transition-all'
                                            >
                                                <option value='draft'>Draft</option>
                                                <option value='published'>Published</option>
                                                <option value='archived'>Archived</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-[#387cae]/5 rounded-xl border border-[#387cae]/10">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="is_featured"
                                                    {...register('is_featured')}
                                                    className="w-5 h-5 rounded border-gray-300 text-[#387cae] focus:ring-[#387cae]"
                                                />
                                                <Label htmlFor="is_featured" className="text-sm font-bold text-[#387cae] cursor-pointer">
                                                    Mark as Featured
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3 z-10'>
                        <Button
                            type='button'
                            onClick={onClose}
                            variant='outline'
                            className="rounded-xl px-6 h-11 font-semibold text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={submitting}
                            className="rounded-xl min-w-[140px] h-11 font-bold shadow-lg shadow-[#387cae]/20 bg-[#387cae] hover:bg-[#387cae]/90 active:scale-95 transition-all text-white flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>
                                {submitting
                                    ? (isEditing ? 'Syncing...' : 'Submitting...')
                                    : (isEditing ? 'Update Post' : 'Create Post')}
                            </span>
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default BlogFormModal
