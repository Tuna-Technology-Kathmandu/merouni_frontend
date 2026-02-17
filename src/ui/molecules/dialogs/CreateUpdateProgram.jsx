'use client'

import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { Trash2, X } from 'lucide-react'

// Dropdowns
import CollegesDropdown from '@/ui/molecules/dropdown/CollegesDropdown'
import DegreeDropdown from '@/ui/molecules/dropdown/DegreeDropdown'
import ExamDropdown from '@/ui/molecules/dropdown/ExamDropdown'
import LevelDropdown from '@/ui/molecules/dropdown/LevelDropdown'
import ScholarshipDropdown from '@/ui/molecules/dropdown/ScholarshipDropdown'
import CourseDropdown from '@/ui/molecules/dropdown/CourseDropdown'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Select } from '@/ui/shadcn/select'

const CKUni = dynamic(() => import('@/ui/molecules/ck-editor/CKUni'), {
    ssr: false
})

const CreateUpdateProgram = ({ isOpen, onClose, slug, onSuccess }) => {
    const author_id = useSelector((state) => state.user.data?.id)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Local state for syllabus management UI
    const [currentYear, setCurrentYear] = useState(1)
    const [currentSemester, setCurrentSemester] = useState(1)
    const [currentCourse, setCurrentCourse] = useState({ id: '', title: '' })

    // Selected colleges state
    const [selectedColleges, setSelectedColleges] = useState([])

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
            title: '',
            code: '',
            author: author_id,
            duration: '',
            credits: '',
            level_id: '',
            degree_id: '',
            language: '',
            eligibility_criteria: '',
            fee: '',
            scholarship_id: '',
            curriculum: '',
            learning_outcomes: '',
            delivery_type: 'Full-time',
            delivery_mode: 'On-campus',
            careers: '',
            exam_id: '',
            syllabus: [
                {
                    year: 1,
                    semester: 1,
                    course_id: '',
                    _title: '',
                    is_elective: false
                }
            ],
            colleges: []
        }
    })

    const {
        fields: syllabusFields,
        append: appendSyllabus,
        remove: removeSyllabus
    } = useFieldArray({ control, name: 'syllabus' })

    // Reset and fetch data when opening
    useEffect(() => {
        if (isOpen) {
            if (slug) {
                handleEdit(slug)
            } else {
                reset({
                    title: '',
                    code: '',
                    author: author_id,
                    duration: '',
                    credits: '',
                    level_id: '',
                    degree_id: '',
                    language: '',
                    eligibility_criteria: '',
                    fee: '',
                    scholarship_id: '',
                    curriculum: '',
                    learning_outcomes: '',
                    delivery_type: 'Full-time',
                    delivery_mode: 'On-campus',
                    careers: '',
                    exam_id: '',
                    syllabus: [
                        {
                            year: 1,
                            semester: 1,
                            course_id: '',
                            _title: '',
                            is_elective: false
                        }
                    ],
                    colleges: []
                })
                setSelectedColleges([])
                setCurrentYear(1)
                setCurrentSemester(1)
                setCurrentCourse({ id: '', title: '' })
            }
        }
    }, [isOpen, slug, author_id, reset])

    const handleEdit = async (slug) => {
        setLoading(true)
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/program/${slug}`
            )
            if (!response.ok) throw new Error('Failed to fetch program details')
            const program = await response.json()

            setValue('id', program.id)
            setValue('title', program.title)
            setValue('duration', program.duration)
            setValue('credits', program.credits)
            setValue('language', program.language)
            setValue('eligibility_criteria', program.eligibility_criteria)
            setValue('fee', program.fee)
            setValue('curriculum', program.curriculum)
            setValue('learning_outcomes', program.learning_outcomes)
            setValue('delivery_type', program.delivery_type)
            setValue('delivery_mode', program.delivery_mode)
            setValue('careers', program.careers)
            setValue('code', program.code)

            const enrichedSyllabus = program.syllabus.map((item) => ({
                year: item.year,
                semester: item.semester,
                course_id: item.course_id,
                _title: item.programCourse?.title || '',
                is_elective: item.is_elective || false
            }))

            setValue('syllabus', enrichedSyllabus)

            // Handle relationship IDs (checking both flat ID and nested object ID)
            setValue('scholarship_id', program.scholarship_id ?? program.programscholarship?.id ?? '')
            setValue('exam_id', program.exam_id ?? program.programexam?.id ?? '')
            setValue('level_id', program.level_id ?? program.programlevel?.id ?? '')
            setValue('degree_id', program.degree_id ?? program.programdegree?.id ?? '')



            if (program.colleges) {
                const collegeIds = program.colleges.map(
                    (college) => college.program_college.college_id
                )
                setValue('colleges', collegeIds)

                const collegeData = program.colleges.map((college) => ({
                    id: college.program_college.college_id,
                    name: college.name,
                    slugs: college.slugs
                }))
                setSelectedColleges(collegeData)
            }
        } catch (error) {
            console.error('Error in handleEdit:', error)
            toast.error('Failed to fetch program details')
            onClose()
        } finally {
            setLoading(false)
        }
    }

    const addCollege = (college) => {
        if (!college) return
        if (!selectedColleges.some((c) => c.id === college.id)) {
            const newSelected = [...selectedColleges, college]
            setSelectedColleges(newSelected)
            setValue('colleges', newSelected.map(c => c.id))
        }
    }

    const removeCollege = (collegeId) => {
        const newSelected = selectedColleges.filter((c) => c.id !== collegeId)
        setSelectedColleges(newSelected)
        setValue('colleges', newSelected.map(c => c.id))
    }

    // Syllabus helper functions
    const getCurrentSemesterCourses = () => {
        return syllabusFields
            .filter(
                (field) =>
                    field.year === currentYear && field.semester === currentSemester
            )
            .map((field) => ({
                id: field.course_id,
                title: field._title || 'Unknown Course'
            }))
    }

    const handleAddCourse = () => {
        if (currentCourse.id) {
            appendSyllabus({
                year: currentYear,
                semester: currentSemester,
                course_id: currentCourse.id,
                _title: currentCourse.title,
                is_elective: false
            })
            setCurrentCourse({ id: '', title: '' })
        }
    }

    const handleRemoveCourse = (courseId) => {
        const index = syllabusFields.findIndex(
            (field) =>
                field.course_id === courseId &&
                field.year === currentYear &&
                field.semester === currentSemester
        )
        if (index >= 0) removeSyllabus(index)
    }

    const onSubmit = async (data) => {
        try {
            setSubmitting(true)
            const cleanedData = {
                ...data,
                level_id: data.level_id ? Number(data.level_id) : undefined,
                degree_id: data.degree_id ? Number(data.degree_id) : null,
                syllabus: data.syllabus.map((item) => ({
                    year: item.year,
                    semester: item.semester,
                    course_id: item.course_id,
                    is_elective: item.is_elective || false
                }))
            }

            const url = `${process.env.baseUrl}/program`
            const method = 'POST'
            const response = await authFetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanedData)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    errorData.error || `HTTP error! status: ${response.status}`
                )
            }

            toast.success(slug ? 'Program updated successfully!' : 'Program created successfully!')
            if (onSuccess) onSuccess()
            onClose()
        } catch (error) {
            if (
                error.message.includes('timeout') ||
                error.message === 'Operation timeout'
            ) {
                toast.error('operation timed out. Please try again.')
            } else if (error.name === 'AbortError') {
                toast.error('Request was aborted.')
            } else {
                toast.error(error.message || 'Failed to save program')
            }
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-6xl'
        >
            <DialogHeader>
                <DialogTitle>{slug ? 'Edit Program' : 'Add Program'}</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='max-h-[calc(100vh-200px)] overflow-y-auto pr-2'>
                        {/* Basic Information */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <Label className='block mb-2'>
                                        Program Title <span className='text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        {...register('title', { required: 'Title is required' })}
                                        className='w-full p-2 border rounded'
                                    />
                                    {errors.title && (
                                        <span className='text-red-500'>{errors.title.message}</span>
                                    )}
                                </div>

                                <div>
                                    <Label className='block mb-2'>Program Code</Label>
                                    <Input
                                        {...register('code')}
                                        className='w-full p-2 border rounded'
                                    />
                                </div>

                                <div>
                                    <Label className='block mb-2'>
                                        Duration <span className='text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        {...register('duration', { required: true })}
                                        className='w-full p-2 border rounded'
                                        placeholder='e.g., 4 years'
                                    />
                                </div>

                                <div>
                                    <Label className='block mb-2'>
                                        Credits <span className='text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        type='number'
                                        {...register('credits', {
                                            required: true,
                                            valueAsNumber: true
                                        })}
                                        className='w-full p-2 border rounded'
                                        step='0.1'
                                    />
                                </div>

                                <div>
                                    <Label className='block mb-2'>
                                        Level <span className='text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        type='hidden'
                                        {...register('level_id', { required: 'Level is required' })}
                                    />
                                    <LevelDropdown
                                        value={watch('level_id') ?? ''}
                                        onChange={(id) => setValue('level_id', id || '')}
                                        placeholder='Select level'
                                        className='w-full'
                                    />
                                    {errors.level_id && (
                                        <span className='text-red-500 text-sm mt-1'>
                                            {errors.level_id.message}
                                        </span>
                                    )}
                                </div>

                                {/* Degree (optional) */}
                                <div>
                                    <Label className='block mb-2'>Degree</Label>
                                    <DegreeDropdown
                                        value={watch('degree_id') ?? ''}
                                        onChange={(id) => setValue('degree_id', id || '')}
                                        placeholder='Select degree'
                                        className='w-full'
                                    />
                                </div>



                                <div>
                                    <Label className='block mb-2'>
                                        Language <span className='text-red-500'>*</span>
                                    </Label>
                                    <Input
                                        {...register('language', { required: true })}
                                        className='w-full p-2 border rounded'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Program Details */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>Program Details</h2>
                            <div className='grid grid-cols-1 gap-4'>
                                <div>
                                    <Label className='block mb-2'>Description</Label>
                                    <CKUni
                                        id='learning-outcomes-editor'
                                        initialData={getValues('learning_outcomes')}
                                        onChange={(data) => setValue('learning_outcomes', data)}
                                    />
                                </div>
                                <div>
                                    <Label className='block mb-2'>Eligibility Criteria</Label>
                                    <Textarea
                                        {...register('eligibility_criteria')}
                                        className='w-full p-2 border rounded'
                                        rows='3'
                                    />
                                </div>

                                <div>
                                    <Label className='block mb-2'>Fee Structure</Label>
                                    <Input
                                        {...register('fee')}
                                        className='w-full p-2 border rounded'
                                        placeholder='e.g. 5000 USD per year'
                                    />
                                </div>

                                <div>
                                    <Label className='block mb-2'>Curriculum</Label>
                                    <Textarea
                                        {...register('curriculum')}
                                        className='w-full p-2 border rounded'
                                        rows='3'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Delivery Information
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <Label className='block mb-2'>Delivery Type</Label>
                                    <Select
                                        {...register('delivery_type')}
                                        className='w-full p-2 border rounded'
                                    >
                                        <option value='Full-time'>Full-time</option>
                                        <option value='Part-time'>Part-time</option>
                                        <option value='Online'>Online</option>
                                        <option value='Hybrid'>Hybrird</option>
                                    </Select>
                                </div>

                                <div>
                                    <Label className='block mb-2'>Delivery Mode</Label>
                                    <Select
                                        {...register('delivery_mode')}
                                        className='w-full p-2 border rounded'
                                    >
                                        <option value='On-campus'>On-campus</option>
                                        <option value='Remote'>Remote</option>
                                        <option value='Blended'>Hybrid</option>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Scholarship & Exams */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Scholarships & Exams
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* Scholarship */}
                                <div>
                                    <Label className='block mb-2'>Scholarship</Label>
                                    <ScholarshipDropdown
                                        value={watch('scholarship_id') ?? ''}
                                        onChange={(id) => setValue('scholarship_id', id || '')}
                                        placeholder='Select scholarship'
                                        className='w-full'
                                    />
                                </div>

                                {/* Exam */}
                                <div>
                                    <Label className='block mb-2'>Entrance Exam</Label>
                                    <ExamDropdown
                                        value={watch('exam_id') ?? ''}
                                        onChange={(id) => setValue('exam_id', id || '')}
                                        placeholder='Select exam'
                                        className='w-full'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* College Selection */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>Select Colleges</h2>
                            <div className='mb-4'>
                                <CollegesDropdown
                                    onChange={(id, college) => {
                                        if (college) addCollege(college)
                                    }}
                                    placeholder="Search and select college to add..."
                                    className='w-full'
                                />
                                <div className='mt-4 flex flex-wrap gap-2'>
                                    {selectedColleges.map((college) => (
                                        <div
                                            key={college.id}
                                            className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2'
                                        >
                                            <span>{college.name}</span>
                                            <button
                                                type='button'
                                                onClick={() => removeCollege(college.id)}
                                                className='text-blue-600 hover:text-blue-800'
                                            >
                                                <X className='w-4 h-4' />
                                            </button>
                                        </div>
                                    ))}
                                    {selectedColleges.length === 0 && (
                                        <p className="text-gray-500 text-sm">No colleges selected.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <h2 className='text-xl font-semibold mb-4'>
                                Additional Information
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block mb-2'>Career Opportunities</label>
                                    <textarea
                                        {...register('careers')}
                                        className='w-full p-2 border rounded'
                                        rows='3'
                                        placeholder='e.g., Software Developer, Data Scientist, IT Consultant'
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <label className='block text-lg font-medium mb-2'>
                                Curriculum Structure
                            </label>

                            {/* Year/Semester Navigation */}
                            <div className='flex flex-wrap gap-4 mb-6 p-3 bg-gray-50 rounded-lg'>
                                {[1, 2, 3, 4].map((year) => (
                                    <div key={year} className='flex-1 min-w-[150px]'>
                                        <h3 className='font-medium mb-2'>Year {year}</h3>
                                        <div className='space-y-2'>
                                            {[0, 1, 2].map((sem) => (
                                                <button
                                                    key={sem}
                                                    type='button'
                                                    onClick={() => {
                                                        setCurrentYear(year)
                                                        setCurrentSemester(sem)
                                                    }}
                                                    className={`w-full py-2 px-3 rounded text-sm ${currentYear === year && currentSemester === sem
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white border hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {sem !== 0
                                                        ? `Semester ${sem}`
                                                        : `Yearly Basis`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Current Semester Header */}
                            <div className='flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg'>
                                <h3 className='font-medium text-lg'>
                                    {currentSemester == 0
                                        ? ` Year ${currentYear}`
                                        : ` Year ${currentYear} - Semester ${currentSemester}`}
                                </h3>
                            </div>

                            {/* Course Management */}
                            <div className='space-y-4'>
                                {/* Course Search - Quick Add */}
                                <div className='flex gap-2 items-end'>
                                    <div className='flex-1'>
                                        <CourseDropdown
                                            value={currentCourse.id}
                                            onChange={(id, course) => {
                                                if (course) {
                                                    setCurrentCourse({ id: course.id, title: course.title })
                                                } else {
                                                    setCurrentCourse({ id: '', title: '' })
                                                }
                                            }}
                                            placeholder="Search and select course"
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type='button'
                                            onClick={handleAddCourse}
                                            disabled={!currentCourse.id}
                                            className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300'
                                        >
                                            Add Course
                                        </button>
                                    </div>
                                </div>

                                {/* Current Semester Courses */}
                                {getCurrentSemesterCourses().length > 0 ? (
                                    <div className='border rounded-lg overflow-hidden'>
                                        <table className='w-full'>
                                            <thead className='bg-gray-50'>
                                                <tr>
                                                    <th className='p-3 text-left w-[50px]'></th>
                                                    <th className='p-3 text-left'>Course</th>
                                                    <th className='p-3 text-left w-[100px]'>Id</th>
                                                    <th className='p-3 text-left w-[100px]'>Elective</th>
                                                    <th className='p-3 text-right w-[50px]'>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getCurrentSemesterCourses().map((course, index) => {
                                                    const fieldIndex = syllabusFields.findIndex(
                                                        (field) =>
                                                            field.course_id === course.id &&
                                                            field.year === currentYear &&
                                                            field.semester === currentSemester
                                                    )

                                                    const title =
                                                        fieldIndex >= 0
                                                            ? watch(`syllabus.${fieldIndex}._title`) ||
                                                            course.title ||
                                                            'Unknown Course'
                                                            : course.title || 'Unknown Course'

                                                    return (
                                                        <tr
                                                            key={course.id}
                                                            className='border-t hover:bg-gray-50'
                                                        >
                                                            <td className='p-3 text-gray-500'>
                                                                {index + 1}.
                                                            </td>
                                                            <td className='p-3 font-medium'>{title}</td>
                                                            <td className='p-3 text-gray-600'>
                                                                {course.id || '-'}
                                                            </td>
                                                            <td className='p-3'>
                                                                <label className='flex items-center'>
                                                                    <input
                                                                        type='checkbox'
                                                                        checked={
                                                                            watch(
                                                                                `syllabus.${fieldIndex}.is_elective`
                                                                            ) || false
                                                                        }
                                                                        onChange={(e) =>
                                                                            setValue(
                                                                                `syllabus.${fieldIndex}.is_elective`,
                                                                                e.target.checked
                                                                            )
                                                                        }
                                                                        className='h-4 w-4 text-blue-600 rounded'
                                                                    />
                                                                    <span className='ml-2 text-sm'>Elective</span>
                                                                </label>
                                                            </td>
                                                            <td className='p-3 text-right'>
                                                                <button
                                                                    type='button'
                                                                    onClick={() => handleRemoveCourse(course.id)}
                                                                    className='text-red-500 hover:text-red-700 p-1'
                                                                    title='Remove course'
                                                                >
                                                                    <Trash2 className='w-4 h-4' />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className='p-6 text-center text-gray-500 bg-gray-50 rounded-lg'>
                                        No courses added for this semester yet
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-end gap-2 pt-4 border-t'>
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
                                : slug
                                    ? 'Update Program'
                                    : 'Create Program'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUpdateProgram
