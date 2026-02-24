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

const SortableItem = ({ consultancy }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: consultancy.id })

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
                {consultancy.logo && (
                    <img
                        src={consultancy.logo}
                        alt={consultancy.title}
                        className='w-16 h-16 object-contain rounded-lg border bg-gray-50'
                    />
                )}
                <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        {consultancy.title}
                    </h3>
                    {consultancy.address && (
                        <p className='text-sm text-gray-500 mt-1'>
                            {typeof consultancy.address === 'string'
                                ? (function () {
                                    try {
                                        const addr = JSON.parse(consultancy.address);
                                        return [addr.street, addr.city, addr.state].filter(Boolean).join(', ');
                                    } catch (e) { return consultancy.address; }
                                })()
                                : [consultancy.address.street, consultancy.address.city, consultancy.address.state].filter(Boolean).join(', ')
                            }
                        </p>
                    )}
                </div>
                <div className='text-sm text-gray-500'>
                    Order: {consultancy.order_no_for_website ?? 'Not set'}
                </div>
            </div>
        </div>
    )
}

const ConsultancyOrderingsPage = () => {
    const { setHeading } = usePageHeading()
    const [consultancies, setConsultancies] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    useEffect(() => {
        setHeading('Consultancy Orderings')
        return () => setHeading(null)
    }, [setHeading])

    const loadConsultancies = async () => {
        try {
            setLoading(true)

            // Fetch all consultancies using pagination
            let allConsultancies = []
            let currentPage = 1
            let hasMore = true
            const limit = 100 // Max limit per page

            while (hasMore) {
                const response = await authFetch(
                    `${process.env.baseUrl}/consultancy?page=${currentPage}&limit=${limit}`
                )

                if (!response.ok) {
                    throw new Error('Failed to load consultancies')
                }

                const data = await response.json()
                const items = data.items || []
                allConsultancies = [...allConsultancies, ...items]

                // Check if there are more pages
                hasMore = currentPage < (data.pagination?.totalPages || 1)
                currentPage++
            }

            // Sort consultancies by order_no_for_website (nulls last), then by id
            const sortedConsultancies = allConsultancies.sort((a, b) => {
                const orderA = a.order_no_for_website ?? Infinity
                const orderB = b.order_no_for_website ?? Infinity
                if (orderA !== orderB) {
                    return orderA - orderB
                }
                return a.id - b.id
            })

            setConsultancies(sortedConsultancies)
        } catch (err) {
            console.error('Error loading consultancies:', err)
            toast.error(err.message || 'Failed to load consultancies')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadConsultancies()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDragEnd = async (event) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = consultancies.findIndex((c) => c.id === active.id)
            const newIndex = consultancies.findIndex((c) => c.id === over.id)

            const newConsultancies = arrayMove(consultancies, oldIndex, newIndex)
            setConsultancies(newConsultancies)

            // Update order numbers based on new position (starting from 1)
            const updatedConsultancies = newConsultancies.map((consultancy, index) => ({
                id: consultancy.id,
                order_no: index + 1
            }))

            await saveOrder(updatedConsultancies)
        }
    }

    const saveOrder = async (updatedConsultancies) => {
        try {
            setSaving(true)
            const response = await authFetch(
                `${process.env.baseUrl}/consultancy/order`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ consultancies: updatedConsultancies })
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to save order')
            }

            // Update local state with new order numbers
            setConsultancies((prevConsultancies) => {
                return prevConsultancies.map((consultancy) => {
                    const updated = updatedConsultancies.find((uc) => uc.id === consultancy.id)
                    return updated
                        ? { ...consultancy, order_no_for_website: updated.order_no }
                        : consultancy
                })
            })

            toast.success('Consultancy order updated successfully')
        } catch (err) {
            console.error('Error saving order:', err)
            toast.error(err.message || 'Failed to save order')
            // Reload consultancies on error to restore original order
            loadConsultancies()
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
                        Drag and drop consultancies to reorder them. The order will be saved
                        automatically.
                    </p>
                    {saving && (
                        <p className='text-blue-600 text-sm mt-2'>Saving order...</p>
                    )}
                </div>

                {consultancies.length === 0 ? (
                    <div className='bg-white rounded-lg p-8 text-center'>
                        <p className='text-gray-500'>No consultancies found.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={consultancies.map((c) => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className='space-y-3'>
                                {consultancies.map((consultancy) => (
                                    <SortableItem key={consultancy.id} consultancy={consultancy} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    )
}

export default ConsultancyOrderingsPage
