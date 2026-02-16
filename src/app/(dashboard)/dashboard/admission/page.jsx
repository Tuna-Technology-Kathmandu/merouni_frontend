'use client'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Edit2, Eye, Trash2, X, Search } from 'lucide-react'
import dynamic from 'next/dynamic'

import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import Table from '@/ui/shadcn/DataTable'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'

import {
  getAdmissions,
  getAdmissionDetail,
  createOrUpdateAdmission,
  deleteAdmission,
  fetchColleges,
  fetchPrograms
} from './action'
import AdmissionViewModal from './AdmissionViewModal'
import { authFetch } from '@/app/utils/authFetch'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import { Controller } from 'react-hook-form'
import ProgramDropdown from '@/ui/molecules/dropdown/ProgramDropdown'

export default function AdmissionManager() {
  const { setHeading } = usePageHeading()
  const searchParams = useSearchParams()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
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

  const [colleges, setColleges] = useState([])
  const [collegeSearch, setCollegeSearch] = useState('')
  const [collegeSearchResults, setCollegeSearchResults] = useState([])
  const [selectedCollege, setSelectedCollege] = useState(null)

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

  const searchCollegesHandler = async (e) => {
    const query = e.target.value
    setCollegeSearch(query)
    if (query.length < 2) {
      setCollegeSearchResults([])
      return
    }

    try {
      const response = await authFetch(`${process.env.baseUrl}/college?q=${query}`)
      const data = await response.json()
      setCollegeSearchResults(data.items || [])
    } catch (error) {
      console.error('College Search Error:', error)
    }
  }

  const selectCollege = (college) => {
    setSelectedCollege(college)
    setValue('college_id', college.id)
    setCollegeSearch('')
    setCollegeSearchResults([])
  }

  const clearSelectedCollege = () => {
    setSelectedCollege(null)
    setValue('college_id', '')
    setCollegeSearch('')
  }

  const onSubmit = async (data) => {
    try {
      const payload = { ...data }
      if (editing) payload.id = editingId

      await createOrUpdateAdmission(payload)
      toast.success(editing ? 'Admission updated successfully' : 'Admission created successfully')
      handleCloseModal()
      loadAdmissions(pagination.currentPage)
    } catch (err) {
      toast.error(err.message || 'Failed to save admission')
    }
  }

  const handleEdit = async (item) => {
    setEditing(true)
    setEditingId(item.id)
    setIsOpen(true)

    // Set form values
    setValue('college_id', item.collegeAdmissionCollege?.id)
    setValue('course_id', item.program?.id)
    setValue('eligibility_criteria', item.eligibility_criteria)
    setValue('admission_process', item.admission_process)
    setValue('fee_details', item.fee_details)
    setValue('description', item.description)

    setSelectedCollege({
      id: item.collegeAdmissionCollege?.id,
      name: item.collegeAdmissionCollege?.name
    })
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
    reset()
  }

  const columns = useMemo(() => [
    {
      header: 'College',
      accessorKey: 'collegeAdmissionCollege.name',
      cell: ({ row }) => row.original.collegeAdmissionCollege?.name || 'N/A'
    },
    {
      header: 'Program',
      accessorKey: 'program.title',
      cell: ({ row }) => row.original.program?.title || 'N/A'
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <button onClick={() => handleView(row.original.id)} className='text-purple-600 hover:text-purple-800'><Eye className='w-4 h-4' /></button>
          <button onClick={() => handleEdit(row.original)} className='text-blue-600 hover:text-blue-800'><Edit2 className='w-4 h-4' /></button>
          <button onClick={() => handleDeleteClick(row.original.id)} className='text-red-600 hover:text-red-800'><Trash2 className='w-4 h-4' /></button>
        </div>
      )
    }
  ], [])

  return (
    <div className='w-full space-y-2'>
      <div className='flex justify-between items-center px-4 pt-4'>
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder='Search admissions...'
          className='max-w-md'
        />
        <Button onClick={() => { setIsOpen(true); setEditing(false); reset(); }}>Add Admission</Button>
      </div>

      <Table
        columns={columns}
        data={admissions}
        pagination={pagination}
        onPageChange={(page) => loadAdmissions(page)}
        onSearch={handleSearchInput}
        loading={loading}
        showSearch={false}
      />

      <Dialog isOpen={isOpen} onClose={handleCloseModal} className='max-w-5xl'>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Admission' : 'Add Admission'}</DialogTitle>
          <DialogClose onClick={handleCloseModal} />
        </DialogHeader>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 pt-2'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* College Selection */}
              <div className='space-y-2'>
                <Label>College <span className='text-red-500'>*</span></Label>
                {selectedCollege ? (
                  <div className='flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md'>
                    <span className='text-sm font-medium text-blue-800'>{selectedCollege.name}</span>
                    <button type='button' onClick={clearSelectedCollege} className='text-blue-600 hover:text-blue-800'>
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                ) : (
                  <div className='relative'>
                    <Input
                      placeholder='Search college...'
                      value={collegeSearch}
                      onChange={searchCollegesHandler}
                    />
                    {collegeSearchResults.length > 0 && (
                      <div className='absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto'>
                        {collegeSearchResults.map(c => (
                          <div
                            key={c.id}
                            className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
                            onClick={() => selectCollege(c)}
                          >
                            {c.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {errors.college_id && <span className='text-red-500 text-xs'>College is required</span>}
              </div>

              {/* Program Selection */}
              <div className='space-y-2'>
                <Label>Program <span className='text-red-500'>*</span></Label>
                <Controller
                  name="course_id"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <ProgramDropdown
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                    />
                  )}
                />
                {errors.course_id && <span className='text-red-500 text-xs'>Program is required</span>}
              </div>

              <div className='col-span-2 space-y-2'>
                <Label>Eligibility Criteria</Label>
                <textarea
                  {...register('eligibility_criteria')}
                  className='w-full p-2 border rounded-md text-sm min-h-[80px]'
                  placeholder='Eligibility criteria details...'
                />
              </div>

              <div className='col-span-2 space-y-2'>
                <Label>Admission Process</Label>
                <textarea
                  {...register('admission_process')}
                  className='w-full p-2 border rounded-md text-sm min-h-[80px]'
                  placeholder='Admission process steps...'
                />
              </div>

              <div className='col-span-2 space-y-2'>
                <Label>Fee Details</Label>
                <textarea
                  {...register('fee_details')}
                  className='w-full p-2 border rounded-md text-sm min-h-[80px]'
                  placeholder='Fee structure details...'
                />
              </div>


              <div className='col-span-2 space-y-2'>
                <Label>Description</Label>
                <TipTapEditor
                  content={getValues('description') || ''}
                  onChange={(html) => setValue('description', html)}
                  placeholder='Enter description...'
                />
              </div>
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t'>
              <Button type='button' variant='outline' onClick={handleCloseModal}>Cancel</Button>
              <Button type='submit'>{editing ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AdmissionViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        admission={viewData}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Admission"
        message="Are you sure you want to delete this admission record? This action cannot be undone."
      />
      <ToastContainer />
    </div>
  )
}
