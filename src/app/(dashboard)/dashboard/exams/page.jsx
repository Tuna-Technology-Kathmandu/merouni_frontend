'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { Search, Edit2, Trash2, Eye, Plus } from 'lucide-react'

import { getAllExams, createExam, deleteExam, fetchUniversities, fetchLevel } from './actions'
import Loading from '../../../../ui/molecules/Loading'
import Table from '@/ui/shadcn/DataTable'
import { authFetch } from '@/app/utils/authFetch'
import useAdminPermission from '@/hooks/useAdminPermission'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose
} from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { Button } from '../../../../ui/shadcn/button'
import { Input } from '../../../../ui/shadcn/input'
import { Label } from '../../../../ui/shadcn/label'
import { Select } from '../../../../ui/shadcn/select'
import { Textarea } from '@/ui/shadcn/textarea'
import SearchInput from '@/ui/molecules/SearchInput'
import { formatDate } from '@/utils/date.util'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import ExamViewModal from './ExamViewModal'

export default function ExamManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { requireAdmin } = useAdminPermission()

  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingExam, setViewingExam] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
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
    }
  })

  // Watch for SearchSelectCreate items
  const selectedLevelId = watch('level_id')
  const selectedAffiliationId = watch('affiliation')

  // We need to keep track of the full objects for SearchSelectCreate's selectedItems prop
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedUniversity, setSelectedUniversity] = useState(null)

  useEffect(() => {
    setHeading('Exam Management')
    loadExams()
    return () => setHeading(null)
  }, [setHeading])

  // Handle URL param 'add=true'
  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      handleAdd()
      router.replace('/dashboard/exams', { scroll: false })
    }
  }, [searchParams, router])

  const loadExams = async (page = 1, query = '') => {
    setTableLoading(true)
    try {
      let response
      if (query) {
        const res = await authFetch(`${process.env.baseUrl}/exam?q=${query}&page=${page}`)
        response = await res.json()
      } else {
        response = await getAllExams(page)
      }

      const flattenedItems = (response.items || []).map((exam) => {
        const examDetail = exam.exam_details?.[0] || {}
        const appDetail = exam.application_details?.[0] || {}
        return {
          ...exam,
          // Extract nested fields for table and form
          exam_type: exam.exam_type || examDetail.exam_type || 'Written',
          question_type: exam.question_type || examDetail.question_type || 'MCQ',
          duration: exam.duration || examDetail.duration || '',
          full_marks: exam.full_marks || examDetail.full_marks || '',
          pass_marks: exam.pass_marks || examDetail.pass_marks || '',
          questions_count: exam.questions_count || examDetail.number_of_question || '',
          normal_fee: exam.normal_fee || appDetail.normal_fee || '',
          late_fee: exam.late_fee || appDetail.late_fee || '',
          opening_date: exam.opening_date || appDetail.opening_date || null,
          closing_date: exam.closing_date || appDetail.closing_date || null,
          exam_date: exam.exam_date || appDetail.exam_date || null
        }
      })

      setExams(flattenedItems)
      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        total: response.pagination?.totalCount || 0
      })
    } catch (error) {
      console.error('Failed to fetch exams:', error)
      toast.error('Failed to fetch exams')
    } finally {
      setTableLoading(false)
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadExams(1, query)
  }

  const handleAdd = () => {
    setEditingId(null)
    setSelectedLevel(null)
    setSelectedUniversity(null)
    reset({
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
    setIsOpen(true)
  }

  const handleEdit = (exam) => {
    setEditingId(exam.id)

    // Set selected objects for SearchSelectCreate
    setSelectedLevel(exam.level || null)
    setSelectedUniversity(exam.university || null)

    // Formatted dates for <input type="date" />
    const formatInputDate = (dateStr) => {
      if (!dateStr) return ''
      try {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return ''
        return date.toISOString().split('T')[0]
      } catch (e) {
        return ''
      }
    }

    reset({
      title: exam.title || '',
      description: exam.description || '',
      level_id: exam.level_id || '',
      affiliation: exam.affiliation || '',
      syllabus: exam.syllabus || '',
      pastQuestion: exam.pastQuestion || '',
      exam_type: exam.exam_type || 'Written',
      full_marks: exam.full_marks || '',
      pass_marks: exam.pass_marks || '',
      questions_count: exam.questions_count || '',
      question_type: exam.question_type || 'MCQ',
      duration: exam.duration || '',
      normal_fee: exam.normal_fee || '',
      late_fee: exam.late_fee || '',
      exam_date: formatInputDate(exam.exam_date),
      opening_date: formatInputDate(exam.opening_date),
      closing_date: formatInputDate(exam.closing_date)
    })
    setIsOpen(true)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditingId(null)
    setSelectedLevel(null)
    setSelectedUniversity(null)
  }

  const onSubmit = async (data) => {
    // Basic date validation
    if (data.opening_date && data.closing_date && new Date(data.opening_date) >= new Date(data.closing_date)) {
      toast.error('Opening date must be before closing date')
      return
    }
    if (data.closing_date && data.exam_date && new Date(data.closing_date) >= new Date(data.exam_date)) {
      toast.error('Closing date must be before exam date')
      return
    }

    try {
      setTableLoading(true)
      const formattedData = {
        ...data,
        author: author_id,
        full_marks: Number(data.full_marks || 0),
        pass_marks: Number(data.pass_marks || 0),
        questions_count: Number(data.questions_count || 0),
        normal_fee: Number(data.normal_fee || 0),
        late_fee: Number(data.late_fee || 0),
        ...(editingId && { id: editingId })
      }

      await createExam(formattedData)
      toast.success(`Exam ${editingId ? 'updated' : 'created'} successfully`)
      handleModalClose()
      loadExams()
    } catch (error) {
      console.error('Error saving exam:', error)
      toast.error(`Failed to ${editingId ? 'update' : 'create'} exam`)
    } finally {
      setTableLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    requireAdmin(() => {
      setDeleteId(id)
      setIsDialogOpen(true)
    })
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteExam(deleteId)
      toast.success('Exam deleted successfully')
      loadExams()
    } catch (error) {
      toast.error('Failed to delete exam')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const columns = useMemo(() => [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.title}</div>
      )
    },
    {
      header: 'Level',
      accessorKey: 'level.title',
      cell: ({ row }) => row.original.level?.title || 'N/A'
    },
    {
      header: 'Affiliation',
      accessorKey: 'university.fullname',
      cell: ({ row }) => row.original.university?.fullname || row.original.affiliation || 'N/A'
    },
    {
      header: 'Exam Date',
      accessorKey: 'exam_date',
      cell: ({ row }) => row.original.exam_date ? formatDate(row.original.exam_date) : 'N/A'
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setViewingExam(row.original)
              setIsViewModalOpen(true)
            }}
            className='hover:bg-blue-50 text-blue-600'
          >
            <Eye className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
            className='hover:bg-amber-50 text-amber-600'
          >
            <Edit2 className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original.id)}
            className='hover:bg-red-50 text-red-600'
          >
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>
      )
    }
  ], [requireAdmin])

  if (loading) return <Loading />

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search exams by title...'
          className='max-w-md w-full'
        />
        <Button onClick={handleAdd} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Exam
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          loading={tableLoading}
          data={exams}
          columns={columns}
          pagination={pagination}
          onPageChange={(page) => loadExams(page, searchQuery)}
          showSearch={false}
        />
      </div>

      {/* Form Dialog */}
      <Dialog
        isOpen={isOpen}
        onClose={handleModalClose}
        closeOnOutsideClick={false}
        className='max-w-5xl'
      >
        <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Exam' : 'Add New Exam'}
            </DialogTitle>
            <DialogClose onClick={handleModalClose} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form id="exam-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* Basic Information */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Basic Information</h3>

                <div className='grid grid-cols-1 gap-6'>
                  <div className="space-y-2">
                    <Label required>Exam Title</Label>
                    <Input
                      {...register('title', { required: 'Exam title is required' })}
                      placeholder='Enter exam title'
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <TipTapEditor
                      value={watch('description')}
                      onChange={(val) => setValue('description', val)}
                      placeholder='Write a detailed description...'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className="space-y-2">
                    <Label required>Level</Label>
                    <SearchSelectCreate
                      onSearch={fetchLevel}
                      onSelect={(item) => {
                        setSelectedLevel(item)
                        setValue('level_id', item.id, { shouldValidate: true })
                      }}
                      onRemove={() => {
                        setSelectedLevel(null)
                        setValue('level_id', '', { shouldValidate: true })
                      }}
                      selectedItems={selectedLevel}
                      placeholder="Select level..."
                      isMulti={false}
                      displayKey="title"
                    />
                    <input type="hidden" {...register('level_id', { required: 'Level is required' })} />
                    {errors.level_id && <p className="text-xs text-red-500">{errors.level_id.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>University/Affiliation</Label>
                    <SearchSelectCreate
                      onSearch={fetchUniversities}
                      onSelect={(item) => {
                        setSelectedUniversity(item)
                        setValue('affiliation', item.id)
                      }}
                      onRemove={() => {
                        setSelectedUniversity(null)
                        setValue('affiliation', '')
                      }}
                      selectedItems={selectedUniversity}
                      placeholder="Select university..."
                      isMulti={false}
                      displayKey="fullname"
                    />
                  </div>
                </div>
              </section>

              {/* Exam Structure */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Exam Structure</h3>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className="space-y-2">
                    <Label>Full Marks</Label>
                    <Input
                      type='number'
                      {...register('full_marks')}
                      placeholder='e.g. 100'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pass Marks</Label>
                    <Input
                      type='number'
                      {...register('pass_marks')}
                      placeholder='e.g. 40'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Input
                      {...register('duration')}
                      placeholder='e.g. 2 Hours'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <Input
                      type='number'
                      {...register('questions_count')}
                      placeholder='e.g. 100'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select {...register('question_type')}>
                      <option value="MCQ">MCQ</option>
                      <option value="Written">Written</option>
                      <option value="Practical">Practical</option>
                      <option value="Mixed">Mixed</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Exam Type</Label>
                    <Select {...register('exam_type')}>
                      <option value="Written">Written</option>
                      <option value="Online">Online</option>
                    </Select>
                  </div>
                </div>
              </section>

              {/* Dates & Fees */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Dates & Fees</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className="space-y-2">
                    <Label>Normal Fee</Label>
                    <Input
                      type='number'
                      {...register('normal_fee')}
                      placeholder='Rs. 1000'
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Late Fee</Label>
                    <Input
                      type='number'
                      {...register('late_fee')}
                      placeholder='Rs. 2000'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className="space-y-2">
                    <Label>Opening Date</Label>
                    <Input type='date' {...register('opening_date')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Closing Date</Label>
                    <Input type='date' {...register('closing_date')} />
                  </div>
                  <div className="space-y-2">
                    <Label required>Exam Date</Label>
                    <Input type='date' {...register('exam_date', { required: 'Exam date is required' })} />
                    {errors.exam_date && <p className="text-xs text-red-500">{errors.exam_date.message}</p>}
                  </div>
                </div>
              </section>

              {/* Content & Resources */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Content & Resources</h3>

                <div className='grid grid-cols-1 gap-6'>
                  <div className="space-y-2">
                    <Label>Syllabus Overview</Label>
                    <Textarea
                      {...register('syllabus')}
                      placeholder='Syllabus summary...'
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Past Question URL</Label>
                    <Input
                      {...register('pastQuestion')}
                      placeholder='Link to past questions'
                    />
                  </div>
                </div>
              </section>
            </form>
          </div>

          <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={handleModalClose}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form="exam-form"
              disabled={tableLoading}
            >
              {tableLoading ? 'Saving...' : editingId ? 'Update Exam' : 'Create Exam'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this exam? This action cannot be undone and will remove all associated details.'
      />

      <ExamViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        exam={viewingExam}
      />
    </div>
  )
}
