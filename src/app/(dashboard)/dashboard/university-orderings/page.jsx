'use client'
import { useState, useEffect } from 'react'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import ShimmerEffect from '@/ui/molecules/ShimmerEffect'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

const SortableItem = ({ university }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: university.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'
    >
      <div className='flex items-center gap-4'>
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600'
        >
          <GripVertical className='w-5 h-5' />
        </div>
        {university.logo && (
          <img
            src={university.logo}
            alt={university.fullname}
            className='w-16 h-16 object-contain rounded-lg border'
          />
        )}
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {university.fullname}
          </h3>
          {university.address && (
            <p className='text-sm text-gray-500 mt-1'>
              {[
                university.city,
                university.state,
                university.country
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>
        <div className='text-sm text-gray-500'>
          Order: {university.order_no_for_website ?? 'Not set'}
        </div>
      </div>
    </div>
  )
}

const UniversityOrderingsPage = () => {
  const { setHeading } = usePageHeading()
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    setHeading('University Orderings')
    return () => setHeading(null)
  }, [setHeading])

  const loadUniversities = async () => {
    try {
      setLoading(true)

      // Fetch all universities using pagination
      let allUniversities = []
      let currentPage = 1
      let hasMore = true
      const limit = 100 // Max limit per page

      while (hasMore) {
        const response = await authFetch(
          `${process.env.baseUrl}/university?page=${currentPage}&limit=${limit}`
        )

        if (!response.ok) {
          throw new Error('Failed to load universities')
        }

        const data = await response.json()
        const items = data.items || []
        allUniversities = [...allUniversities, ...items]

        // Check if there are more pages
        // The API returns totalPages at the root level, not inside pagination object
        hasMore = currentPage < (data.totalPages || 1)
        currentPage++
      }

      // Sort universities by order_no_for_website (nulls last), then by id
      const sortedUniversities = allUniversities.sort((a, b) => {
        const orderA = a.order_no_for_website ?? Infinity
        const orderB = b.order_no_for_website ?? Infinity
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return a.id - b.id
      })

      setUniversities(sortedUniversities)
    } catch (err) {
      console.error('Error loading universities:', err)
      toast.error(err.message || 'Failed to load universities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUniversities()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = universities.findIndex((u) => u.id === active.id)
      const newIndex = universities.findIndex((u) => u.id === over.id)

      const newUniversities = arrayMove(universities, oldIndex, newIndex)
      setUniversities(newUniversities)

      // Update order numbers based on new position (starting from 1)
      const updatedUniversities = newUniversities.map((university, index) => ({
        id: university.id,
        order_no: index + 1
      }))

      await saveOrder(updatedUniversities)
    }
  }

  const saveOrder = async (updatedUniversities) => {
    try {
      setSaving(true)
      const response = await authFetch(
        `${process.env.baseUrl}/university/order`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ universities: updatedUniversities })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save order')
      }

      // Update local state with new order numbers
      setUniversities((prevUniversities) => {
        return prevUniversities.map((university) => {
          const updated = updatedUniversities.find((u) => u.id === university.id)
          return updated
            ? { ...university, order_no_for_website: updated.order_no }
            : university
        })
      })

      toast.success('University order updated successfully')
    } catch (err) {
      console.error('Error saving order:', err)
      toast.error(err.message || 'Failed to save order')
      // Reload universities on error to restore original order
      loadUniversities()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <ShimmerEffect />
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-6'>
          <p className='text-gray-600'>
            Drag and drop universities to reorder them. The order will be saved
            automatically.
          </p>
          {saving && (
            <p className='text-blue-600 text-sm mt-2'>Saving order...</p>
          )}
        </div>

        {universities.length === 0 ? (
          <div className='bg-white rounded-lg p-8 text-center'>
            <p className='text-gray-500'>No universities found.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={universities.map((u) => u.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-3'>
                {universities.map((university) => (
                  <SortableItem key={university.id} university={university} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default UniversityOrderingsPage
