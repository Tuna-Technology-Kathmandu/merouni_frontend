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

const SortableItem = ({ school }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: school.id })

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
                {school.logo && (
                    <img
                        src={school.logo}
                        alt={school.name}
                        className='w-16 h-16 object-contain rounded-lg border bg-gray-50'
                    />
                )}
                <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                        {school.name}
                    </h3>
                    {school.address && (
                        <p className='text-sm text-gray-500 mt-1'>
                            {typeof school.address === 'string'
                                ? (function () {
                                    try {
                                        const addr = JSON.parse(school.address);
                                        return [addr.city, addr.state, addr.country].filter(Boolean).join(', ');
                                    } catch (e) { return school.address; }
                                })()
                                : [school.address.city, school.address.state, school.address.country].filter(Boolean).join(', ')
                            }
                        </p>
                    )}
                </div>
                <div className='text-sm text-gray-500'>
                    Order: {school.order_no_for_website ?? 'Not set'}
                </div>
            </div>
        </div>
    )
}

const SchoolOrderingsPage = () => {
    const { setHeading } = usePageHeading()
    const [schools, setSchools] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    useEffect(() => {
        setHeading('School Orderings')
        return () => setHeading(null)
    }, [setHeading])

    const loadSchools = async () => {
        try {
            setLoading(true)

            // Fetch all schools using pagination
            let allSchools = []
            let currentPage = 1
            let hasMore = true
            const limit = 100 // Max limit per page

            while (hasMore) {
                const response = await authFetch(
                    `${process.env.baseUrl}/school?page=${currentPage}&limit=${limit}`
                )

                if (!response.ok) {
                    throw new Error('Failed to load schools')
                }

                const data = await response.json()
                const items = data.items || []
                allSchools = [...allSchools, ...items]

                // Check if there are more pages
                hasMore = currentPage < (data.pagination?.totalPages || 1)
                currentPage++
            }

            // Sort schools by order_no_for_website (nulls last), then by id
            const sortedSchools = allSchools.sort((a, b) => {
                const orderA = a.order_no_for_website ?? Infinity
                const orderB = b.order_no_for_website ?? Infinity
                if (orderA !== orderB) {
                    return orderA - orderB
                }
                return a.id - b.id
            })

            setSchools(sortedSchools)
        } catch (err) {
            console.error('Error loading schools:', err)
            toast.error(err.message || 'Failed to load schools')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSchools()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDragEnd = async (event) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = schools.findIndex((s) => s.id === active.id)
            const newIndex = schools.findIndex((s) => s.id === over.id)

            const newSchools = arrayMove(schools, oldIndex, newIndex)
            setSchools(newSchools)

            // Update order numbers based on new position (starting from 1)
            const updatedSchools = newSchools.map((school, index) => ({
                id: school.id,
                order_no: index + 1
            }))

            await saveOrder(updatedSchools)
        }
    }

    const saveOrder = async (updatedSchools) => {
        try {
            setSaving(true)
            const response = await authFetch(
                `${process.env.baseUrl}/school/order`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ schools: updatedSchools })
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to save order')
            }

            // Update local state with new order numbers
            setSchools((prevSchools) => {
                return prevSchools.map((school) => {
                    const updated = updatedSchools.find((us) => us.id === school.id)
                    return updated
                        ? { ...school, order_no_for_website: updated.order_no }
                        : school
                })
            })

            toast.success('School order updated successfully')
        } catch (err) {
            console.error('Error saving order:', err)
            toast.error(err.message || 'Failed to save order')
            // Reload schools on error to restore original order
            loadSchools()
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
                        Drag and drop schools to reorder them. The order will be saved
                        automatically.
                    </p>
                    {saving && (
                        <p className='text-blue-600 text-sm mt-2'>Saving order...</p>
                    )}
                </div>

                {schools.length === 0 ? (
                    <div className='bg-white rounded-lg p-8 text-center'>
                        <p className='text-gray-500'>No schools found.</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={schools.map((s) => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className='space-y-3'>
                                {schools.map((school) => (
                                    <SortableItem key={school.id} school={school} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    )
}

export default SchoolOrderingsPage
