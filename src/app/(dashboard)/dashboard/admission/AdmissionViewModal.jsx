import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { formatDate } from '@/utils/date.util'

const AdmissionViewModal = ({ isOpen, onClose, admission }) => {
    if (!admission) return null

    const college = admission.collegeAdmissionCollege || {}
    const program = admission.program || {}

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-4xl"
        >
            <DialogHeader>
                <DialogTitle>Admission Details</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
                <div className="space-y-6 max-h-[70vh] pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500">College</h4>
                            <p className="text-lg font-medium text-gray-900">{college.name || 'N/A'}</p>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-sm font-medium text-gray-500">Program</h4>
                            <p className="text-lg font-medium text-gray-900">{program.title || 'N/A'}</p>
                        </div>

                        <div className="space-y-1 col-span-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
                            <div
                                className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-md border"
                                dangerouslySetInnerHTML={{ __html: admission.description || 'No description available.' }}
                            />
                        </div>

                        <div className="space-y-1 col-span-2">
                            <h4 className="text-sm font-medium text-gray-500">Eligibility Criteria</h4>
                            <div className="p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                                {admission.eligibility_criteria || 'N/A'}
                            </div>
                        </div>

                        <div className="space-y-1 col-span-2">
                            <h4 className="text-sm font-medium text-gray-500">Admission Process</h4>
                            <div className="p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                                {admission.admission_process || 'N/A'}
                            </div>
                        </div>

                        <div className="space-y-1 col-span-2">
                            <h4 className="text-sm font-medium text-gray-500">Fee Details</h4>
                            <div className="p-3 bg-gray-50 rounded border text-sm whitespace-pre-wrap">
                                {admission.fee_details || 'N/A'}
                            </div>
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

export default AdmissionViewModal
