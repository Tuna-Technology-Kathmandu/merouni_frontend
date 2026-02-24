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

const SortableItem = ({ degree }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: degree.id })

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
                {degree.featured_image && (
                    <img
                        src={degree.featured_image}
                        alt={degree.title}
                        className='w-16 h-10 object-cover rounded border'
                    />
                )}
                <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        {degree.title}
                    </h3>
                    {degree.description && (
                        <p className='text-sm text-gray-500 mt-1 line-clamp-1'>
                            {degree.description}
                        </p>
                    )}
                </div>
                <div className='text-sm text-gray-500'>
                    Order: {degree.order_no_for_website ?? 'Not set'}
                </div>
            </div>
        </div>
    )
}

const DegreeOrderingsPage = () => {
    const { setHeading } = usePageHeading()
    const [degrees, setDegrees] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    useEffect(() => {
        setHeading('Degree Orderings')
        return () => setHeading(null)
    }, [setHeading])

    const loadDegrees = async () => {
        try {
            setLoading(true)

            // Fetch all degrees using pagination
            let allDegrees = []
            let currentPage = 1
            let hasMore = true
            const limit = 100 // Max limit per page

            while (hasMore) {
                const response = await authFetch(
                    `${process.env.baseUrl}/degree?page=${currentPage}&limit=${limit}`
                )

                if (!response.ok) {
                    throw new Error('Failed to load degrees')
                }

                const data = await response.json()
                const items = data.items || []
                allDegrees = [...allDegrees, ...items]

                // Check if there are more pages
                hasMore = currentPage < (data.pagination?.totalPages || 1)
                currentPage++
            }

            // Sort degrees by order_no_for_website (nulls last), then by id
            const sortedDegrees = allDegrees.sort((a, b) => {
                const orderA = a.order_no_for_website ?? Infinity
                const orderB = b.order_no_for_website ?? Infinity
                if (orderA !== orderB) {
                    return orderA - orderB
                }
                return a.id - b.id
            })

            setDegrees(sortedDegrees)
        } catch (err) {
            console.error('Error loading degrees:', err)
            toast.error(err.message || 'Failed to load degrees')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadDegrees()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDragEnd = async (event) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = degrees.findIndex((d) => d.id === active.id)
            const newIndex = degrees.findIndex((d) => d.id === over.id)

            const newDegrees = arrayMove(degrees, oldIndex, newIndex)
            setDegrees(newDegrees)

            // Update order numbers based on new position (starting from 1)
            const updatedDegrees = newDegrees.map((degree, index) => ({
                id: degree.id,
                order_no: index + 1
            }))

            await saveOrder(updatedDegrees)
        }
    }

    const saveOrder = async (updatedDegrees) => {
        try {
            setSaving(true)
            const response = await authFetch(
                `${process.env.baseUrl}/degree/order`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ degrees: updatedDegrees })
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to save order')
            }

            // Update local state with new order numbers
            setDegrees((prevDegrees) => {
                return prevDegrees.map((degree) => {
                    const updated = updatedDegrees.find((ud) => ud.id === degree.id)
                    return updated
                        ? { ...degree, order_no_for_website: updated.order_no }
                        : degree
                })
            })

            toast.success('Degree order updated successfully')
        } catch (err) {
            console.error('Error saving order:', err)
            toast.error(err.message || 'Failed to save order')
            // Reload degrees on error to restore original order
            loadDegrees()
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
                        Drag and drop degrees to reorder them. The order will be saved
                        automatically.
                    </p>
                    {saving && (
                        <p className='text-blue-600 text-sm mt-2'>Saving order...</p>
                    )}
                </div>

                {degrees.length === 0 ? (
                    <div className='bg-white rounded-lg p-8 text-center'>
                        <p className='text-gray-500'>No degrees found.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={degrees.map((d) => d.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className='space-y-3'>
                                {degrees.map((degree) => (
                                    <SortableItem key={degree.id} degree={degree} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    )
}

export default DegreeOrderingsPage
