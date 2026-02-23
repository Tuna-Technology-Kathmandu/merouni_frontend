'use client'

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'

export default function ViewDegree({ isOpen, onClose, degree }) {
    if (!degree) return null

    return (
        <Dialog isOpen={isOpen} onClose={onClose} className="max-w-2xl">
            <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Degree Details</DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6 space-y-4'>
                    {/* Cover Image */}
                    {degree.featured_image && (
                        <div className="w-full h-52 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                            <img src={degree.featured_image} alt={degree.title} className="w-full h-full object-contain" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Title</p>
                            <p className="text-base font-bold text-gray-900">{degree.title}</p>
                        </div>

                        {degree.short_name && (
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Short Name</p>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold uppercase">{degree.short_name}</span>
                            </div>
                        )}

                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-0.5">Created At</p>
                            <p className="text-sm text-gray-600">{degree.createdAt ? formatDate(degree.createdAt) : '—'}</p>
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {degree.description || 'No description provided.'}
                        </p>
                    </div>

                    {degree.content && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Content</p>
                            <div
                                className="text-gray-700 text-sm prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: degree.content }}
                            />
                        </div>
                    )}
                </div>

                <div className='px-6 py-4 border-t flex justify-end'>
                    <Button variant='outline' onClick={onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
