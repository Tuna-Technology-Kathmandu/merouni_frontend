import { Button } from '@/ui/shadcn/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import axios from 'axios'
import {
    Calendar,
    Check,
    FileText,
    GraduationCap,
    Image as ImageIcon,
    Info,
    Layers,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Plus,
    Trash2,
    Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { fetchAllCourse, fetchLevel } from '@/app/(dashboard)/dashboard/university/actions'
import { cn } from '@/app/lib/utils'
import { authFetch } from '@/app/utils/authFetch'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import GallerySection from '../college/components/GallerySection'
import FileUploadWithPreview from '../college/components/MediaUploadWithBranding'
import VideoSection from '../college/components/VideoSection'

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#387cae]/10 flex items-center justify-center text-[#387cae] shadow-sm border border-[#387cae]/20">
            <Icon size={20} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-500 mt-0.5 font-semibold leading-relaxed uppercase tracking-wider">{subtitle}</p>}
        </div>
    </div>
)

const CreateUpdateUniversityModal = ({
    isOpen,
    handleCloseModal: onSystemClose,
    editSlug,
    onSuccess
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [submittingDraft, setSubmittingDraft] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [showCloseConfirm, setShowCloseConfirm] = useState(false)
    const [allLevels, setAllLevels] = useState([])
    const [allCourses, setAllCourses] = useState([])
    const [loadingResources, setLoadingResources] = useState(false)
    const [filesDirty, setFilesDirty] = useState(false)

    const [uploadedFiles, setUploadedFiles] = useState({
        logo: '',
        featured_image: '',
        images: [],
        videos: []
    })

    const author_id = useSelector((state) => state.user.data?.id)

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        getValues,
        formState: { errors, isDirty }
    } = useForm({
        defaultValues: {
            fullname: '',
            author_id: author_id,
            country: '',
            state: '',
            city: '',
            street: '',
            postal_code: '',
            date_of_establish: '',
            type_of_institute: 'Public',
            logo: '',
            description: '',
            contact: {
                faxes: '',
                poboxes: '',
                email: '',
                phone_number: ''
            },
            levels: [],
            programs: [],
            members: [
                {
                    role: '',
                    salutation: '',
                    name: '',
                    phone: '',
                    email: ''
                }
            ],
            map: '',
            gallery: [],
            status: 'Published'
        }
    })

    const {
        fields: memberFields,
        append: appendMember,
        remove: removeMember
    } = useFieldArray({ control, name: 'members' })

    const handleSetFiles = (updater) => {
        setUploadedFiles(updater)
        if (!loadingData) setFilesDirty(true)
    }

    const handleCloseAttempt = () => {
        if (isDirty || filesDirty) {
            setShowCloseConfirm(true)
        } else {
            onSystemClose()
        }
    }

    // Load resources (levels, courses)
    useEffect(() => {
        const loadResources = async () => {
            try {
                setLoadingResources(true)
                const [levelsData, coursesData] = await Promise.all([
                    fetchLevel(''),
                    fetchAllCourse()
                ])
                setAllLevels(levelsData || [])
                setAllCourses(coursesData || [])
            } catch (error) {
                console.error('Error fetching resources:', error)
            } finally {
                setLoadingResources(false)
            }
        }
        if (isOpen) {
            loadResources()
        }
    }, [isOpen])

    // Load university data for editing
    useEffect(() => {
        if (isOpen && editSlug) {
            const fetchUniversityData = async () => {
                try {
                    setLoadingData(true)
                    const response = await authFetch(
                        `${process.env.baseUrl}/university/${editSlug}`,
                        { headers: { 'Content-Type': 'application/json' } }
                    )

                    if (!response.ok) throw new Error('Failed to fetch university data')

                    const uniData = await response.json()

                    // Populate fields
                    setValue('id', uniData.id)
                    setValue('fullname', uniData.fullname)
                    setValue('country', uniData.country)
                    setValue('state', uniData.state)
                    setValue('city', uniData.city)
                    setValue('street', uniData.street)
                    setValue('postal_code', uniData.postal_code)
                    setValue('date_of_establish', uniData.date_of_establish ? uniData.date_of_establish.split('T')[0] : '')
                    setValue('type_of_institute', uniData.type_of_institute || 'Public')
                    setValue('map', uniData.map || '')
                    setValue('description', uniData.description || '')
                    setValue('status', uniData.status || 'Published')

                    if (uniData.contact) {
                        setValue('contact.faxes', uniData.contact.faxes || '')
                        setValue('contact.poboxes', uniData.contact.poboxes || '')
                        setValue('contact.email', uniData.contact.email || '')
                        setValue('contact.phone_number', uniData.contact.phone_number || '')
                    }

                    const levelIds = (uniData.levels || []).map(l => String(l.id || l))
                    setValue('levels', levelIds)

                    // Programs are complicates because they might be nested objects in the response
                    const programIds = (uniData.programs || []).map(p => {
                        if (typeof p === 'object') {
                            return String(p.program_id || p.program?.id || p.id)
                        }
                        return String(p)
                    }).filter(Boolean)
                    setValue('programs', programIds)

                    const members = uniData.members?.length
                        ? uniData.members
                        : [{ role: '', salutation: '', name: '', phone: '', email: '' }]
                    setValue('members', members)

                    const featuredImg = uniData.featured_image || ''
                    const logo = uniData.logo || ''
                    const galleryUrls = uniData.gallery || []

                    const images = galleryUrls
                        .filter(url => url)
                        .map(url => ({ url, file_type: 'image' }))

                    let videos = []
                    if (uniData.videos) {
                        if (Array.isArray(uniData.videos)) {
                            videos = uniData.videos.map(url => ({ url, file_type: 'video' }))
                        } else if (typeof uniData.videos === 'string') {
                            videos = [{ url: uniData.videos, file_type: 'video' }]
                        }
                    }

                    setUploadedFiles({
                        logo,
                        featured_image: featuredImg,
                        images,
                        videos
                    })

                    setValue('logo', logo)
                    setValue('featured_image', featuredImg)

                } catch (error) {
                    console.error('Error fetching university data:', error)
                    toast.error('Failed to load university details')
                } finally {
                    setLoadingData(false)
                }
            }
            fetchUniversityData()
        } else if (isOpen) {
            reset({
                fullname: '',
                author_id: author_id,
                country: '',
                state: '',
                city: '',
                street: '',
                postal_code: '',
                date_of_establish: '',
                type_of_institute: 'Public',
                logo: '',
                description: '',
                contact: { faxes: '', poboxes: '', email: '', phone_number: '' },
                levels: [],
                programs: [],
                members: [{ role: '', salutation: '', name: '', phone: '', email: '' }],
                map: '',
                gallery: [],
                status: 'Published'
            })
            setUploadedFiles({
                logo: '',
                featured_image: '',
                images: [],
                videos: []
            })
            setFilesDirty(false)
        }
    }, [isOpen, editSlug, setValue, reset, author_id])

    // Match program names to IDs once courses are loaded
    useEffect(() => {
        if (isOpen && allCourses.length > 0) {
            const currentPrograms = getValues('programs') || []
            const updatedPrograms = currentPrograms.map(p => {
                if (isNaN(p)) {
                    const match = allCourses.find(c => c.title === p)
                    return match ? String(match.id) : p
                }
                return p
            }).filter(p => !isNaN(p))

            if (JSON.stringify(currentPrograms) !== JSON.stringify(updatedPrograms)) {
                setValue('programs', updatedPrograms)
            }
        }
    }, [allCourses, isOpen])

    const onMediaUpload = async (file) => {
        const formData = new FormData()
        formData.append('title', file.name)
        formData.append('altText', file.name)
        formData.append('description', '')
        formData.append('file', file)
        formData.append('authorId', author_id || '1')

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

    const handleSave = async (data, status = 'Published') => {
        try {
            status === 'Draft' ? setSubmittingDraft(true) : setSubmitting(true)

            // Filter logic
            data.members = (data.members || []).filter(m => Object.values(m).some(v => v && v.toString().trim() !== ''))

            data.logo = uploadedFiles.logo
            data.featured_image = uploadedFiles.featured_image
            data.gallery = uploadedFiles.images.map(img => img.url).filter(Boolean)
            data.videos = uploadedFiles.videos.map(v => v.url).filter(Boolean)

            data.levels = (data.levels || []).map(id => parseInt(id)).filter(id => !isNaN(id))
            data.programs = (data.programs || []).map(id => parseInt(id)).filter(id => !isNaN(id))

            data.status = status

            const url = `${process.env.baseUrl}/university`
            const method = editSlug ? 'PUT' : 'POST'

            const response = await authFetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                const res = await response.json()
                throw new Error(res.message || 'Failed to save university')
            }

            toast.success(status === 'Draft' ? 'Draft saved successfully!' : (editSlug ? 'University updated successfully!' : 'University created successfully!'))
            onSuccess?.()
            onSystemClose()
        } catch (error) {
            console.error('Submission error:', error)
            toast.error(error.message || 'Failed to submit data')
        } finally {
            setSubmitting(false)
            setSubmittingDraft(false)
        }
    }

    const onSubmit = async (data) => {
        await handleSave(data, 'Published')
    }

    const onSaveDraft = async () => {
        const data = getValues()
        // When saving as draft, we might want to skip basic validation
        // But we still need the university name at least for most backends
        if (!data.fullname) {
            toast.error('University name is required even for drafts')
            return
        }
        await handleSave(data, 'Draft')
    }

    const onSearchCourses = async (query) => {
        if (!allCourses) return []
        return query
            ? allCourses.filter(c => c.title?.toLowerCase().includes(query.toLowerCase()))
            : allCourses
    }

    const handleSelectProgram = (program) => {
        const current = getValues('programs') || []
        const id = String(program.id || program)
        if (!current.includes(id)) {
            setValue('programs', [...current, id], { shouldDirty: true, shouldValidate: true })
        }
    }

    const handleRemoveProgram = (program) => {
        const current = getValues('programs') || []
        const id = String(program.id || program)
        setValue('programs', current.filter(i => i !== id), { shouldDirty: true, shouldValidate: true })
    }

    const selectedPrograms = allCourses
        .filter(c => watch('programs')?.includes(String(c.id)))
        .map(c => ({ id: c.id, title: c.title }))

    const onSearchLevels = async (query) => {
        if (!allLevels) return []
        return query
            ? allLevels.filter(l => l.title?.toLowerCase().includes(query.toLowerCase()))
            : allLevels
    }

    const handleSelectLevel = (level) => {
        const current = getValues('levels') || []
        const id = String(level.id || level)
        if (!current.includes(id)) {
            setValue('levels', [...current, id], { shouldDirty: true, shouldValidate: true })
        }
    }

    const handleRemoveLevel = (level) => {
        const current = getValues('levels') || []
        const id = String(level.id || level)
        setValue('levels', current.filter(i => i !== id), { shouldDirty: true, shouldValidate: true })
    }

    const selectedLevels = allLevels
        .filter(l => watch('levels')?.includes(String(l.id)))
        .map(l => ({ id: l.id, title: l.title }))

    return (
        <Dialog isOpen={isOpen} onClose={handleCloseAttempt} closeOnOutsideClick={false} className='max-w-7xl'>
            <DialogHeader className="bg-white border-b border-gray-100 p-6">
                <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="text-[#387cae]" size={24} />
                    {editSlug ? 'Edit University' : 'Add New University'}
                </DialogTitle>
                <DialogClose onClick={handleCloseAttempt} />
            </DialogHeader>
            <DialogContent className="p-0 bg-gray-50/50">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col max-h-[calc(100vh-120px)] relative'
                >
                    {loadingData && (
                        <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-b-3xl">
                            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 border border-gray-100 animate-in fade-in zoom-in duration-300">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-[#387cae] animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Info size={16} className="text-[#387cae] animate-pulse" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h4 className="font-bold text-gray-900">Loading Details</h4>
                                    <p className="text-xs text-gray-500 font-medium">Please wait a moment...</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='flex-1 overflow-y-auto p-8'>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
                            {/* Left Column - Main Content (8/12) */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Basic Information */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={Info} title="Basic Information" subtitle="General identity of the university" />
                                    <div className='space-y-6'>
                                        <div>
                                            <Label required={true} htmlFor='fullname'>University Name</Label>
                                            <Input
                                                id='fullname'
                                                placeholder='Enter university name...'
                                                className="h-12 text-base rounded-xl border-gray-200 focus:ring-[#387cae]/20"
                                                {...register('fullname', { required: 'University name is required' })}
                                            />
                                            {errors.fullname && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.fullname.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor='type_of_institute'>Institute Type</Label>
                                                <select
                                                    id='type_of_institute'
                                                    {...register('type_of_institute')}
                                                    className='flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[#387cae]/5 focus:border-[#387cae] transition-all'
                                                >
                                                    <option value='Public'>Public</option>
                                                    <option value='Private'>Private</option>
                                                </select>
                                            </div>

                                            <div>
                                                <Label htmlFor='date_of_establish' required={true}>Date of Establishment</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id='date_of_establish'
                                                        type='date'
                                                        className={cn(
                                                            "h-11 pl-10 rounded-xl border-gray-200 focus:ring-[#387cae]/20",
                                                            errors.date_of_establish && "border-red-500"
                                                        )}
                                                        {...register('date_of_establish', { required: 'Establishment date is required' })}
                                                    />
                                                </div>
                                                {errors.date_of_establish && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.date_of_establish.message}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label required={true} className="mb-3">Educational Levels</Label>
                                            <SearchSelectCreate
                                                onSearch={onSearchLevels}
                                                onSelect={handleSelectLevel}
                                                onRemove={handleRemoveLevel}
                                                selectedItems={selectedLevels}
                                                placeholder="Search or select levels..."
                                                displayKey="title"
                                                valueKey="id"
                                                isMulti={true}
                                                className="w-full"
                                                isLoading={loadingResources}
                                            />
                                            {errors.levels && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.levels.message}</p>
                                            )}
                                            <input type="hidden" {...register('levels', { required: 'At least one level is required' })} />
                                        </div>
                                    </div>
                                </div>

                                {/* About & Content */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={FileText} title="University Details" subtitle="Description and academic programs" />
                                    <div className='space-y-6'>
                                        <div>
                                            <Label required={true} className="mb-2.5">Description</Label>
                                            <Controller
                                                name="description"
                                                control={control}
                                                rules={{ required: 'University description is required' }}
                                                render={({ field }) => (
                                                    <TipTapEditor
                                                        onMediaUpload={onMediaUpload}
                                                        showImageUpload={true}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder='Enter university description and content...'
                                                    />
                                                )}
                                            />
                                            {errors.description && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.description.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label required={true} className="mb-3 block">Programs Offered</Label>
                                            <SearchSelectCreate
                                                onSearch={onSearchCourses}
                                                onSelect={handleSelectProgram}
                                                onRemove={handleRemoveProgram}
                                                selectedItems={selectedPrograms}
                                                placeholder="Search or select programs..."
                                                displayKey="title"
                                                valueKey="id"
                                                isMulti={true}
                                                className="w-full"
                                                isLoading={loadingResources}
                                            />
                                            {errors.programs && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.programs.message}</p>
                                            )}
                                            <input type="hidden" {...register('programs', { required: 'At least one program is required' })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={MapPin} title="Location Details" subtitle="University address information" />
                                    <div className='space-y-6'>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                            <div>
                                                <Label htmlFor='country' required={true}>Country</Label>
                                                <Input
                                                    id='country'
                                                    {...register('country', { required: 'Country is required' })}
                                                    placeholder='e.g. Nepal'
                                                    className="h-11 rounded-xl border-gray-200"
                                                />
                                                {errors.country && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.country.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor='state' required={true}>State / Province</Label>
                                                <Input
                                                    id='state'
                                                    {...register('state', { required: 'State is required' })}
                                                    placeholder='e.g. Bagmati'
                                                    className="h-11 rounded-xl border-gray-200"
                                                />
                                                {errors.state && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.state.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                            <div>
                                                <Label htmlFor='city' required={true}>City</Label>
                                                <Input
                                                    id='city'
                                                    {...register('city', { required: 'City is required' })}
                                                    placeholder='e.g. Kathmandu'
                                                    className="h-11 rounded-xl border-gray-200"
                                                />
                                                {errors.city && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.city.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor='street'>Street Address</Label>
                                                <Input
                                                    id='street'
                                                    {...register('street')}
                                                    placeholder='e.g. Kirtipur'
                                                    className="h-11 rounded-xl border-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor='postal_code'>Postal Code</Label>
                                                <Input
                                                    id='postal_code'
                                                    {...register('postal_code')}
                                                    placeholder='44600'
                                                    className="h-11 rounded-xl border-gray-200"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor='map' required={true}>Google Maps URL</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id='map'
                                                        {...register('map', { required: 'Google Maps URL is required' })}
                                                        placeholder='Paste Google Maps share link...'
                                                        className="h-11 pl-10 rounded-xl border-gray-200"
                                                    />
                                                </div>
                                                {errors.map && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.map.message}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={Phone} title="Contact Information" subtitle="Ways to reach the university" />
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                        <div>
                                            <Label htmlFor='contact.email'>Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id='contact.email'
                                                    type='email'
                                                    {...register('contact.email', {
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Invalid email address"
                                                        }
                                                    })}
                                                    placeholder='info@university.edu'
                                                    className="h-11 pl-10 rounded-xl border-gray-200"
                                                />
                                                {errors.contact?.email && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.contact.email.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor='contact.phone_number'>Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id='contact.phone_number'
                                                    {...register('contact.phone_number')}
                                                    placeholder='+977 1-XXXXXXX'
                                                    className="h-11 pl-10 rounded-xl border-gray-200"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor='contact.faxes'>Fax Number</Label>
                                            <Input
                                                id='contact.faxes'
                                                {...register('contact.faxes')}
                                                placeholder='Optional fax number'
                                                className="h-11 rounded-xl border-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor='contact.poboxes'>P.O. Box</Label>
                                            <Input
                                                id='contact.poboxes'
                                                {...register('contact.poboxes')}
                                                placeholder='Optional P.O. Box'
                                                className="h-11 rounded-xl border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <div className='flex justify-between items-center mb-6'>
                                        <SectionHeader icon={Users} title="Key Members" subtitle="Leadership and faculty staff" />
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            className='rounded-xl border-[#387cae]/20 text-[#387cae] hover:bg-[#387cae]/5'
                                            onClick={() => appendMember({ role: '', salutation: '', name: '', phone: '', email: '' })}
                                        >
                                            <Plus className='w-4 h-4 mr-2' />
                                            Add Member
                                        </Button>
                                    </div>
                                    <div className='space-y-4'>
                                        {memberFields.map((field, index) => (
                                            <div key={field.id} className='group relative p-6 bg-gray-50/50 border border-gray-100 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:shadow-[#387cae]/5 hover:border-[#387cae]/20'>
                                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pr-10'>
                                                    <div>
                                                        <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Role</Label>
                                                        <Input {...register(`members.${index}.role`)} placeholder='e.g. Vice Chancellor' className='h-10 rounded-xl' />
                                                    </div>
                                                    <div>
                                                        <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Salutation</Label>
                                                        <Input {...register(`members.${index}.salutation`)} placeholder='e.g. Prof. Dr.' className='h-10 rounded-xl' />
                                                    </div>
                                                    <div>
                                                        <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Full Name</Label>
                                                        <Input {...register(`members.${index}.name`)} placeholder='Enter name...' className='h-10 rounded-xl' />
                                                    </div>
                                                    <div>
                                                        <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Email</Label>
                                                        <Input
                                                            {...register(`members.${index}.email`, {
                                                                pattern: {
                                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                    message: "Invalid email"
                                                                }
                                                            })}
                                                            type="email"
                                                            placeholder='Email address'
                                                            className='h-10 rounded-xl'
                                                        />
                                                        {errors.members?.[index]?.email && (
                                                            <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.members[index].email.message}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Phone</Label>
                                                        <Input {...register(`members.${index}.phone`)} placeholder='Phone number' className='h-10 rounded-xl' />
                                                    </div>
                                                </div>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='icon'
                                                    className='absolute top-6 right-6 h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl'
                                                    onClick={() => removeMember(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Media & Sidebar (4/12) */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Branding & Visuals */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={ImageIcon} title="Branding" subtitle="Logos and featured visuals" />
                                    <div className='space-y-8'>
                                        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed hover:bg-white hover:border-[#387cae]/30 transition-all group">
                                            <Label required={true} className="text-[10px] font-black text-slate-600 uppercase tracking-[0.1em] mb-4 block text-center group-hover:text-[#387cae]">University Logo</Label>
                                            <FileUploadWithPreview
                                                label=""
                                                onUploadComplete={(url) => {
                                                    handleSetFiles(prev => ({ ...prev, logo: url }))
                                                    setValue('logo', url, { shouldValidate: true })
                                                }}
                                                defaultPreview={uploadedFiles.logo}
                                                onClear={() => {
                                                    handleSetFiles(prev => ({ ...prev, logo: '' }))
                                                    setValue('logo', '', { shouldValidate: true })
                                                }}
                                            />
                                            {errors.logo && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1 text-center'>{errors.logo.message}</p>
                                            )}
                                            <input type="hidden" {...register('logo', { required: 'University logo is required' })} />
                                        </div>

                                        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed hover:bg-white hover:border-[#387cae]/30 transition-all group">
                                            <Label required={true} className="text-[10px] font-black text-slate-600 uppercase tracking-[0.1em] mb-4 block text-center group-hover:text-[#387cae]">Featured Image</Label>
                                            <FileUploadWithPreview
                                                label=""
                                                onUploadComplete={(url) => {
                                                    handleSetFiles(prev => ({ ...prev, featured_image: url }))
                                                    setValue('featured_image', url, { shouldValidate: true })
                                                }}
                                                defaultPreview={uploadedFiles.featured_image}
                                                onClear={() => {
                                                    handleSetFiles(prev => ({ ...prev, featured_image: '' }))
                                                    setValue('featured_image', '', { shouldValidate: true })
                                                }}
                                            />
                                            {errors.featured_image && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1 text-center'>{errors.featured_image.message}</p>
                                            )}
                                            <input type="hidden" {...register('featured_image', { required: 'Featured image is required' })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Media Gallery */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <GallerySection
                                        control={control}
                                        setValue={setValue}
                                        uploadedFiles={uploadedFiles}
                                        setUploadedFiles={handleSetFiles}
                                        getValues={getValues}
                                    />
                                </div>

                                {/* Video Content */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <VideoSection
                                        uploadedFiles={uploadedFiles}
                                        setUploadedFiles={handleSetFiles}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className='shrink-0 flex justify-end items-center gap-3 p-6 bg-white border-t border-gray-100 z-20 sticky bottom-0'>
                        <Button
                            type='button'
                            onClick={handleCloseAttempt}
                            variant='outline'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='button'
                            onClick={onSaveDraft}
                            variant='secondary'
                            disabled={submitting || submittingDraft}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none"
                        >
                            {submittingDraft ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving Draft...</span>
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    <span>Save as Draft</span>
                                </>
                            )}
                        </Button>
                        <Button
                            type='submit'
                            disabled={submitting || submittingDraft}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    {editSlug ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    <span>{editSlug ? 'Update University' : 'Create University'}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>

            <ConfirmationDialog
                open={showCloseConfirm}
                onClose={() => setShowCloseConfirm(false)}
                onConfirm={() => {
                    setShowCloseConfirm(false)
                    onSystemClose()
                }}
                title="Discard Unsaved Changes?"
                message="You have unsaved changes in this form. Are you sure you want to close? All progress will be lost."
                confirmText="Discard Changes"
                cancelText="Keep Editing"
                variant="destructive"
            />
        </Dialog>
    )
}

export default CreateUpdateUniversityModal
