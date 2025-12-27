'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getAllExams, createExam, updateExam, deleteExam } from './actions'
import Loading from '../../../../components/Loading'
import Table from '../../../../components/Table'
import { Edit2, Trash2, Search } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import { fetchUniversities, fetchLevel } from './actions'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Modal } from '../../../../components/CreateUserModal'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '../addCollege/ConfirmationDialog'
const CKExam = dynamic(() => import('../component/CKExam'), {
  ssr: false
})

export default function ExamManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data.id)

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
        accessorKey: 'description'
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
        `${process.env.baseUrl}${process.env.version}/exam?q=${query}`
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
            ...formData.examDetails[0],
            full_marks: Number(formData.examDetails[0].full_marks),
            pass_marks: Number(formData.examDetails[0].pass_marks),
            number_of_question: Number(
              formData.examDetails[0].number_of_question
            )
          }
        ],
        applicationDetails: {
          ...formData.applicationDetails,
          normal_fee: Number(formData.applicationDetails.normal_fee),
          late_fee: Number(formData.applicationDetails.late_fee)
        },
        id: editingId
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
      examDetails: exam.exam_details || [
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
            <button
              className='bg-blue-500 text-white text-sm px-6 py-2 rounded hover:bg-blue-600 transition-colors'
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
            </button>
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
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='max-h-[calc(100vh-200px)] overflow-y-auto pr-2'>
            {/* Basic Information */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Basic Information</h2>
              <input
                type='text'
                placeholder='Exam Title'
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: e.target.value
                  }))
                }
                className='w-full p-2 border rounded'
                required
              />
              <CKExam
                id='exam-description'
                initialData={formData.description}
                onChange={handleDescriptionChange}
              />
              {/* level search box */}
              <div className='relative'>
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
                <input type='hidden' />
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
                    <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                      No levels found.
                    </div>
                  )
                ) : null}
              </div>

              {/* unversity search box */}
              <div className='relative'>
                <input
                  type='text'
                  className='w-full p-2 border rounded'
                  value={uniSearch}
                  onChange={(e) => {
                    setUniSearch(e.target.value)
                    setHasSelectedUni(false)
                  }}
                  placeholder='Search University'
                />

                {/* Hidden input for react-hook-form binding */}
                <input type='hidden' />
                {loadUni ? (
                  <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
                    Loading...
                  </div>
                ) : showUniDrop ? (
                  universities.length > 0 ? (
                    <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
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
                    <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
                      No universities found.
                    </div>
                  )
                ) : null}
              </div>
              <textarea
                placeholder='Syllabus'
                value={formData.syllabus}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    syllabus: e.target.value
                  }))
                }
                className='w-full p-2 border rounded'
                required
              />
              <input
                type='text'
                placeholder='Past Question URL'
                value={formData.pastQuestion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pastQuestion: e.target.value
                  }))
                }
                className='w-full p-2 border rounded'
              />
            </div>

            {/* Exam Details */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Exam Details</h2>
              <select
                value={formData.examDetails[0].exam_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    examDetails: [
                      {
                        ...prev.examDetails[0],
                        exam_type: e.target.value
                      }
                    ]
                  }))
                }
                className='w-full p-2 border rounded'
                required
              >
                <option value='Written'>Written</option>
                <option value='Practical'>Practical</option>
                <option value='Oral'>Oral</option>
              </select>
              <input
                type='number'
                placeholder='Full Marks'
                value={formData.examDetails[0].full_marks}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    examDetails: [
                      {
                        ...prev.examDetails[0],
                        full_marks: e.target.value
                      }
                    ]
                  }))
                }
                className='w-full p-2 border rounded'
                required
              />
              <input
                type='number'
                placeholder='Pass Marks'
                value={formData.examDetails[0].pass_marks}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    examDetails: [
                      {
                        ...prev.examDetails[0],
                        pass_marks: e.target.value
                      }
                    ]
                  }))
                }
                className='w-full p-2 border rounded'
                required
              />
              <input
                type='number'
                placeholder='Number of Questions'
                value={formData.examDetails[0].number_of_question}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    examDetails: [
                      {
                        ...prev.examDetails[0],
                        number_of_question: e.target.value
                      }
                    ]
                  }))
                }
                className='w-full p-2 border rounded'
                required
              />
              <select
                value={formData.examDetails[0].question_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    examDetails: [
                      {
                        ...prev.examDetails[0],
                        question_type: e.target.value
                      }
                    ]
                  }))
                }
                className='w-full p-2 border rounded'
                required
              >
                <option value='MCQ'>MCQ</option>
                <option value='Written'>Written</option>
                <option value='Mixed'>Mixed</option>
              </select>
              <input
                type='text'
                placeholder='Duration (e.g., 2 hours)'
                value={formData.examDetails[0].duration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    examDetails: [
                      {
                        ...prev.examDetails[0],
                        duration: e.target.value
                      }
                    ]
                  }))
                }
                className='w-full p-2 border rounded'
                required
              />
            </div>

            {/* Application Details */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Application Details</h2>
              {/* Normal fee and Late fee inputs remain the same */}

              <input
                type='text'
                placeholder='Normal fee (e.g., 2000)'
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
                className='w-full p-2 border rounded'
                required
              />

              <input
                type='text'
                placeholder='Late fee (e.g., 2000)'
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
                className='w-full p-2 border rounded'
                required
              />
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Exam Date
                </label>
                <input
                  type='date'
                  value={formData.applicationDetails.exam_date}
                  min={formData.applicationDetails.closing_date || undefined}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicationDetails: {
                        ...prev.applicationDetails,
                        exam_date: e.target.value
                      }
                    }))
                  }
                  className='w-full p-2 border rounded'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Opening Date
                </label>
                <input
                  type='date'
                  value={formData.applicationDetails.opening_date}
                  max={formData.applicationDetails.closing_date || undefined}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicationDetails: {
                        ...prev.applicationDetails,
                        opening_date: e.target.value
                      }
                    }))
                  }
                  className='w-full p-2 border rounded'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Closing Date
                </label>
                <input
                  type='date'
                  value={formData.applicationDetails.closing_date}
                  min={formData.applicationDetails.opening_date || undefined}
                  max={formData.applicationDetails.exam_date || undefined}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applicationDetails: {
                        ...prev.applicationDetails,
                        closing_date: e.target.value
                      }
                    }))
                  }
                  className='w-full p-2 border rounded'
                  required
                />
              </div>
            </div>

            {error && <div className='text-red-500'>{error}</div>}
          </div>

          <div className='flex justify-end gap-2 pt-4 border-t'>
            <button
              type='button'
              onClick={handleModalClose}
              className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300'
              disabled={loading}
            >
              {loading
                ? 'Processing...'
                : editingId
                  ? 'Update Exam'
                  : 'Create Exam'}
            </button>
          </div>
        </form>
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
