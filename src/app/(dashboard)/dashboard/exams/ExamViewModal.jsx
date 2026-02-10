import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { formatDate } from '@/utils/date.util'

const ExamViewModal = ({ isOpen, onClose, exam }) => {
    if (!exam) return null

    const examDetail = exam.exam_details?.[0] || {}
    const appDetail = exam.application_details?.[0] || {}

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-4xl"
        >
            <DialogHeader>
                <DialogTitle>Exam Details</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
                <div className="space-y-6 max-h-[70vh] pr-2">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Title</h4>
                            <p className="text-base text-gray-900">{exam.title}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Level</h4>
                            <p className="text-base text-gray-900">{exam.level?.title || 'N/A'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Affiliation</h4>
                            <p className="text-base text-gray-900">{exam.university?.fullname || 'N/A'}</p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                            <p className="text-base text-gray-900">{exam.createdAt ? formatDate(exam.createdAt) : 'N/A'}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                        <div
                            className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-md border"
                            dangerouslySetInnerHTML={{ __html: exam.description || 'No description available.' }}
                        />
                    </div>

                    {/* Syllabus & Past Questions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Syllabus</h4>
                            <div className="bg-gray-50 p-3 rounded-md border min-h-[60px] text-sm whitespace-pre-wrap">
                                {exam.syllabus || 'No syllabus provided.'}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Past Questions</h4>
                            {exam.pastQuestion ? (
                                <a
                                    href={exam.pastQuestion}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                >
                                    {exam.pastQuestion}
                                </a>
                            ) : (
                                <p className="text-gray-500 text-sm">No past question URL provided.</p>
                            )}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">Exam Configuration</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Exam Type</h4>
                                <p className="font-medium">{examDetail.exam_type || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Question Type</h4>
                                <p className="font-medium">{examDetail.question_type || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                                <p className="font-medium">{examDetail.duration || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Full Marks</h4>
                                <p className="font-medium">{examDetail.full_marks || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Pass Marks</h4>
                                <p className="font-medium">{examDetail.pass_marks || 'N/A'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">No. of Questions</h4>
                                <p className="font-medium">{examDetail.number_of_question || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                                <h4 className="font-semibold text-blue-800">Fees</h4>
                                <div className="flex justify-between text-sm">
                                    <span>Normal Fee:</span>
                                    <span className="font-medium">Rs. {appDetail.normal_fee || '0'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Late Fee:</span>
                                    <span className="font-medium">Rs. {appDetail.late_fee || '0'}</span>
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg space-y-2">
                                <h4 className="font-semibold text-green-800">Important Dates</h4>
                                <div className="flex justify-between text-sm">
                                    <span>Opening Date:</span>
                                    <span className="font-medium">{appDetail.opening_date ? formatDate(appDetail.opening_date) : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Closing Date:</span>
                                    <span className="font-medium">{appDetail.closing_date ? formatDate(appDetail.closing_date) : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-sm border-t border-green-200 pt-1 mt-1">
                                    <span className="font-semibold">Exam Date:</span>
                                    <span className="font-bold">{appDetail.exam_date ? formatDate(appDetail.exam_date) : 'N/A'}</span>
                                </div>
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

export default ExamViewModal
