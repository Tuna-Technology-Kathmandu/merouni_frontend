'use client'

import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { Trash2, X, Plus, Building2 } from 'lucide-react'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'


import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import { Select } from '@/ui/shadcn/select'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'

const CreateUpdateProgram = ({ isOpen, onClose, slug, onSuccess }) => {
    const author_id = useSelector((state) => state.user.data?.id)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Rich text field values (managed outside react-hook-form)
    const [learningOutcomes, setLearningOutcomes] = useState('')
    const [learningOutcomesError, setLearningOutcomesError] = useState(false)

    // Local state for syllabus management UI
    const [currentYear, setCurrentYear] = useState(1)
    const [currentSemester, setCurrentSemester] = useState(1)
    const [currentCourse, setCurrentCourse] = useState({ id: '', title: '' })

    // Selected universities state
    const [selectedUniversities, setSelectedUniversities] = useState([])

    // Single-select states for dropdowns
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [selectedDegree, setSelectedDegree] = useState(null)
    const [selectedScholarship, setSelectedScholarship] = useState(null)
    const [selectedExam, setSelectedExam] = useState(null)

    const {
        register,
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
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
            delivery_type: 'Full-time',
            delivery_mode: 'On-campus',
            careers: '',
            exam_id: '',
            syllabus: []
        }
    })

    const {
        fields: syllabusFields,
        append: appendSyllabus,
        remove: removeSyllabus
    } = useFieldArray({ control, name: 'syllabus' })

    const resetForm = () => {
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
            delivery_type: 'Full-time',
            delivery_mode: 'On-campus',
            careers: '',
            exam_id: '',
            syllabus: [],
            colleges: []
        })
        setLearningOutcomes('')
        setLearningOutcomesError(false)
        setSelectedUniversities([])
        setSelectedLevel(null)
        setSelectedDegree(null)
        setSelectedScholarship(null)
        setSelectedExam(null)
        setCurrentYear(1)
        setCurrentSemester(1)
        setCurrentCourse({ id: '', title: '' })
    }

    // Reset and fetch data when opening
    useEffect(() => {
        if (isOpen) {
            if (slug) {
                handleEdit(slug)
            } else {
                resetForm()
            }
        }
    }, [isOpen, slug])

    const handleEdit = async (slug) => {
        setLoading(true)
        try {
            const response = await authFetch(`${process.env.baseUrl}/program/${slug}`)
            if (!response.ok) throw new Error('Failed to fetch program details')
            const program = await response.json()

            setValue('id', program.id)
            setValue('title', program.title || '')
            setValue('duration', program.duration || '')
            setValue('credits', program.credits || '')
            setValue('language', program.language || '')
            setValue('eligibility_criteria', program.eligibility_criteria || '')
            setValue('fee', program.fee || '')
            setValue('curriculum', program.curriculum || '')
            setValue('delivery_type', program.delivery_type || 'Full-time')
            setValue('delivery_mode', program.delivery_mode || 'On-campus')
            setValue('careers', program.careers || '')
            setValue('code', program.code || '')

            // Set rich text
            setLearningOutcomes(program.learning_outcomes || '')

            // Syllabus
            const enrichedSyllabus = (program.syllabus || []).map((item) => ({
                year: item.year,
                semester: item.semester,
                course_id: item.course_id,
                _title: item.programCourse?.title || '',
                is_elective: item.is_elective || false
            }))
            setValue('syllabus', enrichedSyllabus)

            // Relationship IDs
            setValue('scholarship_id', program.scholarship_id ?? program.programscholarship?.id ?? '')
            setValue('exam_id', program.exam_id ?? program.programexam?.id ?? '')
            setValue('level_id', program.level_id ?? program.programlevel?.id ?? '')
            setValue('degree_id', program.degree_id ?? program.programdegree?.id ?? '')

            // Level
            if (program.level_id || program.programlevel) {
                const lvl = program.programlevel
                if (lvl) setSelectedLevel({ id: lvl.id, title: lvl.title })
            }
            // Degree
            if (program.degree_id || program.programdegree) {
                const deg = program.programdegree
                if (deg) setSelectedDegree({ id: deg.id, title: deg.short_name ? `${deg.short_name} – ${deg.title}` : deg.title })
            }
            // Scholarship
            if (program.scholarship_id || program.programscholarship) {
                const sch = program.programscholarship
                if (sch) setSelectedScholarship({ id: sch.id, name: sch.name })
            }
            // Exam
            if (program.exam_id || program.programexam) {
                const ex = program.programexam
                if (ex) setSelectedExam({ id: ex.id, title: ex.title })
            }

            // Universities
            if (program.universities?.length) {
                const universityIds = program.universities.map((u) => u.id)
                setValue('universities', universityIds)
                setSelectedUniversities(
                    program.universities.map((u) => ({
                        id: u.id,
                        fullname: u.fullname,
                        slugs: u.slugs
                    }))
                )
            }
        } catch (error) {
            console.error('Error in handleEdit:', error)
            toast.error('Failed to fetch program details')
            onClose()
        } finally {
            setLoading(false)
        }
    }

    // University search via API
    const onSearchUniversities = async (query) => {
        try {
            const url = query
                ? `${process.env.baseUrl}/university?q=${encodeURIComponent(query)}&limit=20`
                : `${process.env.baseUrl}/university?limit=20`
            const res = await authFetch(url)
            const data = await res.json()
            return (data.items || []).map((u) => ({ id: u.id, fullname: u.fullname, logo: u.logo, slugs: u.slugs }))
        } catch { return [] }
    }

    const addUniversity = (university) => {
        if (!university) return
        if (!selectedUniversities.some((u) => u.id === university.id)) {
            const updated = [...selectedUniversities, university]
            setSelectedUniversities(updated)
            setValue('universities', updated.map((u) => u.id))
        }
    }

    const removeUniversity = (university) => {
        const updated = selectedUniversities.filter((u) => u.id !== university.id)
        setSelectedUniversities(updated)
        setValue('universities', updated.map((u) => u.id))
    }

    // Generic single-select search helpers
    const onSearchLevels = async (q) => {
        try {
            const res = await authFetch(`${process.env.baseUrl}/level?${q ? `q=${encodeURIComponent(q)}&` : ''}limit=50`)
            const data = await res.json()
            return (data.items || []).map((l) => ({ id: l.id, title: l.title }))
        } catch { return [] }
    }

    const onSearchDegrees = async (q) => {
        try {
            const res = await authFetch(`${process.env.baseUrl}/degree?${q ? `q=${encodeURIComponent(q)}&` : ''}limit=50`)
            const data = await res.json()
            return (data.items || []).map((d) => ({ id: d.id, title: d.short_name ? `${d.short_name} – ${d.title}` : d.title }))
        } catch { return [] }
    }

    const onSearchScholarships = async (q) => {
        try {
            const res = await authFetch(`${process.env.baseUrl}/scholarship?${q ? `q=${encodeURIComponent(q)}&` : ''}limit=50`)
            const data = await res.json()
            return (data.scholarships || data.items || []).map((s) => ({ id: s.id, name: s.name }))
        } catch { return [] }
    }

    const onSearchExams = async (q) => {
        try {
            const res = await authFetch(`${process.env.baseUrl}/exam?${q ? `q=${encodeURIComponent(q)}&` : ''}limit=50`)
            const data = await res.json()
            return (data.items || []).map((e) => ({ id: e.id, title: e.title }))
        } catch { return [] }
    }

    const onSearchCourses = async (q) => {
        try {
            const res = await authFetch(`${process.env.baseUrl}/course?${q ? `q=${encodeURIComponent(q)}&` : ''}limit=50`)
            const data = await res.json()
            return (data.items || data.courses || []).map((c) => ({ id: c.id, title: c.title }))
        } catch { return [] }
    }

    // Syllabus helpers
    const getCurrentSemesterCourses = () =>
        syllabusFields
            .filter((f) => f.year === currentYear && f.semester === currentSemester)
            .map((f) => ({ id: f.course_id, title: f._title || 'Unknown Course' }))

    const handleAddCourse = () => {
        if (!currentCourse.id) return
        const alreadyAdded = syllabusFields.some(
            (f) => f.course_id === currentCourse.id && f.year === currentYear && f.semester === currentSemester
        )
        if (alreadyAdded) {
            toast.warn('This course is already in the current semester.')
            return
        }
        appendSyllabus({
            year: currentYear,
            semester: currentSemester,
            course_id: currentCourse.id,
            _title: currentCourse.title,
            is_elective: false
        })
        setCurrentCourse({ id: '', title: '' })
    }

    const handleRemoveCourse = (courseId) => {
        const index = syllabusFields.findIndex(
            (f) => f.course_id === courseId && f.year === currentYear && f.semester === currentSemester
        )
        if (index >= 0) removeSyllabus(index)
    }

    const onSubmit = async (data) => {
        try {
            setSubmitting(true)
            const cleanedData = {
                ...data,
                learning_outcomes: learningOutcomes,
                level_id: data.level_id ? Number(data.level_id) : undefined,
                degree_id: data.degree_id ? Number(data.degree_id) : undefined,
                credits: data.credits ? Number(data.credits) : undefined,
                universities: selectedUniversities.map((u) => u.id),
                syllabus: data.syllabus.map((item) => ({
                    year: item.year,
                    semester: item.semester,
                    course_id: item.course_id,
                    is_elective: item.is_elective || false
                }))
            }

            const response = await authFetch(`${process.env.baseUrl}/program`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedData)
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
            }

            toast.success(slug ? 'Program updated successfully!' : 'Program created successfully!')
            if (onSuccess) onSuccess()
            onClose()
        } catch (error) {
            if (error.message.includes('timeout') || error.message === 'Operation timeout') {
                toast.error('Operation timed out. Please try again.')
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
        <Dialog isOpen={isOpen} onClose={onClose} className='max-w-6xl'>
            <DialogContent className='max-w-6xl max-h-[90vh] flex flex-col p-0'>
                {/* Sticky Header */}
                <DialogHeader className='px-6 py-4 border-b shrink-0'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                        {slug ? 'Edit Program' : 'Add New Program'}
                    </DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                {/* Scrollable Body */}
                <div className='flex-1 overflow-y-auto p-6'>
                    {loading ? (
                        <div className='flex items-center justify-center py-20'>
                            <div className='flex flex-col items-center gap-3'>
                                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#387cae]' />
                                <p className='text-sm text-gray-500'>Loading program details...</p>
                            </div>
                        </div>
                    ) : (
                        <form id="program-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>

                            {/* ── Section 1: Basic Information ── */}
                            <section className="space-y-5">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>

                                    <div className="space-y-1.5">
                                        <Label required>Program Title</Label>
                                        <Input
                                            {...register('title', { required: 'Program title is required' })}
                                            placeholder='e.g., Bachelor of Computer Science'
                                            className={errors.title ? 'border-red-400 focus-visible:ring-red-400' : ''}
                                        />
                                        {errors.title && (
                                            <p className='text-xs text-red-500'>{errors.title.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Program Code</Label>
                                        <Input
                                            {...register('code')}
                                            placeholder='e.g., BCS-101'
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Duration <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <Input
                                            {...register('duration')}
                                            placeholder='e.g., 4 years'
                                            className={errors.duration ? 'border-red-400 focus-visible:ring-red-400' : ''}
                                        />
                                        {errors.duration && (
                                            <p className='text-xs text-red-500'>{errors.duration.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Credits <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <Input
                                            type='number'
                                            step='0.1'
                                            placeholder='e.g., 120'
                                            {...register('credits', {
                                                valueAsNumber: true,
                                                min: { value: 0, message: 'Credits must be a positive number' }
                                            })}
                                            className={errors.credits ? 'border-red-400 focus-visible:ring-red-400' : ''}
                                        />
                                        {errors.credits && (
                                            <p className='text-xs text-red-500'>{errors.credits.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Level <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <input type='hidden' {...register('level_id')} />
                                        <SearchSelectCreate
                                            onSearch={onSearchLevels}
                                            onSelect={(item) => { setSelectedLevel(item); setValue('level_id', item.id) }}
                                            onRemove={() => { setSelectedLevel(null); setValue('level_id', '') }}
                                            selectedItems={selectedLevel ? [selectedLevel] : []}
                                            placeholder='Search level…'
                                            displayKey='title'
                                            valueKey='id'
                                            isMulti={false}
                                            allowCreate={false}
                                            inputSize="sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Degree <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <SearchSelectCreate
                                            onSearch={onSearchDegrees}
                                            onSelect={(item) => { setSelectedDegree(item); setValue('degree_id', item.id) }}
                                            onRemove={() => { setSelectedDegree(null); setValue('degree_id', '') }}
                                            selectedItems={selectedDegree ? [selectedDegree] : []}
                                            placeholder='Search degree…'
                                            displayKey='title'
                                            valueKey='id'
                                            isMulti={false}
                                            allowCreate={false}
                                            inputSize="sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Language of Instruction <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <Input
                                            {...register('language')}
                                            placeholder='e.g., English'
                                            className={errors.language ? 'border-red-400 focus-visible:ring-red-400' : ''}
                                        />
                                        {errors.language && (
                                            <p className='text-xs text-red-500'>{errors.language.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Fee Structure <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <Input
                                            {...register('fee')}
                                            placeholder='e.g., 5,000 USD per year'
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ── Section 2: Program Details ── */}
                            <section className="space-y-5">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Program Details</h3>

                                {/* Learning Outcomes – TipTap */}
                                <div className="space-y-1.5">
                                    <Label>Description / Learning Outcomes <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                    <div className={learningOutcomesError ? 'ring-2 ring-red-400 rounded-xl' : ''}>
                                        <TipTapEditor
                                            value={learningOutcomes}
                                            onChange={(html) => {
                                                setLearningOutcomes(html)
                                                const hasText = html && html.replace(/<[^>]*>/g, '').trim().length > 0
                                                if (hasText) setLearningOutcomesError(false)
                                            }}
                                            placeholder='Describe the program objectives and what students will learn...'
                                            height='220px'
                                        />
                                    </div>
                                    {learningOutcomesError && (
                                        <p className='text-xs text-red-500'>Description / Learning Outcomes is recommended.</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Eligibility Criteria</Label>
                                    <Textarea
                                        {...register('eligibility_criteria')}
                                        rows={3}
                                        placeholder='Describe admission requirements and prerequisites...'
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Curriculum Overview</Label>
                                    <Textarea
                                        {...register('curriculum')}
                                        rows={3}
                                        placeholder='Brief overview of the curriculum structure...'
                                    />
                                </div>
                            </section>

                            {/* ── Section 3: Delivery ── */}
                            <section className="space-y-5">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Delivery Information</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                    <div className="space-y-1.5">
                                        <Label>Delivery Type</Label>
                                        <Select
                                            {...register('delivery_type')}
                                            className='w-full p-2 border rounded-md text-sm'
                                        >
                                            <option value='Full-time'>Full-time</option>
                                            <option value='Part-time'>Part-time</option>
                                            <option value='Online'>Online</option>
                                            <option value='Hybrid'>Hybrid</option>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Delivery Mode</Label>
                                        <Select
                                            {...register('delivery_mode')}
                                            className='w-full p-2 border rounded-md text-sm'
                                        >
                                            <option value='On-campus'>On-campus</option>
                                            <option value='Remote'>Remote</option>
                                            <option value='Blended'>Hybrid / Blended</option>
                                        </Select>
                                    </div>
                                </div>
                            </section>

                            {/* ── Section 4: Scholarships & Exams ── */}
                            <section className="space-y-5">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Scholarships & Exams</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                    <div className="space-y-1.5">
                                        <Label>Scholarship <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <SearchSelectCreate
                                            onSearch={onSearchScholarships}
                                            onSelect={(item) => { setSelectedScholarship(item); setValue('scholarship_id', item.id) }}
                                            onRemove={() => { setSelectedScholarship(null); setValue('scholarship_id', '') }}
                                            selectedItems={selectedScholarship ? [selectedScholarship] : []}
                                            placeholder='Search scholarship…'
                                            displayKey='name'
                                            valueKey='id'
                                            isMulti={false}
                                            allowCreate={false}
                                            inputSize="sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Entrance Exam <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                        <SearchSelectCreate
                                            onSearch={onSearchExams}
                                            onSelect={(item) => { setSelectedExam(item); setValue('exam_id', item.id) }}
                                            onRemove={() => { setSelectedExam(null); setValue('exam_id', '') }}
                                            selectedItems={selectedExam ? [selectedExam] : []}
                                            placeholder='Search entrance exam…'
                                            displayKey='title'
                                            valueKey='id'
                                            isMulti={false}
                                            allowCreate={false}
                                            inputSize="sm"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ── Section 5: Associated Universities ── */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 border-b pb-2">
                                    <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center shrink-0">
                                        <Building2 size={13} className="text-violet-600" />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-800">Associated Universities</h3>
                                    <span className="ml-auto text-xs text-gray-400 font-normal">(optional)</span>
                                </div>
                                <p className="text-xs text-gray-400">Search and select the universities this program is affiliated with. You can select multiple.</p>
                                <SearchSelectCreate
                                    onSearch={onSearchUniversities}
                                    onSelect={addUniversity}
                                    onRemove={removeUniversity}
                                    selectedItems={selectedUniversities}
                                    placeholder="Search universities…"
                                    displayKey="fullname"
                                    valueKey="id"
                                    isMulti={true}
                                    allowCreate={false}
                                    inputSize="sm"
                                />
                            </section>

                            {/* ── Section 6: Additional Info ── */}
                            <section className="space-y-4">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Additional Information</h3>
                                <div className="space-y-1.5">
                                    <Label>Career Opportunities <span className='text-gray-400 text-xs font-normal'>(optional)</span></Label>
                                    <Textarea
                                        {...register('careers')}
                                        rows={3}
                                        placeholder='e.g., Software Developer, Data Scientist, IT Consultant'
                                    />
                                </div>
                            </section>

                            {/* ── Section 7: Curriculum Structure ── */}
                            <section className="space-y-5">
                                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Curriculum Structure</h3>

                                {/* Year / Semester Tabs */}
                                <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl border'>
                                    {[1, 2, 3, 4].map((year) => (
                                        <div key={year} className='space-y-1.5'>
                                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide text-center'>
                                                Year {year}
                                            </p>
                                            {[0, 1, 2].map((sem) => (
                                                <button
                                                    key={sem}
                                                    type='button'
                                                    onClick={() => { setCurrentYear(year); setCurrentSemester(sem) }}
                                                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${currentYear === year && currentSemester === sem
                                                        ? 'bg-[#387cae] text-white shadow-sm'
                                                        : 'bg-white border border-gray-200 hover:border-[#387cae]/50 hover:text-[#387cae] text-gray-600'
                                                        }`}
                                                >
                                                    {sem === 0 ? 'Yearly' : `Sem ${sem}`}
                                                </button>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Active Semester Banner */}
                                <div className='flex items-center gap-2 px-4 py-2.5 bg-[#387cae]/5 border border-[#387cae]/20 rounded-lg'>
                                    <div className='w-2 h-2 rounded-full bg-[#387cae]' />
                                    <p className='text-sm font-medium text-[#387cae]'>
                                        {currentSemester === 0
                                            ? `Year ${currentYear} — Full Year`
                                            : `Year ${currentYear} — Semester ${currentSemester}`}
                                    </p>
                                </div>

                                {/* Add Course */}
                                <div className='flex gap-2 items-end'>
                                    <div className='flex-1 space-y-1.5'>
                                        <Label>Add Course</Label>
                                        <SearchSelectCreate
                                            onSearch={onSearchCourses}
                                            onSelect={(item) => setCurrentCourse({ id: item.id, title: item.title })}
                                            onRemove={() => setCurrentCourse({ id: '', title: '' })}
                                            selectedItems={currentCourse.id ? [currentCourse] : []}
                                            placeholder='Search and select a course…'
                                            displayKey='title'
                                            valueKey='id'
                                            isMulti={false}
                                            allowCreate={false}
                                            inputSize="sm"
                                        />
                                    </div>
                                    <Button
                                        type='button'
                                        onClick={handleAddCourse}
                                        disabled={!currentCourse.id}
                                        className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-1.5'
                                    >
                                        <Plus className='w-4 h-4' />
                                        Add
                                    </Button>
                                </div>

                                {/* Courses Table */}
                                {getCurrentSemesterCourses().length > 0 ? (
                                    <div className='border rounded-xl overflow-hidden'>
                                        <table className='w-full text-sm'>
                                            <thead>
                                                <tr className='bg-gray-50 border-b'>
                                                    <th className='p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10'>#</th>
                                                    <th className='p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide'>Course</th>
                                                    <th className='p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide w-28'>Elective</th>
                                                    <th className='p-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-16'>Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getCurrentSemesterCourses().map((course, index) => {
                                                    const fieldIndex = syllabusFields.findIndex(
                                                        (f) => f.course_id === course.id && f.year === currentYear && f.semester === currentSemester
                                                    )
                                                    const title = fieldIndex >= 0
                                                        ? (watch(`syllabus.${fieldIndex}._title`) || course.title || 'Unknown Course')
                                                        : (course.title || 'Unknown Course')

                                                    return (
                                                        <tr key={course.id} className='border-t hover:bg-gray-50/60 transition-colors'>
                                                            <td className='p-3 text-gray-400 font-medium'>{index + 1}.</td>
                                                            <td className='p-3 font-medium text-gray-900'>{title}</td>
                                                            <td className='p-3'>
                                                                <label className='flex items-center justify-center gap-2 cursor-pointer'>
                                                                    <input
                                                                        type='checkbox'
                                                                        checked={watch(`syllabus.${fieldIndex}.is_elective`) || false}
                                                                        onChange={(e) => setValue(`syllabus.${fieldIndex}.is_elective`, e.target.checked)}
                                                                        className='h-4 w-4 accent-[#387cae] rounded'
                                                                    />
                                                                    <span className='text-xs text-gray-500'>Elective</span>
                                                                </label>
                                                            </td>
                                                            <td className='p-3 text-right'>
                                                                <Button
                                                                    type='button'
                                                                    variant='ghost'
                                                                    size='icon'
                                                                    onClick={() => handleRemoveCourse(course.id)}
                                                                    className='h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50'
                                                                >
                                                                    <Trash2 className='w-3.5 h-3.5' />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center p-10 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center'>
                                        <p className='text-sm text-gray-400'>No courses added for this semester yet.</p>
                                        <p className='text-xs text-gray-300 mt-1'>Use the dropdown above to add courses.</p>
                                    </div>
                                )}
                            </section>

                        </form>
                    )}
                </div>

                {/* Sticky Footer */}
                <div className='sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 shrink-0'>
                    <Button type='button' variant='outline' onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        form="program-form"
                        disabled={submitting || loading}
                        className='bg-[#387cae] hover:bg-[#387cae]/90 text-white min-w-[130px]'
                    >
                        {submitting ? (
                            <span className='flex items-center gap-2'>
                                <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                                Processing...
                            </span>
                        ) : slug ? 'Update Program' : 'Create Program'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUpdateProgram
