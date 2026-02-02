'use client'

import { Modal } from '@/ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'

export default function ViewDegree({ isOpen, onClose, degree }) {
    if (!degree) return null

    
    return (

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Degree Details"
            className="max-w-2xl"
        >
            <div className="p-1 space-y-6">
                {/* Cover Image */}
                {degree.featured_image && (
                    <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-6 border border-gray-200">
                        <img
                            src={degree.featured_image}
                            alt={degree.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Title</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{degree.title}</p>
                    </div>

                 

                    <div className="md:col-span-2">
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <div className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                            {degree.description || "No description provided."}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                        <p className="mt-1 text-gray-900">{degree.createdAt ? formatDate(degree.createdAt) : 'N/A'}</p>
                    </div>

                 
                </div>

                <div className="flex justify-end pt-4 border-t mt-6">
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
