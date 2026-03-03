'use client'

import { useState, useEffect } from 'react'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import CreateUpdateDegree from '@/ui/molecules/dialogs/CreateUpdateDegree'
import ViewDegree from '@/ui/molecules/dialogs/ViewDegree'
import {
  Plus,
  GripVertical,
  GraduationCap,
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

// ─── Short-name badge ─────────────────────────────────────────────────────────
const ShortNameBadge = ({ shortName }) => {
  if (!shortName) return null
  return (
    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0 bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-wide'>
      {shortName}
    </span>
  )
}

// ─── Sortable Degree Card ─────────────────────────────────────────────────────
const SortableCard = ({ degree, rank, onView, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: degree.id })

  const style = {
    transform: transform ? CSS.Transform.toString({ ...transform, x: 0 }) : undefined,
    transition,
    opacity: isDragging ? 0 : 1
  }

  const disciplines = Array.isArray(degree.disciplines) ? degree.disciplines : []

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

        {/* Drag handle */}
        <div
          {...listeners}
          className='shrink-0 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none transition-colors'
          title='Drag to reorder'
        >
          <GripVertical size={18} />
        </div>

        {/* Rank circle */}
        <div className='w-8 h-8 rounded-full bg-[#387cae]/10 flex items-center justify-center shrink-0'>
          <span className='text-[11px] font-bold text-[#387cae] tabular-nums'>{rank}</span>
        </div>

        {/* Cover image / icon */}
        <div className='w-[52px] h-[52px] rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm'>
          {degree.featured_image
            ? <img src={degree.featured_image} alt={degree.title} className='w-full h-full object-cover' />
            : <GraduationCap className='w-6 h-6 text-gray-300' />}
        </div>

        {/* Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 flex-wrap'>
            <h3 className='text-[15px] font-bold text-gray-900 truncate leading-tight'>
              {degree.title}
            </h3>
            <ShortNameBadge shortName={degree.short_name} />
          </div>
          {disciplines.length > 0 && (
            <div className='flex items-center gap-1.5 mt-1.5'>
              <BookOpen size={11} className='text-gray-400 shrink-0' />
              <span className='text-[12px] text-gray-400 truncate'>
                {disciplines.slice(0, 3).map(d => d.title || d).join(', ')}
                {disciplines.length > 3 ? ` +${disciplines.length - 3} more` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className='flex items-center gap-1 shrink-0'>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onView(degree)}
            title='View details'
            className='w-8 h-8 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-all'
          >
            <Eye size={15} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(degree)}
            title='Edit'
            className='w-8 h-8 flex items-center justify-center rounded-md text-amber-500 hover:bg-amber-50 transition-all'
          >
            <Edit2 size={15} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(degree.id)}
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
const OverlayCard = ({ degree, rank }) => (
  <div className='bg-white border-2 border-[#387cae]/40 rounded-2xl shadow-2xl rotate-[0.6deg] scale-[1.01]'>
    <div className='flex items-center gap-3 px-4 py-3'>
      <GripVertical size={18} className='text-[#387cae]/50 cursor-grabbing shrink-0' />
      <div className='w-8 h-8 rounded-full bg-[#387cae]/15 flex items-center justify-center shrink-0'>
        <span className='text-[11px] font-bold text-[#387cae]'>{rank}</span>
      </div>
      <div className='w-[52px] h-[52px] rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0'>
        {degree.featured_image
          ? <img src={degree.featured_image} alt={degree.title} className='w-full h-full object-cover' />
          : <GraduationCap className='w-6 h-6 text-gray-300' />}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <h3 className='text-[15px] font-bold text-gray-900 truncate'>{degree.title}</h3>
          <ShortNameBadge shortName={degree.short_name} />
        </div>
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
        <div className='flex items-center gap-2'>
          <div className='h-4 bg-gray-200 rounded-md w-48' />
          <div className='h-5 bg-gray-200 rounded-full w-16' />
        </div>
        <div className='h-3 bg-gray-200 rounded-full w-32' />
      </div>
      <div className='flex gap-2 shrink-0'>
        {[0, 1, 2].map(j => <div key={j} className='w-9 h-9 bg-gray-200 rounded-md' />)}
      </div>
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DegreePage() {
  const { setHeading } = usePageHeading()

  const [degrees, setDegrees] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)

  // Create/Edit Modal
  const [isOpen, setIsOpen] = useState(false)
  const [editingDegree, setEditingDegree] = useState(null)

  // View Modal
  const [viewingDegree, setViewingDegree] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  // Delete Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // DnD
  const [activeId, setActiveId] = useState(null)
  const activeDegree = degrees.find(d => d.id === activeId)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    setHeading('Degree Management')
    loadDegrees()
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => { if (searchTimeout) clearTimeout(searchTimeout) }
  }, [searchTimeout])

  const loadDegrees = async (query = '', silent = false) => {
    try {
      if (!silent) setLoading(true)
      let all = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        let url = `${process.env.baseUrl}/degree?page=${page}&limit=100`
        if (query) url += `&q=${encodeURIComponent(query)}`
        const res = await authFetch(url)
        if (!res.ok) throw new Error('Failed to load degrees')
        const data = await res.json()
        all = [...all, ...(data.items || [])]
        hasMore = page < (data.pagination?.totalPages || data.totalPages || 1)
        page++
      }

      all.sort((a, b) => {
        const oA = a.order_no_for_website ?? Infinity
        const oB = b.order_no_for_website ?? Infinity
        return oA !== oB ? oA - oB : a.id - b.id
      })

      setDegrees(all)
    } catch (err) {
      toast.error(err.message || 'Failed to load degrees')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    const id = setTimeout(() => loadDegrees(value, true), 350)
    setSearchTimeout(id)
  }

  const handleDragStart = (event) => setActiveId(event.active.id)
  const handleDragCancel = () => setActiveId(null)

  const handleDragEnd = async (event) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = degrees.findIndex(d => d.id === active.id)
    const newIdx = degrees.findIndex(d => d.id === over.id)
    const reordered = arrayMove(degrees, oldIdx, newIdx)
    setDegrees(reordered)

    const payload = reordered.map((d, i) => ({ id: d.id, order_no: i + 1 }))
    await saveOrder(payload)
  }

  const saveOrder = async (payload) => {
    try {
      setSaving(true)
      const res = await authFetch(`${process.env.baseUrl}/degree/update-order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ degrees: payload })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save order')
      }
      setDegrees(prev =>
        prev.map(d => {
          const updated = payload.find(p => p.id === d.id)
          return updated ? { ...d, order_no_for_website: updated.order_no } : d
        })
      )
      toast.success('Order saved', { autoClose: 1500 })
    } catch (err) {
      toast.error(err.message || 'Failed to save order')
      loadDegrees(searchQuery, true)
    } finally {
      setSaving(false)
    }
  }

  const handleView = (degree) => {
    setViewingDegree(degree)
    setIsViewOpen(true)
  }

  const handleEdit = (degree) => {
    setEditingDegree(degree)
    setIsOpen(true)
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const res = await authFetch(`${process.env.baseUrl}/degree/${deleteId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      toast.success(data.message || 'Degree deleted')
      loadDegrees(searchQuery, true)
    } catch (err) {
      toast.error(err.message || 'Failed to delete degree')
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className='w-full p-4 space-y-3'>

        {/* ── Sticky Header ──────────────────────────────────────────────────── */}
        <div className='sticky top-0 z-30 bg-[#F7F8FA] py-3'>
          <div className='bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-md bg-[#387cae]/10 flex items-center justify-center shrink-0'>
                <GraduationCap size={17} className='text-[#387cae]' />
              </div>
              <div>
                <p className='text-sm font-bold text-gray-800'>Degrees</p>
                <p className='text-xs text-gray-400 flex items-center gap-1.5'>
                  {loading
                    ? <span className='inline-flex items-center gap-1'><Loader2 size={10} className='animate-spin' /> Loading…</span>
                    : `${degrees.length} total`
                  }
                  {saving && (
                    <span className='inline-flex items-center gap-1 text-[#387cae]'>
                      · <Loader2 size={10} className='animate-spin' /> Saving order…
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2 w-full sm:w-auto'>
              <div className='relative flex-1 sm:w-60'>
                <Search size={13} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder='Search degrees…'
                  className='w-full pl-8 pr-3 h-9 rounded-md border border-gray-200 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#387cae]/25 focus:border-[#387cae]/40 transition'
                />
              </div>
              <Button
                onClick={() => { setEditingDegree(null); setIsOpen(true) }}
                className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 h-9 px-4 rounded-md text-sm font-semibold shrink-0'
              >
                <Plus size={15} />
                Add Degree
              </Button>
            </div>
          </div>
        </div>

        {/* ── Card List ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div className='space-y-2.5'>
            {[...Array(5)].map((_, i) => <CardSkeleton key={i} i={i} />)}
          </div>
        ) : degrees.length === 0 ? (
          <div className='bg-white border border-dashed border-gray-200 rounded-2xl py-20 text-center'>
            <GraduationCap className='w-10 h-10 text-gray-200 mx-auto mb-3' />
            <p className='text-gray-500 font-medium text-sm'>
              {searchQuery ? 'No degrees match your search.' : 'No degrees yet.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => { setEditingDegree(null); setIsOpen(true) }}
                className='mt-4 bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 text-sm'
              >
                <Plus size={15} /> Add First Degree
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
                items={degrees.map(d => d.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-2'>
                  {degrees.map((degree, idx) => (
                    <SortableCard
                      key={degree.id}
                      degree={degree}
                      rank={idx + 1}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeDegree ? (
                  <OverlayCard
                    degree={activeDegree}
                    rank={degrees.findIndex(d => d.id === activeId) + 1}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <CreateUpdateDegree
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setEditingDegree(null) }}
        initialData={editingDegree}
        onSuccess={() => loadDegrees(searchQuery, true)}
      />

      <ViewDegree
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setViewingDegree(null) }}
        degree={viewingDegree}
      />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this degree? This action cannot be undone.'
        confirmText='Delete'
        cancelText='Cancel'
      />

      <ToastContainer position='bottom-right' />
    </>
  )
}
