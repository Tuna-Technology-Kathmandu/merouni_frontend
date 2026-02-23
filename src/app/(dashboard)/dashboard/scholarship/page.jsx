'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { Search, Edit2, Trash2, Eye, Users, Plus } from 'lucide-react'

import {
  createScholarship,
  deleteScholarship,
  getAllScholarships,
  updateScholarship,
  getScholarshipApplications,
  fetchCategories
} from './actions'
import Loading from '../../../../ui/molecules/Loading'
import Table from '@/ui/shadcn/DataTable'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { Textarea } from '@/ui/shadcn/textarea'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose,
  DialogFooter
} from '@/ui/shadcn/dialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'
import { formatDate } from '@/utils/date.util'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'
import ScholarshipViewModal from './ScholarshipViewModal'
import { authFetch } from '@/app/utils/authFetch'

export default function ScholarshipManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)
  const searchParams = useSearchParams()
  const router = useRouter()

  const [scholarships, setScholarships] = useState([])
  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewData, setViewData] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false)
  const [applicationsData, setApplicationsData] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  const [selectedCategory, setSelectedCategory] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      eligibilityCriteria: '',
      amount: '',
      applicationDeadline: '',
      renewalCriteria: '',
      contactInfo: '',
      categoryId: ''
    }
  })

  useEffect(() => {
    setHeading('Scholarship Management')
    loadScholarships()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    const addParam = searchParams.get('add')
    if (addParam === 'true') {
      handleAdd()
      router.replace('/dashboard/scholarship', { scroll: false })
    }
  }, [searchParams, router])

  const loadScholarships = async (page = 1, query = searchQuery) => {
    setTableLoading(true)
    try {
      let response
      if (query) {
        const res = await authFetch(`${process.env.baseUrl}/scholarship?q=${query}&page=${page}`)
        response = await res.json()
      } else {
        response = await getAllScholarships(page)
      }

      const items = response.scholarships || response.items || []
      setScholarships(items.map(s => ({
        ...s,
        categoryId: s.scholarshipCategory?.id,
        applicationDeadline: s.applicationDeadline ? new Date(s.applicationDeadline) : null
      })))

      setPagination({
        currentPage: response.pagination?.currentPage || 1,
        totalPages: response.pagination?.totalPages || 1,
        totalCount: response.pagination?.totalCount || 0
      })
    } catch (error) {
      console.error('Failed to fetch scholarships:', error)
      toast.error('Failed to fetch scholarships')
    } finally {
      setTableLoading(false)
      setLoading(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    loadScholarships(1, value)
  }

  const handleAdd = () => {
    setEditingId(null)
    setSelectedCategory(null)
    reset({
      name: '',
      description: '',
      eligibilityCriteria: '',
      amount: '',
      applicationDeadline: '',
      renewalCriteria: '',
      contactInfo: '',
      categoryId: ''
    })
    setIsOpen(true)
  }

  const handleEdit = (scholarship) => {
    setEditingId(scholarship.id)
    setSelectedCategory(scholarship.scholarshipCategory ? {
      id: scholarship.scholarshipCategory.id,
      title: scholarship.scholarshipCategory.title
    } : null)

    reset({
      name: scholarship.name || '',
      description: scholarship.description || '',
      eligibilityCriteria: scholarship.eligibilityCriteria || '',
      amount: scholarship.amount != null ? String(scholarship.amount) : '',
      applicationDeadline: scholarship.applicationDeadline ? new Date(scholarship.applicationDeadline).toISOString().split('T')[0] : '',
      renewalCriteria: scholarship.renewalCriteria || '',
      contactInfo: scholarship.contactInfo || '',
      categoryId: scholarship.scholarshipCategory?.id || ''
    })
    setIsOpen(true)
  }

  const handleModalClose = () => {
    setIsOpen(false)
    setEditingId(null)
    setSelectedCategory(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      setTableLoading(true)
      const payload = {
        ...data,
        author: author_id,
        amount: data.amount, // API expects string according to previous code
      }

      if (editingId) {
        await updateScholarship(editingId, payload)
        toast.success('Scholarship updated successfully')
      } else {
        await createScholarship(payload)
        toast.success('Scholarship created successfully')
      }
      handleModalClose()
      loadScholarships(pagination.currentPage)
    } catch (error) {
      console.error('Error saving scholarship:', error)
      toast.error(`Failed to ${editingId ? 'update' : 'create'} scholarship`)
    } finally {
      setTableLoading(false)
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteScholarship(deleteId)
      toast.success('Scholarship deleted successfully')
      loadScholarships(pagination.currentPage)
    } catch (error) {
      toast.error('Failed to delete scholarship')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  const handleViewApplications = async (scholarshipId) => {
    setIsApplicationsOpen(true)
    setApplicationsLoading(true)
    setApplicationsData([])

    try {
      const data = await getScholarshipApplications(scholarshipId)
      setApplicationsData(data.applications || [])
    } catch (err) {
      toast.error('Failed to load applications')
    } finally {
      setApplicationsLoading(false)
    }
  }

  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div className="font-medium text-gray-900">{row.original.name}</div>
    },
    {
      header: 'Category',
      accessorKey: 'scholarshipCategory.title',
      cell: ({ row }) => row.original.scholarshipCategory?.title || 'N/A'
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }) => <div className="text-gray-600 font-medium">Rs. {row.original.amount?.toLocaleString()}</div>
    },
    {
      header: 'Deadline',
      accessorKey: 'applicationDeadline',
      cell: ({ row }) => row.original.applicationDeadline ? formatDate(row.original.applicationDeadline) : 'N/A'
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
              setViewData(row.original)
              setIsViewOpen(true)
            }}
            className='hover:bg-blue-50 text-blue-600'
          >
            <Eye className='w-4 h-4' />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewApplications(row.original.id)}
            className='hover:bg-purple-50 text-purple-600'
          >
            <Users className='w-4 h-4' />
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

  if (loading) return <Loading />

  return (
    <div className='w-full space-y-4 p-4'>
      <ToastContainer />

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border'>
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder='Search scholarships...'
          className='max-w-md w-full'
        />
        <Button onClick={handleAdd} className="bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Scholarship
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table
          loading={tableLoading}
          data={scholarships}
          columns={columns}
          pagination={pagination}
          onPageChange={(page) => loadScholarships(page)}
          showSearch={false}
        />
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={handleModalClose}
        closeOnOutsideClick={false}
        className='max-w-5xl'
      >
        <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Scholarship' : 'Add New Scholarship'}
            </DialogTitle>
            <DialogClose onClick={handleModalClose} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form id="scholarship-form" onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Basic Information</h3>
                <div className='grid grid-cols-1 gap-6'>
                  <div className="space-y-2">
                    <Label required>Scholarship Name</Label>
                    <Input
                      {...register('name', { required: 'Name is required' })}
                      placeholder='e.g. Merit-based Scholarship 2024'
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label required>Category</Label>
                    <SearchSelectCreate
                      onSearch={fetchCategories}
                      onSelect={(item) => {
                        setSelectedCategory(item)
                        setValue('categoryId', item.id, { shouldValidate: true })
                      }}
                      onRemove={() => {
                        setSelectedCategory(null)
                        setValue('categoryId', '', { shouldValidate: true })
                      }}
                      selectedItems={selectedCategory}
                      placeholder="Select category..."
                      isMulti={false}
                      displayKey="title"
                    />
                    <input type="hidden" {...register('categoryId', { required: 'Category is required' })} />
                    {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
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
              </section>

              <section className="space-y-4">
                <h3 className="text-base font-semibold text-slate-800 border-b pb-2">Requirements & Details</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className="space-y-2">
                    <Label required>Eligibility Criteria</Label>
                    <Textarea
                      {...register('eligibilityCriteria', { required: 'Eligibility criteria is required' })}
                      placeholder='Who can apply?'
                      className="min-h-[100px]"
                    />
                    {errors.eligibilityCriteria && <p className="text-xs text-red-500">{errors.eligibilityCriteria.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label required>Renewal Criteria</Label>
                    <Textarea
                      {...register('renewalCriteria', { required: 'Renewal criteria is required' })}
                      placeholder='Conditions for renewal...'
                      className="min-h-[100px]"
                    />
                    {errors.renewalCriteria && <p className="text-xs text-red-500">{errors.renewalCriteria.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label required>Amount</Label>
                    <Input
                      {...register('amount', { required: 'Amount is required' })}
                      placeholder='e.g. 50,000 or Full tuition'
                    />
                    {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label required>Application Deadline</Label>
                    <Input
                      type="date"
                      {...register('applicationDeadline', { required: 'Deadline is required' })}
                    />
                    {errors.applicationDeadline && <p className="text-xs text-red-500">{errors.applicationDeadline.message}</p>}
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label required>Contact Information</Label>
                    <Input
                      {...register('contactInfo', { required: 'Contact info is required' })}
                      placeholder='Phone, email, or office location...'
                    />
                    {errors.contactInfo && <p className="text-xs text-red-500">{errors.contactInfo.message}</p>}
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
              form="scholarship-form"
              disabled={tableLoading}
            >
              {tableLoading ? 'Saving...' : editingId ? 'Update Scholarship' : 'Create Scholarship'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ScholarshipViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        scholarship={viewData}
      />

      <Dialog
        isOpen={isApplicationsOpen}
        onClose={() => setIsApplicationsOpen(false)}
        className='max-w-4xl'
      >
        <DialogContent className='max-w-4xl max-h-[85vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className="text-lg font-semibold text-gray-900">Scholarship Applications</DialogTitle>
            <DialogClose onClick={() => setIsApplicationsOpen(false)} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            {applicationsLoading ? (
              <div className='flex items-center justify-center py-12'>
                <Loading />
              </div>
            ) : applicationsData.length === 0 ? (
              <div className='py-12 text-center text-gray-500 h-full flex flex-col justify-center items-center'>
                <Users className='w-12 h-12 mb-4 text-gray-400 opacity-20' />
                <p>No applications found for this scholarship</p>
              </div>
            ) : (
              <div className='space-y-4'>
                {applicationsData.map((application) => (
                  <div
                    key={application.id}
                    className='border border-gray-100 rounded-xl p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#387cae]/10 flex items-center justify-center text-[#387cae] font-bold text-lg'>
                          {application.student?.firstName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className='font-bold text-gray-900'>
                            {application.student?.firstName} {application.student?.lastName}
                          </h3>
                          <p className='text-sm text-gray-500'>{application.student?.email}</p>
                          {application.student?.phoneNo && (
                            <p className='text-sm text-gray-500'>{application.student.phoneNo}</p>
                          )}
                        </div>
                      </div>
                      <div className='flex flex-col items-end gap-2'>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${application.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            application.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>
                          {application.status}
                        </span>
                        <span className='text-xs text-gray-400'>
                          Applied {formatDate(application.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='p-4 border-t flex justify-end'>
            <Button variant='outline' onClick={() => setIsApplicationsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this scholarship? This action cannot be undone and will remove all student applications.'
      />
    </div>
  )
}
