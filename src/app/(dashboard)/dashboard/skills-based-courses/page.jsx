'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import DOMPurify from 'dompurify'
import { fetchSkillsCourses } from './action'
import Loader from '../../../../ui/molecules/Loading'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSelector } from 'react-redux'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import FileUpload from '../addCollege/FileUpload'
import { Label } from '@/ui/shadcn/label'
import { Input } from '@/ui/shadcn/input'
import { formatDate } from '@/utils/date.util'
import { Select } from '@/ui/shadcn/select'
import SearchInput from '@/ui/molecules/SearchInput'

export default function SkillsCoursesManager() {
    const { setHeading } = usePageHeading()
    const author_id = useSelector((state) => state.user.data.id)

    // Initialize react-hook-form
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
            thumbnail_image: '',
            price: '',
            duration: '',
            is_featured: false,
            is_featured: false,
            author: author_id,
            institution_name: '',
            content: ''
        }
    })

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
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

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title'
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: ({ getValue }) => getValue() ? `Rs. ${parseFloat(getValue()).toLocaleString()}` : 'Free'
            },
            {
                header: 'Duration',
                accessorKey: 'duration',
                cell: ({ getValue }) => getValue() || 'Flexible'
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
                cell: ({ getValue }) => formatDate(getValue())
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className='flex gap-2'>
                        <button
                            onClick={() => handleView(row.original)}
                            className='p-1 text-gray-600 hover:text-gray-900'
                            title="View Details"
                        >
                            <Eye className='w-4 h-4' />
                        </button>
                        <button
                            onClick={() => handleEdit(row.original)}
                            className='p-1 text-blue-600 hover:text-blue-800'
                            title="Edit"
                        >
                            <Edit2 className='w-4 h-4' />
                        </button>
                        <button
                            onClick={() => handleDeleteClick(row.original.id)}
                            className='p-1 text-red-600 hover:text-red-800'
                            title="Delete"
                        >
                            <Trash2 className='w-4 h-4' />
                        </button>
                    </div>
                )
            }
        ],
        []
    )

    useEffect(() => {
        setHeading('Skills-Based Courses Management')
        loadCourses()
        return () => setHeading(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeading])

    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout)
            }
        }
    }, [searchTimeout])

    const loadCourses = async (page = 1) => {
        try {
            const response = await fetchSkillsCourses(page)
            setCourses(response.items)
            setPagination({
                currentPage: response.pagination.currentPage,
                totalPages: response.pagination.totalPages,
                total: response.pagination.totalCount
            })
        } catch (err) {
            toast.error('Failed to load courses')
            console.error('Error loading courses:', err)
        } finally {
            setLoading(false)
        }
    }

    const createCourse = async (data) => {
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/skills-based-courses`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message)
            }
            return await response.json()
        } catch (error) {
            console.error('Error creating course:', error)
            throw error
        }
    }

    const updateCourse = async (data, id) => {
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/skills-based-courses/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
            if (!response.ok) {
                throw new Error('Failed to update course')
            }
            return await response.json()
        } catch (error) {
            console.error('Error updating course:', error)
            throw error
        }
    }

    // Use react-hook-form's handleSubmit to process the form data.
    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            thumbnail_image: uploadedFiles.thumbnail_image,
            is_featured: data.is_featured === 'true' || data.is_featured === true,
            price: data.price ? parseFloat(data.price) : 0
        }
        try {
            if (editingId) {
                // Update course if in edit mode
                await updateCourse(formattedData, editingId)
                toast.success('Course updated successfully')
            } else {
                // Otherwise, create a new course
                await createCourse(formattedData)
                toast.success('Course created successfully')
            }
            reset() // Clear form
            setEditingId(null)
            setEditing(false)
            setIsOpen(false)
            setUploadedFiles({ thumbnail_image: '' })
            loadCourses()
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Network error occurred'
            toast.error(
                `Failed to ${editingId ? 'update' : 'create'} course: ${errorMsg}`
            )
            console.error('Error saving course:', err)
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
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            const res = await response.json()
            toast.success(res.message)
            loadCourses()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setIsDialogOpen(false)
            setDeleteId(null)
        }
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setDeleteId(null)
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
                console.error('Error fetching results:', response.statusText)
                setCourses([])
            }
        } catch (error) {
            console.error('Error fetching course search results:', error.message)
            setCourses([])
        }
    }

    const handleSearchInput = (value) => {
        setSearchQuery(value)

        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }

        if (value === '') {
            handleSearch('')
        } else {
            const timeoutId = setTimeout(() => {
                handleSearch(value)
            }, 300)
            setSearchTimeout(timeoutId)
        }
    }

    if (loading)
        return (
            <div className='mx-auto'>
                <Loader />
            </div>
        )

    return (
        <>

            <div className='p-4 w-full'>
                <div className='flex justify-between items-center mb-4'>
                    {/* Search Bar */}
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder='Search skill based courses...'
                        className='max-w-md'
                    />
                    {/* Button */}
                    <div className='flex gap-2'>
                        <Button
                            onClick={() => {
                                setIsOpen(true)
                                setEditing(false)
                                setEditingId(null)
                                reset()
                                setUploadedFiles({ thumbnail_image: '' })
                            }}
                        >
                            Add Skill Based Course
                        </Button>
                    </div>
                </div>
                <ToastContainer />

                <Dialog
                    isOpen={isOpen}
                    onClose={() => {
                        setIsOpen(false)
                        setEditing(false)
                        setEditingId(null)
                        reset()
                        setUploadedFiles({ thumbnail_image: '' })
                    }}
                    className='max-w-2xl'
                >
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Skill Based Course' : 'Add Skill Based Course'}</DialogTitle>
                        <DialogClose onClick={() => {
                            setIsOpen(false)
                            setEditing(false)
                            setEditingId(null)
                            reset()
                            setUploadedFiles({ thumbnail_image: '' })
                        }} />
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
                                                Title <span className='text-red-500'>*</span>
                                            </Label>
                                            <Input
                                                type='text'
                                                placeholder='Course Title'
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
                                            <Label>Institution Name</Label>
                                            <Input
                                                type='text'
                                                placeholder='Institution/Provider Name'
                                                {...register('institution_name')}
                                                className='w-full p-2 border rounded'
                                            />
                                        </div>
                                        <div>
                                            <Label>Price (Rs.)</Label>
                                            <Input
                                                type='number'
                                                step='0.01'
                                                placeholder='0 for Free'
                                                {...register('price')}
                                                className='w-full p-2 border rounded'
                                            />
                                        </div>
                                        <div>
                                            <Label>Duration</Label>
                                            <Input
                                                type='text'
                                                placeholder='e.g., 3 months, 6 weeks'
                                                {...register('duration')}
                                                className='w-full p-2 border rounded'
                                            />
                                        </div>

                                        <div>
                                            <Label>Featured</Label>
                                            <Select
                                                {...register('is_featured')}
                                                className='w-full p-2 border rounded'
                                            >
                                                <option value={false}>No</option>
                                                <option value={true}>Yes</option>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <textarea
                                                placeholder='Course Description'
                                                {...register('description')}
                                                className='w-full p-2 border rounded min-h-[100px]'
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <Label>Detailed Content</Label>
                                            <Controller
                                                name='content'
                                                control={control}
                                                render={({ field }) => (
                                                    <TipTapEditor
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder='Enter detailed course content, curriculum, etc.'
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <Label>Thumbnail Image (Optional)</Label>
                                            <FileUpload
                                                defaultPreview={uploadedFiles.thumbnail_image}
                                                onUploadComplete={(url) => {
                                                    setUploadedFiles((prev) => ({
                                                        ...prev,
                                                        thumbnail_image: url
                                                    }))
                                                    setValue('thumbnail_image', url)
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
                                    onClick={() => {
                                        setIsOpen(false)
                                        setEditing(false)
                                        setEditingId(null)
                                        reset()
                                        setUploadedFiles({ thumbnail_image: '' })
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type='submit'>
                                    {editing ? 'Update Course' : 'Create Course'}
                                </Button>
                            </div>
                        </form>
                    </div>
                    </DialogContent>
                </Dialog>

                {/* Table */}
                <div className='mt-8'>
                    <Table
                        data={courses}
                        columns={columns}
                        pagination={pagination}
                        onPageChange={(newPage) => loadCourses(newPage)}
                        onSearch={handleSearch}
                        showSearch={false}
                    />
                </div>
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
                <DialogHeader>
                    <DialogTitle>Course Details</DialogTitle>
                    <DialogClose onClick={() => {
                        setIsViewModalOpen(false)
                        setViewingCourse(null)
                    }} />
                </DialogHeader>
                <DialogContent>
                <div className="p-6 space-y-6">
                    {/* Thumbnail Image */}
                    {viewingCourse?.thumbnail_image && (
                        <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-6 border border-gray-200">
                            <img
                                src={viewingCourse.thumbnail_image}
                                alt={viewingCourse.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Title</h3>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{viewingCourse?.title}</p>
                        </div>

                        {viewingCourse?.institution_name && (
                            <div className="md:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Institution Name</h3>
                                <p className="mt-1 text-gray-900 font-medium">{viewingCourse.institution_name}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Price</h3>
                            <p className="mt-1 text-gray-900 font-semibold">
                                {viewingCourse?.price ? `Rs. ${parseFloat(viewingCourse.price).toLocaleString()}` : 'Free'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                            <p className="mt-1 text-gray-900">{viewingCourse?.duration || 'Flexible'}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Featured</h3>
                            <span
                                className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${viewingCourse?.is_featured
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                {viewingCourse?.is_featured ? 'Yes' : 'No'}
                            </span>
                        </div>



                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Description</h3>
                            <div className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {viewingCourse?.description || "No description provided."}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Detailed Content</h3>
                            <div 
                                className="mt-1 prose prose-sm max-w-none text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[200px]"
                                dangerouslySetInnerHTML={{ 
                                    __html: viewingCourse?.content ? DOMPurify.sanitize(viewingCourse.content) : "No content provided." 
                                }}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                            <p className="mt-1 text-gray-900">{viewingCourse?.createdAt ? formatDate(viewingCourse.createdAt) : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t mt-6">
                        <Button onClick={() => setIsViewModalOpen(false)}>
                            Close
                        </Button>
                    </div>
                </div>
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                onConfirm={handleDeleteConfirm}
                title='Confirm Deletion'
                message='Are you sure you want to delete this course? This action cannot be undone.'
            />
        </>
    )
}
