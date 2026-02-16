import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Select } from '@/ui/shadcn/select'
import { Checkbox } from '@/ui/shadcn/checkbox'
import FileUpload from '../../addCollege/FileUpload'
import GallerySection from '../GallerySection'
import { fetchAllCourse, fetchLevel } from '../actions'
import { useDebounce } from 'use-debounce'
import { authFetch } from '@/app/utils/authFetch'

import TipTapEditor from '@/ui/shadcn/tiptap-editor'

const RequiredLabel = ({ children, htmlFor }) => (
    <Label htmlFor={htmlFor}>
        {children} <span className='text-red-500'>*</span>
    </Label>
)

const UniversityFormModal = ({
    isOpen,
    onClose,
    isEditing,
    initialData,
    onSave,
    loading,
    author_id
}) => {
    const [uploadedFiles, setUploadedFiles] = useState({
        featured: '',
        gallery: []
    })

    // Levels state
    const [levelSearch, setLevelSearch] = useState('')
    const [debouncedLevel] = useDebounce(levelSearch, 300)
    const [levels, setLevels] = useState([])
    const [hasSelectedLevel, setHasSelectedLevel] = useState(false)

    // Courses state
    const [courses, setCourses] = useState([])
    const [courseSearch, setCourseSearch] = useState('')

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
        getValues
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
            assets: {
                featured_image: '',
                videos: ''
            },
            gallery: ['']
        }
    })

    const {
        fields: memberFields,
        append: appendMember,
        remove: removeMember
    } = useFieldArray({ control, name: 'members' })

    const formData = watch()

    useEffect(() => {
        const getCourses = async () => {
            try {
                const courseList = await fetchAllCourse()
                setCourses(courseList)
            } catch (error) {
                console.error('Error fetching courses:', error)
            }
        }
        getCourses()
    }, [])

    // Fetch levels on search
    useEffect(() => {
        if (hasSelectedLevel) return

        const getLevels = async () => {
            try {
                const levelList = await fetchLevel(debouncedLevel)
                setLevels(levelList)
            } catch (error) {
                console.error('Error fetching levels:', error)
            }
        }
        getLevels()
    }, [debouncedLevel])


    useEffect(() => {
        if (isOpen) {
            if (isEditing && initialData) {
                setValue('id', initialData.id)
                setValue('fullname', initialData.fullname)
                setValue('country', initialData.country)
                setValue('state', initialData.state)
                setValue('city', initialData.city)
                setValue('street', initialData.street)
                setValue('postal_code', initialData.postal_code)
                setValue('date_of_establish', initialData.date_of_establish)
                setValue('type_of_institute', initialData.type_of_institute)
                setValue('description', initialData.description)
                setValue('logo', initialData.logo)

                setValue('contact', initialData.contact)

                setValue('levels', initialData.levels || [])
                const programIds = initialData.programs?.map((programName) => {
                    if (typeof programName === 'string') {
                        const matchingCourse = courses.find(course => course.title === programName)
                        return matchingCourse ? matchingCourse.id : null
                    } else if (typeof programName === 'object' && programName.id) {
                        return programName.id
                    }
                    return null
                }).filter(id => id !== null) || []

                setValue('programs', programIds)

                setValue('members', initialData.members)

                setUploadedFiles({
                    featured: initialData.assets?.featured_image || '',
                    gallery: initialData.gallery || ['']
                })
                setValue('assets.featured_image', initialData.assets?.featured_image || '')
                setValue('assets.videos', initialData.assets?.videos || '')
            } else {
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
                    description: '',
                    contact: { faxes: '', poboxes: '', email: '', phone_number: '' },
                    levels: [],
                    programs: [],
                    members: [{ role: '', salutation: '', name: '', phone: '', email: '' }],
                    assets: { featured_image: '', videos: '' },
                    logo: '',
                    gallery: ['']
                })
                setUploadedFiles({ featured: '', gallery: [] })
            }
        }
    }, [isOpen, isEditing, initialData, courses, setValue, reset, author_id])

    // Rerun program mapping if courses load after initialData
    useEffect(() => {
        if (isOpen && isEditing && initialData && courses.length > 0) {
            const programIds = initialData.programs?.map((programName) => {
                // Try to match title
                const matchingCourse = courses.find(course => course.title === programName)
                return matchingCourse ? String(matchingCourse.id) : null
            }).filter(id => id !== null) || []
            if (programIds.length > 0) {
                setValue('programs', programIds)
            }
        }
    }, [courses, initialData, isOpen, isEditing, setValue])


    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(courseSearch.toLowerCase())
    )

    const handleFormSubmit = (data) => {
        // Pass data and uploaded files state to parent save handler or handle mostly here?
        // Page.jsx handles formatting. We can do formatting here and pass clean data.

        const formattedData = { ...data }
        formattedData.assets = { ...data.assets, featured_image: uploadedFiles.featured }
        formattedData.gallery = uploadedFiles.gallery.filter(url => url)
        formattedData.levels = data.levels.map(l => parseInt(l))

        // Process programs
        const programsArray = Array.isArray(data.programs)
            ? data.programs.map((program) => parseInt(program))
            : []

        const validProgramIds = programsArray.filter(
            (id) =>
                !isNaN(id) &&
                id !== null &&
                id !== undefined &&
                courses.some((course) => course.id === id)
        )
        formattedData.programs = validProgramIds

        if (!formattedData.contact) {
            formattedData.contact = { faxes: '', poboxes: '', email: '', phone_number: '' }
        }

        onSave(formattedData)
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-5xl'
        >
            <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit University' : 'Add University'}</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
            <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
                <form
                    onSubmit={handleSubmit(handleFormSubmit)}
                    className='flex flex-col flex-1 overflow-hidden'
                >
                    <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                        {/* Basic Information */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Basic Information
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <RequiredLabel htmlFor='fullname'>
                                        University Name
                                    </RequiredLabel>
                                    <Input
                                        id='fullname'
                                        {...register('fullname', {
                                            required: 'University name is required',
                                            minLength: {
                                                value: 3,
                                                message: 'Name must be at least 3 characters long'
                                            }
                                        })}
                                    />
                                    {errors.fullname && (
                                        <span className='text-red-500 text-sm mt-1 block'>
                                            {errors.fullname.message}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <RequiredLabel htmlFor='type_of_institute'>
                                        Type of Institute
                                    </RequiredLabel>
                                    <Select
                                        className='w-full'
                                        {...register('type_of_institute', { required: true })}
                                    >
                                        <option value='Public'>Public</option>
                                        <option value='Private'>Private</option>
                                    </Select>
                                </div>

                                <div>
                                    <RequiredLabel htmlFor='date_of_establish'>
                                        Date of Establishment
                                    </RequiredLabel>
                                    <Input
                                        id='date_of_establish'
                                        type='date'
                                        {...register('date_of_establish', { required: true })}
                                    />
                                    {errors.date_of_establish && (
                                        <span className='text-red-500 text-sm mt-1 block'>
                                            This field is required
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className='mt-4'>
                                <Label>Description</Label>
                                <Controller
                                    name='description'
                                    control={control}
                                    render={({ field }) => (
                                        <TipTapEditor
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder='Enter university description...'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {isEditing && <input type='hidden' {...register('id')} />}

                        {/* Address Section */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>Address</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {[
                                    'country',
                                    'state',
                                    'city',
                                    'street',
                                    'postal_code'
                                ].map((field) => (
                                    <div key={field}>
                                        <RequiredLabel htmlFor={field}>
                                            {field.replace('_', ' ')}
                                        </RequiredLabel>
                                        <Input
                                            id={field}
                                            {...register(field, { required: true })}
                                        />
                                        {errors[field] && (
                                            <span className='text-red-500 text-sm mt-1 block'>
                                                This field is required
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Contact Information
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {[
                                    { key: 'faxes', label: 'Fax' },
                                    { key: 'poboxes', label: 'P.O. Box' },
                                    { key: 'email', label: 'Email' },
                                    { key: 'phone_number', label: 'Phone Number' }
                                ].map(({ key, label }) => (
                                    <div key={key}>
                                        <Label htmlFor={key}>{label}</Label>
                                        <Input
                                            id={key}
                                            {...register(`contact.${key}`)}
                                            type={key === 'email' ? 'email' : 'text'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Members Section */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-semibold'>Members</h2>
                                <Button
                                    type='button'
                                    onClick={() =>
                                        appendMember({
                                            role: '',
                                            salutation: '',
                                            name: '',
                                            phone: '',
                                            email: ''
                                        })
                                    }
                                    className='bg-green-500 text-white hover:bg-green-600'
                                >
                                    Add Member
                                </Button>
                            </div>

                            {memberFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'
                                >
                                    <div>
                                        <Label htmlFor={`members.${index}.role`}>Role</Label>
                                        <Input
                                            id={`members.${index}.role`}
                                            {...register(`members.${index}.role`)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`members.${index}.salutation`}>
                                            Salutation
                                        </Label>
                                        <Input
                                            id={`members.${index}.salutation`}
                                            {...register(`members.${index}.salutation`)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`members.${index}.name`}>Name</Label>
                                        <Input
                                            id={`members.${index}.name`}
                                            {...register(`members.${index}.name`)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`members.${index}.phone`}>
                                            Phone
                                        </Label>
                                        <Input
                                            id={`members.${index}.phone`}
                                            {...register(`members.${index}.phone`)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor={`members.${index}.email`}>
                                            Email
                                        </Label>
                                        <Input
                                            id={`members.${index}.email`}
                                            type='email'
                                            {...register(`members.${index}.email`)}
                                        />
                                    </div>
                                    {index > 0 && (
                                        <Button
                                            type='button'
                                            onClick={() => removeMember(index)}
                                            className='bg-red-500 text-white hover:bg-red-600'
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Media Section */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>Media</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* Logo Upload */}
                                <div>
                                    <FileUpload
                                        label='Logo'
                                        onUploadComplete={(url) => {
                                            setValue('logo', url)
                                        }}
                                        defaultPreview={getValues('logo')}
                                    />
                                </div>
                                {/* Featured Image Upload */}
                                <div>
                                    <FileUpload
                                        label='Featured Image'
                                        onUploadComplete={(url) => {
                                            setUploadedFiles((prev) => ({
                                                ...prev,
                                                featured: url
                                            }))
                                            setValue('assets.featured_image', url)
                                        }}
                                        defaultPreview={uploadedFiles.featured}
                                    />
                                </div>
                                {/* Video URL */}
                                <div>
                                    <Label htmlFor='video-url'>Video URL</Label>
                                    <Input
                                        id='video-url'
                                        {...register('assets.videos')}
                                        placeholder='Enter video URL'
                                    />
                                </div>
                            </div>
                            <GallerySection
                                control={control}
                                setValue={setValue}
                                uploadedFiles={uploadedFiles}
                                setUploadedFiles={setUploadedFiles}
                                getValues={getValues}
                            />
                        </div>

                        {/* Levels Section */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div>
                                <h2 className='text-xl font-semibold mb-4'>
                                    Educational Levels
                                </h2>
                                <Input
                                    type='text'
                                    value={levelSearch}
                                    onChange={(e) => {
                                        setLevelSearch(e.target.value)
                                        setHasSelectedLevel(false)
                                    }}
                                    placeholder='Search levels'
                                />
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-7'>
                                {levels.map((level) => (
                                    <label
                                        key={level.id}
                                        className='flex items-center gap-2'
                                    >
                                        <Checkbox
                                            checked={formData.levels?.includes(
                                                String(level.id)
                                            )}
                                            onCheckedChange={(checked) => {
                                                const currentLevels = formData.levels || []
                                                if (checked) {
                                                    setValue('levels', [
                                                        ...currentLevels,
                                                        String(level.id)
                                                    ])
                                                } else {
                                                    setValue(
                                                        'levels',
                                                        currentLevels.filter(
                                                            (id) => id !== String(level.id)
                                                        )
                                                    )
                                                }
                                                setHasSelectedLevel(checked)
                                            }}
                                        />
                                        <span>{level.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Courses/Programs Section */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className='text-xl font-semibold'>Programs</h2>
                                <Input
                                    type='text'
                                    placeholder='Search Programs'
                                    className='w-60'
                                    value={courseSearch}
                                    onChange={(e) => setCourseSearch(e.target.value)}
                                />
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-scroll'>
                                {filteredCourses.map((course) => (
                                    <label
                                        key={course.id}
                                        className='flex items-center gap-2'
                                    >
                                        <Checkbox
                                            checked={formData.programs?.includes(
                                                String(course.id)
                                            )}
                                            onCheckedChange={(checked) => {
                                                const currentPrograms = formData.programs || []
                                                if (checked) {
                                                    setValue('programs', [
                                                        ...currentPrograms,
                                                        String(course.id)
                                                    ])
                                                } else {
                                                    setValue(
                                                        'programs',
                                                        currentPrograms.filter(
                                                            (id) => id !== String(course.id)
                                                        )
                                                    )
                                                }
                                            }}
                                        />
                                        <span>{course.title}</span>
                                    </label>
                                ))}
                                {filteredCourses.length === 0 && (
                                    <p className='text-gray-500 col-span-full'>
                                        No matching courses found.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button - Sticky Footer */}
                    <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                        <Button
                            type='button'
                            onClick={onClose}
                            variant='outline'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            disabled={loading}
                        >
                            {loading
                                ? 'Processing...'
                                : isEditing
                                    ? 'Update University'
                                    : 'Create University'}
                        </Button>
                    </div>
                </form>
            </div>
            </DialogContent>
        </Dialog>
    )
}

export default UniversityFormModal
