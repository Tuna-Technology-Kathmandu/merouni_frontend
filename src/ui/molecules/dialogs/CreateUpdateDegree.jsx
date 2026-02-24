'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import FileUpload from '@/app/(dashboard)/dashboard/colleges/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'

export default function CreateUpdateDegree({
    isOpen,
    onClose,
    onSuccess,
    initialData = null
}) {
    const [submitting, setSubmitting] = useState(false)
    const [selectedDisciplines, setSelectedDisciplines] = useState([])
    const [disciplineError, setDisciplineError] = useState('')
    const [content, setContent] = useState('')
    const [uploadedImage, setUploadedImage] = useState('')

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
            short_name: '',
            title: '',
            description: '',
        }
    })

    const coverImage = watch('featured_image')

    // Search disciplines via API
    const onSearchDisciplines = async (query) => {
        try {
            const url = query
                ? `${process.env.baseUrl}/discipline?q=${encodeURIComponent(query)}`
                : `${process.env.baseUrl}/discipline?limit=100`
            const res = await authFetch(url)
            const data = await res.json()
            return data.items || []
        } catch (err) {
            console.error('Failed to search disciplines', err)
            return []
        }
    }

    const handleSelectDiscipline = (discipline) => {
        setSelectedDisciplines(prev => {
            // Avoid duplicates
            if (prev.some(d => d.id === discipline.id)) return prev
            return [...prev, discipline]
        })
        setDisciplineError('')
    }

    const handleRemoveDiscipline = (discipline) => {
        setSelectedDisciplines(prev => prev.filter(d => d.id !== discipline.id))
    }

    // Populate form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('featured_image', initialData.featured_image || '')
                setValue('short_name', initialData.short_name || '')
                setValue('title', initialData.title || '')
                setValue('description', initialData.description || '')
                setContent(initialData.content || '')
                setUploadedImage(initialData.featured_image || '')

                // Resolve disciplines → prefer objects, fallback to ids
                let existingDisciplines = []
                if (Array.isArray(initialData.disciplines)) {
                    existingDisciplines = initialData.disciplines.map(d =>
                        typeof d === 'object' ? d : { id: d, title: `Discipline #${d}` }
                    )
                } else if (typeof initialData.disciplines === 'string') {
                    try {
                        const parsed = JSON.parse(initialData.disciplines)
                        existingDisciplines = Array.isArray(parsed)
                            ? parsed.map(d => typeof d === 'object' ? d : { id: d, title: `Discipline #${d}` })
                            : []
                    } catch { /* ignore */ }
                }
                setSelectedDisciplines(existingDisciplines)
            } else {
                reset({ featured_image: '', short_name: '', title: '', description: '' })
                setSelectedDisciplines([])
                setContent('')
                setUploadedImage('')
            }
            setDisciplineError('')
        }
    }, [isOpen, initialData, setValue, reset])

    const onSubmit = async (data) => {
        // Extra validation for disciplines (optional — remove if not required)
        // Uncomment below if you want to require at least one discipline:
        // if (selectedDisciplines.length === 0) {
        //     setDisciplineError('Please select at least one discipline')
        //     return
        // }

        try {
            setSubmitting(true)
            const payload = {
                featured_image: uploadedImage?.trim() || data.featured_image?.trim() || null,
                short_name: data.short_name.trim(),
                title: data.title.trim(),
                description: data.description?.trim() || null,
                content: content?.trim() || null,
                disciplines: selectedDisciplines.map(d => d.id)
            }

            let response
            if (initialData?.id) {
                response = await authFetch(`${process.env.baseUrl}/degree/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            } else {
                response = await authFetch(`${process.env.baseUrl}/degree`, {
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
        <Dialog isOpen={isOpen} onClose={onClose} className='max-w-3xl'>
            <DialogContent className='max-w-3xl max-h-[90vh] flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Degree' : 'Add Degree'}
                    </DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6'>
                    <form id="degree-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

                        {/* ── Basic Details ─────────────────────────────── */}
                        <section className="space-y-5">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Degree Details</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label htmlFor="deg-short_name" required>Short Name</Label>
                                    <Input
                                        id="deg-short_name"
                                        placeholder='e.g. BCS, BBA, MBA'
                                        {...register('short_name', {
                                            required: 'Short name is required',
                                            minLength: { value: 2, message: 'Min 2 characters' },
                                            maxLength: { value: 20, message: 'Max 20 characters' }
                                        })}
                                        className={errors.short_name ? 'border-destructive focus-visible:ring-destructive' : ''}
                                    />
                                    {errors.short_name && (
                                        <p className='text-xs text-destructive mt-1'>{errors.short_name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deg-title" required>Full Title</Label>
                                    <Input
                                        id="deg-title"
                                        placeholder='e.g. Bachelor of Computer Science'
                                        {...register('title', {
                                            required: 'Title is required',
                                            minLength: { value: 2, message: 'Title must be at least 2 characters' },
                                            maxLength: { value: 200, message: 'Max 200 characters' }
                                        })}
                                        className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                                    />
                                    {errors.title && (
                                        <p className='text-xs text-destructive mt-1'>{errors.title.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deg-desc">Description</Label>
                                <Textarea
                                    id="deg-desc"
                                    placeholder='Enter a short description of this degree…'
                                    {...register('description', {
                                        maxLength: { value: 1000, message: 'Max 1000 characters' }
                                    })}
                                    rows={3}
                                    className={`resize-none ${errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                />
                                {errors.description && (
                                    <p className='text-xs text-destructive mt-1'>{errors.description.message}</p>
                                )}
                            </div>
                        </section>

                        {/* ── Disciplines ───────────────────────────────── */}
                        <section className="space-y-3">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Disciplines</h3>
                            <p className="text-xs text-gray-400">
                                Search and select the disciplines this degree belongs to. You can select multiple.
                            </p>
                            <SearchSelectCreate
                                onSearch={onSearchDisciplines}
                                onSelect={handleSelectDiscipline}
                                onRemove={handleRemoveDiscipline}
                                selectedItems={selectedDisciplines}
                                placeholder="Search disciplines…"
                                displayKey="title"
                                valueKey="id"
                                isMulti={true}
                                allowCreate={false}
                            />
                            {disciplineError && (
                                <p className='text-xs text-destructive mt-1'>{disciplineError}</p>
                            )}
                        </section>

                        {/* ── Detailed Content ──────────────────────────── */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Content</h3>
                            <div className="space-y-2">
                                <Label>Detailed Content</Label>
                                <TipTapEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder='Enter detailed content for the degree…'
                                />
                            </div>
                        </section>

                        {/* ── Media ─────────────────────────────────────── */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Media</h3>
                            <div className="space-y-2">
                                <Label>
                                    Cover Image{' '}
                                    <span className='text-gray-400 font-normal text-sm'>(Optional)</span>
                                </Label>
                                <FileUpload
                                    label=''
                                    defaultPreview={uploadedImage || coverImage}
                                    onUploadComplete={(url) => {
                                        setUploadedImage(url || '')
                                        setValue('featured_image', url || '')
                                    }}
                                />
                            </div>
                        </section>

                    </form>
                </div>

                {/* Sticky Footer */}
                <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3'>
                    <Button type='button' variant='outline' onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        form="degree-form"
                        disabled={submitting}
                        className='bg-[#387cae] hover:bg-[#387cae]/90 text-white'
                    >
                        {submitting ? 'Processing…' : initialData ? 'Update Degree' : 'Create Degree'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
