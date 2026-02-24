'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Edit2, Eye, Trash2, Plus } from 'lucide-react'

import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import Table from '@/ui/shadcn/DataTable'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'
import { Textarea } from '@/ui/shadcn/textarea'

import {
  getAdmissions,
  getAdmissionDetail,
  createOrUpdateAdmission,
  deleteAdmission,
  fetchColleges,
  fetchPrograms
} from './action'
import AdmissionViewModal from './AdmissionViewModal'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'

export default function AdmissionManager() {
  const { setHeading } = usePageHeading()
  const searchParams = useSearchParams()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      college_id: '',
      course_id: '',
      eligibility_criteria: '',
      admission_process: '',
      fee_details: '',
      description: ''
    }
  })

  const [admissions, setAdmissions] = useState([])
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [deleteId, setDeleteId] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewData, setViewData] = useState(null)

  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState(null)

  useEffect(() => {
    setHeading('Admission Management')
    loadAdmissions()
    return () => setHeading(null)
  }, [setHeading])

  const loadAdmissions = async (page = 1, search = searchQuery) => {
    setLoading(true)
    try {
      const data = await getAdmissions(page, search)
      setAdmissions(data.items)
      setPagination(data.pagination)
    } catch (err) {
      toast.error('Failed to load admissions')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)

    const timeoutId = setTimeout(() => {
      loadAdmissions(1, value)
    }, 300)
    setSearchTimeout(timeoutId)
  }

  const handleAdd = () => {
    setEditing(false)
    setEditingId(null)
    setSelectedCollege(null)
    setSelectedProgram(null)
    reset({
      college_id: '',
      course_id: '',
      eligibility_criteria: '',
      admission_process: '',
      fee_details: '',
      description: ''
    })
    setIsOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const payload = { ...data }
      if (editing) payload.id = editingId

      await createOrUpdateAdmission(payload)
      toast.success(editing ? 'Admission updated successfully' : 'Admission created successfully')
      handleCloseModal()
      loadAdmissions(pagination.currentPage)
    } catch (err) {
      toast.error(err.message || 'Failed to save admission')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (item) => {
    setEditing(true)
    setEditingId(item.id)

    // Set selected objects for SearchSelectCreate
    setSelectedCollege(item.collegeAdmissionCollege ? {
      id: item.collegeAdmissionCollege.id,
      name: item.collegeAdmissionCollege.name,
      college_logo: item.collegeAdmissionCollege.college_logo
    } : null)

    setSelectedProgram(item.program ? {
      id: item.program.id,
      title: item.program.title
    } : null)

    reset({
      college_id: item.collegeAdmissionCollege?.id || '',
      course_id: item.program?.id || '',
      eligibility_criteria: item.eligibility_criteria || '',
      admission_process: item.admission_process || '',
      fee_details: item.fee_details || '',
      description: item.description || ''
    })

    setIsOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteAdmission(deleteId)
      toast.success('Admission deleted successfully')
      loadAdmissions(pagination.currentPage)
    } catch (err) {
      toast.error('Failed to delete admission')
    } finally {
      setIsConfirmOpen(false)
      setDeleteId(null)
    }
  }

  const handleView = async (id) => {
    try {
      const data = await getAdmissionDetail(id)
      setViewData(data)
      setViewModalOpen(true)
    } catch (err) {
      toast.error('Failed to load details')
    }
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditing(false)
    setEditingId(null)
    setSelectedCollege(null)
    setSelectedProgram(null)
    reset()
  }

  const columns = useMemo(() => [
    {
      header: 'College',
      accessorKey: 'collegeAdmissionCollege.name',
      cell: ({ row }) => <div className="font-medium text-gray-900">{row.original.collegeAdmissionCollege?.name || 'N/A'}</div>
    },
    {
      header: 'Program',
      accessorKey: 'program.title',
      cell: ({ row }) => <div className="text-gray-600">{row.original.program?.title || 'N/A'}</div>
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-1'>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(row.original.id)}
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
  ], [])

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder='Search admissions by college or program...'
          className='max-w-md w-full'
        />
        <Button onClick={handleAdd} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Admission
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          columns={columns}
          data={admissions}
          pagination={pagination}
          onPageChange={(page) => loadAdmissions(page)}
          loading={loading}
          showSearch={false}
        />
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={handleCloseModal}
        closeOnOutsideClick={false}
        className='max-w-5xl'
      >
        <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editing ? 'Edit Admission Detail' : 'Add Admission Detail'}
            </DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form id="admission-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* Basic Selection */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Basic Information</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* College Selection */}
                  <div className='space-y-2'>
                    <Label required>College</Label>
                    <SearchSelectCreate
                      onSearch={fetchColleges}
                      onSelect={(item) => {
                        setSelectedCollege(item)
                        setValue('college_id', item.id, { shouldValidate: true })
                      }}
                      onRemove={() => {
                        setSelectedCollege(null)
                        setValue('college_id', '', { shouldValidate: true })
                      }}
                      selectedItems={selectedCollege}
                      placeholder="Search and select college..."
                      isMulti={false}
                      displayKey="name"
                      renderItem={(item) => (
                        <div className="flex items-center gap-3">
                          {item.college_logo ? (
                            <img
                              src={item.college_logo}
                              alt={item.name}
                              className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-[#387cae]">
                                {item.name?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-800">{item.name}</span>
                        </div>
                      )}
                      renderSelected={(item) => (
                        <div className="flex items-center gap-3">
                          {item.college_logo ? (
                            <img
                              src={item.college_logo}
                              alt={item.name}
                              className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-[#387cae]">
                                {item.name?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                          )}
                          <span className="text-sm font-semibold text-gray-900 truncate">{item.name}</span>
                        </div>
                      )}
                    />
                    <input type="hidden" {...register('college_id', { required: 'College is required' })} />
                    {errors.college_id && <p className="text-xs text-red-500">{errors.college_id.message}</p>}
                  </div>

                  {/* Program Selection */}
                  <div className='space-y-2'>
                    <Label required>Program</Label>
                    <SearchSelectCreate
                      onSearch={fetchPrograms}
                      onSelect={(item) => {
                        setSelectedProgram(item)
                        setValue('course_id', item.id, { shouldValidate: true })
                      }}
                      onRemove={() => {
                        setSelectedProgram(null)
                        setValue('course_id', '', { shouldValidate: true })
                      }}
                      selectedItems={selectedProgram}
                      placeholder="Search and select program..."
                      isMulti={false}
                      displayKey="title"
                    />
                    <input type="hidden" {...register('course_id', { required: 'Program is required' })} />
                    {errors.course_id && <p className="text-xs text-red-500">{errors.course_id.message}</p>}
                  </div>
                </div>
              </section>

              {/* Details Sections */}
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Admission Process & Requirements</h3>

                <div className='grid grid-cols-1 gap-6'>
                  <div className='space-y-2'>
                    <Label>Eligibility Criteria</Label>
                    <Textarea
                      {...register('eligibility_criteria')}
                      className='min-h-[100px]'
                      placeholder='Describe the eligibility criteria for this course...'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Admission Process</Label>
                    <Textarea
                      {...register('admission_process')}
                      className='min-h-[100px]'
                      placeholder='Step-by-step admission process...'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Fee Details</Label>
                    <Textarea
                      {...register('fee_details')}
                      className='min-h-[100px]'
                      placeholder='Detail the fee structure for this course...'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label>Additional Description</Label>
                    <TipTapEditor
                      value={watch('description')}
                      onChange={(html) => setValue('description', html)}
                      placeholder='Enter additional details...'
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
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              form="admission-form"
              disabled={loading}
            >
              {loading ? 'Saving...' : editing ? 'Update Admission' : 'Create Admission'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AdmissionViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        admission={viewData}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Admission"
        message="Are you sure you want to delete this admission record? This action cannot be undone."
      />
    </div>
  )
}
