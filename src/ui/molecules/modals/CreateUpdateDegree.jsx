'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Modal } from '@/ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'
import FileUpload from '@/app/(dashboard)/dashboard/addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
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
    const [allDisciplines, setAllDisciplines] = useState([])
    const [selectedDisciplines, setSelectedDisciplines] = useState([])

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
            description: ''
        }
    })

    // Watch featured_image for preview
    const coverImage = watch('featured_image')

    useEffect(() => {
        // Fetch disciplines
        const fetchDisciplines = async () => {
            try {
                const response = await authFetch(`${process.env.baseUrl}/discipline`)
                const data = await response.json()
                if (response.ok) {
                    setAllDisciplines(data.items || [])
                }
            } catch (err) {
                console.error('Failed to fetch disciplines', err)
            }
        }
        fetchDisciplines()
    }, [])

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('featured_image', initialData.featured_image || '')
                setValue('short_name', initialData.short_name || '')
                setValue('title', initialData.title || '')
                setValue('description', initialData.description || '')
                
                // Set selected disciplines if available
                // Assuming initialData.disciplines is an array of IDs or objects
                let existingDisciplines = []
                if (Array.isArray(initialData.disciplines)) {
                     // If it's array of objects, map to ID. If IDs, use as is.
                     // The backend stores JSON, so it might be [1, 2] or [{"id":1}, ...] depending on how we saved it.
                     // Our validator allows array. We will save array of IDs.
                     existingDisciplines = initialData.disciplines.map(d => (typeof d === 'object' ? d.id : d))
                } else if (typeof initialData.disciplines === 'string') {
                    try {
                        existingDisciplines = JSON.parse(initialData.disciplines)
                    } catch(e) {/* ignore */}
                }
                setSelectedDisciplines(existingDisciplines)

            } else {
                reset({
                    featured_image: '',
                    short_name: '',
                    title: '',
                    description: ''
                })
                setSelectedDisciplines([])
            }
        }
    }, [isOpen, initialData, setValue, reset])

    const handleDisciplineToggle = (id) => {
        setSelectedDisciplines(prev => {
            if (prev.includes(id)) {
                return prev.filter(d => d !== id)
            } else {
                return [...prev, id]
            }
        })
    }

    const onSubmit = async (data) => {
        try {
            setSubmitting(true)
            const baseUrl = process.env.baseUrl
            const payload = {
                featured_image: data.featured_image?.trim() || null,
                short_name: data.short_name.trim(),
                title: data.title.trim(),
                description: data.description?.trim() || null,
                disciplines: selectedDisciplines
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
                            Short Name <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                            {...register('short_name', {
                                required: 'Short name is required'
                            })}
                            className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none'
                            placeholder='e.g. BCS, BBA'
                        />
                        {errors.short_name && (
                            <span className='text-red-500 text-sm'>{errors.short_name.message}</span>
                        )}
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
                    
                    {/* Disciplines Multi-select */}
                    <div>
                        <Label className='block mb-2 text-sm font-medium'>
                            Disciplines 
                        </Label>
                        <div className="border rounded-md p-2 max-h-40 overflow-y-auto space-y-2">
                            {allDisciplines.length > 0 ? (
                                allDisciplines.map(discipline => (
                                    <label key={discipline.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedDisciplines.includes(discipline.id)}
                                            onChange={() => handleDisciplineToggle(discipline.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm">{discipline.title || discipline.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No disciplines found.</p>
                            )}
                        </div>
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
