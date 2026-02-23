'use client'
import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Checkbox } from '@/ui/shadcn/checkbox'
import { Plus, Trash2, X, PlusCircle } from 'lucide-react'
import FileUpload from '@/app/(dashboard)/dashboard/addCollege/FileUpload'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import { Select } from '@/ui/shadcn/select'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import { fetchCourses, createOrUpdateConsultancy } from '@/app/(dashboard)/dashboard/consultancy/actions'

export default function CreateUpdateConsultancy({
    isOpen,
    onClose,
    onSuccess,
    initialData = null
}) {
    const [loading, setLoading] = useState(false)
    const [selectedCourses, setSelectedCourses] = useState([])

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            destination: [],
            address: {
                street: '',
                city: '',
                state: '',
                zip: ''
            },
            description: '',
            contact: ['', ''],
            website_url: '',
            google_map_url: '',
            video_url: '',
            featured_image: '',
            logo: '',
            pinned: 0,
            courses: [],
            map_type: ""
        }
    })

    const {
        fields: destinationFields,
        append: appendDestination,
        remove: removeDestination
    } = useFieldArray({ control, name: 'destination' })

    // Initialize form when opening
    useEffect(() => {
        if (isOpen && initialData) {
            const consultancy = initialData

            // Handle Courses/Colleges
            if (consultancy.consultancyCourses) {
                const consultData = consultancy.consultancyCourses.map((c) => ({
                    id: c.id,
                    title: c.title
                }))
                setSelectedCourses(consultData)
                setValue('courses', consultData.map((c) => c.id))
            } else {
                setSelectedCourses([])
                setValue('courses', [])
            }

            // Parse Destination
            let parsedDestination = []
            try {
                parsedDestination = Array.isArray(consultancy.destination)
                    ? consultancy.destination
                    : typeof consultancy.destination === 'string'
                        ? JSON.parse(consultancy.destination)
                        : []
            } catch (e) {
                parsedDestination = []
            }

            const destinationForForm = (Array.isArray(parsedDestination) ? parsedDestination : [])
                .map((d) => typeof d === 'string' ? { country: d } : { country: d?.country ?? '' })

            // Parse Address
            let address = { street: '', city: '', state: '', zip: '' }
            try {
                address = typeof consultancy.address === 'string'
                    ? JSON.parse(consultancy.address)
                    : consultancy.address || address
            } catch (e) { }

            // Parse Contact
            let parsedContact = ['', '']
            try {
                const contactData = consultancy.contact
                    ? typeof consultancy.contact === 'string'
                        ? JSON.parse(consultancy.contact)
                        : consultancy.contact
                    : []
                parsedContact = Array.isArray(contactData) ? contactData : []
                if (parsedContact.length < 2) {
                    parsedContact = [...parsedContact, ...Array(2 - parsedContact.length).fill('')]
                }
            } catch (e) { }

            reset({
                title: consultancy.title || '',
                description: consultancy.description || '',
                website_url: consultancy.website_url || '',
                google_map_url: consultancy.google_map_url || '',
                video_url: consultancy.video_url || '',
                map_type: consultancy.map_type || '',
                destination: destinationForForm.length ? destinationForForm : [],
                address: address,
                contact: parsedContact,
                pinned: consultancy.pinned || 0,
                featured_image: consultancy.featured_image || '',
                logo: consultancy.logo || '',
                courses: consultancy.consultancyCourses?.map(c => c.id) || []
            })
        } else if (isOpen && !initialData) {
            reset({
                title: '',
                destination: [],
                address: { street: '', city: '', state: '', zip: '' },
                description: '',
                contact: ['', ''],
                website_url: '',
                google_map_url: '',
                map_type: "",
                video_url: '',
                featured_image: '',
                logo: '',
                pinned: 0,
                courses: []
            })
            setSelectedCourses([])
        }
    }, [isOpen, initialData, reset, setValue])

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const payload = {
                ...data,
                title: data.title?.trim(),
                destination: data.destination.map(d => d.country).filter(Boolean),
                pinned: data.pinned ? 1 : 0,
                contact: data.contact.filter(Boolean),
                courses: Array.isArray(data.courses) ? data.courses : (data.courses ? [data.courses] : [])
            }

            if (initialData?.id) {
                payload.id = initialData.id
            }

            await createOrUpdateConsultancy(payload)
            toast.success(initialData ? 'Consultancy updated successfully!' : 'Consultancy created successfully!')
            onSuccess?.()
            onClose()
        } catch (error) {
            toast.error(error.message || 'Failed to save consultancy')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            closeOnOutsideClick={false}
            className='max-w-5xl'
        >
            <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Edit Consultancy' : 'Add New Consultancy'}
                    </DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6'>
                    <form id="consultancy-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                        {/* Basic Information */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
                            <div className='grid grid-cols-1 gap-6'>
                                <div className='space-y-2'>
                                    <Label required>Consultancy Title</Label>
                                    <Input
                                        placeholder='Enter consultancy name'
                                        {...register('title', { required: 'Title is required' })}
                                    />
                                    {errors.title && <p className='text-xs text-red-500'>{errors.title.message}</p>}
                                </div>
                                <div className='space-y-2'>
                                    <Label>Description</Label>
                                    <TipTapEditor
                                        value={watch('description')}
                                        onChange={(val) => setValue('description', val)}
                                        placeholder='Detailed description of services...'
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Options & Media */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Media & Status</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='space-y-4'>
                                    <div className='space-y-2'>
                                        <Label>Logo</Label>
                                        <FileUpload
                                            onUploadComplete={(url) => setValue('logo', url)}
                                            defaultPreview={watch('logo')}
                                        />
                                    </div>
                                    <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg border'>
                                        <Controller
                                            name='pinned'
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    id='pinned'
                                                    checked={!!field.value}
                                                    onCheckedChange={(v) => field.onChange(v ? 1 : 0)}
                                                />
                                            )}
                                        />
                                        <Label htmlFor='pinned' className='font-medium cursor-pointer'>
                                            Pin this consultancy to top
                                        </Label>
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <Label required>Featured Image</Label>
                                    <FileUpload
                                        onUploadComplete={(url) => setValue('featured_image', url)}
                                        defaultPreview={watch('featured_image')}
                                    />
                                    <input type="hidden" {...register('featured_image', { required: 'Featured image is required' })} />
                                    {errors.featured_image && <p className='text-xs text-red-500'>{errors.featured_image.message}</p>}
                                </div>
                            </div>
                        </section>

                        {/* Destinations & Courses */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Destinations & Courses</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <Label>Target Destinations</Label>
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            onClick={() => appendDestination({ country: '' })}
                                            className='h-7 text-xs gap-1'
                                        >
                                            <PlusCircle className='w-3.5 h-3.5' />
                                            Add Country
                                        </Button>
                                    </div>
                                    <div className='space-y-2 max-h-[200px] overflow-y-auto pr-2'>
                                        {destinationFields.map((field, index) => (
                                            <div key={field.id} className='flex gap-2 items-center'>
                                                <Input
                                                    {...register(`destination.${index}.country`)}
                                                    placeholder='e.g. Australia'
                                                    className='h-9'
                                                />
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() => removeDestination(index)}
                                                    className='h-9 w-9 text-red-500 hover:bg-red-50'
                                                >
                                                    <Trash2 className='w-4 h-4' />
                                                </Button>
                                            </div>
                                        ))}
                                        {destinationFields.length === 0 && (
                                            <p className='text-xs text-gray-400 italic py-2'>No destinations added yet.</p>
                                        )}
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label>Courses Offered</Label>
                                    <SearchSelectCreate
                                        onSearch={fetchCourses}
                                        onSelect={(item) => {
                                            const current = watch('courses') || []
                                            if (!current.includes(item.id)) {
                                                setValue('courses', [...current, item.id])
                                                setSelectedCourses(prev => [...prev, item])
                                            }
                                        }}
                                        onRemove={(item) => {
                                            const current = watch('courses') || []
                                            setValue('courses', current.filter(id => id !== item.id))
                                            setSelectedCourses(prev => prev.filter(c => c.id !== item.id))
                                        }}
                                        selectedItems={selectedCourses}
                                        placeholder="Search and add courses..."
                                        isMulti={true}
                                        displayKey="title"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Contact & Location */}
                        <section className="space-y-4">
                            <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Contact & Location</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label>Contact Number 1</Label>
                                            <Input {...register('contact.0')} placeholder='Phone 1' />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Contact Number 2</Label>
                                            <Input {...register('contact.1')} placeholder='Phone 2' />
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>Website URL</Label>
                                        <Input {...register('website_url')} type='url' placeholder='https://...' />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>YouTube Video URL</Label>
                                        <Input {...register('video_url')} type='url' placeholder='https://www.youtube.com/watch?v=...' />
                                    </div>
                                </div>

                                <div className='space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label>City</Label>
                                            <Input {...register('address.city')} placeholder='City' />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>State</Label>
                                            <Input {...register('address.state')} placeholder='State' />
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>Street Address</Label>
                                        <Input {...register('address.street')} placeholder='Street, ZIP, etc.' />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label>Map Type</Label>
                                            <Controller
                                                name='map_type'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    >
                                                        <option value=''>Select Type</option>
                                                        <option value='embed_map_url'>Embed URL</option>
                                                        <option value='google_map_url'>Google Map URL</option>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                        <div className='space-y-2'>
                                            <Label>Map Link/Code</Label>
                                            <Input {...register('google_map_url')} placeholder='URL or Iframe src' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        form="consultancy-form"
                        disabled={loading}
                        className="bg-[#387cae] hover:bg-[#387cae]/90"
                    >
                        {loading ? 'Saving...' : initialData ? 'Update Consultancy' : 'Create Consultancy'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
