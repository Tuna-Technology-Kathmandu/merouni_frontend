'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import FileUpload from '@/app/(dashboard)/dashboard/colleges/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'

export default function CreateUpdateDiscipline({
    isOpen,
    onClose,
    onSuccess,
    initialData = null,
    authorId
}) {
    const [uploadedFiles, setUploadedFiles] = useState({ featured_image: '' })

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
            content: '',
            featured_image: '',
            author: authorId
        }
    })

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('title', initialData.title)
                setValue('description', initialData.description || '')
                setValue('content', initialData.content || '')
                setValue('featured_image', initialData.featured_image || '')
                setUploadedFiles({ featured_image: initialData.featured_image || '' })
            } else {
                reset({ title: '', description: '', content: '', featured_image: '', author: authorId })
                setUploadedFiles({ featured_image: '' })
            }
        }
    }, [isOpen, initialData, setValue, reset, authorId])

    const onSubmit = async (data) => {
        const payload = { ...data, featured_image: uploadedFiles.featured_image }
        try {
            let response
            if (initialData?.id) {
                response = await authFetch(`${process.env.baseUrl}/discipline?discipline_id=${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            } else {
                response = await authFetch(`${process.env.baseUrl}/discipline`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
            }
            if (!response.ok) throw new Error(`Failed to ${initialData ? 'update' : 'create'} discipline`)
            toast.success(`Discipline ${initialData ? 'updated' : 'created'} successfully`)
            onSuccess?.()
            onClose()
        } catch (err) {
            toast.error(err.message || `Failed to ${initialData ? 'update' : 'create'} discipline`)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} className='max-w-2xl'>
            <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Discipline' : 'Add Discipline'}
                    </DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6'>
                    <form id="discipline-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

                        {/* Details */}
                        <section className="space-y-5">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Discipline Details</h3>

                            <div className="space-y-2">
                                <Label htmlFor="disc-title" required>Title</Label>
                                <Input
                                    id="disc-title"
                                    placeholder='e.g. Computer Science'
                                    {...register('title', {
                                        required: 'Title is required',
                                        minLength: { value: 2, message: 'Title must be at least 2 characters' }
                                    })}
                                    className={errors.title ? 'border-destructive focus-visible:ring-destructive' : ''}
                                />
                                {errors.title && <p className='text-xs text-destructive mt-1'>{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="disc-desc">Short Description</Label>
                                <Textarea
                                    id="disc-desc"
                                    placeholder='Brief summary of this discipline…'
                                    {...register('description', {
                                        maxLength: { value: 1000, message: 'Max 1000 characters' }
                                    })}
                                    rows={3}
                                    className={`resize-none ${errors.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                />
                                {errors.description && <p className='text-xs text-destructive mt-1'>{errors.description.message}</p>}
                            </div>
                        </section>

                        {/* Rich Content */}
                        <section className="space-y-5">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Content</h3>
                            <div className="space-y-2">
                                <Label>Detailed Content</Label>
                                <Controller
                                    name='content'
                                    control={control}
                                    render={({ field }) => (
                                        <TipTapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder='Enter detailed content with rich formatting…'
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
                                    Featured Image{' '}
                                    <span className='text-gray-400 font-normal text-sm'>(Optional)</span>
                                </Label>
                                <FileUpload
                                    label=''
                                    defaultPreview={uploadedFiles.featured_image}
                                    onUploadComplete={(url) => {
                                        setUploadedFiles((prev) => ({ ...prev, featured_image: url }))
                                        setValue('featured_image', url)
                                    }}
                                />
                            </div>
                        </section>

                    </form>
                </div>

                {/* Sticky Footer */}
                <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3'>
                    <Button type='button' variant='outline' onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        form="discipline-form"
                        disabled={isSubmitting}
                        className='bg-[#387cae] hover:bg-[#387cae]/90 text-white'
                    >
                        {isSubmitting ? 'Processing…' : initialData ? 'Update Discipline' : 'Create Discipline'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
