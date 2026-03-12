'use client'

import { authFetch } from '@/app/utils/authFetch'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'
import { Button } from '@/ui/shadcn/button'
import Table from '@/ui/shadcn/DataTable'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import { Award, Edit2, Eye, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FileUpload from '../colleges/FileUpload'
import { fetchSkillsCourses } from './action'

export default function SkillsCoursesManager() {
    const { setHeading } = usePageHeading()
    const user = useSelector((state) => state.user.data)
    const author_id = user?.id

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
            content: '',
            location: '',
            course_type: 'online',
            class_time: '',
            start_date: '',
            class_days: '',
            seats_available: ''
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
        setHeading('Short Term Courses')
        loadCourses()
        return () => setHeading(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setHeading])

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

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            thumbnail_image: uploadedFiles.thumbnail_image,
            is_featured: data.is_featured === 'true' || data.is_featured === true,
            price: data.price ? parseFloat(data.price) : 0,
            seats_available: data.seats_available ? parseInt(data.seats_available) : null
        }
        try {
            if (editingId) {
                const res = await authFetch(`${process.env.baseUrl}/skills-based-courses/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedData)
                })
                if (!res.ok) throw new Error('Update failed')
                toast.success('Course updated successfully')
            } else {
                const res = await authFetch(`${process.env.baseUrl}/skills-based-courses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formattedData)
                })
                if (!res.ok) throw new Error('Creation failed')
                toast.success('Course created successfully')
            }
            handleCloseModal()
            loadCourses(pagination.currentPage)
        } catch (err) {
            toast.error(err.message || 'Action failed')
        }
    }

    const handleCloseModal = () => {
        setIsOpen(false)
        setEditing(false)
        setEditingId(null)
        reset()
        setUploadedFiles({ thumbnail_image: '' })
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
        setValue('location', course.location || '')
        setValue('course_type', course.course_type || 'online')
        setValue('class_time', course.class_time || '')
        setValue('start_date', course.start_date || '')
        setValue('class_days', course.class_days || '')
        setValue('seats_available', course.seats_available || '')
        setUploadedFiles({ thumbnail_image: course.thumbnail_image || '' })
    }

    const handleDeleteClick = (id) => {
        setDeleteId(id)
        setIsDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        try {
            await authFetch(`${process.env.baseUrl}/skills-based-courses/${deleteId}`, { method: 'DELETE' })
            toast.success('Course deleted')
            loadCourses(pagination.currentPage)
        } catch (err) {
            toast.error('Delete failed')
        } finally {
            setIsDialogOpen(false)
        }
    }

    const handleSearch = async (query) => {
        setTableLoading(true)
        try {
            const response = await authFetch(`${process.env.baseUrl}/skills-based-courses?q=${query}`)
            const data = await response.json()
            setCourses(data.items || [])
            setPagination({
                currentPage: data.pagination?.currentPage || 1,
                totalPages: data.pagination?.totalPages || 1,
                total: data.pagination?.totalCount || 0
            })
        } catch (error) {
            setCourses([])
        } finally {
            setTableLoading(false)
        }
    }

    const handleSearchInput = (value) => {
        setSearchQuery(value)
        if (searchTimeout) clearTimeout(searchTimeout)
        const timeoutId = setTimeout(() => handleSearch(value), 300)
        setSearchTimeout(timeoutId)
    }

    const columns = useMemo(() => [
        {
            header: 'Course Information',
            accessorKey: 'title',
            cell: ({ row }) => (
                <div className='flex flex-col'>
                    <span className="font-semibold text-gray-900">{row.original.title}</span>
                    <span className='text-[10px] text-gray-400 uppercase font-bold tracking-wider'>{row.original.institution_name || 'Individual'}</span>
                </div>
            )
        },
        {
            header: 'Investment',
            accessorKey: 'price',
            cell: ({ getValue }) => (
                getValue() > 0
                    ? <span className="font-bold text-gray-700">Rs. {parseFloat(getValue()).toLocaleString()}</span>
                    : <span className="text-green-600 font-bold text-xs uppercase">Free</span>
            )
        },
        {
            header: 'Mode',
            accessorKey: 'course_type',
            cell: ({ getValue }) => (
                <span className="capitalize text-xs font-medium text-gray-600 px-2 py-0.5 bg-gray-50 rounded border border-gray-100">{getValue() || 'online'}</span>
            )
        },
        {
            header: 'Featured',
            accessorKey: 'is_featured',
            cell: ({ getValue }) => (
                getValue() ? (
                    <span className="text-[10px] font-bold text-amber-600 uppercase bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center w-fit gap-1">
                        <Award className='w-3 h-3' /> Yes
                    </span>
                ) : <span className="text-[10px] text-gray-400 font-bold uppercase">No</span>
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className='flex items-center gap-2'>
                    <Button variant="ghost" size="icon" onClick={() => { setViewingCourse(row.original); setIsViewModalOpen(true); }} className='w-8 h-8 text-blue-600 hover:bg-blue-50'><Eye className='w-4 h-4' /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)} className='w-8 h-8 text-amber-600 hover:bg-amber-50'><Edit2 className='w-4 h-4' /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(row.original.id)} className='w-8 h-8 text-red-600 hover:bg-red-50'><Trash2 className='w-4 h-4' /></Button>
                </div>
            )
        }
    ], [])

    return (
        <div className='w-full'>
            <ToastContainer />

            <div className='flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-md shadow-sm border mb-4'>
                <div className='flex flex-1 w-full max-w-md'>
                    <SearchInput
                        value={searchQuery}
                        onChange={(e) => handleSearchInput(e.target.value)}
                        placeholder='Search courses...'
                        className='w-full'
                    />
                </div>
                <Button
                    onClick={() => { setIsOpen(true); setEditing(false); reset(); }}
                    className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 h-11 px-6 rounded-md shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Course
                </Button>
            </div>

            <div className="bg-white rounded-md shadow-sm border overflow-hidden">
                <Table
                    loading={tableLoading}
                    data={courses}
                    columns={columns}
                    pagination={pagination}
                    onPageChange={(newPage) => loadCourses(newPage)}
                    showSearch={false}
                />
            </div>

            {/* Modal for Create/Edit */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-md border-none'>
                    <DialogHeader className='px-6 py-4 border-b bg-white sticky top-0 z-10'>
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            {editing ? 'Update Course' : 'Create New Course'}
                        </DialogTitle>
                        <DialogClose onClick={handleCloseModal} />
                    </DialogHeader>

                    <div className='p-6 bg-white'>
                        <form id="course-form" onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    <Label required htmlFor="title">Title</Label>
                                    <Input id="title" {...register('title', { required: true })} placeholder="Course Name" />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="institution_name">Institution</Label>
                                    <Input id="institution_name" {...register('institution_name')} placeholder="Institution Name" />
                                </div>
                                <div className='space-y-2'>
                                    <Label required htmlFor="price">Price (Rs.)</Label>
                                    <Input id="price" type="number" {...register('price')} placeholder="0 for Free" />
                                </div>
                                <div className='space-y-2'>
                                    <Label required htmlFor="duration">Duration</Label>
                                    <Input id="duration" {...register('duration')} placeholder="e.g. 1 Month" />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="course_type">Mode</Label>
                                    <select id="course_type" {...register('course_type')} className='w-full h-10 px-3 rounded-md border border-gray-200 text-sm'>
                                        <option value="online">Online</option>
                                        <option value="offline">Offline</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" {...register('location')} placeholder="e.g. Kathmandu" />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="class_time">Class Time</Label>
                                    <Input id="class_time" {...register('class_time')} placeholder="e.g. 7 AM - 9 AM" />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="start_date">Start Date</Label>
                                    <Input id="start_date" type="date" {...register('start_date')} />
                                </div>
                                <div className='space-y-2'>
                                    <Label htmlFor="seats_available">Seats</Label>
                                    <Input id="seats_available" type="number" {...register('seats_available')} />
                                </div>
                                <div className='flex items-center gap-4 pt-8'>
                                    <Label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" {...register('is_featured')} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                                        <span className="text-sm font-medium">Featured Course</span>
                                    </Label>
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label required htmlFor="description">Short Description</Label>
                                <Textarea id="description" {...register('description', { required: true })} placeholder="One-line summary" className="min-h-[80px]" />
                            </div>

                            <div className='space-y-2'>
                                <Label required>Detailed Content</Label>
                                <Controller
                                    name='content'
                                    control={control}
                                    render={({ field }) => <TipTapEditor value={field.value} onChange={field.onChange} />}
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label>Thumbnail Image</Label>
                                <FileUpload
                                    label=''
                                    defaultPreview={uploadedFiles.thumbnail_image}
                                    onUploadComplete={(url) => {
                                        setUploadedFiles((prev) => ({ ...prev, thumbnail_image: url }))
                                        setValue('thumbnail_image', url)
                                    }}
                                />
                            </div>
                        </form>
                    </div>

                    <div className='p-4 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0 z-10'>
                        <Button variant="ghost" onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" form="course-form" disabled={isSubmitting} className="bg-[#387cae] text-white">
                            {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className='max-w-xl'>
                    <DialogHeader>
                        <DialogTitle>Course Details</DialogTitle>
                        <DialogClose />
                    </DialogHeader>
                    {viewingCourse && (
                        <div className='space-y-4 text-sm'>
                            {viewingCourse.thumbnail_image && <img src={viewingCourse.thumbnail_image} alt="" className='w-full h-40 object-cover rounded-md border' />}
                            <div className='grid grid-cols-2 gap-4'>
                                <div><p className='font-bold text-gray-400 uppercase text-[10px]'>Title</p><p className='font-bold'>{viewingCourse.title}</p></div>
                                <div><p className='font-bold text-gray-400 uppercase text-[10px]'>Price</p><p className='font-bold text-green-600'>{viewingCourse.price ? `Rs. ${viewingCourse.price}` : 'Free'}</p></div>
                                <div><p className='font-bold text-gray-400 uppercase text-[10px]'>Duration</p><p>{viewingCourse.duration}</p></div>
                                <div><p className='font-bold text-gray-400 uppercase text-[10px]'>Mode</p><p className='capitalize'>{viewingCourse.course_type}</p></div>
                            </div>
                            <div><p className='font-bold text-gray-400 uppercase text-[10px]'>Description</p><p>{viewingCourse.description}</p></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title='Delete Course'
                message='Are you sure?'
            />
        </div>
    )
}
