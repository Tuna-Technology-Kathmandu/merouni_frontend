import UniversityDropdown from '@/ui/molecules/dropdown/UniversityDropdown'
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
        logo: '',
        featured: '',
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
            google_map_url: '',
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
            map_type: ''
        }
    })

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
                logo: '',
                featured: '',
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
                    setValue('google_map_url', collegeData.google_map_url)
                    setValue('map_type', collegeData.map_type || '')

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
                        logo: collegeData.college_logo || '',
                        featured: collegeData.featured_img || '',
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
                        : [{ title: '', description: '', icon: '' }]
                    setValue('facilities', facilityData)

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
                        {/* Form Fields - Directly copied JSX */}
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
                                    <Label htmlFor='google_map_url'>
                                        {watch('map_type') === 'embed_map_url' ? 'Embed Map URL' : 'Google Map URL'}
                                    </Label>
                                    <Input
                                        id='google_map_url'
                                        {...register('google_map_url')}
                                        placeholder={
                                            watch('map_type') === 'embed_map_url'
                                                ? 'Paste the iframe src URL'
                                                : 'Paste Google Maps embed iframe code or URL'
                                        }
                                    />
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='map_type'>Map Type</Label>
                                    <Select
                                        id='map_type'
                                        {...register('map_type')}
                                    >
                                        <option value=''>Select Map Type</option>
                                        <option value='embed_map_url'>Embed Map URL</option>
                                        <option value='google_map_url'>Google Map URL</option>
                                    </Select>
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
                                        onUploadComplete={(url) => setUploadedFiles(prev => ({ ...prev, logo: url }))}
                                        defaultPreview={uploadedFiles.logo}
                                        onClear={() => setUploadedFiles(prev => ({ ...prev, logo: '' }))}
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

                        <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
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
                                                            id={`course-${course.id}`}
                                                            value={course.id}
                                                            {...register('courses')}
                                                            className='h-4 w-4 rounded border-gray-300'
                                                        />
                                                        <label
                                                            htmlFor={`course-${course.id}`}
                                                            className='text-sm text-gray-700'
                                                        >
                                                            {course.title}
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
                            <div className='p-4 border rounded-lg bg-gray-50'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-lg font-semibold'>Facilities</h3>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => appendFacility({ title: '', description: '', icon: '' })}
                                    >
                                        Add Facility
                                    </Button>
                                </div>
                                <div className='space-y-4'>
                                    {facilityFields.map((field, index) => (
                                        <div key={field.id} className='grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded bg-white'>
                                            <div className='space-y-1'>
                                                <Label>Title</Label>
                                                <Input {...register(`facilities[${index}].title`)} placeholder='e.g. WiFi' />
                                            </div>
                                            <div className='space-y-1 md:col-span-2'>
                                                <Label>Description</Label>
                                                <Input {...register(`facilities[${index}].description`)} placeholder='Details...' />
                                            </div>
                                            <div className='flex items-end gap-2'>
                                                <div className='flex-1 space-y-1'>
                                                    <Label>Icon</Label>
                                                    <Input {...register(`facilities[${index}].icon`)} placeholder='lucide icon name' />
                                                </div>
                                                <Button
                                                    type='button'
                                                    variant='ghost'
                                                    size='sm'
                                                    className='text-red-500 hover:text-red-700 hover:bg-red-50'
                                                    onClick={() => removeFacility(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='p-4 border rounded-lg bg-gray-50'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-lg font-semibold'>Team Members</h3>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => appendMember({ name: '', position: '', image_url: '', bio: '', contact_info: '' })}
                                    >
                                        Add Member
                                    </Button>
                                </div>
                                <div className='space-y-4'>
                                    {memberFields.map((field, index) => (
                                        <div key={field.id} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded bg-white'>
                                            <div className='space-y-1'>
                                                <Label>Name</Label>
                                                <Input {...register(`members[${index}].name`)} />
                                            </div>
                                            <div className='space-y-1'>
                                                <Label>Position</Label>
                                                <Input {...register(`members[${index}].position`)} />
                                            </div>
                                            <div className='space-y-1'>
                                                <Label>Member Image URL</Label>
                                                <Input {...register(`members[${index}].image_url`)} />
                                            </div>
                                            <div className='space-y-1 lg:col-span-2'>
                                                <Label>Bio</Label>
                                                <Textarea {...register(`members[${index}].bio`)} rows={2} />
                                            </div>
                                            <div className='space-y-1 flex flex-col justify-end'>
                                                <Label>Contact Info</Label>
                                                <div className='flex gap-2'>
                                                    <Input {...register(`members[${index}].contact_info`)} className='flex-1' />
                                                    <Button
                                                        type='button'
                                                        variant='ghost'
                                                        size='sm'
                                                        className='text-red-500 hover:text-red-700 hover:bg-red-50'
                                                        onClick={() => removeMember(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
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
