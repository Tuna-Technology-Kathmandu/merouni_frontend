'use client'
import { useState, useEffect } from 'react'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import ShimmerEffect from '@/ui/molecules/ShimmerEffect'
import { DotenvConfig } from '@/config/env.config'
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

const SortableItem = ({ college }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: college.id })

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
        {college.college_logo && (
          <img
            src={college.college_logo}
            alt={college.name}
            className='w-16 h-16 object-contain rounded-lg border'
          />
        )}
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {college.name}
          </h3>
          {college.address && (
            <p className='text-sm text-gray-500 mt-1'>
              {[
                college.address.city,
                college.address.state,
                college.address.country
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
        </div>
        <div className='text-sm text-gray-500'>
          Order: {college.order_no_for_website ?? 'Not set'}
        </div>
      </div>
    </div>
  )
}

const CollegeOrderingsPage = () => {
  const { setHeading } = usePageHeading()
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    setHeading('College Orderings')
    return () => setHeading(null)
  }, [setHeading])

  const loadColleges = async () => {
    try {
      setLoading(true)

      // Fetch all colleges using pagination
      let allColleges = []
      let currentPage = 1
      let hasMore = true
      const limit = 100 // Max limit per page

      while (hasMore) {
        const response = await authFetch(
          `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?page=${currentPage}&limit=${limit}`
        )

        if (!response.ok) {
          throw new Error('Failed to load colleges')
        }

        const data = await response.json()
        const items = data.items || []
        allColleges = [...allColleges, ...items]

        // Check if there are more pages
        hasMore = currentPage < (data.pagination?.totalPages || 1)
        currentPage++
      }

      // Sort colleges by order_no_for_website (nulls last), then by id
      const sortedColleges = allColleges.sort((a, b) => {
        const orderA = a.order_no_for_website ?? Infinity
        const orderB = b.order_no_for_website ?? Infinity
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return a.id - b.id
      })

      setColleges(sortedColleges)
    } catch (err) {
      console.error('Error loading colleges:', err)
      toast.error(err.message || 'Failed to load colleges')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadColleges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = colleges.findIndex((c) => c.id === active.id)
      const newIndex = colleges.findIndex((c) => c.id === over.id)

      const newColleges = arrayMove(colleges, oldIndex, newIndex)
      setColleges(newColleges)

      // Update order numbers based on new position (starting from 1)
      const updatedColleges = newColleges.map((college, index) => ({
        id: college.id,
        order_no: index + 1
      }))

      await saveOrder(updatedColleges)
    }
  }

  const saveOrder = async (updatedColleges) => {
    try {
      setSaving(true)
      const response = await authFetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/college/order`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ colleges: updatedColleges })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save order')
      }

      // Update local state with new order numbers
      setColleges((prevColleges) => {
        return prevColleges.map((college) => {
          const updated = updatedColleges.find((uc) => uc.id === college.id)
          return updated
            ? { ...college, order_no_for_website: updated.order_no }
            : college
        })
      })

      toast.success('College order updated successfully')
    } catch (err) {
      console.error('Error saving order:', err)
      toast.error(err.message || 'Failed to save order')
      // Reload colleges on error to restore original order
      loadColleges()
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
            Drag and drop colleges to reorder them. The order will be saved
            automatically.
          </p>
          {saving && (
            <p className='text-blue-600 text-sm mt-2'>Saving order...</p>
          )}
        </div>

        {colleges.length === 0 ? (
          <div className='bg-white rounded-lg p-8 text-center'>
            <p className='text-gray-500'>No colleges found.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={colleges.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-3'>
                {colleges.map((college) => (
                  <SortableItem key={college.id} college={college} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}

export default CollegeOrderingsPage
