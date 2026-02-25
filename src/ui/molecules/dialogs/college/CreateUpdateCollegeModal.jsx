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
import { Textarea } from '@/ui/shadcn/textarea'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import EmojiPicker from 'emoji-picker-react'
import axios from 'axios'
import {
    Activity,
    Check,
    FileText,
    GraduationCap,
    HelpCircle,
    Image as ImageIcon,
    Info,
    Layers,
    Loader2,
    Map,
    MapPin,
    Plus,
    Trash2,
    Users,
    Video
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import {
    createCollege,
    updateCollege,
    saveDraft,
    getProgramsByUniversity,
    fetchUniversities
} from '@/app/(dashboard)/dashboard/colleges/actions'
import { cn } from '@/app/lib/utils'
import { authFetch } from '@/app/utils/authFetch'
import GallerySection from './components/GallerySection'
import FileUploadWithPreview from './components/MediaUploadWithBranding'
import VideoSection from './components/VideoSection'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-md bg-[#387cae]/10 flex items-center justify-center text-[#387cae] shadow-sm border border-[#387cae]/20">
            <Icon size={20} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
            {subtitle && <p className="text-[11px] mt-0.5 font-semibold tracking-wider">{subtitle}</p>}
        </div>
    </div>
)


const CreateUpdateCollegeModal = ({
    isOpen,
    handleCloseModal: onSystemClose,
    editSlug,
    onSuccess,
    allDegrees
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [submittingDraft, setSubmittingDraft] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [showCloseConfirm, setShowCloseConfirm] = useState(false)
    const [universityPrograms, setUniversityPrograms] = useState([])
    const [loadingPrograms, setLoadingPrograms] = useState(false)
    const [filesDirty, setFilesDirty] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState({
        college_logo: '',
        featured_img: '',
        images: [],
        videos: []
    })
    const [selectedUniversities, setSelectedUniversities] = useState([])
    const [openEmojiPickerIndex, setOpenEmojiPickerIndex] = useState(null)

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
            name: '',
            author_id: author_id,
            university_id: [],
            institute_type: 'Private',
            institute_level: [],
            courses: [],
            degrees: [],
            description: '',
            content: '',
            website_url: '',
            college_logo: '',
            featured_img: '',
            images: [],
            college_broucher: '',
            facilities: [],
            address: {
                country: '',
                state: '',
                city: '',
                street: '',
                postal_code: ''
            },
            google_map_url: '',
            map_type: '',
            contacts: [],
            members: [],
            faqs: [],
            status: 'published'
        }
    })

    const {
        fields: faqFields,
        append: appendFaq,
        remove: removeFaq
    } = useFieldArray({ control, name: 'faqs' })

    const {
        fields: memberFields,
        append: appendMember,
        remove: removeMember
    } = useFieldArray({ control, name: 'members' })

    const {
        fields: facilityFields,
        append: appendFacility,
        remove: removeFacility
    } = useFieldArray({ control, name: 'facilities' })

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

    useEffect(() => {
        if (!isOpen) {
            reset()
            setUploadedFiles({
                college_logo: '',
                featured_img: '',
                images: [],
                videos: []
            })
            setFilesDirty(false)
            setUniversityPrograms([])
            setSelectedUniversities([])
            setOpenEmojiPickerIndex(null)
        }
    }, [isOpen, reset])

    useEffect(() => {
        if (isOpen && editSlug) {
            const fetchCollegeData = async () => {
                try {
                    setLoadingData(true)
                    const response = await authFetch(
                        `${process.env.baseUrl}/college/${editSlug}`,
                        { headers: { 'Content-Type': 'application/json' } }
                    )

                    if (!response.ok) throw new Error('Failed to fetch college data')

                    let collegeData = await response.json()
                    collegeData = collegeData.item

                    setValue('id', collegeData.id)
                    setValue('name', collegeData.name)
                    setValue('institute_type', collegeData.institute_type)
                    setValue(
                        'institute_level',
                        typeof collegeData.institute_level === 'string'
                            ? JSON.parse(collegeData.institute_level || '[]')
                            : collegeData.institute_level || []
                    )
                    setValue('description', collegeData.description)
                    setValue('content', collegeData.content)
                    setValue('website_url', collegeData.website_url)
                    setValue('status', collegeData.status || 'published')

                    const uniList = collegeData.universities || (collegeData.university ? [collegeData.university] : [])
                    setSelectedUniversities(uniList)

                    const uniIds = (collegeData.university_id
                        ? (Array.isArray(collegeData.university_id) ? collegeData.university_id : [collegeData.university_id])
                        : uniList.map(u => u.id)
                    ).map(Number).filter(id => !isNaN(id))

                    setValue('university_id', uniIds)

                    if (collegeData.degrees && Array.isArray(collegeData.degrees)) {
                        const degreeIds = collegeData.degrees.map((degree) => String(degree.id))
                        setValue('degrees', degreeIds)
                    }

                    const collegeCourses = collegeData.collegeCourses || []
                    const programIds = collegeCourses
                        .map((course) => course.program_id || course.program?.id)
                        .filter((id) => id !== undefined)

                    setValue('courses', [...new Set(programIds)])

                    // Pre-populate university programs to show titles immediately
                    const initialPrograms = collegeCourses
                        .map(cc => ({
                            id: cc.program_id || cc.program?.id,
                            title: cc.program?.title || cc.course?.title || 'Unknown'
                        }))
                        .filter(p => p.id)

                    if (initialPrograms.length > 0) {
                        setUniversityPrograms(initialPrograms)
                    }

                    if (collegeData.collegeAddress) {
                        setValue('address.country', collegeData.collegeAddress.country)
                        setValue('address.state', collegeData.collegeAddress.state)
                        setValue('address.city', collegeData.collegeAddress.city)
                        setValue('address.street', collegeData.collegeAddress.street)
                        setValue('address.postal_code', collegeData.collegeAddress.postal_code)
                    }

                    setValue('google_map_url', collegeData.google_map_url || '')
                    setValue('map_type', collegeData.map_type || '')

                    const contacts = collegeData.collegeContacts?.map(
                        (contact) => contact.contact_number
                    ) || ['', '']
                    setValue('contacts', contacts)

                    const galleryItems = collegeData.gallery || []
                    const images = galleryItems
                        .filter(img => img.file_type === 'image' || !img.file_type)
                        .map((img) => ({ url: img.file_url, file_type: 'image' }))

                    const videos = galleryItems
                        .filter(vid => vid.file_type === 'video')
                        .map((vid) => {
                            const youtubeId = vid.file_url.includes('embed/')
                                ? vid.file_url.split('embed/')[1].split('?')[0]
                                : null
                            return {
                                url: vid.file_url,
                                file_type: 'video',
                                thumbnail: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null,
                                youtubeId
                            }
                        })

                    setUploadedFiles({
                        college_logo: collegeData.college_logo || '',
                        featured_img: collegeData.featured_img || '',
                        images: images.length === 1 && !images[0].url ? [] : images,
                        videos: videos
                    })

                    setValue('college_logo', collegeData.college_logo || '')
                    setValue('featured_img', collegeData.featured_img || '')

                    setValue('images', [...images])

                    const memberData = (collegeData.collegeMembers || []).map(m => ({
                        id: m.id,
                        name: m.name || '',
                        role: m.role || '',
                        image_url: m.image_url || m.image || '',
                        description: m.description || '',
                        contact_number: m.contact_number || ''
                    }))
                    setValue('members', memberData)

                    if (collegeData.college_broucher) {
                        setValue('college_broucher', collegeData.college_broucher)
                    }

                    const facilityData = collegeData.facilities?.length
                        ? collegeData.facilities.map((f) => ({
                            title: f.title || '',
                            description: f.description || '',
                            icon: f.icon || ''
                        }))
                        : []
                    setValue('facilities', facilityData)

                    const faqData = collegeData.faqs?.length
                        ? collegeData.faqs.map((f) => ({
                            question: f.question || '',
                            answer: f.answer || ''
                        }))
                        : [{ question: '', answer: '' }]
                    setValue('faqs', faqData)

                } catch (error) {
                    console.error('Error fetching college data:', error)
                    toast.error('Failed to load college details')
                } finally {
                    setLoadingData(false)
                }
            }
            fetchCollegeData()
        }
    }, [isOpen, editSlug, setValue])

    const selectedUniIds = watch('university_id') || []

    useEffect(() => {
        const fetchPrograms = async () => {
            if (!selectedUniIds || selectedUniIds.length === 0) {
                setUniversityPrograms([])
                return
            }
            try {
                setLoadingPrograms(true)
                const universityData = await getProgramsByUniversity(selectedUniIds)
                setUniversityPrograms(universityData || [])
            } catch (error) {
                console.error('Error fetching university programs:', error)
            } finally {
                setLoadingPrograms(false)
            }
        }
        fetchPrograms()
    }, [JSON.stringify(selectedUniIds)])

    const onSearchPrograms = async (query) => {
        if (!universityPrograms) return []
        const filtered = query
            ? universityPrograms.filter(p => p.title?.toLowerCase().includes(query.toLowerCase()))
            : universityPrograms

        return filtered.map(p => ({
            id: p.id,
            title: p.title || 'Unknown'
        }))
    }

    const handleSelectProgram = (program) => {
        const currentCourses = getValues('courses') || []
        const programId = program.id || program
        if (!currentCourses.includes(programId)) {
            setValue('courses', [...currentCourses, programId], { shouldDirty: true })
        }
    }

    const handleRemoveProgram = (program) => {
        const currentCourses = getValues('courses') || []
        const programId = program.id || program
        setValue('courses', currentCourses.filter(id => id !== programId), { shouldDirty: true })
    }

    const selectedProgramIds = watch('courses') || []
    const selectedPrograms = Array.isArray(universityPrograms)
        ? universityPrograms
            .filter(p => selectedProgramIds.map(String).includes(String(p.id)))
            .map(p => ({ id: p.id, title: p.title }))
        : []

    const onSearchDegrees = async (query) => {
        if (!allDegrees) return []
        return query
            ? allDegrees.filter(d => d.title?.toLowerCase().includes(query.toLowerCase()))
            : allDegrees
    }

    const handleSelectDegree = (degree) => {
        const currentDegrees = getValues('degrees') || []
        const degreeId = String(degree.id || degree)
        if (!currentDegrees.includes(degreeId)) {
            setValue('degrees', [...currentDegrees, degreeId], { shouldDirty: true })
        }
    }

    const handleRemoveDegree = (degree) => {
        const currentDegrees = getValues('degrees') || []
        const degreeId = String(degree.id || degree)
        setValue('degrees', currentDegrees.filter(id => id !== degreeId), { shouldDirty: true })
    }

    const selectedDegreeIds = watch('degrees') || []
    const selectedDegrees = allDegrees
        ? allDegrees
            .filter(d => selectedDegreeIds.includes(String(d.id)))
            .map(d => ({ id: d.id, title: d.title }))
        : []

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

    const handleSave = async (data, status = 'published') => {
        try {
            status === 'draft' ? setSubmittingDraft(true) : setSubmitting(true)

            // Always include author_id from current redux state
            data.author_id = author_id

            // Filter logic
            data.members = (data.members || []).map(m => ({
                id: m.id,
                name: m.name,
                role: m.role,
                image_url: m.image_url,
                description: m.description,
                contact_number: m.contact_number
            })).filter(m => m.name || m.role || m.description || m.contact_number || m.image_url)
            if (data.members.length === 0) delete data.members

            const uniIds = (data.university_id || []).map(id => parseInt(id)).filter(id => !isNaN(id))
            if (uniIds.length > 0) data.university_id = uniIds
            else delete data.university_id

            data.degrees = (data.degrees || []).map(id => parseInt(id)).filter(id => !isNaN(id))

            const coursesArray = (data.courses || []).map(c => parseInt(c)).filter(c => !isNaN(c) && c > 0)
            if (coursesArray.length > 0) data.courses = coursesArray
            else delete data.courses

            data.college_logo = uploadedFiles.college_logo
            data.featured_img = uploadedFiles.featured_img
            data.images = [...(uploadedFiles.images || []), ...(uploadedFiles.videos || [])]

            data.facilities = (data.facilities || []).filter(f => f.title.trim() !== '' || f.description.trim() !== '' || f.icon.trim() !== '')
            if (data.facilities.length === 0) delete data.facilities

            data.faqs = (data.faqs || []).filter(f => f.question.trim() !== '' || f.answer.trim() !== '')
            if (data.faqs.length === 0) delete data.faqs

            if (editSlug && data.images.length === 0) {
                data.images = [{ file_type: '', url: '' }]
            }

            data.status = status
            // Ensure college_id is present for updates/drafts of existing colleges
            if (editSlug && data.id) {
                data.college_id = data.id
            }


            // Use saveDraft (POST) for Drafts, regular logic for Published
            if (status === 'draft') {
                await saveDraft(data)
            } else if (editSlug && data.id) {
                await updateCollege(data.id, data)
            } else {
                await createCollege(data)
            }

            toast.success(
                status === 'draft'
                    ? 'Draft saved successfully!'
                    : editSlug
                        ? 'College updated successfully!'
                        : 'College created successfully!'
            )
            onSuccess?.()
            onSystemClose()
        } catch (error) {
            console.log('Submission error:', error)
            toast.error(error.message || 'Failed to submit data')
        } finally {
            setSubmitting(false)
            setSubmittingDraft(false)
        }
    }

    const onSubmit = async (data) => {
        await handleSave(data, 'published')
    }

    const onSaveDraft = async () => {
        const data = getValues()
        if (!data.name || !data.name.trim()) {
            toast.error('College name is required even for drafts')
            return
        }
        await handleSave(data, 'draft')
    }
    return (
        <Dialog isOpen={isOpen} onClose={handleCloseAttempt} closeOnOutsideClick={false} className='max-w-7xl'>
            <DialogHeader className="bg-white border-b border-gray-100 p-6">
                <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="text-[#387cae]" size={24} />
                    {editSlug ? 'Edit College' : 'Add New College'}
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
                    <div className='flex-1'>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
                            {/* Left Column - Main Content (8/12) */}
                            <div className="lg:col-span-8 space-y-8">
                                {/* Basic Information */}
                                <div className='bg-white p-8 rounded-2xl border border-gray-100'>
                                    <SectionHeader icon={Info} title="Basic Information" subtitle="General identity of the college" />
                                    <div className='space-y-6'>
                                        <div>
                                            <Label required={true} htmlFor='name'>College Name</Label>
                                            <Input
                                                id='name'
                                                placeholder='Enter college name...'
                                                className="h-12 text-base rounded-md"
                                                {...register('name', { required: 'College name is required' })}
                                            />
                                            {errors.name && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.name.message}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <Label htmlFor='institute_type'>Institute Type</Label>
                                                <select
                                                    id='institute_type'
                                                    {...register('institute_type')}
                                                    className='flex h-11 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[#387cae]/5 focus:border-[#387cae] transition-all'
                                                >
                                                    <option value='Private'>Private</option>
                                                    <option value='Public'>Public</option>
                                                </select>
                                            </div>

                                            <div>
                                                <Label htmlFor='website_url'>Website URL</Label>
                                                <Input
                                                    id='website_url'
                                                    placeholder='https://example.com'
                                                    className="h-11 rounded-md border-gray-200"
                                                    {...register('website_url')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Label required={true} className="mb-3">Institute Level</Label>
                                            <div className='grid grid-cols-2 gap-4'>
                                                {['School', 'College'].map((level) => (
                                                    <label
                                                        key={level}
                                                        className={cn(
                                                            'flex items-center justify-center gap-3 p-4 rounded-md border-2 transition-all cursor-pointer group',
                                                            watch('institute_level')?.includes(level)
                                                                ? 'bg-[#387cae]/5 border-[#387cae] text-[#387cae] shadow-md'
                                                                : 'bg-white border-gray-200 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                                                        )}
                                                    >
                                                        <input
                                                            type='checkbox'
                                                            value={level}
                                                            {...register('institute_level', { required: 'At least one level is required' })}
                                                            className='hidden'
                                                        />
                                                        <div className={cn(
                                                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                            watch('institute_level')?.includes(level) ? "border-[#387cae] bg-[#387cae]" : "border-gray-200"
                                                        )}>
                                                            {watch('institute_level')?.includes(level) && <Check size={12} className="text-white" />}
                                                        </div>
                                                        <span className='text-sm font-bold'>{level}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.institute_level && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.institute_level.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* About College */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={FileText} title="About College" subtitle="Detailed description and content" />
                                    <div className='space-y-6'>
                                        <div>
                                            <Label htmlFor='description' required={true} className="mb-1.5">Short Description</Label>
                                            <Textarea
                                                id='description'
                                                placeholder='Enter a brief summary of the college...'
                                                {...register('description', { required: 'Short description is required' })}
                                                className='flex min-h-[100px] w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-[#387cae]/5 focus:border-[#387cae] transition-all resize-none'
                                            />
                                            {errors.description && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.description.message}</p>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <Label className="mb-2.5">Full Content Body</Label>
                                            <TipTapEditor
                                                onMediaUpload={onMediaUpload}
                                                showImageUpload={true}
                                                value={watch('content')}
                                                onChange={(data) => setValue('content', data, { shouldDirty: true })}
                                                placeholder='Start writing about the college here...'
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Details */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={GraduationCap} title="Academic Details" subtitle="Affiliation and programs" />
                                    <div className='space-y-6'>
                                        <div>
                                            <Label required={true}>Affiliated Universities</Label>
                                            <SearchSelectCreate
                                                onSearch={fetchUniversities}
                                                onSelect={(uni) => {
                                                    const current = getValues('university_id') || []
                                                    const newIds = [...new Set([...current, uni.id])]
                                                    setValue('university_id', newIds, { shouldDirty: true, shouldValidate: true })

                                                    const currentUnis = selectedUniversities || []
                                                    if (!currentUnis.find(u => u.id === uni.id)) {
                                                        const updatedUnis = [...currentUnis, uni]
                                                        setSelectedUniversities(updatedUnis)
                                                    }
                                                }}
                                                onRemove={(uni) => {
                                                    const targetId = uni.id || uni
                                                    const current = getValues('university_id') || []
                                                    const newIds = current.filter(id => id !== targetId)
                                                    setValue('university_id', newIds, { shouldDirty: true, shouldValidate: true })

                                                    const updatedUnis = selectedUniversities.filter(u => u.id !== targetId)
                                                    setSelectedUniversities(updatedUnis)
                                                }}
                                                selectedItems={selectedUniversities}
                                                placeholder="Search or select universities..."
                                                displayKey="fullname"
                                                valueKey="id"
                                                isMulti={true}
                                                className="w-full"
                                                renderItem={(item) => (
                                                    <div className="flex items-center gap-3">
                                                        {item.logo ? (
                                                            <img
                                                                src={item.logo}
                                                                alt={item.fullname}
                                                                className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0">
                                                                <span className="text-xs font-bold text-[#387cae]">
                                                                    {item.fullname?.charAt(0)?.toUpperCase() || 'C'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-medium text-gray-800">{item.fullname}</span>
                                                    </div>
                                                )}
                                                renderSelected={(item) => (
                                                    <div className="flex items-center gap-3">
                                                        {item.logo ? (
                                                            <img
                                                                src={item.logo}
                                                                alt={item.fullname}
                                                                className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-7 h-7 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0">
                                                                <span className="text-xs font-bold text-[#387cae]">
                                                                    {item.fullname?.charAt(0)?.toUpperCase() || 'C'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-semibold text-gray-900 truncate">{item.fullname}</span>
                                                    </div>
                                                )}
                                                inputSize='sm'
                                            />
                                            {errors.university_id && (
                                                <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.university_id.message}</p>
                                            )}
                                            <input type="hidden" {...register('university_id', { required: 'Please select at least one university' })} />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <Label className="mb-3 block">Degrees Offered</Label>
                                                <SearchSelectCreate
                                                    onSearch={onSearchDegrees}
                                                    onSelect={handleSelectDegree}
                                                    onRemove={handleRemoveDegree}
                                                    selectedItems={selectedDegrees}
                                                    placeholder="Search or select degrees..."
                                                    displayKey="title"
                                                    valueKey="id"
                                                    isMulti={true}
                                                    className="w-full"
                                                    inputSize='sm'
                                                />
                                            </div>

                                            <div>
                                                <Label className="mb-3 block">Available Programs</Label>
                                                <SearchSelectCreate
                                                    onSearch={onSearchPrograms}
                                                    onSelect={handleSelectProgram}
                                                    onRemove={handleRemoveProgram}
                                                    selectedItems={selectedPrograms}
                                                    placeholder="Search or select programs..."
                                                    displayKey="title"
                                                    valueKey="id"
                                                    isMulti={true}
                                                    className="w-full"
                                                    isLoading={loadingPrograms}
                                                    inputSize='sm'
                                                />
                                                {selectedUniIds.length === 0 && (
                                                    <p className='text-[10px] text-gray-400 mt-2 font-medium bg-gray-50 p-2 rounded-md border border-dashed border-gray-200'>
                                                        Please select a university first to view available programs.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Contact */}
                                <div className='bg-white p-8 rounded-md shadow-sm border border-gray-100'>
                                    <SectionHeader icon={MapPin} title="Location & Contact" subtitle="Where to find the college" />
                                    <div className='space-y-6'>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                            <div>
                                                <Label htmlFor='address.country' required={true}>Country</Label>
                                                <Input
                                                    id='address.country'
                                                    {...register('address.country', { required: 'Country is required' })}
                                                    placeholder='e.g. Nepal'
                                                    className="h-11 rounded-md border-gray-200"
                                                />
                                                {errors.address?.country && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.address.country.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor='address.state' required={true}>State / Province</Label>
                                                <Input
                                                    id='address.state'
                                                    {...register('address.state', { required: 'State is required' })}
                                                    placeholder='e.g. Bagmati'
                                                    className="h-11 rounded-md border-gray-200"
                                                />
                                                {errors.address?.state && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.address.state.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                            <div>
                                                <Label htmlFor='address.city' required={true}>City</Label>
                                                <Input
                                                    id='address.city'
                                                    {...register('address.city', { required: 'City is required' })}
                                                    placeholder='e.g. Kathmandu'
                                                    className="h-11 rounded-md border-gray-200"
                                                />
                                                {errors.address?.city && (
                                                    <p className='text-xs font-semibold text-red-500 mt-2 ml-1'>{errors.address.city.message}</p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor='address.street'>Street Address</Label>
                                                <Input
                                                    id='address.street'
                                                    {...register('address.street')}
                                                    placeholder='e.g. Putalisadak'
                                                    className="h-11 rounded-md border-gray-200"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div>
                                                    <Label htmlFor='map_type' className="flex items-center gap-2 mb-3">
                                                        Map Type
                                                    </Label>
                                                    <select
                                                        id='map_type'
                                                        {...register('map_type')}
                                                        className='flex h-11 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[#387cae]/5 focus:border-[#387cae] transition-all'
                                                    >
                                                        <option value=''>Select Map Type</option>
                                                        <option value='google_map_url'>Google Map URL (Share Link)</option>
                                                        <option value='embed_map_url'>Embed Map URL (Iframe Src)</option>
                                                    </select>
                                                </div>
                                                <div className="flex-1">
                                                    <Label htmlFor='google_map_url' className="flex items-center gap-2 mb-3">
                                                        <Map size={14} className="text-[#387cae]" />
                                                        Map Link / URL
                                                    </Label>
                                                    <div className="relative group">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#387cae] transition-colors">
                                                            <MapPin size={18} />
                                                        </div>
                                                        <Input
                                                            id='google_map_url'
                                                            {...register('google_map_url')}
                                                            placeholder={watch('map_type') === 'embed_map_url' ? "Paste iframe src..." : "Paste Google Maps share link..."}
                                                            className="h-11 pl-12 rounded-md bg-gray-50/30 border-gray-200 transition-all focus:ring-4 focus:ring-[#387cae]/5 focus:bg-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 -mt-2 ml-1 flex items-center gap-1.5 font-medium">
                                                <Info size={12} />
                                                This interactive map will be visible to students on the college profile.
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="mb-3 block">Contact Numbers</Label>
                                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                                {[0, 1].map((index) => (
                                                    <div key={index} className="relative group">
                                                        <Activity className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#387cae] transition-colors" />
                                                        <Input
                                                            placeholder={`Phone Number ${index + 1}`}
                                                            className="h-11 pl-10 rounded-md border-gray-200 transition-all focus:ring-4 focus:ring-[#387cae]/5"
                                                            {...register(`contacts[${index}]`, {
                                                                pattern: {
                                                                    value: /^[0-9]{10}$/,
                                                                    message: 'Must be exactly 10 digits'
                                                                }
                                                            })}
                                                            onInput={(e) => {
                                                                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                                                            }}
                                                            maxLength={10}
                                                        />
                                                        {errors?.contacts?.[index] && (
                                                            <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.contacts[index].message}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Facilities */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <div className='flex justify-between items-center mb-6'>
                                        <SectionHeader icon={Activity} title="Facilities" subtitle="Amenities and services" />
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            className='rounded-md border-[#387cae]/20 text-[#387cae] hover:bg-[#387cae]/5'
                                            onClick={() => appendFacility({ title: '', description: '', icon: '' })}
                                        >
                                            <Plus className='w-4 h-4 mr-2' />
                                            Add Facility
                                        </Button>
                                    </div>
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        {facilityFields.map((field, index) => (
                                            <div key={field.id} className='group relative p-5 bg-white border border-gray-100 rounded-md transition-all hover:shadow-xl hover:shadow-[#387cae]/5 hover:border-[#387cae]/20'>
                                                <div className='space-y-4 pr-8'>
                                                    <div className='grid grid-cols-2 gap-3'>
                                                        <div>
                                                            <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Title</Label>
                                                            <Input
                                                                {...register(`facilities[${index}].title`, { required: 'Title is required' })}
                                                                placeholder='e.g. WiFi'
                                                                className='h-9 text-xs rounded-md'
                                                            />
                                                            {errors?.facilities?.[index]?.title && (
                                                                <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.facilities[index].title.message}</p>
                                                            )}
                                                        </div>
                                                        <div className="relative">
                                                            <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Icon / Emoji</Label>
                                                            <div
                                                                className="h-9 w-full flex items-center justify-between border border-gray-200 rounded-md px-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                                                                onClick={() => setOpenEmojiPickerIndex(openEmojiPickerIndex === index ? null : index)}
                                                            >
                                                                <span className="text-sm">
                                                                    {watch(`facilities[${index}].icon`) || 'Select'}
                                                                </span>
                                                                <Plus size={12} className="text-gray-400" />
                                                            </div>

                                                            {openEmojiPickerIndex === index && (
                                                                <div className="absolute top-full left-0 mt-2 z-[100] shadow-2xl rounded-md overflow-hidden border border-gray-100">
                                                                    <div className="bg-white p-2 border-b flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase">
                                                                        <span>Select Icon</span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setOpenEmojiPickerIndex(null)}
                                                                            className="hover:text-red-500"
                                                                        >Close</button>
                                                                    </div>
                                                                    <EmojiPicker
                                                                        onEmojiClick={(emojiData) => {
                                                                            setValue(`facilities[${index}].icon`, emojiData.emoji, { shouldDirty: true })
                                                                            setOpenEmojiPickerIndex(null)
                                                                        }}
                                                                        width={280}
                                                                        height={350}
                                                                        previewConfig={{ showPreview: false }}
                                                                        skinTonesDisabled
                                                                        searchDisabled={false}
                                                                    />
                                                                </div>
                                                            )}
                                                            <input type="hidden" {...register(`facilities[${index}].icon`, { required: 'Icon is required' })} />
                                                            {errors?.facilities?.[index]?.icon && (
                                                                <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.facilities[index].icon.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block'>Description</Label>
                                                        <Input
                                                            {...register(`facilities[${index}].description`)}
                                                            placeholder='Details...'
                                                            className='h-9 text-xs rounded-md'
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='icon'
                                                    className='absolute top-4 right-4 h-7 w-7 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-md'
                                                    onClick={() => removeFacility(index)}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <div className='flex justify-between items-center mb-6'>
                                        <SectionHeader icon={Users} title="Team Members" subtitle="Faculty and staff directory" />
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            className='rounded-md border-[#387cae]/20 text-[#387cae] hover:bg-[#387cae]/5'
                                            onClick={() => appendMember({ id: null, name: '', role: '', image_url: '', description: '', contact_number: '' })}
                                        >
                                            <Plus className='w-4 h-4 mr-2' />
                                            Add Member
                                        </Button>
                                    </div>
                                    <div className='grid grid-cols-1 gap-6'>
                                        {memberFields.map((field, index) => (
                                            <div key={field.id} className='group relative p-6 bg-white border border-gray-100 rounded-3xl transition-all hover:shadow-xl hover:shadow-[#387cae]/5 hover:border-[#387cae]/20'>
                                                <div className='flex flex-col md:flex-row gap-6 pr-10'>
                                                    <div className='w-24 shrink-0'>
                                                        <Label className='text-[10px] font-bold text-gray-400 uppercase mb-3 block text-center'>Photo</Label>
                                                        <FileUploadWithPreview
                                                            onUploadComplete={(url) => setValue(`members[${index}].image_url`, url, { shouldDirty: true })}
                                                            onClear={() => setValue(`members[${index}].image_url`, '', { shouldDirty: true })}
                                                            defaultPreview={watch(`members[${index}].image_url`)}
                                                        />
                                                        <input type="hidden" {...register(`members[${index}].image_url`)} />
                                                    </div>
                                                    <div className='flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                                        <div>
                                                            <Label className='text-[10px] font-bold text-gray-400 uppercase mb-1 block'>Full Name</Label>
                                                            <Input
                                                                {...register(`members[${index}].name`, { required: 'Name is required' })}
                                                                placeholder='Dr. John Doe'
                                                                className='h-10 rounded-md'
                                                            />
                                                            {errors?.members?.[index]?.name && (
                                                                <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.members[index].name.message}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label className='text-[10px] font-bold text-slate-500 uppercase mb-1 block'>Role</Label>
                                                            <select
                                                                {...register(`members[${index}].role`, { required: 'Role is required' })}
                                                                className='flex h-10 w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[#387cae]/5 focus:border-[#387cae] transition-all'
                                                            >
                                                                <option value="">Select Role</option>
                                                                <option value="Principal">Principal</option>
                                                                <option value="Professor">Professor</option>
                                                                <option value="Lecturer">Lecturer</option>
                                                                <option value="Admin">Admin</option>
                                                            </select>
                                                            {errors?.members?.[index]?.role && (
                                                                <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.members[index].role.message}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label className='text-[10px] font-bold text-slate-500 uppercase mb-1 block'>Contact (Phone)</Label>
                                                            <Input
                                                                {...register(`members[${index}].contact_number`, {
                                                                    pattern: {
                                                                        value: /^[0-9]{10}$/,
                                                                        message: 'Contact must be exactly 10 digits'
                                                                    }
                                                                })}
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10)
                                                                }}
                                                                maxLength={10}
                                                                placeholder='98XXXXXXXX'
                                                                className='h-10 rounded-md'
                                                            />
                                                            {errors?.members?.[index]?.contact_number && (
                                                                <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.members[index].contact_number.message}</p>
                                                            )}
                                                        </div>
                                                        <div className='sm:col-span-3'>
                                                            <Label className='text-[10px] font-bold text-slate-500 uppercase mb-1 block'>Professional description</Label>
                                                            <Input
                                                                {...register(`members[${index}].description`, { required: 'Description is required' })}
                                                                placeholder='Achievement and specialization...'
                                                                className='h-10 rounded-md'
                                                            />
                                                            {errors?.members?.[index]?.description && (
                                                                <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.members[index].description.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    size='icon'
                                                    className='absolute top-6 right-6 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 border-gray-100 rounded-md'
                                                    onClick={() => removeMember(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FAQs */}
                                <div className='bg-white p-8 rounded-2xl shadow-sm border border-gray-100'>
                                    <div className='flex justify-between items-center mb-6'>
                                        <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" subtitle="Common queries about the college" />
                                        <Button
                                            type='button'
                                            variant='outline'
                                            size='sm'
                                            className='rounded-md border-[#387cae]/20 text-[#387cae] hover:bg-[#387cae]/5'
                                            onClick={() => appendFaq({ question: '', answer: '' })}
                                        >
                                            <Plus className='w-4 h-4 mr-2' />
                                            Add FAQ
                                        </Button>
                                    </div>
                                    <div className='space-y-4'>
                                        {faqFields.map((field, index) => (
                                            <div key={field.id} className='group relative p-6 bg-white border border-gray-100 rounded-2xl transition-all hover:shadow-lg hover:shadow-[#387cae]/5 hover:border-[#387cae]/20'>
                                                <div className='space-y-4 pr-10'>
                                                    <div>
                                                        <Label
                                                            required
                                                            className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block'>Question</Label>
                                                        <Input
                                                            {...register(`faqs[${index}].question`, {
                                                                required: 'Question is required'
                                                            })}
                                                            placeholder='e.g. What are the admission requirements?'
                                                            className='h-11 rounded-md text-gray-800'
                                                        />
                                                        {errors?.faqs?.[index]?.question && (
                                                            <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.faqs[index].question.message}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Label
                                                            required
                                                            className='text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block'>Answer</Label>
                                                        <Textarea
                                                            {...register(`faqs[${index}].answer`, {
                                                                required: 'Answer is required'
                                                            })}
                                                            placeholder='Provide a detailed answer...'
                                                            rows={2}
                                                            className='rounded-md resize-none min-h-[80px]'
                                                        />
                                                        {errors?.faqs?.[index]?.answer && (
                                                            <p className='text-[10px] font-semibold text-red-500 mt-1 ml-1'>{errors.faqs[index].answer.message}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='icon'
                                                    className='absolute top-6 right-4 h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-md'
                                                    onClick={() => removeFaq(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Media & Settings (4/12) */}
                            <div className="lg:col-span-4 space-y-8">
                                {/* Media & Branding */}
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={ImageIcon} title="Logo & Cover" subtitle="Identity visuals" />
                                    <div className="space-y-6">
                                        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed hover:bg-white hover:border-[#387cae]/30 transition-all group">
                                            <Label required={true} className="text-[11px] font-black tracking-[0.1em] mb-4 block  group-hover:text-[#387cae]">College Logo</Label>
                                            <FileUploadWithPreview
                                                label=''
                                                required={true}
                                                onUploadComplete={(url) => {
                                                    handleSetFiles(prev => ({ ...prev, college_logo: url }))
                                                    setValue('college_logo', url, { shouldValidate: true })
                                                }}
                                                defaultPreview={uploadedFiles.college_logo}
                                                onClear={() => {
                                                    handleSetFiles(prev => ({ ...prev, college_logo: '' }))
                                                    setValue('college_logo', '', { shouldValidate: true })
                                                }}
                                            />
                                            {errors.college_logo && (
                                                <p className='text-[10px] font-semibold text-red-500 mt-2 '>{errors.college_logo.message}</p>
                                            )}
                                            <input type="hidden" {...register('college_logo', { required: 'College logo is required' })} />
                                        </div>

                                        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed hover:bg-white hover:border-[#387cae]/30 transition-all group">
                                            <Label required={true} className="text-[11px] font-black mb-4 block group-hover:text-[#387cae]">Cover Image</Label>
                                            <FileUploadWithPreview
                                                label=''
                                                required={true}
                                                onUploadComplete={(url) => {
                                                    handleSetFiles(prev => ({ ...prev, featured_img: url }))
                                                    setValue('featured_img', url, { shouldValidate: true })
                                                }}
                                                defaultPreview={uploadedFiles.featured_img}
                                                onClear={() => {
                                                    handleSetFiles(prev => ({ ...prev, featured_img: '' }))
                                                    setValue('featured_img', '', { shouldValidate: true })
                                                }}
                                            />
                                            {errors.featured_img && (
                                                <p className='text-[10px] font-semibold text-red-500 mt-2 text-center'>{errors.featured_img.message}</p>
                                            )}
                                            <input type="hidden" {...register('featured_img', { required: 'Featured image is required' })} />
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={FileText} title="Brochure" subtitle="PDF documents" />
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor='college_broucher' className='text-xs font-bold text-gray-400 mb-1.5 block'>Brochure URL</Label>
                                            <Input
                                                id='college_broucher'
                                                {...register('college_broucher')}
                                                placeholder='URL to PDF brochure'
                                                className="h-10 rounded-md border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery Section */}
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={ImageIcon} title="Image Gallery" subtitle="Visual showcase" />
                                    <GallerySection
                                        control={control}
                                        setValue={setValue}
                                        uploadedFiles={uploadedFiles}
                                        setUploadedFiles={handleSetFiles}
                                        getValues={getValues}
                                    />
                                </div>

                                {/* Video Section */}
                                <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
                                    <SectionHeader icon={Video} title="Video Gallery" subtitle="Virtual tours & promos" />
                                    <VideoSection
                                        control={control}
                                        setValue={setValue}
                                        uploadedFiles={uploadedFiles}
                                        setUploadedFiles={handleSetFiles}
                                        getValues={getValues}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className='shrink-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3 z-20 sticky bottom-0'>
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
                            disabled={submitting || submittingDraft || loadingData}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-none px-4"
                        >
                            {submittingDraft ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving Draft...</span>
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4" />
                                    <span>Save as Draft</span>
                                </>
                            )}
                        </Button>
                        <Button
                            type='submit'
                            disabled={submitting || submittingDraft || loadingData}
                            className="px-4"
                        >
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            <span>
                                {submitting
                                    ? (editSlug ? 'Updating...' : 'Creating...')
                                    : (editSlug ? 'Update College' : 'Create College')}
                            </span>
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
                title="Unsaved Changes"
                message="You have unsaved changes. Are you sure you want to close? Your progress will be lost."
                confirmText="Discard & Close"
                cancelText="Keep Editing"
            />
        </Dialog>
    )
}

export default CreateUpdateCollegeModal

