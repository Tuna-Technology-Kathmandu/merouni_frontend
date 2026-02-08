import React from 'react'
import { Modal } from '@/ui/molecules/Modal'
import { formatDate } from '@/utils/date.util'

const ScholarshipViewModal = ({ isOpen, onClose, scholarship }) => {
    if (!scholarship) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Scholarship Details"
            className="max-w-4xl"
        >
            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Scholarship Name</h4>
                        <p className="text-lg font-medium text-gray-900">{scholarship.name}</p>
                    </div>

                    <div className="space-y-1 col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Category</h4>
                        <p className="text-lg font-medium text-gray-900">
                            {scholarship.scholarshipCategory?.title || 'N/A'}
                        </p>
                    </div>

                    <div className="space-y-1 col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                        <div
                            className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md border"
                            dangerouslySetInnerHTML={{ __html: scholarship.description || 'No description available.' }}
                        />
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Eligibility Criteria</h4>
                        <div className="font-medium bg-gray-50 p-3 rounded border">
                            {scholarship.eligibilityCriteria || 'N/A'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500">Renewal Criteria</h4>
                        <div className="font-medium bg-gray-50 p-3 rounded border">
                            {scholarship.renewalCriteria || 'N/A'}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-blue-800">Financial Details</h4>
                        <div className="flex justify-between items-center text-sm">
                            <span>Amount:</span>
                            <span className="font-bold text-lg">Rs. {scholarship.amount ? scholarship.amount.toLocaleString() : '0'}</span>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-semibold text-green-800">Important Dates</h4>
                        <div className="flex justify-between items-center text-sm">
                            <span>Deadline:</span>
                            <span className="font-bold">
                                {scholarship.applicationDeadline ? formatDate(scholarship.applicationDeadline) : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1 col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                        <p className="font-medium text-gray-900 bg-gray-50 p-3 rounded border">
                            {scholarship.contactInfo || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end pt-4 border-t mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                    Close
                </button>
            </div>
        </Modal>
    )
}

export default ScholarshipViewModal
