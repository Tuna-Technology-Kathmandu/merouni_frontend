'use client'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Edit2, Search, Trash2, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import { Modal } from '../../../../components/UserModal'
import Table from '../../../../components/Table'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import {
  fetchExam,
  fetchFaculties,
  fetchLevel,
  fetchScholarship
} from './actions'
import CourseSearch from './CourseSearch'
import { Button } from '@/components/ui/button'
const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})

export default function ProgramForm() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const [isOpen, setIsOpen] = useState(false)
  const [programs, setPrograms] = useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  //new syllabus
  const [currentYear, setCurrentYear] = useState(1)
  const [currentSemester, setCurrentSemester] = useState(1)
  const [currentCourse, setCurrentCourse] = useState({ id: '', title: '' })

  // States for dropdowns
  //for faculties search
  const [facSearch, setFacSearch] = useState('')
  const [debouncedFac] = useDebounce(facSearch, 300)
  const [faculties, setFaculties] = useState([])
  const [loadFac, setLoadFac] = useState(false)
  const [showFacDrop, setShowFacDrop] = useState(false)
  const [hasSelectedFac, setHasSelectedFac] = useState(false)

  //for level search
  const [levelSearch, setLevelSearch] = useState('')
  const [debouncedLevel] = useDebounce(levelSearch, 300)
  const [levels, setLevels] = useState([])
  const [loadLevel, setLoadLevel] = useState(false)
  const [showLevelDrop, setShowLevelDrop] = useState(false)
  const [hasSelectedLevel, setHasSelectedLevel] = useState(false)

  //for scholarship search
  const [scholarSearch, setScholarSearch] = useState('')
  const [debouncedScholar] = useDebounce(scholarSearch, 300)
  const [scholarships, setScholarships] = useState([])
  const [loadScholar, setLoadScholar] = useState(false)
  const [showScholarDrop, setShowScholarDrop] = useState(false)
  const [hasSelectedScholar, setHasSelectedScholar] = useState(false)

  //for exam searchs
  const [examSearch, setExamSearch] = useState('')
  const [debouncedExam] = useDebounce(examSearch, 300)
  const [exams, setExams] = useState([])
  const [loadExam, setLoadExam] = useState(false)
  const [showExamDrop, setShowExamDrop] = useState(false)
  const [hasSelectedExam, setHasSelectedExam] = useState(false)

  const [colleges, setColleges] = useState([])
  const [collegeSearch, setCollegeSearch] = useState('')
  const [selectedColleges, setSelectedColleges] = useState([])
  const [searchResults, setSearchResults] = useState([])

  const [syllabusSearch, setSyllabusSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const searchCollege = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?q=${query}`
      )
      const data = await response.json()
      setSearchResults(data.items || [])
    } catch (error) {
      console.error('College Search Error:', error)
      toast.error('Failed to search colleges')
    }
  }
  const addCollege = (college) => {
    if (!selectedColleges.some((c) => c.id === college.id)) {
      setSelectedColleges((prev) => [...prev, college])
      // Update form value
      const collegeIds = [...selectedColleges, college].map((c) => c.id)
      setValue('colleges', collegeIds)
    }
    setCollegeSearch('')
    setSearchResults([])
  }

  // Add function to remove college
  const removeCollege = (collegeId) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== collegeId))
    // Update form value
    const updatedCollegeIds = selectedColleges
      .filter((c) => c.id !== collegeId)
      .map((c) => c.id)
    setValue('colleges', updatedCollegeIds)
  }

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
      faculty_id: '',
      duration: '',
      credits: '',
      level_id: '',
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

  // Fetch all necessary data on component mount
  useEffect(() => {
    setHeading('Program Management')
    fetchPrograms()
    fetchColleges()
    return () => setHeading(null)
  }, [setHeading])

  // Handle query parameter to open add form
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('add') === 'true') {
      setIsOpen(true)
      setEditing(false)
      reset()
      setFacSearch('')
      setHasSelectedFac(false)
      setLevelSearch('')
      setHasSelectedLevel(false)
      setSelectedColleges([])
      setCollegeSearch('')
    }
  }, [reset])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const { requireAdmin } = useAdminPermission()

  //for faculties
  useEffect(() => {
    if (hasSelectedFac) return

    const getFaculties = async () => {
      setLoadFac(true)
      try {
        const facultyList = await fetchFaculties(debouncedFac)
        setFaculties(facultyList)
        setShowFacDrop(true)
        setLoadFac(false)
      } catch (error) {
        console.error('Error fetching Faculties:', error)
      }
    }
    if (debouncedFac !== '') {
      getFaculties()
    } else {
      setShowFacDrop(false)
    }
  }, [debouncedFac])

  //for level searching
  useEffect(() => {
    if (hasSelectedLevel) return

    const getLevels = async () => {
      setLoadLevel(true)
      try {
        const levelList = await fetchLevel(debouncedLevel)
        setLevels(levelList)
        setShowLevelDrop(true)
        setLoadLevel(false)
      } catch (error) {
        console.error('Error fetching levels:', error)
      }
    }
    if (debouncedLevel !== '') {
      getLevels()
    } else {
      setShowLevelDrop(false)
    }
  }, [debouncedLevel])

  //for scholarships searching
  useEffect(() => {
    if (hasSelectedScholar) return

    const getScholarship = async () => {
      setLoadScholar(true)
      try {
        const ScholarList = await fetchScholarship(debouncedScholar)
        setScholarships(ScholarList)
        setShowScholarDrop(true)
        setLoadScholar(false)
      } catch (error) {
        console.error('Error fetching scholarships:', error)
      }
    }
    if (debouncedScholar !== '') {
      getScholarship()
    } else {
      setShowScholarDrop(false)
    }
  }, [debouncedScholar])

  //watch form data
  // const formData = watch()

  // useEffect(() => {
  //   console.log('Form data:', formData)
  // }, [formData]) // Runs every time formData changes

  //for exams searching
  useEffect(() => {
    if (hasSelectedExam) return

    const getExam = async () => {
      setLoadExam(true)
      try {
        const ExamList = await fetchExam(debouncedExam)
        setExams(ExamList)
        setShowExamDrop(true)
        setLoadExam(false)
      } catch (error) {
        console.error('Error fetching exams:', error)
      }
    }
    if (debouncedExam !== '') {
      getExam()
    } else {
      setShowExamDrop(false)
    }
  }, [debouncedExam])

  // Fetch functions for all dropdown data
  const fetchPrograms = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/program?page=${page}`
      )
      const data = await response.json()
      setPrograms(data.items)
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        total: data.pagination.totalCount
      })
    } catch (error) {
      console.log(error, "DONEDONE")
      toast.error('Failed to fetch programs')
    } finally {
      setTableLoading(false)
    }
  }

  const fetchColleges = async () => {
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college`
      )
      const data = await response.json()
      setColleges(data.items)
    } catch (error) {
      toast.error('Failed to fetch levels')
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const cleanedData = {
        ...data,
        syllabus: data.syllabus.map((item) => ({
          year: item.year,
          semester: item.semester,
          course_id: item.course_id,
          // _title and _code are automatically excluded
          is_elective: item.is_elective || false
        }))
      }
      const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/program`
      const method = 'POST'
      console.log('while submiting data is', cleanedData)

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

      const result = await response.json()

      toast.success(
        editing
          ? 'Program updated successfully!'
          : 'Program created successfully!'
      )
      setSubmitting(false)
      setEditing(false)
      reset()
      setSelectedColleges([])
      setCollegeSearch('')
      fetchPrograms()
      setIsOpen(false)

      setFacSearch('')
      setHasSelectedFac(false)
      setScholarSearch('')
      setHasSelectedScholar(false)
      setExamSearch('')
      setHasSelectedExam(false)
      setLevelSearch('')
      setHasSelectedLevel(false)
    } catch (error) {
      // Handle different error types
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
      setSubmitting(false) // This will always run
    }
  }

  const handleEdit = async (slug) => {
    setFacSearch('')
    setHasSelectedFac(false)
    setScholarSearch('')
    setHasSelectedScholar(false)
    setExamSearch('')
    setHasSelectedExam(false)
    setLevelSearch('')
    setHasSelectedLevel(false)
    try {
      setEditing(true)
      setLoading(true)
      setIsOpen(true)

      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/program/${slug}`
      )
      const program = await response.json()
      // console.log('program', program)
      // Set basic information
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

      if (program.programfaculty?.title) {
        setFacSearch(program.programfaculty.title)
      } else {
        setFacSearch('')
        setHasSelectedFac(true) // Don't auto-open if there's nothing to pre-fill
      }

      if (program.programscholarship?.name) {
        setScholarSearch(program.programscholarship.name)
      } else {
        setScholarSearch('')
        setHasSelectedScholar(true)
      }

      if (program.programexam?.title) {
        setExamSearch(program.programexam.title)
      } else {
        setExamSearch('')
        setHasSelectedExam(true)
      }

      if (program.programlevel?.title) {
        setLevelSearch(program.programlevel.title)
        setHasSelectedLevel(false) // allow dropdown to auto-open
      } else {
        setLevelSearch('')
        setHasSelectedLevel(true) // prevent auto-opening dropdown
      }

      // Set colleges - extract college_ids from program_college
      if (program.colleges) {
        const collegeIds = program.colleges.map(
          (college) => college.program_college.college_id
        )
        setValue('colleges', collegeIds)
      }

      if (program.colleges) {
        const collegeData = program.colleges.map((college) => ({
          id: college.program_college.college_id,
          name: college.name,
          slugs: college.slugs
        }))
        setSelectedColleges(collegeData)
        setValue(
          'colleges',
          collegeData.map((c) => c.id)
        )
      }
    } catch (error) {
      console.error('Error in handleEdit:', error)
      toast.error('Failed to fetch program details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (facSearch && faculties.length > 0 && !hasSelectedFac) {
      setShowFacDrop(true)
    }
  }, [facSearch, faculties])

  useEffect(() => {
    if (scholarSearch && scholarships.length > 0 && !hasSelectedScholar) {
      setShowScholarDrop(true)
    }
  }, [scholarSearch, scholarships])

  useEffect(() => {
    if (examSearch && exams.length > 0 && !hasSelectedExam) {
      setShowExamDrop(true)
    }
  }, [examSearch, exams])

  useEffect(() => {
    if (levelSearch && levels.length > 0 && !hasSelectedLevel) {
      setShowLevelDrop(true)
    }
  }, [levelSearch, levels])

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    }, 'You do not have permission to delete this item.')
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/program/${deleteId}`,
        {
          method: 'DELETE'
        }
      )
      await response.json()
      toast.success('Program deleted successfully')
      await fetchPrograms()
    } catch (error) {
      toast.error('Failed to delete program')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditing(false)
    reset()
    setSelectedColleges([])
    setCollegeSearch('')
    setFacSearch('')
    setHasSelectedFac(false)
    setScholarSearch('')
    setHasSelectedScholar(false)
    setExamSearch('')
    setHasSelectedExam(false)
    setLevelSearch('')
    setHasSelectedLevel(false)
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)

    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    if (value === '') {
      handleSearch('')
    } else {
      const timeoutId = setTimeout(() => {
        handleSearch(value)
      }, 300)
      setSearchTimeout(timeoutId)
    }
  }

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title'
    },
    {
      header: 'Faculty',
      accessorKey: 'faculty_id'
    },
    {
      header: 'Duration',
      accessorKey: 'duration'
    },
    {
      header: 'Fee',
      accessorKey: 'fee'
    },
    {
      header: 'Level',
      accessorKey: 'level_id'
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button
            onClick={() => handleEdit(row.original.slugs)}
            className='p-1 text-blue-600 hover:text-blue-800'
          >
            <Edit2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => handleDeleteClick(row.original.id)}
            className='p-1 text-red-600 hover:text-red-800'
          >
            <Trash2 className='w-4 h-4' />
          </button>
        </div>
      )
    }
  ]

  const handleSearch = async (query) => {
    if (!query) {
      fetchPrograms()
      return
    }

    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/program?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        console.error('Error fetching levels:', response.statusText)
        setPrograms([])
      }
    } catch (error) {
      console.error('Error fetching levels search results:', error.message)
      setPrograms([])
    }
  }
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
        is_elective: false // Default to false when adding new course
      })
      setCurrentCourse({ id: '', title: '' })
      setSyllabusSearch('')
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

  // const clearSearch = () => { }

  return (
    <>
      <div className='p-4 w-full'>
        <div className='flex justify-between items-center mb-4'>
          {/* Search Bar */}
          <div className='relative w-full max-w-md'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <Search className='w-4 h-4 text-gray-500' />
            </div>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Search programs...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              onClick={() => {
                setEditing(false)
                reset()
                setSelectedColleges([])
                setCollegeSearch('')
                setFacSearch('')
                setHasSelectedFac(false)
                setScholarSearch('')
                setHasSelectedScholar(false)
                setExamSearch('')
                setHasSelectedExam(false)
                setLevelSearch('')
                setHasSelectedLevel(false)
                setIsOpen(true)
              }}
            >
              Add Program
            </Button>
          </div>
        </div>
        <ToastContainer />

        {/* Table Section */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={programs}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => fetchPrograms(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={editing ? 'Edit Program' : 'Add Program'}
        className='max-w-6xl'
      >
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='max-h-[calc(100vh-200px)] overflow-y-auto pr-2'>
            {/* Basic Information */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block mb-2'>
                    Program Title <span className='text-red-500'>*</span>
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className='w-full p-2 border rounded'
                  />
                  {errors.title && (
                    <span className='text-red-500'>{errors.title.message}</span>
                  )}
                </div>

                <div>
                  <label className='block mb-2'>Program Code</label>
                  <input
                    {...register('code')}
                    className='w-full p-2 border rounded'
                  />
                </div>

                <div className='relative'>
                  <label className='block mb-2'>
                    Faculty <span className='text-red-500'>*</span>
                  </label>

                  <input
                    type='text'
                    className='w-full p-2 border rounded'
                    value={facSearch}
                    onChange={(e) => {
                      setFacSearch(e.target.value)
                      setHasSelectedFac(false)
                    }}
                    placeholder='Search Faculty'
                  />

                  {/* Hidden input for react-hook-form binding */}
                  <input
                    type='hidden'
                    {...register('faculty_id', { required: true })}
                  />
                  {loadFac ? (
                    <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                      Loading...
                    </div>
                  ) : showFacDrop ? (
                    faculties.length > 0 ? (
                      <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
                        {faculties.map((fac) => (
                          <li
                            key={fac.id}
                            className='p-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                              setValue('faculty_id', fac.id)
                              setFacSearch(fac.title)
                              setShowFacDrop(false)
                              setHasSelectedFac(true)
                            }}
                          >
                            {fac.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                        No faculty found.
                      </div>
                    )
                  ) : null}
                </div>

                <div>
                  <label className='block mb-2'>
                    Duration <span className='text-red-500'>*</span>
                  </label>
                  <input
                    {...register('duration', { required: true })}
                    className='w-full p-2 border rounded'
                    placeholder='e.g., 4 years'
                  />
                </div>

                <div>
                  <label className='block mb-2'>
                    Credits <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='number'
                    {...register('credits', {
                      required: true,
                      valueAsNumber: true
                    })}
                    className='w-full p-2 border rounded'
                    step='0.1' //
                  />
                </div>

                {/* level search box */}
                <div className='relative'>
                  <label className='block mb-2'>
                    Level <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    className='w-full p-2 border rounded'
                    value={levelSearch}
                    onChange={(e) => {
                      setLevelSearch(e.target.value)
                      setHasSelectedLevel(false)
                    }}
                    placeholder='Search Levels'
                  />

                  {/* Hidden input for react-hook-form binding */}
                  <input
                    type='hidden'
                    {...register('level_id', { required: true })}
                  />
                  {loadLevel ? (
                    <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                      Loading...
                    </div>
                  ) : showLevelDrop ? (
                    levels.length > 0 ? (
                      <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
                        {levels.map((level) => (
                          <li
                            key={level.id}
                            className='p-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                              setValue('level_id', level.id)
                              setLevelSearch(level.title)
                              setShowLevelDrop(false)
                              setHasSelectedLevel(true)
                            }}
                          >
                            {level.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                        No levels found.
                      </div>
                    )
                  ) : null}
                </div>

                <div>
                  <label className='block mb-2'>
                    Language <span className='text-red-500'>*</span>
                  </label>
                  <input
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
                  <label className='block mb-2'>Description</label>
                  <CKUni
                    id='learning-outcomes-editor'
                    initialData={getValues('learning_outcomes')}
                    onChange={(data) => setValue('learning_outcomes', data)}
                  />
                </div>
                <div>
                  <label className='block mb-2'>Eligibility Criteria</label>
                  <textarea
                    {...register('eligibility_criteria')}
                    className='w-full p-2 border rounded'
                    rows='3'
                  />
                </div>

                <div>
                  <label className='block mb-2'>Fee Structure</label>
                  <input
                    {...register('fee')}
                    className='w-full p-2 border rounded'
                    placeholder='e.g., 5000 USD per year'
                  />
                </div>

                <div>
                  <label className='block mb-2'>Curriculum</label>
                  <textarea
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
                  <label className='block mb-2'>Delivery Type</label>
                  <select
                    {...register('delivery_type')}
                    className='w-full p-2 border rounded'
                  >
                    <option value='Full-time'>Full-time</option>
                    <option value='Part-time'>Part-time</option>
                    <option value='Online'>Online</option>
                    <option value='Hybrid'>Hybrird</option>
                  </select>
                </div>

                <div>
                  <label className='block mb-2'>Delivery Mode</label>
                  <select
                    {...register('delivery_mode')}
                    className='w-full p-2 border rounded'
                  >
                    <option value='On-campus'>On-campus</option>
                    <option value='Remote'>Remote</option>
                    <option value='Blended'>Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h2 className='text-xl font-semibold mb-4'>
                Additional Information
              </h2>
              Plus
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* for scholarships */}
                <div className='relative'>
                  <label className='block mb-2'>Scholarship</label>
                  <input
                    type='text'
                    className='w-full p-2 border rounded'
                    value={scholarSearch}
                    onChange={(e) => {
                      setScholarSearch(e.target.value)
                      setHasSelectedScholar(false)
                    }}
                    placeholder='Search Scholarships'
                  />

                  {/* Hidden input for react-hook-form binding */}
                  <input type='hidden' {...register('scholarship_id')} />
                  {loadScholar ? (
                    <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                      Loading...
                    </div>
                  ) : showScholarDrop ? (
                    scholarships.length > 0 ? (
                      <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
                        {scholarships.map((item) => (
                          <li
                            key={item.id}
                            className='p-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                              setValue('scholarship_id', item.id)
                              setScholarSearch(item.name)
                              setShowScholarDrop(false)
                              setHasSelectedScholar(true)
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                        No scholarships found.
                      </div>
                    )
                  ) : null}
                </div>

                {/* for exam */}

                <div className='relative'>
                  <label className='block mb-2'>Exam</label>
                  <input
                    type='text'
                    className='w-full p-2 border rounded'
                    value={examSearch}
                    onChange={(e) => {
                      setExamSearch(e.target.value)
                      setHasSelectedExam(false)
                    }}
                    placeholder='Search Exams'
                  />

                  {/* Hidden input for react-hook-form binding */}
                  <input type='hidden' {...register('exam_id')} />
                  {loadExam ? (
                    <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                      Loading...
                    </div>
                  ) : showExamDrop ? (
                    exams.length > 0 ? (
                      <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>

                        toot
                        {exams.map((item) => (
                          <li
                            key={item.id}
                            className='p-2 cursor-pointer hover:bg-gray-100'
                            onClick={() => {
                              setValue('exam_id', item.id)
                              setExamSearch(item.title)
                              setShowExamDrop(false)
                              setHasSelectedExam(true)
                            }}
                          >
                            {item.title}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                        No exams found.
                      </div>
                    )
                  ) : null}
                </div>

                <div>
                  <label className='block mb-2'>Career Opportunities</label>
                  <textarea
                    {...register('careers')}
                    className='w-full p-2 border rounded'
                    rows='3'
                    placeholder='e.g., Software Developer, Data Scientist, IT Consultant'
                  />
                </div>

                <div className='mb-4'>
                  <label className='block mb-2'>Colleges</label>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    {selectedColleges.map((college) => (
                      <div
                        key={college.id}
                        className='flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full'
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
                  </div>

                  <div className='relative'>
                    <input
                      type='text'
                      value={collegeSearch}
                      onChange={searchCollege}
                      className='w-full p-2 border rounded'
                      placeholder='Search colleges...'
                    />

                    {searchResults.length > 0 && (
                      <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto'>
                        {searchResults.map((college) => (
                          <div
                            key={college.id}
                            onClick={() => addCollege(college)}
                            className='p-2 hover:bg-gray-100 cursor-pointer'
                          >
                            {college.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* new one */}

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
                            ? `
                            Semester ${sem}`
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
                    <CourseSearch
                      search={syllabusSearch}
                      setSearch={setSyllabusSearch}
                      value={currentCourse.id}
                      onChange={(id, title) => setCurrentCourse({ id, title })}
                      title={currentCourse.title}
                      placeholder='Search courses to add...'
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
              onClick={handleModalClose}
              className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <Button
              type='submit'
              disabled={submitting}
            >
              {submitting
                ? 'Processing...'
                : editing
                  ? 'Update Program'
                  : 'Create Program'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this program? This action cannot be undone.'
      />
    </>
  )
}

{
  /* <div className='bg-white p-6 rounded-lg shadow-md'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold'>Syllabus</h2>
                <button
                  type='button'
                  onClick={() =>
                    appendSyllabus({
                      year: 1,
                      semester: 1,
                      course_id: ''
                    })
                  }
                  className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
                >
                  Add Course
                </button>
              </div>

              {syllabusFields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded'
                  >
                    <div>
                      <label className='block mb-2'>Year</label>
                      <input
                        type='number'
                        {...register(`syllabus.${index}.year`)}
                        className='w-full p-2 border rounded'
                        min='1'
                      />
                    </div>

                    <div>
                      <label className='block mb-2'>Semester</label>
                      <input
                        type='number'
                        {...register(`syllabus.${index}.semester`)}
                        className='w-full p-2 border rounded'
                        min='1'
                        max='2'
                      />
                    </div>

                    <CourseSearch
                      value={watch(`syllabus.${index}.course_id`)}
                      onChange={(id) =>
                        setValue(`syllabus.${index}.course_id`, id)
                      }
                      title={watch(`syllabus.${index}.course.title`)}
                    />

                    {index > 0 && (
                      <button
                        type='button'
                        onClick={() => removeSyllabus(index)}
                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              })}
            </div> */
}
