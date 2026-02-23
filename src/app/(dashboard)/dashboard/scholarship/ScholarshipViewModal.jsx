import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { formatDate } from '@/utils/date.util'

const ScholarshipViewModal = ({ isOpen, onClose, scholarship }) => {
    if (!scholarship) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-4xl"
        >
            <DialogHeader>
                <DialogTitle>Scholarship Details</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
                <div className="space-y-6 max-h-[70vh] pr-2">
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

                        <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-500">Financial Details (Amount)</h4>
                            <span className="font-bold text-lg text-gray-900">Rs. {scholarship.amount ? scholarship.amount.toLocaleString() : '0'}</span>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
                            <h4 className="text-sm font-medium text-gray-500">Application Deadline</h4>
                            <span className="font-bold text-gray-900">
                                {scholarship.applicationDeadline ? formatDate(scholarship.applicationDeadline) : 'N/A'}
                            </span>
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
            </DialogContent>
        </Dialog>
    )
}

export default ScholarshipViewModal
