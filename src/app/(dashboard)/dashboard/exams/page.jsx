'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import { getAllExams, createExam, updateExam, deleteExam } from './actions'
import Loading from '../../../../ui/molecules/Loading'
import Table from '../../../../ui/molecules/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import { fetchUniversities, fetchLevel } from './actions'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Modal } from '../../../../ui/molecules/UserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
import { Button } from '../../../../ui/shadcn/button'
import { Input } from '../../../../ui/shadcn/input'
import { Label } from '../../../../ui/shadcn/label'
import { Select } from '../../../../ui/shadcn/select'
import { DotenvConfig } from '@/config/env.config'
const CKExam = dynamic(() => import('../component/CKExam'), {
  ssr: false
})

// Helper component for required label
const RequiredLabel = ({ children, htmlFor }) => (
  <Label htmlFor={htmlFor}>
    {children} <span className='text-red-500'>*</span>
  </Label>
)

export default function ExamManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)
  const searchParams = useSearchParams()
  const router = useRouter()

  //for university search
  const [uniSearch, setUniSearch] = useState('')
  const [debouncedUni] = useDebounce(uniSearch, 300)
  const [universities, setUniversities] = useState([])
  const [loadUni, setLoadUni] = useState(false)
  const [showUniDrop, setShowUniDrop] = useState(false)
  const [hasSelectedUni, setHasSelectedUni] = useState(false)

  //for level search
  const [levelSearch, setLevelSearch] = useState('')
  const [debouncedLevel] = useDebounce(levelSearch, 300)
  const [levels, setLevels] = useState([])
  const [loadLevel, setLoadLevel] = useState(false)
  const [showLevelDrop, setShowLevelDrop] = useState(false)
  const [hasSelectedLevel, setHasSelectedLevel] = useState(false)

  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level_id: '',
    affiliation: '',
    syllabus: '',
    pastQuestion: '',
    examDetails: [
      {
        exam_type: 'Written',
        full_marks: '',
        pass_marks: '',
        number_of_question: '',
        question_type: 'MCQ',
        duration: ''
      }
    ],
    applicationDetails: {
      normal_fee: '',
      late_fee: '',
      exam_date: '',
      opening_date: '',
      closing_date: ''
    }
  })

  const editorRef = useRef(null)

  // console.log('formData', formData)

  const { requireAdmin } = useAdminPermission()

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

  //for university searching
  useEffect(() => {
    if (hasSelectedUni) return

    const getUniversities = async () => {
      setLoadUni(true)
      try {
        const universityList = await fetchUniversities(debouncedUni)
        setUniversities(universityList)
        setShowUniDrop(true)
        setLoadUni(false)
      } catch (error) {
        console.error('Error fetching universities:', error)
      }
    }
    if (debouncedUni !== '') {
      getUniversities()
    } else {
      setShowUniDrop(false)
    }
  }, [debouncedUni])

  // Validate dates
  const validateDates = () => {
    const examDate = new Date(formData.applicationDetails.exam_date)
    const openingDate = new Date(formData.applicationDetails.opening_date)
    const closingDate = new Date(formData.applicationDetails.closing_date)

    if (openingDate >= closingDate) {
      setError('Opening date must be before closing date')
      return false
    }
    if (closingDate >= examDate) {
      setError('Closing date must be before exam date')
      return false
    }
    return true
  }
  const columns = useMemo(
    () => [
      {
        header: 'Title',
        accessorKey: 'title'
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: ({ getValue }) => (
          <div
            className='max-w-xs truncate text-sm'
            dangerouslySetInnerHTML={{
              __html: getValue() || ''
            }}
          />
        )
      },
      {
        header: 'Syllabus',
        accessorKey: 'syllabus'
      },
      {
        header: 'Past Questions',
        accessorKey: 'pastQuestion',
        cell: ({ getValue }) => (
          <a
            href={getValue()}
            className='text-blue-600 hover:underline'
            target='_blank'
            rel='noopener noreferrer'
          >
            View
          </a>
        )
      },
      {
        header: 'Created Date',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString()
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <button
              onClick={() => handleEdit(row.original)}
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
    ],
    []
  )

  useEffect(() => {
    setHeading('Exam Management')
    loadExams()
    return () => setHeading(null)
  }, [setHeading])

  // Check for 'add' query parameter and open modal
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      setIsOpen(true)
      setEditingId(null)
      setFormData({
        title: '',
        description: '',
        level_id: '',
        affiliation: '',
        syllabus: '',
        pastQuestion: '',
        examDetails: [
          {
            exam_type: 'Written',
            full_marks: '',
            pass_marks: '',
            number_of_question: '',
            question_type: 'MCQ',
            duration: ''
          }
        ],
        applicationDetails: {
          normal_fee: '',
          late_fee: '',
          exam_date: '',
          opening_date: '',
          closing_date: ''
        }
      })
      setError(null)
      // Remove query parameter from URL
      router.replace('/dashboard/exams', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  const loadExams = async (page = 1) => {
    setTableLoading(true)
    try {
      const response = await getAllExams(page)

      setExams(response.items)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        total: response.pagination.totalCount
      })
    } catch (error) {
      setError('Failed to load exams')
      toast.error('Failed to fetch exams')
    } finally {
      setTableLoading(false)
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query) {
      loadExams()
      return
    }
    try {
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/exam?q=${query}`
      )
      if (response.ok) {
        const data = await response.json()
        setExams(data.items)

        if (data.pagination) {
          setPagination({
            currentPage: data.pagination.currentPage,
            totalPages: data.pagination.totalPages,
            total: data.pagination.totalCount
          })
        }
      } else {
        setExams([])
      }
    } catch (error) {
      console.error('Error fetching exams search results:', error.message)
      setExams([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateDates()) return

    try {
      setLoading(true)
      const formattedData = {
        ...formData,
        author: author_id,
        examDetails: [
          {
            ...(formData.examDetails?.[0] || {}),
            full_marks: Number(formData.examDetails?.[0]?.full_marks || 0),
            pass_marks: Number(formData.examDetails?.[0]?.pass_marks || 0),
            number_of_question: Number(
              formData.examDetails?.[0]?.number_of_question || 0
            )
          }
        ],
        applicationDetails: {
          ...formData.applicationDetails,
          normal_fee: Number(formData.applicationDetails.normal_fee),
          late_fee: Number(formData.applicationDetails.late_fee)
        },
        ...(editingId && { id: editingId })
      }
      await createExam(formattedData)
      // Reset form...
      setFormData({
        title: '',
        description: '',
        level_id: '',
        affiliation: '',
        syllabus: '',
        pastQuestion: '',
        examDetails: [
          {
            exam_type: 'Written',
            full_marks: '',
            pass_marks: '',
            number_of_question: '',
            question_type: 'MCQ',
            duration: ''
          }
        ],
        applicationDetails: {
          normal_fee: '',
          late_fee: '',
          exam_date: '',
          opening_date: '',
          closing_date: ''
        }
      })
      setLoading(false)
      setEditingId(null)
      setError(null)
      setIsOpen(false)
      setLevelSearch('')
      setUniSearch('')
      setHasSelectedLevel(false)
      setHasSelectedUni(false)
      loadExams()

      toast.success(`Successfully ${editingId ? 'updated' : 'created'} exam`)
    } catch (error) {
      toast.error(`Failed to ${editingId ? 'update' : 'create'} exam`)
      console.error('Error saving exam:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (exam) => {
    setFormData({
      title: exam.title,
      description: exam.description,
      level_id: exam.level_id,
      affiliation: exam.affiliation,
      syllabus: exam.syllabus,
      pastQuestion: exam.pastQuestion,
      examDetails:
        exam.exam_details && exam.exam_details.length > 0
          ? exam.exam_details
          : [
              {
                exam_type: 'Written',
                full_marks: '',
                pass_marks: '',
                number_of_question: '',
                question_type: 'MCQ',
                duration: ''
              }
            ],
      applicationDetails: exam.application_details[0] || {
        normal_fee: '',
        late_fee: '',
        exam_date: '',
        opening_date: '',
        closing_date: ''
      }
    })
    setEditingId(exam.id)
    setError(null)
    setIsOpen(true)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditingId(null)
    setError(null)
    setFormData({
      title: '',
      description: '',
      level_id: '',
      affiliation: '',
      syllabus: '',
      pastQuestion: '',
      examDetails: [
        {
          exam_type: 'Written',
          full_marks: '',
          pass_marks: '',
          number_of_question: '',
          question_type: 'MCQ',
          duration: ''
        }
      ],
      applicationDetails: {
        normal_fee: '',
        late_fee: '',
        exam_date: '',
        opening_date: '',
        closing_date: ''
      }
    })
    setLevelSearch('')
    setUniSearch('')
    setHasSelectedLevel(false)
    setHasSelectedUni(false)
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setDeleteId(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      await deleteExam(deleteId)
      toast.success('Exam deleted successfully!')
      await loadExams()
      setError(null)
    } catch (error) {
      toast.error('Failed to delete exam')
      setError('Failed to delete exam')
      console.error('Error deleting exam:', error)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
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

  const handleDescriptionChange = (value) => {
    if (value !== formData.description) {
      setFormData((prev) => ({
        ...prev,
        description: value
      }))
    }
  }
  if (loading)
    return (
      <div className='mx-auto'>
        <Loading />
      </div>
    )

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
              placeholder='Search exams...'
            />
          </div>
          {/* Button */}
          <div className='flex gap-2'>
            <Button
              type='button'
              variant='default'
              onClick={() => {
                setIsOpen(true)
                setEditingId(null)
                setError(null)
                setFormData({
                  title: '',
                  description: '',
                  level_id: '',
                  affiliation: '',
                  syllabus: '',
                  pastQuestion: '',
                  examDetails: [
                    {
                      exam_type: 'Written',
                      full_marks: '',
                      pass_marks: '',
                      number_of_question: '',
                      question_type: 'MCQ',
                      duration: ''
                    }
                  ],
                  applicationDetails: {
                    normal_fee: '',
                    late_fee: '',
                    exam_date: '',
                    opening_date: '',
                    closing_date: ''
                  }
                })
                setLevelSearch('')
                setUniSearch('')
                setHasSelectedLevel(false)
                setHasSelectedUni(false)
              }}
            >
              Add Exam
            </Button>
          </div>
        </div>
        <ToastContainer />

        {/* Table */}
        <div className='mt-8'>
          <Table
            loading={tableLoading}
            data={exams}
            columns={columns}
            pagination={pagination}
            onPageChange={(newPage) => loadExams(newPage)}
            onSearch={handleSearch}
            showSearch={false}
          />
        </div>
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        title={editingId ? 'Edit Exam' : 'Add Exam'}
        className='max-w-5xl'
      >
        <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col flex-1 overflow-hidden'
          >
            <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
              {/* Basic Information */}
              <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Basic Information</h2>
                <div>
                  <RequiredLabel htmlFor='exam-title'>Exam Title</RequiredLabel>
                  <Input
                    id='exam-title'
                    type='text'
                    placeholder='Enter exam title'
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='exam-description'>Description</Label>
                  <CKExam
                    id='exam-description'
                    initialData={formData.description}
                    onChange={handleDescriptionChange}
                  />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {/* level search box */}
                  <div>
                    <RequiredLabel htmlFor='level-search'>Level</RequiredLabel>
                    <div className='relative'>
                      <Input
                        id='level-search'
                        type='text'
                        value={levelSearch}
                        onChange={(e) => {
                          setLevelSearch(e.target.value)
                          setHasSelectedLevel(false)
                        }}
                        placeholder='Search levels...'
                      />
                      {loadLevel ? (
                        <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2 mt-1'>
                          Loading...
                        </div>
                      ) : showLevelDrop ? (
                        levels.length > 0 ? (
                          <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md mt-1'>
                            {levels.map((level) => (
                              <li
                                key={level.id}
                                className='p-2 cursor-pointer hover:bg-gray-100'
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    level_id: level.id
                                  }))

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
                          <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 mt-1 text-gray-500'>
                            No levels found.
                          </div>
                        )
                      ) : null}
                    </div>
                  </div>

                  {/* university search box */}
                  <div>
                    <Label htmlFor='university-search'>
                      University/Affiliation
                    </Label>
                    <div className='relative'>
                      <Input
                        id='university-search'
                        type='text'
                        value={uniSearch}
                        onChange={(e) => {
                          setUniSearch(e.target.value)
                          setHasSelectedUni(false)
                        }}
                        placeholder='Search universities...'
                      />
                      {loadUni ? (
                        <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2 mt-1'>
                          Loading...
                        </div>
                      ) : showUniDrop ? (
                        universities.length > 0 ? (
                          <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md mt-1'>
                            {universities.map((uni) => (
                              <li
                                key={uni.id}
                                className='p-2 cursor-pointer hover:bg-gray-100'
                                onClick={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    affiliation: uni.id
                                  }))
                                  setUniSearch(uni.fullname)
                                  setShowUniDrop(false)
                                  setHasSelectedUni(true)
                                }}
                              >
                                {uni.fullname}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 mt-1 text-gray-500'>
                            No universities found.
                          </div>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
                <div>
                  <RequiredLabel htmlFor='syllabus'>Syllabus</RequiredLabel>
                  <textarea
                    id='syllabus'
                    placeholder='Enter exam syllabus'
                    value={formData.syllabus}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        syllabus: e.target.value
                      }))
                    }
                    className='flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    required
                  />
                </div>
                <div>
                  <Label htmlFor='past-question'>Past Question URL</Label>
                  <Input
                    id='past-question'
                    type='text'
                    placeholder='Enter past question URL'
                    value={formData.pastQuestion}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pastQuestion: e.target.value
                      }))
                    }
                  />
                </div>
              </div>

              {/* Exam Details */}
              <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Exam Details</h2>
                <div>
                  <RequiredLabel htmlFor='exam-type'>Exam Type</RequiredLabel>
                  <Select
                    className='w-full'
                    id='exam-type'
                    value={formData.examDetails?.[0]?.exam_type || 'Written'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        examDetails: [
                          {
                            ...(prev.examDetails?.[0] || {}),
                            exam_type: e.target.value
                          }
                        ]
                      }))
                    }
                    required
                  >
                    <option value='Written'>Written</option>
                    <option value='Practical'>Practical</option>
                    <option value='Oral'>Oral</option>
                  </Select>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <RequiredLabel htmlFor='full-marks'>
                      Full Marks
                    </RequiredLabel>
                    <Input
                      id='full-marks'
                      type='number'
                      placeholder='e.g., 100'
                      value={formData.examDetails?.[0]?.full_marks || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          examDetails: [
                            {
                              ...(prev.examDetails?.[0] || {}),
                              full_marks: e.target.value
                            }
                          ]
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <RequiredLabel htmlFor='pass-marks'>
                      Pass Marks
                    </RequiredLabel>
                    <Input
                      id='pass-marks'
                      type='number'
                      placeholder='e.g., 40'
                      value={formData.examDetails?.[0]?.pass_marks || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          examDetails: [
                            {
                              ...(prev.examDetails?.[0] || {}),
                              pass_marks: e.target.value
                            }
                          ]
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <RequiredLabel htmlFor='num-questions'>
                    Number of Questions
                  </RequiredLabel>
                  <Input
                    id='num-questions'
                    type='number'
                    placeholder='e.g., 50'
                    value={formData.examDetails?.[0]?.number_of_question || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        examDetails: [
                          {
                            ...(prev.examDetails?.[0] || {}),
                            number_of_question: e.target.value
                          }
                        ]
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <RequiredLabel htmlFor='question-type'>
                    Question Type
                  </RequiredLabel>
                  <Select
                    id='question-type'
                    value={formData.examDetails?.[0]?.question_type || 'MCQ'}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        examDetails: [
                          {
                            ...(prev.examDetails?.[0] || {}),
                            question_type: e.target.value
                          }
                        ]
                      }))
                    }
                    required
                  >
                    <option value='MCQ'>MCQ</option>
                    <option value='Written'>Written</option>
                    <option value='Mixed'>Mixed</option>
                  </Select>
                </div>
                <div>
                  <RequiredLabel htmlFor='duration'>Duration</RequiredLabel>
                  <Input
                    id='duration'
                    type='text'
                    placeholder='e.g., 2 hours'
                    value={formData.examDetails?.[0]?.duration || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        examDetails: [
                          {
                            ...(prev.examDetails?.[0] || {}),
                            duration: e.target.value
                          }
                        ]
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Application Details */}
              <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Application Details</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <RequiredLabel htmlFor='normal-fee'>
                      Normal Fee
                    </RequiredLabel>
                    <Input
                      id='normal-fee'
                      type='text'
                      placeholder='e.g., 2000'
                      value={formData.applicationDetails.normal_fee}
                      onChange={(e) =>
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          applicationDetails: {
                            ...prevFormData.applicationDetails,
                            normal_fee: e.target.value
                          }
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <RequiredLabel htmlFor='late-fee'>Late Fee</RequiredLabel>
                    <Input
                      id='late-fee'
                      type='text'
                      placeholder='e.g., 2500'
                      value={formData.applicationDetails.late_fee}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          applicationDetails: {
                            ...prev.applicationDetails,
                            late_fee: e.target.value
                          }
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div>
                    <RequiredLabel htmlFor='exam-date'>Exam Date</RequiredLabel>
                    <Input
                      id='exam-date'
                      type='date'
                      value={formData.applicationDetails.exam_date}
                      min={
                        formData.applicationDetails.closing_date || undefined
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          applicationDetails: {
                            ...prev.applicationDetails,
                            exam_date: e.target.value
                          }
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <RequiredLabel htmlFor='opening-date'>
                      Opening Date
                    </RequiredLabel>
                    <Input
                      id='opening-date'
                      type='date'
                      value={formData.applicationDetails.opening_date}
                      max={
                        formData.applicationDetails.closing_date || undefined
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          applicationDetails: {
                            ...prev.applicationDetails,
                            opening_date: e.target.value
                          }
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <RequiredLabel htmlFor='closing-date'>
                      Closing Date
                    </RequiredLabel>
                    <Input
                      id='closing-date'
                      type='date'
                      value={formData.applicationDetails.closing_date}
                      // min={formData.applicationDetails.opening_date || undefined}
                      // max={formData.applicationDetails.exam_date || undefined}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          applicationDetails: {
                            ...prev.applicationDetails,
                            closing_date: e.target.value
                          }
                        }))
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {error && <div className='text-red-500 text-sm'>{error}</div>}
            </div>

            {/* Submit Button - Sticky Footer */}
            <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
              <Button
                type='button'
                onClick={handleModalClose}
                variant='outline'
              >
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading
                  ? 'Processing...'
                  : editingId
                    ? 'Update Exam'
                    : 'Create Exam'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this exam? This action cannot be undone.'
      />
    </>
  )
}
