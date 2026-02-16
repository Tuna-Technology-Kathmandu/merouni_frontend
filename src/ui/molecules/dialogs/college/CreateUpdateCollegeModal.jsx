import UniversityDropdown from '@/ui/molecules/dropdown/UniversityDropdown'
import { Button } from '@/ui/shadcn/button'
import { Plus, Trash2 } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/ui/shadcn/dialog'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Select } from '@/ui/shadcn/select'
import { Textarea } from '@/ui/shadcn/textarea'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import {
    createCollege,
    getUniversityBySlug
} from '@/app/(dashboard)/dashboard/addCollege/actions'
import { authFetch } from '@/app/utils/authFetch'
import GallerySection from './components/GallerySection'
import VideoSection from './components/VideoSection'
import FileUploadWithPreview from './components/MediaUploadWithBranding'

const CKUni = dynamic(() => import('../../../molecules/ck-editor/CKUni'), {
    ssr: false
})


const CreateUpdateCollegeModal = ({
    isOpen,
    handleCloseModal,
    editSlug,
    onSuccess,
    allDegrees
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [loadingData, setLoadingData] = useState(false)
    const [uniSlug, setUniSlug] = useState('')
    const [universityPrograms, setUniversityPrograms] = useState([])
    const [loadingPrograms, setLoadingPrograms] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState({
        college_logo: '',
        featured_img: '',
        images: [],
        videos: []
    })

    const author_id = useSelector((state) => state.user.data.id)


    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            author_id: author_id,
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
            contacts: ['', ''],
            members: [],
            faqs: [{ question: '', answer: '' }]
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

    // Reset form when modal closes or opens for new college
    useEffect(() => {
        if (!isOpen) {
            reset()
            setUploadedFiles({
                college_logo: '',
                featured_img: '',
                images: [],
                videos: []
            })
            setUniSlug('')
            setUniversityPrograms([])
        }
    }, [isOpen, reset])

    // Load college data for editing
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

                    // Populate fields
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

                    if (collegeData.university_id) {
                        setValue('university_id', Number(collegeData.university_id))
                    }

                    if (collegeData.university) {
                        setUniSlug(collegeData.university.slugs)
                    }

                    if (collegeData.degrees && Array.isArray(collegeData.degrees)) {
                        const degreeIds = collegeData.degrees.map((degree) => String(degree.id))
                        setValue('degrees', degreeIds)
                    }

                    const programIds = collegeData.collegeCourses
                        ?.map((course) => course.program_id || course.program?.id)
                        .filter((id) => id !== undefined) || []

                    setValue('courses', [...new Set(programIds)])

                    if (collegeData.collegeAddress) {
                        setValue('address.country', collegeData.collegeAddress.country)
                        setValue('address.state', collegeData.collegeAddress.state)
                        setValue('address.city', collegeData.collegeAddress.city)
                        setValue('address.street', collegeData.collegeAddress.street)
                        setValue('address.postal_code', collegeData.collegeAddress.postal_code)
                    }

                    const contacts = collegeData.collegeContacts?.map(
                        (contact) => contact.contact_number
                    ) || ['', '']
                    setValue('contacts', contacts)

                    const galleryItems = collegeData.collegeGallery || []
                    const images = galleryItems
                        .filter((item) => item.file_type === 'image' && item.file_url)
                        .map((img) => ({ url: img.file_url, file_type: 'image' }))

                    const videos = galleryItems
                        .filter((item) => item.file_type === 'video')
                        .map((vid) => ({ url: vid.file_url, file_type: 'video' }))

                    setUploadedFiles({
                        college_logo: collegeData.college_logo || '',
                        featured_img: collegeData.featured_img || '',
                        images: images.length === 1 && !images[0].url ? [] : images,
                        videos
                    })

                    setValue('images', [...images, ...videos])

                    const memberData = collegeData.collegeMembers?.length
                        ? collegeData.collegeMembers
                        : [{ name: '', contact_number: '', role: '', description: '' }]
                    setValue('members', memberData)

                    if (collegeData.college_broucher) {
                        setValue('college_broucher', collegeData.college_broucher)
                    }

                    const facilityData = collegeData.collegeFacility?.length
                        ? collegeData.collegeFacility.map((f) => ({
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

    // Load university programs
    useEffect(() => {
        const fetchPrograms = async () => {
            if (!uniSlug) {
                setUniversityPrograms([])
                return
            }
            try {
                setLoadingPrograms(true)
                const universityData = await getUniversityBySlug(uniSlug)
                setUniversityPrograms(universityData.university_programs || [])
            } catch (error) {
                console.error('Error fetching university programs:', error)
            } finally {
                setLoadingPrograms(false)
            }
        }
        fetchPrograms()
    }, [uniSlug])

    const onSubmit = async (data) => {
        try {
            setSubmitting(true)

            // Filter logic
            data.members = (data.members || []).filter(m => Object.values(m).some(v => v && v.toString().trim() !== ''))
            if (data.members.length === 0) delete data.members

            data.university_id = parseInt(data.university_id)
            data.degrees = (data.degrees || []).map(id => parseInt(id)).filter(id => !isNaN(id))

            const coursesArray = (data.courses || []).map(c => parseInt(c)).filter(c => !isNaN(c) && c > 0)
            if (coursesArray.length > 0) data.courses = coursesArray
            else delete data.courses

            data.college_logo = uploadedFiles.logo
            data.featured_img = uploadedFiles.featured
            data.images = [...uploadedFiles.images, ...uploadedFiles.videos]

            data.facilities = (data.facilities || []).filter(f => f.title.trim() !== '' || f.description.trim() !== '' || f.icon.trim() !== '')
            if (data.facilities.length === 0) delete data.facilities

            data.faqs = (data.faqs || []).filter(f => f.question.trim() !== '' || f.answer.trim() !== '')
            if (data.faqs.length === 0) delete data.faqs

            if (editSlug && data.images.length === 0) {
                data.images = [{ file_type: '', url: '' }]
            }

            await createCollege(data)

            toast.success(editSlug ? 'College updated successfully!' : 'College created successfully!')
            onSuccess?.()
            handleCloseModal()
        } catch (error) {
            console.error('Submission error:', error)
            toast.error(error.message || 'Failed to submit data')
        } finally {
            setSubmitting(false)
        }
    }
    return (
        <Dialog isOpen={isOpen} onClose={handleCloseModal} className='max-w-7xl'>
            <DialogContent className='max-h-[90vh] flex flex-col'>
                <DialogHeader>
                    <DialogTitle>{editSlug ? 'Edit College' : 'Add College'}</DialogTitle>
                    <DialogClose onClick={handleCloseModal} />
                </DialogHeader>
                <div className='flex-1 overflow-y-auto px-1'>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 pb-20'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Basic Information */}
                            <div className='space-y-4'>
                                <h3 className='text-lg font-semibold border-b pb-2'>
                                    Basic Information
                                </h3>
                                <div className='space-y-2'>
                                    <Label htmlFor='name' required>College Name</Label>
                                    <Input
                                        id='name'
                                        {...register('name', { required: 'College name is required' })}
                                        placeholder='Enter college name'
                                    />
                                    {errors.name && (
                                        <span className='text-red-500 text-xs'>
                                            {errors.name.message}
                                        </span>
                                    )}
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='institute_type'>Institute Type</Label>
                                        <Select
                                            id='institute_type'
                                            {...register('institute_type')}
                                        >
                                            <option value='Private'>Private</option>
                                            <option value='Public'>Public</option>
                                        </Select>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='website_url'>Website URL</Label>
                                        <Input
                                            id='website_url'
                                            {...register('website_url')}
                                            placeholder='https://example.com'
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label>Institute Level</Label>
                                    <div className='flex gap-4 items-center h-10'>
                                        {['School', 'College'].map((level) => (
                                            <div key={level} className='flex items-center space-x-2'>
                                                <input
                                                    type='checkbox'
                                                    id={`level-${level}`}
                                                    value={level}
                                                    {...register('institute_level')}
                                                    className='h-4 w-4 rounded border-gray-300'
                                                />
                                                <label
                                                    htmlFor={`level-${level}`}
                                                    className='text-sm text-gray-700'
                                                >
                                                    {level}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Media & Branding */}
                            <div className='space-y-4'>
                                <h3 className='text-lg font-semibold border-b pb-2'>
                                    Media & Branding
                                </h3>
                                <div className='grid grid-cols-2 gap-4'>
                                    <FileUploadWithPreview
                                        label='College Logo'
                                        onUploadComplete={(url) => setUploadedFiles(prev => ({ ...prev, college_logo: url }))}
                                        defaultPreview={uploadedFiles.college_logo}
                                        onClear={() => setUploadedFiles(prev => ({ ...prev, college_logo: '' }))}
                                    />
                                    <FileUploadWithPreview
                                        label='Featured Image'
                                        onUploadComplete={(url) => setUploadedFiles(prev => ({ ...prev, featured: url }))}
                                        defaultPreview={uploadedFiles.featured}
                                        onClear={() => setUploadedFiles(prev => ({ ...prev, featured: '' }))}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='college_broucher'>Brochure (PDF URL)</Label>
                                    <Input
                                        id='college_broucher'
                                        {...register('college_broucher')}
                                        placeholder='URL to PDF brochure'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description & Editor */}
                        <div className='space-y-4'>
                            <h3 className='text-lg font-semibold border-b pb-2'>
                                About College
                            </h3>
                            <div className='space-y-2'>
                                <Label htmlFor='description'>Short Description</Label>
                                <Textarea
                                    id='description'
                                    {...register('description')}
                                    placeholder='Brief overview of the college...'
                                    rows={4}
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label>Full Content</Label>
                                <CKUni
                                    onChange={(data) => setValue('content', data)}
                                    data={watch('content')}
                                />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Academic Details */}
                            <div className='space-y-4'>
                                <h3 className='text-lg font-semibold border-b pb-2'>
                                    Academic Details
                                </h3>
                                <div className='space-y-2'>
                                    <Label>University</Label>
                                    <UniversityDropdown
                                        onChange={(id, selectedUni) => {
                                            setValue('university_id', id)
                                            if (selectedUni) setUniSlug(selectedUni.slugs)
                                        }}
                                        value={watch('university_id')}
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label>Degrees</Label>
                                    <div className='grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded'>
                                        {allDegrees.map((degree) => (
                                            <div key={degree.id} className='flex items-center space-x-2'>
                                                <input
                                                    type='checkbox'
                                                    id={`degree-${degree.id}`}
                                                    value={degree.id}
                                                    {...register('degrees')}
                                                    className='h-4 w-4 rounded border-gray-300'
                                                />
                                                <label
                                                    htmlFor={`degree-${degree.id}`}
                                                    className='text-sm text-gray-700'
                                                >
                                                    {degree.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label>Programs</Label>
                                    {loadingPrograms ? (
                                        <div className='text-sm text-gray-500'>Loading programs...</div>
                                    ) : (
                                        <div className='grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded'>
                                            {universityPrograms && universityPrograms.length > 0 ? (
                                                universityPrograms.map((course) => (
                                                    <div key={course.id} className='flex items-center space-x-2'>
                                                        <input
                                                            type='checkbox'
                                                            id={`course-${course.program_id}`}
                                                            value={course.program_id}
                                                            {...register('courses')}
                                                            className='h-4 w-4 rounded border-gray-300'
                                                        />
                                                        <label
                                                            htmlFor={`course-${course.program_id}`}
                                                            className='text-sm text-gray-700'
                                                        >
                                                            {course.program.title}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className='text-sm text-gray-500'>
                                                    Select a university to see programs
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contacts & Address */}
                            <div className='space-y-4'>
                                <h3 className='text-lg font-semibold border-b pb-2'>
                                    Location & Contact
                                </h3>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='address.country'>Country</Label>
                                        <Input
                                            id='address.country'
                                            {...register('address.country')}
                                            placeholder='Nepal'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='address.state'>State</Label>
                                        <Input
                                            id='address.state'
                                            {...register('address.state')}
                                            placeholder='State/Province'
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='address.city'>City</Label>
                                        <Input
                                            id='address.city'
                                            {...register('address.city')}
                                            placeholder='City'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor='address.street'>Street</Label>
                                        <Input
                                            id='address.street'
                                            {...register('address.street')}
                                            placeholder='Street Address'
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label>Contact Numbers</Label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {[0, 1].map((index) => (
                                            <Input
                                                key={index}
                                                placeholder={`Phone ${index + 1}`}
                                                {...register(`contacts[${index}]`)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <GallerySection
                            control={control}
                            setValue={setValue}
                            uploadedFiles={uploadedFiles}
                            setUploadedFiles={setUploadedFiles}
                            getValues={getValues}
                        />
                        <VideoSection
                            control={control}
                            setValue={setValue}
                            uploadedFiles={uploadedFiles}
                            setUploadedFiles={setUploadedFiles}
                            getValues={getValues}
                        />

                        <div className='space-y-6 pt-6'>
                            <div className='p-6 border rounded-xl bg-gray-50/50 shadow-sm space-y-4'>
                                <div className='flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-900'>Facilities</h3>
                                        <p className='text-xs text-gray-500'>List the amenities and services available</p>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        className='h-9 px-4 border-gray-200 hover:bg-gray-50'
                                        onClick={() => appendFacility({ title: '', description: '', icon: '' })}
                                    >
                                        <Plus className='w-4 h-4 mr-2' />
                                        Add Facility
                                    </Button>
                                </div>
                                <div className='space-y-3'>
                                    {facilityFields.length === 0 && (
                                        <div className='text-center py-6 border-2 border-dashed rounded-xl bg-white/30 border-gray-200'>
                                            <p className='text-sm text-gray-400'>No facilities added yet.</p>
                                        </div>
                                    )}
                                    {facilityFields.map((field, index) => (
                                        <div key={field.id} className='group relative p-5 bg-white border border-gray-200 rounded-xl transition-all hover:shadow-md'>
                                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pr-10'>
                                                <div className='space-y-1.5'>
                                                    <Label className='text-xs text-gray-400'>Title</Label>
                                                    <Input
                                                        {...register(`facilities[${index}].title`)}
                                                        placeholder='e.g. WiFi'
                                                        className='h-9 bg-gray-50/30 border-gray-100 focus-visible:ring-1'
                                                    />
                                                </div>
                                                <div className='space-y-1.5'>
                                                    <Label className='text-xs text-gray-400'>Description</Label>
                                                    <Input
                                                        {...register(`facilities[${index}].description`)}
                                                        placeholder='Details...'
                                                        className='h-9 bg-gray-50/30 border-gray-100 focus-visible:ring-1'
                                                    />
                                                </div>
                                                <div className='space-y-1.5'>
                                                    <Label className='text-xs text-gray-400'>Icon Name</Label>
                                                    <Input
                                                        {...register(`facilities[${index}].icon`)}
                                                        placeholder='lucide name'
                                                        className='h-9 bg-gray-50/30 border-gray-100 focus-visible:ring-1'
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                className='absolute top-4 right-4 h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full'
                                                onClick={() => removeFacility(index)}
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='p-6 border rounded-xl bg-gray-50/50 shadow-sm space-y-4'>
                                <div className='flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-900'>Team Members</h3>
                                        <p className='text-xs text-gray-500'>Manage the faculty and staff directory</p>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        className='h-9 px-4 border-gray-200 hover:bg-gray-50'
                                        onClick={() => appendMember({ name: '', position: '', image_url: '', bio: '', contact_info: '' })}
                                    >
                                        <Plus className='w-4 h-4 mr-2' />
                                        Add Member
                                    </Button>
                                </div>
                                <div className='space-y-3'>
                                    {memberFields.length === 0 && (
                                        <div className='text-center py-6 border-2 border-dashed rounded-xl bg-white/30 border-gray-200'>
                                            <p className='text-sm text-gray-400'>No members added yet.</p>
                                        </div>
                                    )}
                                    {memberFields.map((field, index) => (
                                        <div key={field.id} className='group relative p-5 bg-white border border-gray-200 rounded-xl transition-all hover:shadow-md'>
                                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-10'>
                                                <div className='space-y-1.5'>
                                                    <Label className='text-xs text-gray-400'>Name</Label>
                                                    <Input
                                                        {...register(`members[${index}].name`)}
                                                        className='h-9 bg-gray-50/30 border-gray-100 focus-visible:ring-1'
                                                    />
                                                </div>
                                                <div className='space-y-1.5'>
                                                    <Label className='text-xs text-gray-400'>Position</Label>
                                                    <Input
                                                        {...register(`members[${index}].position`)}
                                                        className='h-9 bg-gray-50/30 border-gray-100 focus-visible:ring-1'
                                                    />
                                                </div>
                                                <div className='space-y-1.5'>
                                                    <Label className='text-xs text-gray-400'>Image URL</Label>
                                                    <Input
                                                        {...register(`members[${index}].image_url`)}
                                                        className='h-9 bg-gray-50/30 border-gray-100 focus-visible:ring-1'
                                                    />
                                                </div>
                                                <div className='space-y-1.5 lg:col-span-2'>
                                                    <Label className='text-xs text-gray-400'>Bio</Label>
                                                    <Textarea
                                                        {...register(`members[${index}].bio`)}
                                                        rows={2}
                                                        className='text-sm bg-gray-50/30 border-gray-100 focus-visible:ring-1 resize-none'
                                                    />
                                                </div>
                                                <div className='space-y-1.5'>
                                                    <Label className='text-xs text-gray-400'>Contact Info</Label>
                                                    <Input
                                                        {...register(`members[${index}].contact_info`)}
                                                        className='h-9 bg-gray-50/30 border-gray-100 focus-visible:ring-1'
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                className='absolute top-4 right-4 h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full'
                                                onClick={() => removeMember(index)}
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='p-6 border rounded-xl bg-gray-50/50 shadow-sm space-y-4'>
                                <div className='flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm'>
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-900'>FAQs</h3>
                                        <p className='text-xs text-gray-500'>Manage frequently asked questions</p>
                                    </div>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        className='h-9 px-4 border-gray-200 hover:bg-gray-50'
                                        onClick={() => appendFaq({ question: '', answer: '' })}
                                    >
                                        <Plus className='w-4 h-4 mr-2' />
                                        Add FAQ
                                    </Button>
                                </div>

                                <div className='space-y-3'>
                                    {faqFields.length === 0 && (
                                        <div className='text-center py-6 border-2 border-dashed rounded-xl bg-white/30 border-gray-200'>
                                            <p className='text-sm text-gray-400'>No FAQs added yet.</p>
                                        </div>
                                    )}
                                    {faqFields.map((field, index) => (
                                        <div key={field.id} className='group relative p-5 bg-white border border-gray-200 rounded-xl transition-all hover:shadow-md'>
                                            <div className='grid grid-cols-1 gap-4 pr-10'>
                                                <div className='space-y-1.5'>
                                                    <Input
                                                        {...register(`faqs[${index}].question`)}
                                                        placeholder='Enter the question...'
                                                        className='font-medium text-gray-900 focus-visible:ring-1 border-gray-100 bg-gray-50/30'
                                                    />
                                                </div>
                                                <div className='space-y-1.5'>
                                                    <Textarea
                                                        {...register(`faqs[${index}].answer`)}
                                                        placeholder='Enter the answer...'
                                                        rows={2}
                                                        className='text-sm text-gray-600 focus-visible:ring-1 border-gray-100 bg-gray-50/30 resize-none min-h-[80px]'
                                                    />
                                                </div>
                                            </div>
                                            <Button
                                                type='button'
                                                variant='ghost'
                                                size='icon'
                                                className='absolute top-4 right-4 h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors rounded-full'
                                                onClick={() => removeFaq(index)}
                                            >
                                                <Trash2 className='w-4 h-4' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                            <Button
                                type='button'
                                onClick={handleCloseModal}
                                variant='outline'
                                size='sm'
                            >
                                Cancel
                            </Button>
                            <Button type='submit' disabled={submitting || loadingData} size='sm'>
                                {submitting
                                    ? editSlug
                                        ? 'Updating...'
                                        : 'Creating...'
                                    : editSlug
                                        ? 'Update College'
                                        : 'Create College'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUpdateCollegeModal

