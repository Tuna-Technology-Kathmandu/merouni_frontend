'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import useAdminPermission from '@/hooks/useAdminPermission'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'
import CreateUpdateUniversityModal from '@/ui/molecules/dialogs/university/CreateUpdateUniversityModal'
import UniversityViewModal from './components/UniversityViewModal'
import ImageLightbox from '@/ui/molecules/image-lightbox'
import {
  Plus,
  GripVertical,
  Building2,
  Eye,
  Edit2,
  Trash2,
  Search,
  MapPin,
  Globe,
  CalendarDays,
  Loader2,
  GraduationCap
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
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/app/lib/utils'

const StatusBadge = ({ status }) => {
  if (!status) return null
  const isPublished = status.toLowerCase() === 'published'
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0',
      isPublished
        ? 'bg-blue-50 text-blue-600 border-blue-100'
        : 'bg-orange-50 text-orange-600 border-orange-100'
    )}>
      {status}
    </span>
  )
}

// ─── Type badge helper ────────────────────────────────────────────────────────
const TypeBadge = ({ type }) => {
  if (!type) return null
  const isPublic = type === 'Public'
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shrink-0',
      isPublic
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-violet-50 text-violet-700 border-violet-200'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', isPublic ? 'bg-emerald-500' : 'bg-violet-500')} />
      {type}
    </span>
  )
}

// ─── Sortable University Card (grid layout, college-style) ────────────────────
const SortableCard = ({ university, onView, onEdit, onDelete, onImageClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: university.id })

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const location = [university.city, university.state, university.country].filter(Boolean).join(', ')
  const year = university.date_of_establish ?? null
  const websiteUrl = university.contact?.website_url
  const mapUrl = university.map

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'bg-white border rounded-2xl transition-all duration-200 overflow-hidden',
        isDragging
          ? 'border-[#387cae]/40 shadow-xl ring-2 ring-[#387cae]/20'
          : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
      )}
    >
      <div className='flex flex-col h-full'>
        <div className='flex items-start gap-3 p-4'>
          {/* Drag handle */}
          <div
            {...listeners}
            className='shrink-0 mt-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none transition-colors'
            title='Drag to reorder'
          >
            <GripVertical size={18} />
          </div>

          {/* Logo (clickable) */}
          <div
            role='button'
            tabIndex={0}
            onClick={() => university.logo && onImageClick(university.logo, university.fullname)}
            onKeyDown={(e) => e.key === 'Enter' && university.logo && onImageClick(university.logo, university.fullname)}
            className={cn(
              'w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm',
              university.logo && 'cursor-pointer hover:opacity-90 transition-opacity'
            )}
          >
            {university.logo
              ? <img src={university.logo} alt={university.fullname} className='w-full h-full object-contain p-1.5' />
              : <GraduationCap className='w-7 h-7 text-gray-300' />}
          </div>

          {/* Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              {university.slugs ? (
                <Link
                  href={`/universities/${university.slugs}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='font-bold text-gray-900 hover:text-[#387cae] hover:underline text-[15px] leading-tight truncate'
                >
                  {university.fullname}
                </Link>
              ) : (
                <h3 className='text-[15px] font-bold text-gray-900 truncate leading-tight'>
                  {university.fullname}
                </h3>
              )}
              <TypeBadge type={university.type_of_institute} />
              <StatusBadge status={university.status} />
            </div>
            {websiteUrl && (
              <a
                href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:underline text-sm mt-1 inline-flex items-center gap-1'
              >
                <Globe className='inline w-4 h-4 shrink-0' /> {websiteUrl}
              </a>
            )}
          </div>
        </div>

        <div className='px-4 pb-3 flex flex-col gap-1.5'>
          {(location || mapUrl) && (
            <div className='flex flex-col'>
              {location && (
                <span className='flex items-center gap-1.5 text-[12px] text-gray-500'>
                  <MapPin size={12} className='shrink-0' />
                  {location}
                </span>
              )}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline text-sm mt-0.5 inline-flex items-center gap-1'
                >
                  <MapPin className='inline w-4 h-4 shrink-0' /> View Map
                </a>
              )}
            </div>
          )}
          {year && (
            <span className='flex items-center gap-1.5 text-[12px] text-gray-400'>
              <CalendarDays size={12} className='shrink-0' />
              Est. {year}
            </span>
          )}
        </div>

        <div className='flex items-center justify-end gap-1 px-4 py-3 border-t border-gray-100 bg-gray-50/50'>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onView(university.slugs)}
            title='View details'
            className='w-8 h-8 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-all'
          >
            <Eye size={15} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(university.slugs)}
            title='Edit'
            className='w-8 h-8 flex items-center justify-center rounded-md text-amber-500 hover:bg-amber-50 transition-all'
          >
            <Edit2 size={15} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(university.id)}
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
const OverlayCard = ({ university }) => (
  <div className='bg-white border-2 border-[#387cae]/40 rounded-2xl shadow-2xl rotate-[0.6deg] scale-[1.01]'>
    <div className='flex items-start gap-3 p-4'>
      <GripVertical size={18} className='text-[#387cae]/50 cursor-grabbing shrink-0 mt-1' />
      <div className='w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0'>
        {university.logo
          ? <img src={university.logo} alt={university.fullname} className='w-full h-full object-contain p-1.5' />
          : <GraduationCap className='w-7 h-7 text-gray-300' />}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <h3 className='text-[15px] font-bold text-gray-900 truncate'>{university.fullname}</h3>
          <TypeBadge type={university.type_of_institute} />
          <StatusBadge status={university.status} />
        </div>
      </div>
    </div>
  </div>
)

// ─── Skeleton Card ────────────────────────────────────────────────────────────
const CardSkeleton = ({ i = 0 }) => (
  <div
    className='bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse'
    style={{ animationDelay: `${i * 60}ms` }}
  >
    <div className='flex items-start gap-3 p-4'>
      <div className='w-[18px] h-[18px] bg-gray-200 rounded shrink-0 mt-1' />
      <div className='w-16 h-16 bg-gray-200 rounded-lg shrink-0' />
      <div className='flex-1 space-y-2.5'>
        <div className='flex items-center gap-2'>
          <div className='h-4 bg-gray-200 rounded-md w-40' />
          <div className='h-5 bg-gray-200 rounded-full w-16' />
        </div>
        <div className='h-3 bg-gray-200 rounded w-28' />
      </div>
    </div>
    <div className='px-4 pb-3 space-y-2'>
      <div className='h-3 bg-gray-200 rounded w-36' />
      <div className='h-3 bg-gray-200 rounded w-24' />
    </div>
    <div className='flex justify-end gap-2 px-4 py-3 border-t border-gray-100'>
      {[0, 1, 2].map(j => <div key={j} className='w-8 h-8 bg-gray-200 rounded-md' />)}
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UniversityPage() {
  const { setHeading } = usePageHeading()
  const { requireAdmin } = useAdminPermission()

  const [isOpen, setIsOpen] = useState(false)
  const [editSlug, setEditSlug] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [viewUniversityData, setViewUniversityData] = useState(null)
  const [loadingView, setLoadingView] = useState(false)

  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTimeout, setSearchTimeout] = useState(null)

  const [activeId, setActiveId] = useState(null)
  const activeUniversity = universities.find((u) => u.id === activeId)
  const [lightbox, setLightbox] = useState({ isOpen: false, imageUrl: '', altText: '' })

  const handleImageClick = (imageUrl, altText) => {
    setLightbox({ isOpen: true, imageUrl, altText: altText || 'University Logo' })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    setHeading('University Management')
    loadUniversities(searchQuery, statusFilter)
    return () => setHeading(null)
  }, [setHeading])

  useEffect(() => {
    return () => { if (searchTimeout) clearTimeout(searchTimeout) }
  }, [searchTimeout])

  const loadUniversities = async (query = '', status = 'All', silent = false) => {
    try {
      if (!silent) setLoading(true)
      let all = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        let url = `${process.env.baseUrl}/university?page=${page}&limit=100`
        if (query) url += `&q=${encodeURIComponent(query)}`
        if (status && status !== 'All') url += `&status=${status.toLowerCase()}`
        const res = await authFetch(url)
        if (!res.ok) throw new Error('Failed to load universities')
        const data = await res.json()
        all = [...all, ...(data.items || [])]
        hasMore = page < (data.pagination?.totalPages || data.totalPages || 1)
        page++
      }

      all.sort((a, b) => {
        const oA = a.order_no_for_website ?? Infinity
        const oB = b.order_no_for_website ?? Infinity
        return oA !== oB ? oA - oB : b.id - a.id
      })

      setUniversities(all)
    } catch (err) {
      toast.error(err.message || 'Failed to load universities')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleSearchInput = (value) => {
    setSearchQuery(value)
    if (searchTimeout) clearTimeout(searchTimeout)
    const id = setTimeout(() => loadUniversities(value, statusFilter, true), 350)
    setSearchTimeout(id)
  }

  const handleStatusChange = (status) => {
    setStatusFilter(status)
    loadUniversities(searchQuery, status, true)
  }

  const handleDragStart = (event) => setActiveId(event.active.id)
  const handleDragCancel = () => setActiveId(null)

  const handleDragEnd = async (event) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIdx = universities.findIndex((u) => u.id === active.id)
    const newIdx = universities.findIndex((u) => u.id === over.id)
    const reordered = arrayMove(universities, oldIdx, newIdx)
    setUniversities(reordered)

    const payload = reordered.map((u, i) => ({ id: u.id, order_no: i + 1 }))
    await saveOrder(payload)
  }

  const saveOrder = async (payload) => {
    try {
      setSaving(true)
      const res = await authFetch(`${process.env.baseUrl}/university/update-order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universities: payload })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save order')
      }
      setUniversities((prev) =>
        prev.map((u) => {
          const updated = payload.find((p) => p.id === u.id)
          return updated ? { ...u, order_no_for_website: updated.order_no } : u
        })
      )
      toast.success('Order saved', { autoClose: 1500 })
    } catch (err) {
      toast.error(err.message || 'Failed to save order')
      loadUniversities(searchQuery, statusFilter, true)
    } finally {
      setSaving(false)
    }
  }

  const handleView = async (slug) => {
    try {
      setLoadingView(true)
      setViewModalOpen(true)
      const res = await authFetch(`${process.env.baseUrl}/university/${slug}`)
      if (!res.ok) throw new Error('Failed to fetch university details')
      setViewUniversityData(await res.json())
    } catch (err) {
      toast.error(err.message || 'Failed to load university details')
      setViewModalOpen(false)
    } finally {
      setLoadingView(false)
    }
  }

  const handleEdit = (slug) => { setEditSlug(slug); setIsOpen(true) }

  const handleDeleteClick = (id) => {
    requireAdmin(() => { setDeleteId(id); setIsDialogOpen(true) })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      const res = await authFetch(
        `${process.env.baseUrl}/university?id=${deleteId}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } }
      )
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || 'Deleted successfully')
        loadUniversities(searchQuery, statusFilter, true)
      } else {
        throw new Error(data.message || 'Failed to delete')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsDialogOpen(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className='w-full'>

        {/* ── Sticky Header ──────────────────────────────────────────────────── */}
        <div className='sticky mb-3 top-0 z-30 bg-[#F7F8FA] py-3'>
          <div className='bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-md bg-[#387cae]/10 flex items-center justify-center shrink-0'>
                <Building2 size={17} className='text-[#387cae]' />
              </div>
              <div>
                <p className='text-sm font-bold text-gray-800'>Universities</p>
                <p className='text-xs text-gray-400 flex items-center gap-1.5'>
                  {loading
                    ? <span className='inline-flex items-center gap-1'><Loader2 size={10} className='animate-spin' /> Loading…</span>
                    : `${universities.length} total`
                  }
                  {saving && (
                    <span className='inline-flex items-center gap-1 text-[#387cae]'>
                      · <Loader2 size={10} className='animate-spin' /> Saving order…
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2 w-full sm:w-auto overflow-x-auto sm:overflow-visible pb-1 sm:pb-0'>
              <div className='relative shrink-0 sm:w-60'>
                <Search size={13} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder='Search universities…'
                  className='w-full pl-8 pr-3 h-9 rounded-md border border-gray-200 text-sm text-gray-700 placeholder-gray-400 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#387cae]/25 focus:border-[#387cae]/40 transition'
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => handleStatusChange(e.target.value)}
                className='h-9 rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#387cae]/25 transition-all font-medium min-w-[120px]'
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>

              <Button
                onClick={() => { setEditSlug(''); setIsOpen(true) }}
                className='bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 h-9 px-4 rounded-md text-sm font-semibold shrink-0'
              >
                <Plus size={15} />
                Add University
              </Button>
            </div>
          </div>
        </div>

        {/* ── Card List ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => <CardSkeleton key={i} i={i} />)}
          </div>
        ) : universities.length === 0 ? (
          <div className='bg-white border border-dashed border-gray-200 rounded-2xl py-20 text-center'>
            <GraduationCap className='w-10 h-10 text-gray-200 mx-auto mb-3' />
            <p className='text-gray-500 font-medium text-sm'>
              {searchQuery ? 'No universities match your search.' : 'No universities yet.'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => { setEditSlug(''); setIsOpen(true) }}
                className='mt-4 bg-[#387cae] hover:bg-[#387cae]/90 text-white gap-2 text-sm'
              >
                <Plus size={15} /> Add First University
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
                items={universities.map((u) => u.id)}
                strategy={rectSortingStrategy}
              >
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {universities.map((university) => (
                    <SortableCard
                      key={university.id}
                      university={university}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onImageClick={handleImageClick}
                    />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeUniversity ? <OverlayCard university={activeUniversity} /> : null}
              </DragOverlay>
            </DndContext>
          </>
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <CreateUpdateUniversityModal
        isOpen={isOpen}
        handleCloseModal={() => { setIsOpen(false); setEditSlug('') }}
        editSlug={editSlug}
        onSuccess={() => loadUniversities(searchQuery, statusFilter, true)}
      />

      <ConfirmationDialog
        open={isDialogOpen}
        onClose={() => { setIsDialogOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        title='Confirm Deletion'
        message='Are you sure you want to delete this university? This action cannot be undone.'
      />

      <UniversityViewModal
        isOpen={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setViewUniversityData(null) }}
        data={viewUniversityData}
        loading={loadingView}
      />

      <ImageLightbox
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox({ ...lightbox, isOpen: false })}
        imageUrl={lightbox.imageUrl}
        altText={lightbox.altText}
      />

      <ToastContainer position='bottom-right' />
    </>
  )
}
