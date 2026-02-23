'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import DOMPurify from 'dompurify'
import { fetchSkillsCourses } from './action'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Eye, Plus } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import FileUpload from '../addCollege/FileUpload'
import { Label } from '@/ui/shadcn/label'
import { Input } from '@/ui/shadcn/input'
import { Textarea } from '@/ui/shadcn/textarea'
import { formatDate } from '@/utils/date.util'
import SearchInput from '@/ui/molecules/SearchInput'

export default function SkillsCoursesManager() {
    const { setHeading } = usePageHeading()
    const author_id = useSelector((state) => state.user.data?.id)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            thumbnail_image: '',
            price: '',
            duration: '',
            is_featured: false,
            author: author_id,
            institution_name: '',
            content: ''
        }
    })

    const [courses, setCourses] = useState([])
    const [tableLoading, setTableLoading] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [editing, setEditing] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // View Modal State
    const [viewingCourse, setViewingCourse] = useState(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [uploadedFiles, setUploadedFiles] = useState({
        thumbnail_image: ''
    })

    useEffect(() => {
        setHeading('Skills-Based Courses')
        loadCourses()
        return () => setHeading(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeading])

    useEffect(() => {
        return () => {
            if (searchTimeout) clearTimeout(searchTimeout)
        }
    }, [searchTimeout])

    const loadCourses = async (page = 1) => {
        try {
            setTableLoading(true)
            const response = await fetchSkillsCourses(page)
            setCourses(response.items)
            setPagination({
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                total: response.pagination.totalCount
            })
        } catch (err) {
            toast.error('Failed to load courses')
        } finally {
            setTableLoading(false)
        }
    }

    const createCourse = async (data) => {
        const response = await authFetch(
            `${process.env.baseUrl}/skills-based-courses`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        )
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to create course')
        }
        return await response.json()
    }

    const updateCourse = async (data, id) => {
        const response = await authFetch(
            `${process.env.baseUrl}/skills-based-courses/${id}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        )
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to update course')
        }
        return await response.json()
    }

    const handleCloseModal = () => {
        setIsOpen(false)
        setEditing(false)
        setEditingId(null)
        reset()
        setUploadedFiles({ thumbnail_image: '' })
    }

    const handleAddClick = () => {
        setIsOpen(true)
        setEditing(false)
        setEditingId(null)
        reset()
        setUploadedFiles({ thumbnail_image: '' })
    }

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            thumbnail_image: uploadedFiles.thumbnail_image,
            is_featured: data.is_featured === 'true' || data.is_featured === true,
            price: data.price ? parseFloat(data.price) : 0
        }
        try {
            if (editingId) {
                await updateCourse(formattedData, editingId)
                toast.success('Course updated successfully')
            } else {
                await createCourse(formattedData)
                toast.success('Course created successfully')
            }
            handleCloseModal()
            loadCourses(pagination.currentPage)
        } catch (err) {
            toast.error(err.message || `Failed to ${editingId ? 'update' : 'create'} course`)
        }
    }

    const handleView = (course) => {
        setViewingCourse(course)
        setIsViewModalOpen(true)
    }

    const handleEdit = (course) => {
        setEditingId(course.id)
        setEditing(true)
        setIsOpen(true)
        setValue('title', course.title)
        setValue('description', course.description || '')
        setValue('thumbnail_image', course.thumbnail_image || '')
        setValue('price', course.price || '')
        setValue('duration', course.duration || '')
        setValue('is_featured', course.is_featured || false)
        setValue('institution_name', course.institution_name || '')
        setValue('content', course.content || '')
        setUploadedFiles({ thumbnail_image: course.thumbnail_image || '' })
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id)
        setIsDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteId) return
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/skills-based-courses/${deleteId}`,
                { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
            )
            const res = await response.json()
            toast.success(res.message || 'Course deleted successfully')
            loadCourses(pagination.currentPage)
        } catch (err) {
            toast.error(err.message || 'Failed to delete course')
        } finally {
            setIsDialogOpen(false)
            setDeleteId(null)
        }
    }

    const handleSearch = async (query) => {
        if (!query) {
            loadCourses()
            return
        }
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/skills-based-courses?q=${query}`
            )
            if (response.ok) {
                const data = await response.json()
                setCourses(data.items)
                if (data.pagination) {
                    setPagination({
                        currentPage: data.pagination.currentPage,
                        totalPages: data.pagination.totalPages,
                        total: data.pagination.totalCount
                    })
                }
            } else {
                setCourses([])
            }
        } catch (error) {
            setCourses([])
        }
    }

    const handleSearchInput = (value) => {
        setSearchQuery(value)
        if (searchTimeout) clearTimeout(searchTimeout)
        if (value === '') {
            handleSearch('')
        } else {
            const timeoutId = setTimeout(() => handleSearch(value), 300)
            setSearchTimeout(timeoutId)
        }
    }

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: ({ row }) => (
                    <span className="font-medium text-gray-900">{row.original.title}</span>
                )
            },
            {
                header: 'Institution',
                accessorKey: 'institution_name',
                cell: ({ getValue }) => (
                    <span className="text-gray-600 text-sm">{getValue() || <span className="text-gray-400 italic">N/A</span>}</span>
                )
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: ({ getValue }) => (
                    getValue()
                        ? <span className="font-medium text-gray-800">Rs. {parseFloat(getValue()).toLocaleString()}</span>
                        : <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">Free</span>
                )
            },
            {
                header: 'Duration',
                accessorKey: 'duration',
                cell: ({ getValue }) => (
                    <span className="text-gray-600 text-sm">{getValue() || 'Flexible'}</span>
                )
            },
            {
                header: 'Featured',
                accessorKey: 'is_featured',
                cell: ({ getValue }) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getValue()
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {getValue() ? 'Yes' : 'No'}
                    </span>
                )
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: ({ getValue }) => (
                    <span className="text-gray-500 text-sm">{formatDate(getValue())}</span>
                )
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className='flex gap-1'>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(row.original)}
                            className='hover:bg-blue-50 text-blue-600'
                            title="View Details"
                        >
                            <Eye className='w-4 h-4' />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(row.original)}
                            className='hover:bg-amber-50 text-amber-600'
                            title="Edit"
                        >
                            <Edit2 className='w-4 h-4' />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(row.original.id)}
                            className='hover:bg-red-50 text-red-600'
                            title="Delete"
                        >
                            <Trash2 className='w-4 h-4' />
                        </Button>
                    </div>
                )
            }
        ],
        []
    )

    return (
        <div className='w-full space-y-4 p-4'>
            <ToastContainer />

            {/* Header */}
            <div className='sticky top-0 z-30 bg-[#F7F8FA] py-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder='Search skill-based courses...'
                        className='max-w-md w-full'
                    />
                    <Button onClick={handleAddClick} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        Add Course
                    </Button>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <Dialog
                isOpen={isOpen}
                onClose={handleCloseModal}
                className='max-w-3xl'
            >
                <DialogContent className='max-w-3xl max-h-[90vh] flex flex-col p-0'>
                    <DialogHeader className='px-6 py-4 border-b'>
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            {editing ? 'Edit Skill-Based Course' : 'Add Skill-Based Course'}
                        </DialogTitle>
                        <DialogClose onClick={handleCloseModal} />
                    </DialogHeader>

                    <div className='flex-1 overflow-y-auto p-6'>
                        <form id="skills-course-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

                            {/* Course Details */}
                            <section className="space-y-5">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Course Details</h3>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                    {/* Title */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="title" required>Title</Label>
                                        <Input
                                            id="title"
                                            placeholder='e.g. Advanced React Development'
                                            {...register('title', {
                                                required: 'Title is required',
                                                minLength: { value: 3, message: 'Title must be at least 3 characters' }
                                            })}
                                            className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                                        />
                                        {errors.title && (
                                            <p className='text-xs text-destructive mt-1'>{errors.title.message}</p>
                                        )}
                                    </div>

                                    {/* Institution */}
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="institution_name">Institution / Provider</Label>
                                        <Input
                                            id="institution_name"
                                            placeholder='e.g. Coursera, Udemy, Local College'
                                            {...register('institution_name', {
                                                maxLength: { value: 200, message: 'Max 200 characters allowed' }
                                            })}
                                            className={errors.institution_name ? 'border-destructive focus-visible:ring-destructive' : ''}
                                        />
                                        {errors.institution_name && (
                                            <p className='text-xs text-destructive mt-1'>{errors.institution_name.message}</p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (Rs.)</Label>
                                        <Input
                                            id="price"
                                            type='number'
                                            step='0.01'
                                            min='0'
                                            placeholder='0 = Free'
                                            {...register('price', {
                                                min: { value: 0, message: 'Price cannot be negative' },
                                                validate: (v) =>
                                                    v === '' || v === null || !isNaN(parseFloat(v)) || 'Enter a valid price'
                                            })}
                                            className={errors.price ? 'border-destructive focus-visible:ring-destructive' : ''}
                                        />
                                        {errors.price && (
                                            <p className='text-xs text-destructive mt-1'>{errors.price.message}</p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration</Label>
                                        <Input
                                            id="duration"
                                            placeholder='e.g. 3 months, 6 weeks'
                                            {...register('duration', {
                                                maxLength: { value: 100, message: 'Max 100 characters' }
                                            })}
                                            className={errors.duration ? 'border-destructive focus-visible:ring-destructive' : ''}
                                        />
                                        {errors.duration && (
                                            <p className='text-xs text-destructive mt-1'>{errors.duration.message}</p>
                                        )}
                                    </div>

                                    {/* Featured */}
                                    <div className="space-y-2">
                                        <Label htmlFor="is_featured">Featured</Label>
                                        <select
                                            id="is_featured"
                                            {...register('is_featured')}
                                            className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387cae] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Description & Content */}
                            <section className="space-y-5">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Content</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Short Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder='Brief summary of the course...'
                                        {...register('description', {
                                            maxLength: { value: 1000, message: 'Description must be 1000 characters or fewer' }
                                        })}
                                        rows={3}
                                        className={`resize-none ${errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                    />
                                    {errors.description && (
                                        <p className='text-xs text-destructive mt-1'>{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Detailed Content</Label>
                                    <Controller
                                        name='content'
                                        control={control}
                                        render={({ field }) => (
                                            <TipTapEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder='Enter curriculum, modules, requirements...'
                                            />
                                        )}
                                    />
                                </div>
                            </section>

                            {/* Media */}
                            <section className="space-y-4">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Media</h3>
                                <div className="space-y-2">
                                    <Label>
                                        Thumbnail Image{' '}
                                        <span className='text-gray-400 font-normal text-sm'>(Optional)</span>
                                    </Label>
                                    <FileUpload
                                        label=''
                                        defaultPreview={uploadedFiles.thumbnail_image}
                                        onUploadComplete={(url) => {
                                            setUploadedFiles((prev) => ({ ...prev, thumbnail_image: url }))
                                            setValue('thumbnail_image', url)
                                        }}
                                    />
                                </div>
                            </section>

                        </form>
                    </div>

                    {/* Sticky Footer */}
                    <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            form="skills-course-form"
                            disabled={isSubmitting}
                            className='bg-[#387cae] hover:bg-[#387cae]/90 text-white'
                        >
                            {isSubmitting
                                ? 'Processing...'
                                : editing
                                    ? 'Update Course'
                                    : 'Create Course'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table
                    data={courses}
                    columns={columns}
                    pagination={pagination}
                    onPageChange={(newPage) => loadCourses(newPage)}
                    showSearch={false}
                    loading={tableLoading}
                />
            </div>

            {/* View Modal */}
            <Dialog
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false)
                    setViewingCourse(null)
                }}
                className="max-w-2xl"
            >
                <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0'>
                    <DialogHeader className='px-6 py-4 border-b'>
                        <DialogTitle className="text-lg font-semibold text-gray-900">Course Details</DialogTitle>
                        <DialogClose onClick={() => {
                            setIsViewModalOpen(false)
                            setViewingCourse(null)
                        }} />
                    </DialogHeader>

                    <div className='flex-1 overflow-y-auto p-6 space-y-6'>
                        {/* Thumbnail */}
                        {viewingCourse?.thumbnail_image && (
                            <div className="w-full h-56 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                    src={viewingCourse.thumbnail_image}
                                    alt={viewingCourse.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Title</p>
                            <p className="text-xl font-bold text-gray-900">{viewingCourse?.title}</p>
                        </div>

                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {viewingCourse?.institution_name && (
                                <div className="col-span-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Institution</p>
                                    <p className="text-gray-800 font-medium">{viewingCourse.institution_name}</p>
                                </div>
                            )}
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Price</p>
                                <p className="text-gray-800 font-semibold">
                                    {viewingCourse?.price
                                        ? `Rs. ${parseFloat(viewingCourse.price).toLocaleString()}`
                                        : <span className="text-green-600">Free</span>}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Duration</p>
                                <p className="text-gray-800">{viewingCourse?.duration || 'Flexible'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Featured</p>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${viewingCourse?.is_featured
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {viewingCourse?.is_featured ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Created</p>
                                <p className="text-gray-800 text-sm">{viewingCourse?.createdAt ? formatDate(viewingCourse.createdAt) : 'N/A'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        {viewingCourse?.description && (
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Description</p>
                                <div className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed">
                                    {viewingCourse.description}
                                </div>
                            </div>
                        )}

                        {/* Detailed Content */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Detailed Content</p>
                            <div
                                className="prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[120px]"
                                dangerouslySetInnerHTML={{
                                    __html: viewingCourse?.content
                                        ? DOMPurify.sanitize(viewingCourse.content)
                                        : '<p class="text-gray-400 italic">No content provided.</p>'
                                }}
                            />
                        </div>
                    </div>

                    <div className='px-6 py-4 border-t flex justify-end'>
                        <Button variant='outline' onClick={() => setIsViewModalOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmationDialog
                open={isDialogOpen}
                onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
                onConfirm={handleDeleteConfirm}
                title='Confirm Deletion'
                message='Are you sure you want to delete this course? This action cannot be undone.'
                confirmText='Delete'
                cancelText='Cancel'
            />
        </div>
    )
}
