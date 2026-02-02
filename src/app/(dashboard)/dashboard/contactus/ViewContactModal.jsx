'use client'

import { Modal } from '@/ui/molecules/Modal'
import { Button } from '@/ui/shadcn/button'

export default function ViewContactModal({ isOpen, onClose, contact }) {
    if (!contact) return null

    const getStatusColor = (currentStatus) => {
        switch (currentStatus) {
            case 'new': return 'bg-blue-100 text-blue-800'
            case 'in_progress': return 'bg-yellow-100 text-yellow-800'
            case 'resolved': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const status = contact.status || 'new'

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Contact Details"
            className="max-w-2xl"
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-500">Full Name</label>
                        <p className="text-lg font-medium text-gray-900">{contact.fullname || contact.fullName}</p>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-500">Email</label>
                        <p className="text-lg font-medium text-gray-900">{contact.email}</p>
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-semibold text-gray-500">Subject</label>
                        <p className="text-lg font-medium text-gray-900">{contact.subject}</p>
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="text-sm font-semibold text-gray-500 mb-2 block">Message</label>
                    <div className="bg-gray-50 p-4 rounded-lg border text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {contact.message}
                    </div>
                </div>

                {/* Status Display */}
                <div className="flex items-center justify-start border-t pt-4 mt-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-500 mr-3">Current Status:</label>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(status)}`}>
                            {status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={onClose} variant="outline">Close</Button>
                </div>
            </div>
        </Modal>
    )
}
