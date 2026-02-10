'use client'

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'

export default function ViewFaculty({ isOpen, onClose, faculty }) {
    if (!faculty) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className="max-w-2xl"
        >
            <DialogHeader>
                <DialogTitle>Faculty Details</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
            <div className="p-1 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Title</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{faculty.title}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <div className="mt-1 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                            {faculty.description || "No description provided."}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Author</h3>
                        <p className="mt-1 text-gray-900">
                            {faculty.authorDetails
                                ? `${faculty.authorDetails.firstName} ${faculty.authorDetails.lastName}`
                                : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t mt-6">
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
            </DialogContent>
        </Dialog>
    )
}
