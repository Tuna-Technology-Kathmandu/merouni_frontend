'use client'

import { useState, useEffect } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import CreateUpdateDiscipline from '@/ui/molecules/dialogs/CreateUpdateDiscipline'
import {
  Plus,
  GripVertical,
  Eye,
  Edit2,
  Trash2,
  Search,
  Loader2,
  BookOpen
} from 'lucide-react'
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
import { formatDate } from '@/utils/date.util'
import { useSelector } from 'react-redux'

// ─── Sortable Discipline Card ───────────────────────────────────────────────
const SortableCard = ({ discipline, rank, onView, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: discipline.id })

  const style = {
    transform: transform ? CSS.Transform.toString({ ...transform, x: 0 }) : undefined,
    transition,
    opacity: isDragging ? 0 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'bg-white border rounded-2xl transition-all duration-200',
        isDragging
          ? 'border-[#387cae]/30 bg-[#387cae]/[0.03]'
          : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
      )}
    >
      <div className='flex items-center gap-3 px-4 py-3'>
        <div
          {...listeners}
          className='shrink-0 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none transition-colors'
          title='Drag to reorder'
        >
          <GripVertical size={18} />
        </div>

        <div className='w-8 h-8 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0'>
          <span className='text-[11px] font-bold text-[#387cae] tabular-nums'>{rank}</span>
        </div>

        <div className='w-[52px] h-[52px] rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm'>
          {discipline.featured_image ? (
            <img
              src={discipline.featured_image}
              alt={discipline.title}
              className='w-full h-full object-contain p-1.5'
            />
          ) : (
            <BookOpen className='w-6 h-6 text-gray-300' />
          )}
        </div>

        <div className='flex-1 min-w-0'>
          <h3 className='text-[15px] font-bold text-gray-900 truncate leading-tight'>
            {discipline.title}
          </h3>
          {discipline.description && (
            <p className='text-[12px] text-gray-500 line-clamp-2 mt-0.5'>
              {discipline.description}
            </p>
          )}
          {discipline.createdAt && (
            <span className='flex items-center gap-1.5 text-[11px] text-gray-400 mt-1'>
              {formatDate(discipline.createdAt)}
            </span>
          )}
        </div>

        <div className='flex items-center gap-1 shrink-0'>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onView(discipline)}
            title='View details'
            className='w-8 h-8 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-all'
          >
            <Eye size={15} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(discipline)}
            title='Edit'
            className='w-8 h-8 flex items-center justify-center rounded-md text-amber-500 hover:bg-amber-50 transition-all'
          >
            <Edit2 size={15} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(discipline.id)}
            title='Delete'
            className='w-8 h-8 flex items-center justify-center rounded-md text-red-400 hover:bg-red-50 transition-all'
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Drag Overlay Ghost Card ──────────────────────────────────────────────────
const OverlayCard = ({ discipline, rank }) => (
  <div className='bg-white border-2 border-[#387cae]/40 rounded-2xl shadow-2xl rotate-[0.6deg] scale-[1.01]'>
    <div className='flex items-center gap-3 px-4 py-3'>
      <GripVertical size={18} className='text-[#387cae]/50 cursor-grabbing shrink-0' />
      <div className='w-8 h-8 rounded-full bg-[#387cae]/15 flex items-center justify-center shrink-0'>
        <span className='text-[11px] font-bold text-[#387cae]'>{rank}</span>
      </div>
      <div className='w-[52px] h-[52px] rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0'>
        {discipline.featured_image ? (
          <img
            src={discipline.featured_image}
            alt={discipline.title}
            className='w-full h-full object-contain p-1.5'
          />
        ) : (
          <BookOpen className='w-6 h-6 text-gray-300' />
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <h3 className='text-[15px] font-bold text-gray-900 truncate'>{discipline.title}</h3>
      </div>
    </div>
  </div>
)

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const CardSkeleton = ({ i = 0 }) => (
  <div
    className='bg-white border border-gray-200 rounded-2xl animate-pulse'
    style={{ animationDelay: `${i * 60}ms` }}
  >
    <div className='flex items-center gap-3 px-4 py-3'>
      <div className='w-[18px] h-[18px] bg-gray-200 rounded shrink-0' />
      <div className='w-8 h-8 bg-gray-200 rounded-full shrink-0' />
      <div className='w-[52px] h-[52px] bg-gray-200 rounded-md shrink-0' />
      <div className='flex-1 space-y-2.5'>
        <div className='h-4 bg-gray-200 rounded-md w-48' />
        <div className='h-3 bg-gray-200 rounded-full w-32' />
      </div>
      <div className='flex gap-2 shrink-0'>
        {[0, 1, 2].map((j) => (
          <div key={j} className='w-9 h-9 bg-gray-200 rounded-md' />
        ))}
      </div>
    </div>
  </div>
)

export default function DisciplineManager() {
  const { setHeading } = usePageHeading()
  const author_id = useSelector((state) => state.user.data?.id)

  const [disciplines, setDisciplines] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [editingDiscipline, setEditingDiscipline] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewingDiscipline, setViewingDiscipline] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const [activeId, setActiveId] = useState(null)
  const activeDiscipline = disciplines.find((d) => d.id === activeId)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    setHeading('Discipline Management')
    loadDisciplines()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [searchTimeout])

  const loadDisciplines = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const res = await authFetch(
        `${process.env.baseUrl}/discipline?page=1&limit=1000${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`
      )
      if (!res.ok) throw new Error('Failed to load disciplines')
      const data = await res.json()
      const items = data.items || []
      items.sort((a, b) => {
        const oA = a.order_no_for_website ?? Infinity
        const oB = b.order_no_for_website ?? Infinity
        return oA !== oB ? oA - oB : b.id - a.id
      })
      setDisciplines(items)
    } catch (err) {
      toast.error(err.message || 'Failed to load disciplines')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    const id = setTimeout(() => loadDisciplines(true), 350)
    setSearchTimeout(id)
  }

  const handleDragStart = (event) => setActiveId(event.active.id)
  const handleDragCancel = () => setActiveId(null)

  const handleDragEnd = async (event) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = disciplines.findIndex((d) => d.id === active.id)
    const newIdx = disciplines.findIndex((d) => d.id === over.id)
    const reordered = arrayMove(disciplines, oldIdx, newIdx)
    setDisciplines(reordered)

    const payload = reordered.map((d, i) => ({ id: d.id, order_no: i + 1 }))
    await saveOrder(payload)
  }

  const saveOrder = async (payload) => {
    try {
      setSaving(true)
      const res = await authFetch(`${process.env.baseUrl}/discipline/update-order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disciplines: payload })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save order')
      }
      setDisciplines((prev) =>
        prev.map((d) => {
          const updated = payload.find((p) => p.id === d.id)
          return updated ? { ...d, order_no_for_website: updated.order_no } : d
        })
      )
      toast.success('Order saved', { autoClose: 1500 })
    } catch (err) {
      toast.error(err.message || 'Failed to save order')
      loadDisciplines(true)
    } finally {
      setSaving(false)
    }
  }

  const handleView = (discipline) => {
    setViewingDiscipline(discipline)
    setIsViewModalOpen(true)
  }

  const handleEdit = (discipline) => {
    setEditingDiscipline(discipline)
    setIsOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const res = await authFetch(`${process.env.baseUrl}/discipline/${deleteId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      toast.success(data.message || 'Discipline deleted')
      loadDisciplines(true)
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className='w-full'>
        <ToastContainer position='bottom-right' />

        <div className='sticky mb-3 top-0 z-30 bg-[#F7F8FA] py-3'>
          <div className='bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-md bg-[#387cae]/10 flex items-center justify-center shrink-0'>
                <BookOpen size={17} className='text-[#387cae]' />
              </div>
              <div>
                <p className='text-sm font-bold text-gray-800'>Disciplines</p>
                <p className='text-xs text-gray-400 flex items-center gap-1.5'>
                  {loading ? (
                    <span className='inline-flex items-center gap-1'>
                      <Loader2 size={10} className='animate-spin' /> Loading…
                    </span>
                  ) : (
                    `${disciplines.length} total`
                  )}
                  {saving && (
                    <span className='inline-flex items-center gap-1 text-[#387cae]'>
                      · <Loader2 size={10} className='animate-spin' /> Saving order…
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <div className='relative shrink-0 sm:w-60'>
                <Search size={13} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder='Search disciplines…'
                  className='w-full pl-8 pr-3 h-9 rounded-md border border-gray-200 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#387cae]/25 focus:border-[#387cae]/40 transition'
                />
              </div>

              <Button
                onClick={() => {
                  setEditingDiscipline(null)
                  setIsOpen(true)
                }}
                className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 h-9 px-4 rounded-md text-sm font-semibold shrink-0'
              >
                <Plus size={15} />
                Add Discipline
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='space-y-2.5'>
            {[...Array(5)].map((_, i) => (
              <CardSkeleton key={i} i={i} />
            ))}
          </div>
        ) : disciplines.length === 0 ? (
          <div className='bg-white border border-dashed border-gray-200 rounded-2xl py-20 text-center'>
            <BookOpen className='w-10 h-10 text-gray-200 mx-auto mb-3' />
            <p className='text-gray-500 font-medium text-sm'>
              {searchQuery ? 'No disciplines match your search.' : 'No disciplines yet.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => {
                  setEditingDiscipline(null)
                  setIsOpen(true)
                }}
                className='mt-4 bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 text-sm'
              >
                <Plus size={15} /> Add First Discipline
              </Button>
            )}
          </div>
        ) : (
          <>
            <p className='text-[11px] text-gray-400 px-1 flex items-center gap-1.5'>
              <GripVertical size={11} className='text-gray-300' />
              Drag the grip handle to reorder · Changes save automatically
            </p>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={disciplines.map((d) => d.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-2'>
                  {disciplines.map((discipline, idx) => (
                    <SortableCard
                      key={discipline.id}
                      discipline={discipline}
                      rank={idx + 1}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeDiscipline ? (
                  <OverlayCard
                    discipline={activeDiscipline}
                    rank={disciplines.findIndex((d) => d.id === activeId) + 1}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </div>

      <CreateUpdateDiscipline
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setEditingDiscipline(null)
        }}
        onSuccess={() => loadDisciplines(true)}
        initialData={editingDiscipline}
        authorId={author_id}
      />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setDeleteId(null)
        }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this discipline? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />

      {isViewModalOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
          onClick={() => { setIsViewModalOpen(false); setViewingDiscipline(null) }}
        >
          <div
            className='bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='px-6 py-4 border-b flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Discipline Details</h2>
              <button
                onClick={() => { setIsViewModalOpen(false); setViewingDiscipline(null) }}
                className='text-gray-400 hover:text-gray-600 p-1'
              >
                ×
              </button>
            </div>
            <div className='flex-1 overflow-y-auto p-6 space-y-4'>
              {viewingDiscipline?.featured_image && (
                <div className='w-full h-48 rounded-md overflow-hidden bg-gray-100 border border-gray-200'>
                  <img
                    src={viewingDiscipline.featured_image}
                    alt={viewingDiscipline.title}
                    className='w-full h-full object-contain'
                  />
                </div>
              )}
              <div className='p-3 bg-gray-50 rounded-md border border-gray-100'>
                <p className='text-xs font-semibold uppercase tracking-widest mb-0.5'>Title</p>
                <p className='text-lg font-bold text-gray-900'>{viewingDiscipline?.title}</p>
              </div>
              <div className='p-3 bg-gray-50 rounded-md border border-gray-100'>
                <p className='text-xs font-semibold uppercase tracking-widest mb-1'>Description</p>
                <p className='text-gray-700 text-sm leading-relaxed'>
                  {viewingDiscipline?.description || 'No description provided.'}
                </p>
              </div>
              <div className='p-3 bg-gray-50 rounded-md border border-gray-100'>
                <p className='text-xs font-semibold uppercase tracking-widest mb-0.5'>Created At</p>
                <p className='text-sm text-gray-600'>
                  {viewingDiscipline?.createdAt ? formatDate(viewingDiscipline.createdAt) : '—'}
                </p>
              </div>
            </div>
            <div className='px-6 py-4 border-t flex justify-end'>
              <Button variant='outline' onClick={() => { setIsViewModalOpen(false); setViewingDiscipline(null) }}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
