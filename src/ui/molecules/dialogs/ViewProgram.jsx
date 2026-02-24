'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'

const ViewProgram = ({ isOpen, onClose, slug }) => {
    const [viewProgram, setViewProgram] = useState(null)
    const [viewLoading, setViewLoading] = useState(false)

    useEffect(() => {
        if (isOpen && slug) {
            handleView(slug)
        } else {
            setViewProgram(null)
        }
    }, [isOpen, slug])

    const handleView = async (slug) => {
        setViewLoading(true)
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/program/${slug}`
            )
            if (!response.ok) throw new Error('Failed to fetch program')
            const program = await response.json()
            setViewProgram(program)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load program details')
            onClose()
        } finally {
            setViewLoading(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-2xl'
        >
            <DialogContent className='max-w-2xl max-h-[90vh] flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Program Details</DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6'>
                    {viewLoading ? (
                        <div className='flex items-center justify-center py-16'>
                            <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#387cae]' />
                        </div>
                    ) : viewProgram ? (
                        <div className='space-y-6'>
                            {/* Title & Code */}
                            <div>
                                <h3 className='text-lg font-semibold text-gray-900 border-b pb-2 mb-2'>
                                    {viewProgram.title}
                                </h3>
                                {viewProgram.code && (
                                    <p className='text-sm text-gray-500'>
                                        Code: <span className='font-medium text-gray-700'>{viewProgram.code}</span>
                                    </p>
                                )}
                            </div>

                            {/* Key Details Grid */}
                            <section className='space-y-3'>
                                <h4 className='text-sm font-semibold text-slate-700 border-b pb-1'>Overview</h4>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                                    {viewProgram.programfaculty?.title && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Faculty</span>
                                            <p className='text-gray-900'>{viewProgram.programfaculty.title}</p>
                                        </div>
                                    )}
                                    {viewProgram.programlevel?.title && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Level</span>
                                            <p className='text-gray-900'>{viewProgram.programlevel.title}</p>
                                        </div>
                                    )}
                                    {viewProgram.programdegree?.title && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Degree</span>
                                            <p className='text-gray-900'>{viewProgram.programdegree.title}</p>
                                        </div>
                                    )}
                                    {viewProgram.duration && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Duration</span>
                                            <p className='text-gray-900'>{viewProgram.duration}</p>
                                        </div>
                                    )}
                                    {viewProgram.credits != null && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Credits</span>
                                            <p className='text-gray-900'>{viewProgram.credits}</p>
                                        </div>
                                    )}
                                    {viewProgram.fee && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Fee</span>
                                            <p className='text-gray-900'>{viewProgram.fee}</p>
                                        </div>
                                    )}
                                    {viewProgram.delivery_type && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Delivery Type</span>
                                            <p className='text-gray-900'>{viewProgram.delivery_type}</p>
                                        </div>
                                    )}
                                    {viewProgram.delivery_mode && (
                                        <div className='space-y-0.5'>
                                            <span className='font-medium text-gray-500 text-xs uppercase tracking-wide'>Delivery Mode</span>
                                            <p className='text-gray-900'>{viewProgram.delivery_mode}</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Rich Text Fields */}
                            {viewProgram.eligibility_criteria && (
                                <section className='space-y-2'>
                                    <h4 className='text-sm font-semibold text-slate-700 border-b pb-1'>Eligibility Criteria</h4>
                                    <div
                                        className='text-gray-700 text-sm prose prose-sm max-w-none'
                                        dangerouslySetInnerHTML={{ __html: viewProgram.eligibility_criteria }}
                                    />
                                </section>
                            )}

                            {viewProgram.learning_outcomes && (
                                <section className='space-y-2'>
                                    <h4 className='text-sm font-semibold text-slate-700 border-b pb-1'>Learning Outcomes</h4>
                                    <div
                                        className='text-gray-700 text-sm prose prose-sm max-w-none'
                                        dangerouslySetInnerHTML={{ __html: viewProgram.learning_outcomes }}
                                    />
                                </section>
                            )}

                            {/* Syllabus */}
                            {viewProgram.syllabus?.length > 0 && (
                                <section className='space-y-2'>
                                    <h4 className='text-sm font-semibold text-slate-700 border-b pb-1'>Syllabus</h4>
                                    <div className='border rounded-lg overflow-hidden'>
                                        <table className='w-full text-sm'>
                                            <thead className='bg-gray-50 border-b'>
                                                <tr>
                                                    <th className='text-left p-2.5 text-gray-500 font-medium'>Year</th>
                                                    <th className='text-left p-2.5 text-gray-500 font-medium'>Semester</th>
                                                    <th className='text-left p-2.5 text-gray-500 font-medium'>Course</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {viewProgram.syllabus.map((s, i) => (
                                                    <tr key={i} className='border-t hover:bg-gray-50'>
                                                        <td className='p-2.5 text-gray-700'>{s.year}</td>
                                                        <td className='p-2.5 text-gray-700'>{s.semester}</td>
                                                        <td className='p-2.5 text-gray-900 font-medium'>
                                                            {s.programCourse?.title ?? '—'}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Sticky Footer */}
                <div className='sticky bottom-0 bg-white border-t p-4 px-6 flex justify-end gap-3'>
                    <Button variant='outline' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ViewProgram
