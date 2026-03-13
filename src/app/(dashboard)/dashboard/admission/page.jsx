'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Edit2, Eye, Trash2, Plus, GripVertical, Building2, GraduationCap } from 'lucide-react'

import { Button } from '@/ui/shadcn/button'
import { Label } from '@/ui/shadcn/label'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogClose
} from '@/ui/shadcn/dialog'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import SearchInput from '@/ui/molecules/SearchInput'
import { Textarea } from '@/ui/shadcn/textarea'

import {
  getAdmissions,
  getAdmissionDetail,
  createOrUpdateAdmission,
  deleteAdmission,
  fetchColleges,
  fetchPrograms,
  updateAdmissionOrder
} from './action'
import AdmissionViewModal from './AdmissionViewModal'
import TipTapEditor from '@/ui/shadcn/tiptap-editor'
import SearchSelectCreate from '@/ui/shadcn/search-select-create'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/app/lib/utils'

// ─── Sortable Admission Card ───────────────────────────────────────────────────
const SortableCard = ({ admission, onView, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: admission.id })

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const collegeName = admission.collegeAdmissionCollege?.name || 'N/A'
  const collegeLogo = admission.collegeAdmissionCollege?.college_logo || admission.collegeAdmissionCollege?.featured_img || null
  const programTitle = admission.program?.title || 'N/A'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white border rounded-xl transition-all duration-200 overflow-hidden',
        isDragging
          ? 'border-[#387cae]/40 shadow-xl ring-2 ring-[#387cae]/20'
          : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
      )}
    >
      <div className='flex items-center gap-4 p-4'>
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className='shrink-0 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none transition-colors'
          title='Drag to reorder'
        >
          <GripVertical size={20} />
        </div>

        {/* Logo */}
        <div className='w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm'>
          {collegeLogo
            ? <img src={collegeLogo} alt={collegeName} className='w-full h-full object-contain p-1.5' />
            : <Building2 className='w-7 h-7 text-gray-300' />}
        </div>

        {/* Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap mb-1'>
            <h3 className='text-[16px] font-bold text-gray-900 truncate leading-tight'>
              {collegeName}
            </h3>
          </div>
          <div className='flex items-center gap-1.5 text-[13px] text-gray-500 mt-1'>
            <GraduationCap className='w-4 h-4 shrink-0 text-gray-400' />
            <span className='truncate'>{programTitle}</span>
          </div>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-1 pl-4 border-l border-gray-100'>
          <button
            onClick={() => onView(admission.id)}
            title='View details'
            className='w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 transition-all'
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(admission)}
            title='Edit'
            className='w-9 h-9 flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 transition-all'
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(admission.id)}
            title='Delete'
            className='w-9 h-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-all'
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Drag Overlay Ghost Card ──────────────────────────────────────────────────
const OverlayCard = ({ admission }) => {
  const collegeName = admission.collegeAdmissionCollege?.name || 'N/A'
  const collegeLogo = admission.collegeAdmissionCollege?.college_logo || admission.collegeAdmissionCollege?.featured_img || null
  const programTitle = admission.program?.title || 'N/A'

  return (
    <div className='bg-white border-2 border-[#387cae]/40 rounded-xl shadow-2xl rotate-[0.6deg] scale-[1.01]'>
      <div className='flex items-center gap-4 p-4'>
        <GripVertical size={20} className='text-[#387cae]/50 cursor-grabbing shrink-0' />
        <div className='w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0'>
          {collegeLogo
            ? <img src={collegeLogo} alt={collegeName} className='w-full h-full object-contain p-1.5' />
            : <Building2 className='w-7 h-7 text-gray-300' />}
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-[16px] font-bold text-gray-900 truncate mb-1'>{collegeName}</h3>
          <div className='flex items-center gap-1.5 text-[13px] text-gray-500'>
            <span className='truncate'>{programTitle}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const CardSkeleton = ({ i = 0 }) => (
  <div
    className='bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse'
    style={{ animationDelay: `${i * 60}ms` }}
  >
    <div className='flex items-center gap-4 p-4'>
      <div className='w-5 h-5 bg-gray-200 rounded shrink-0' />
      <div className='w-16 h-16 bg-gray-200 rounded-lg shrink-0' />
      <div className='flex-1 space-y-2.5'>
        <div className='h-5 bg-gray-200 rounded-md w-1/3' />
        <div className='h-3 bg-gray-200 rounded w-1/4' />
      </div>
      <div className='flex gap-2 pl-4 border-l border-gray-100'>
        {[0, 1, 2].map(j => <div key={j} className='w-9 h-9 bg-gray-200 rounded-lg' />)}
      </div>
    </div>
  </div>
)

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
      program_id: '',
      eligibility_criteria: '',
      admission_process: '',
      fee_details: '',
      description: ''
    }
  })

  const [admissions, setAdmissions] = useState([])
  const [editing, setEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [activeId, setActiveId] = useState(null)
  
  const [deleteId, setDeleteId] = useState(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewData, setViewData] = useState(null)

  const [selectedCollege, setSelectedCollege] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    setHeading('Admission Management')
    loadAdmissions(searchQuery, false)
    return () => setHeading(null)
  }, [setHeading])

  const loadAdmissions = async (search = searchQuery, silent = true) => {
    if (!silent) setLoading(true)
    try {
      let all = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        const data = await getAdmissions(page, search)
        all = [...all, ...(data.items || [])]
        hasMore = page < (data.pagination?.totalPages || 1)
        page++
      }

      // Display all recursively fetched items for drag-and-drop
      const uniqueItems = Array.from(new Map(all.map((a) => [a.id, a])).values())

      uniqueItems.sort((a, b) => {
        const oA = a.order_no ?? Infinity
        const oB = b.order_no ?? Infinity
        return oA !== oB ? oA - oB : b.id - a.id
      })

      setAdmissions(uniqueItems)
    } catch (err) {
      toast.error('Failed to load admissions')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)

    const timeoutId = setTimeout(() => {
      loadAdmissions(value, false)
    }, 350)
    setSearchTimeout(timeoutId)
  }

  const handleDragStart = (event) => setActiveId(event.active.id)
  const handleDragCancel = () => setActiveId(null)

  const handleDragEnd = async (event) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = admissions.findIndex((a) => a.id === active.id)
    const newIdx = admissions.findIndex((a) => a.id === over.id)
    const reordered = arrayMove(admissions, oldIdx, newIdx)
    setAdmissions(reordered)

    const payload = reordered.map((a, i) => ({ id: a.id, order_no: i + 1 }))
    await saveOrder(payload)
  }

  const saveOrder = async (payload) => {
    try {
      setSaving(true)
      await updateAdmissionOrder(payload)
      setAdmissions((prev) =>
        prev.map((a) => {
          const updated = payload.find((p) => p.id === a.id)
          return updated ? { ...a, order_no: updated.order_no } : a
        })
      )
      toast.success('Order saved', { autoClose: 1500 })
    } catch (err) {
      toast.error(err.message || 'Failed to save order')
      loadAdmissions(searchQuery, true)
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = () => {
    setEditing(false)
    setEditingId(null)
    setSelectedCollege(null)
    setSelectedProgram(null)
    reset({
      college_id: '',
      program_id: '',
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
      toast.success(
        editing
          ? 'Admission updated successfully'
          : 'Admission created successfully'
      )
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
    setSelectedCollege(
      item.collegeAdmissionCollege
        ? {
            id: item.collegeAdmissionCollege.id,
            name: item.collegeAdmissionCollege.name,
            college_logo: item.collegeAdmissionCollege.college_logo
          }
        : null
    )

    setSelectedProgram(
      item.program
        ? {
            id: item.program.id,
            title: item.program.title
          }
        : null
    )

    reset({
      college_id: item.collegeAdmissionCollege?.id || '',
      program_id: item.program?.id || '',
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

  return (
    <div className='w-full'>
      <ToastContainer />

      <div className='flex flex-col mb-3 sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200'>
        <div className='flex items-center gap-3 w-full sm:w-auto'>
          <div className='relative w-full sm:w-64 shrink-0'>
            <SearchInput
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder='Search admissions...'
              className='w-full'
            />
          </div>
        </div>

        <Button
          onClick={handleAdd}
          className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 w-full sm:w-auto rounded-md'
        >
          <Plus className='w-4 h-4' />
          Add Admission
        </Button>
      </div>

      <div className='mt-2'>
        {loading ? (
          <div className='flex flex-col gap-3'>
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} i={i} />)}
          </div>
        ) : admissions.length === 0 ? (
          <div className='bg-white border border-dashed border-gray-200 rounded-2xl py-20 text-center'>
            <GraduationCap className='w-10 h-10 text-gray-200 mx-auto mb-3' />
            <p className='text-gray-500 font-medium text-sm'>
              {searchQuery ? 'No admissions match your search.' : 'No admissions found.'}
            </p>
          </div>
        ) : (
          <>
            <p className='text-[11px] text-gray-400 px-1 mb-2 flex items-center gap-1.5'>
              <GripVertical size={11} className='text-gray-300' />
              Drag the grip handle to reorder · Changes save automatically
              {saving && <span className='text-[#387cae] ml-2 animate-pulse'>Saving order...</span>}
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={admissions.map(a => a.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='flex flex-col gap-3'>
                  {admissions.map((admission) => (
                    <SortableCard
                      key={admission.id}
                      admission={admission}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeId ? <OverlayCard admission={admissions.find(a => a.id === activeId)} /> : null}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </div>

      <Dialog
        isOpen={isOpen}
        onClose={handleCloseModal}
        closeOnOutsideClick={false}
        className='max-w-5xl'
      >
        <DialogContent className='max-w-5xl max-h-[90vh] flex flex-col p-0'>
          <DialogHeader className='px-6 py-4 border-b'>
            <DialogTitle className='text-lg font-semibold text-gray-900'>
              {editing ? 'Edit Admission Detail' : 'Add Admission Detail'}
            </DialogTitle>
            <DialogClose onClick={handleCloseModal} />
          </DialogHeader>

          <div className='flex-1 overflow-y-auto p-6'>
            <form
              id='admission-form'
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-8'
            >
              {/* Basic Selection */}
              <section className='space-y-4'>
                <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>
                  Basic Information
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* College Selection */}
                  <div className='space-y-2'>
                    <Label required>College</Label>
                    <SearchSelectCreate
                      onSearch={fetchColleges}
                      onSelect={(item) => {
                        setSelectedCollege(item)
                        setValue('college_id', item.id, {
                          shouldValidate: true
                        })
                      }}
                      onRemove={() => {
                        setSelectedCollege(null)
                        setValue('college_id', '', { shouldValidate: true })
                      }}
                      selectedItems={selectedCollege}
                      placeholder='Search and select college...'
                      isMulti={false}
                      displayKey='name'
                      renderItem={(item) => (
                        <div className='flex items-center gap-3'>
                          {item.college_logo ? (
                            <img
                              src={item.college_logo}
                              alt={item.name}
                              className='w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0'
                            />
                          ) : (
                            <div className='w-7 h-7 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0'>
                              <span className='text-xs font-bold text-[#387cae]'>
                                {item.name?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                          )}
                          <span className='text-sm font-medium text-gray-800'>
                            {item.name}
                          </span>
                        </div>
                      )}
                      renderSelected={(item) => (
                        <div className='flex items-center gap-3'>
                          {item.college_logo ? (
                            <img
                              src={item.college_logo}
                              alt={item.name}
                              className='w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0'
                            />
                          ) : (
                            <div className='w-7 h-7 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0'>
                              <span className='text-xs font-bold text-[#387cae]'>
                                {item.name?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                          )}
                          <span className='text-sm font-semibold text-gray-900 truncate'>
                            {item.name}
                          </span>
                        </div>
                      )}
                    />
                    <input
                      type='hidden'
                      {...register('college_id', {
                        required: 'College is required'
                      })}
                    />
                    {errors.college_id && (
                      <p className='text-xs text-red-500'>
                        {errors.college_id.message}
                      </p>
                    )}
                  </div>

                  {/* Program Selection */}
                  <div className='space-y-2'>
                    <Label required>Program</Label>
                    <SearchSelectCreate
                      onSearch={fetchPrograms}
                      onSelect={(item) => {
                        setSelectedProgram(item)
                        setValue('program_id', item.id, {
                          shouldValidate: true
                        })
                      }}
                      onRemove={() => {
                        setSelectedProgram(null)
                        setValue('program_id', '', { shouldValidate: true })
                      }}
                      selectedItems={selectedProgram}
                      placeholder='Search and select program...'
                      isMulti={false}
                      displayKey='title'
                    />
                    <input
                      type='hidden'
                      {...register('program_id', {
                        required: 'Program is required'
                      })}
                    />
                    {errors.program_id && (
                      <p className='text-xs text-red-500'>
                        {errors.program_id.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Details Sections */}
              <section className='space-y-4'>
                <h3 className='text-base font-semibold text-slate-800 border-b pb-2'>
                  Admission Process & Requirements
                </h3>

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
            <Button type='button' variant='outline' onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type='submit' form='admission-form' disabled={loading}>
              {loading
                ? 'Saving...'
                : editing
                  ? 'Update Admission'
                  : 'Create Admission'}
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
        title='Delete Admission'
        message='Are you sure you want to delete this admission record? This action cannot be undone.'
      />
    </div>
  )
}
