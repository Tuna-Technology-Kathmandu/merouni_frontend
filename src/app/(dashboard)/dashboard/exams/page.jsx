'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import { getAllExams, createExam, updateExam, deleteExam } from './actions'
import Loading from '../../../../ui/molecules/Loading'
import Table from '@/ui/shadcn/DataTable'
import { Edit2, Trash2, Search, Eye } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import { useDebounce } from 'use-debounce'
import { fetchUniversities, fetchLevel } from './actions'
import useAdminPermission from '@/hooks/useAdminPermission'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { Button } from '../../../../ui/shadcn/button'
import { Input } from '../../../../ui/shadcn/input'
import { Label } from '../../../../ui/shadcn/label'
import { Select } from '../../../../ui/shadcn/select'
import SearchInput from '@/ui/molecules/SearchInput'
import { formatDate } from '@/utils/date.util'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import ExamViewModal from './ExamViewModal'

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
  const [viewingExam, setViewingExam] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
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
    exam_type: 'Written',
    full_marks: '',
    pass_marks: '',
    questions_count: '',
    question_type: 'MCQ',
    duration: '',
    normal_fee: '',
    late_fee: '',
    exam_date: '',
    opening_date: '',
    closing_date: ''
  })


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
    const examDate = new Date(formData.exam_date)
    const openingDate = new Date(formData.opening_date)
    const closingDate = new Date(formData.closing_date)

    if (formData.opening_date && formData.closing_date && openingDate >= closingDate) {
      setError('Opening date must be before closing date')
      return false
    }
    if (formData.closing_date && formData.exam_date && closingDate >= examDate) {
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
        cell: ({ getValue }) => {
          const html = getValue() || ''
          const text = html.replace(/<[^>]+>/g, '') // Strip HTML tags
          const truncated = text.length > 50 ? text.substring(0, 50) + '...' : text
          return (
            <div className='max-w-xs text-sm text-gray-600' title={text}>
              {truncated}
            </div>
          )
        }
      },
      {
        header: 'Syllabus',
        accessorKey: 'syllabus',
        cell: ({ getValue }) => {
          const value = getValue() || ''

          const getFirst20text = value.slice(0, 20)
          if (value.length > 20) {
            return getFirst20text + '...'
          }
          return value
        }

      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(row.original)}
              className='text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              title='View Details'
            >
              <Eye className='w-4 h-4' />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row.original)}
              className='text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              title='Edit'
            >
              <Edit2 className='w-4 h-4' />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(row.original.id)}
              className='text-red-600 hover:text-red-800 hover:bg-red-50'
              title='Delete'
            >
              <Trash2 className='w-4 h-4' />
            </Button>
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
        exam_type: 'Written',
        full_marks: '',
        pass_marks: '',
        questions_count: '',
        question_type: 'MCQ',
        duration: '',
        normal_fee: '',
        late_fee: '',
        exam_date: '',
        opening_date: '',
        closing_date: ''
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
        `${process.env.baseUrl}/exam?q=${query}`
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
        full_marks: Number(formData.full_marks || 0),
        pass_marks: Number(formData.pass_marks || 0),
        questions_count: Number(formData.questions_count || 0),
        normal_fee: Number(formData.normal_fee || 0),
        late_fee: Number(formData.late_fee || 0),
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
        exam_type: 'Written',
        full_marks: '',
        pass_marks: '',
        questions_count: '',
        question_type: 'MCQ',
        duration: '',
        normal_fee: '',
        late_fee: '',
        exam_date: '',
        opening_date: '',
        closing_date: ''
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
    // Determine data source (flat or nested for backward compatibility if needed, though we moved to flat)
    // Assume API returns flat structure now based on service update
    setFormData({
      title: exam.title,
      description: exam.description,
      level_id: exam.level_id,
      affiliation: exam.affiliation,
      syllabus: exam.syllabus,
      pastQuestion: exam.pastQuestion,
      exam_type: exam.exam_type || 'Written',
      full_marks: exam.full_marks || '',
      pass_marks: exam.pass_marks || '',
      questions_count: exam.questions_count || '',
      question_type: exam.question_type || 'MCQ',
      duration: exam.duration || '',
      normal_fee: exam.normal_fee || '',
      late_fee: exam.late_fee || '',
      exam_date: exam.exam_date || '',
      opening_date: exam.opening_date || '',
      closing_date: exam.closing_date || ''
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
      exam_type: 'Written',
      full_marks: '',
      pass_marks: '',
      questions_count: '',
      question_type: 'MCQ',
      duration: '',
      normal_fee: '',
      late_fee: '',
      exam_date: '',
      opening_date: '',
      closing_date: ''
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

  const handleView = (exam) => {
    setViewingExam(exam)
    setIsViewModalOpen(true)
  }

  const handleViewModalClose = () => {
    setIsViewModalOpen(false)
    setViewingExam(null)
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
      <div className='w-full space-y-2'>
        <div className='flex justify-between items-center px-4 pt-4'>
          {/* Search Bar */}
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder='Search exams...'
            className='max-w-md'
          />

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
                  exam_type: 'Written',
                  full_marks: '',
                  pass_marks: '',
                  questions_count: '',
                  question_type: 'MCQ',
                  duration: '',
                  normal_fee: '',
                  late_fee: '',
                  exam_date: '',
                  opening_date: '',
                  closing_date: ''
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

      {/* Form Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleModalClose}
        className='max-w-5xl'
      >
        <DialogHeader>
          <DialogTitle>{editingId ? 'Edit Exam' : 'Add Exam'}</DialogTitle>
          <DialogClose onClick={handleModalClose} />
        </DialogHeader>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <div className='container mx-auto p-1 flex flex-col max-h-[calc(100vh-200px)]'>
            <form
              onSubmit={handleSubmit}
              className='flex flex-col flex-1 overflow-hidden'
            >
              <div className='flex-1 overflow-y-auto space-y-6 pr-2'>
                {/* Basic Information */}
                <div>
                  <h2 className='text-lg font-semibold mb-4 text-gray-800 border-b pb-1'>Basic Information</h2>
                  <div className='grid grid-cols-1 gap-4 mb-4'>
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
                        className='mt-1'
                      />
                    </div>
                     <div>
                      <Label htmlFor='exam-description'>Description</Label>
                      <div className='mt-1'>
                        <TipTapEditor
                          value={formData.description}
                          onChange={handleDescriptionChange}
                          placeholder='Enter exam description...'
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* level search box */}
                    <div>
                      <RequiredLabel htmlFor='level-search'>Level</RequiredLabel>
                      <div className='relative mt-1'>
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
                      <div className='relative mt-1'>
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
                </div>

                {/* Exam Details - Clean Grid */}
                <div>
                  <h2 className='text-lg font-semibold mb-4 text-gray-800 border-b pb-1'>Exam Structure</h2>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                        <Label htmlFor='full_marks'>Full Marks</Label>
                        <Input
                            id='full_marks'
                            type='number'
                            placeholder='100'
                            value={formData.full_marks}
                            onChange={(e) => setFormData(prev => ({ ...prev, full_marks: e.target.value }))}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label htmlFor='pass_marks'>Pass Marks</Label>
                        <Input
                            id='pass_marks'
                            type='number'
                            placeholder='40'
                            value={formData.pass_marks}
                            onChange={(e) => setFormData(prev => ({ ...prev, pass_marks: e.target.value }))}
                            className='mt-1'
                        />
                    </div>
                     <div>
                        <Label htmlFor='duration'>Duration</Label>
                        <Input
                            id='duration'
                            type='text'
                            placeholder='e.g. 2 Hours'
                            value={formData.duration}
                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                            className='mt-1'
                        />
                    </div>
                     <div>
                        <Label htmlFor='question_type'>Question Type</Label>
                        <Select
                            id='question_type'
                            value={formData.question_type}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, question_type: value }))}
                        >
                             <option value="MCQ">MCQ</option>
                             <option value="Written">Written</option>
                             <option value="Practical">Practical</option>
                             <option value="Mixed">Mixed</option>
                        </Select>
                    </div>
                    <div>
                         <Label htmlFor='exam_type'>Exam Type</Label>
                         <Select
                             id='exam_type'
                             value={formData.exam_type}
                             onValueChange={(value) => setFormData(prev => ({ ...prev, exam_type: value }))}
                         >
                            <option value="Written">Written</option>
                            <option value="Online">Online</option>
                         </Select>
                     </div>
                  </div>
                </div>

                {/* Application Details - Clean Grid */}
                <div>
                   <h2 className='text-lg font-semibold mb-4 text-gray-800 border-b pb-1'>Dates & Fees</h2>
                   <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <div>
                            <Label htmlFor='normal_fee'>Normal Fee</Label>
                            <Input
                                id='normal_fee'
                                type='number'
                                placeholder='Rs.'
                                value={formData.normal_fee}
                                onChange={(e) => setFormData(prev => ({ ...prev, normal_fee: e.target.value }))}
                                className='mt-1'
                            />
                        </div>
                        <div>
                            <Label htmlFor='late_fee'>Late Fee</Label>
                            <Input
                                id='late_fee'
                                type='number'
                                placeholder='Rs.'
                                value={formData.late_fee}
                                onChange={(e) => setFormData(prev => ({ ...prev, late_fee: e.target.value }))}
                                className='mt-1'
                            />
                        </div>
                   </div>
                   <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                       <div>
                            <Label htmlFor='opening_date'>Opening Date</Label>
                            <Input
                                id='opening_date'
                                type='date'
                                value={formData.opening_date ? formatDate(formData.opening_date, 'YYYY-MM-DD') : ''} // Need to handle date format for input type='date'
                                onChange={(e) => setFormData(prev => ({ ...prev, opening_date: e.target.value }))}
                                className='mt-1'
                            />
                        </div>
                         <div>
                            <Label htmlFor='closing_date'>Closing Date</Label>
                            <Input
                                id='closing_date'
                                type='date'
                                value={formData.closing_date ? formatDate(formData.closing_date, 'YYYY-MM-DD') : ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, closing_date: e.target.value }))}
                                className='mt-1'
                            />
                        </div>
                        <div>
                            <Label htmlFor='exam_date'>Exam Date</Label>
                            <Input
                                id='exam_date'
                                type='date'
                                value={formData.exam_date ? formatDate(formData.exam_date, 'YYYY-MM-DD') : ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, exam_date: e.target.value }))}
                                className='mt-1'
                            />
                        </div>
                   </div>
                </div>

                {/* Additional Info */}
                 <div>
                    <h2 className='text-lg font-semibold mb-4 text-gray-800 border-b pb-1'>Additional Information</h2>
                    <div className='grid grid-cols-1 gap-4'>
                        <div>
                            <Label htmlFor='syllabus'>Syllabus</Label>
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
                              className='flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1'
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
                              className='mt-1'
                            />
                        </div>
                    </div>
                 </div>

              </div>
                {error && <div className='text-red-500 text-sm mt-2'>{error}</div>}


              {/* Submit Button */}
              <div className='p-4 border-t mt-auto'>
                <div className='flex justify-end gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleModalClose}
                  >
                    Cancel
                  </Button>
                  <Button type='submit' disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update Exam' : 'Create Exam'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this exam? This action cannot be undone.'
      />

      <ExamViewModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        exam={viewingExam}
      />
    </>
  )
}
