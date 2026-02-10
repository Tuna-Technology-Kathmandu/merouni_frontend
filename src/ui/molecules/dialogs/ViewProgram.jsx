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
            <DialogHeader>
                <DialogTitle>Program Details</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
            <div className='overflow-y-auto flex-1 -m-6 p-6'>
                {viewLoading ? (
                    <div className='flex items-center justify-center py-12'>
                        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A6FA7]' />
                    </div>
                ) : viewProgram ? (
                    <div className='space-y-6'>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900 border-b pb-2 mb-2'>
                                {viewProgram.title}
                            </h3>
                            {viewProgram.code && (
                                <p className='text-sm text-gray-500'>
                                    Code: {viewProgram.code}
                                </p>
                            )}
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
                            {viewProgram.programfaculty?.title && (
                                <div>
                                    <span className='font-medium text-gray-500'>Faculty</span>
                                    <p className='text-gray-900'>
                                        {viewProgram.programfaculty.title}
                                    </p>
                                </div>
                            )}
                            {viewProgram.programlevel?.title && (
                                <div>
                                    <span className='font-medium text-gray-500'>Level</span>
                                    <p className='text-gray-900'>
                                        {viewProgram.programlevel.title}
                                    </p>
                                </div>
                            )}
                            {viewProgram.programdegree?.title && (
                                <div>
                                    <span className='font-medium text-gray-500'>Degree</span>
                                    <p className='text-gray-900'>
                                        {viewProgram.programdegree.title}
                                    </p>
                                </div>
                            )}
                            {viewProgram.duration && (
                                <div>
                                    <span className='font-medium text-gray-500'>Duration</span>
                                    <p className='text-gray-900'>{viewProgram.duration}</p>
                                </div>
                            )}
                            {viewProgram.credits != null && (
                                <div>
                                    <span className='font-medium text-gray-500'>Credits</span>
                                    <p className='text-gray-900'>{viewProgram.credits}</p>
                                </div>
                            )}
                            {viewProgram.fee && (
                                <div>
                                    <span className='font-medium text-gray-500'>Fee</span>
                                    <p className='text-gray-900'>{viewProgram.fee}</p>
                                </div>
                            )}
                            {viewProgram.delivery_type && (
                                <div>
                                    <span className='font-medium text-gray-500'>
                                        Delivery Type
                                    </span>
                                    <p className='text-gray-900'>{viewProgram.delivery_type}</p>
                                </div>
                            )}
                            {viewProgram.delivery_mode && (
                                <div>
                                    <span className='font-medium text-gray-500'>
                                        Delivery Mode
                                    </span>
                                    <p className='text-gray-900'>{viewProgram.delivery_mode}</p>
                                </div>
                            )}
                        </div>
                        {viewProgram.eligibility_criteria && (
                            <div>
                                <span className='block font-medium text-gray-500 text-sm mb-1'>
                                    Eligibility Criteria
                                </span>
                                <div
                                    className='text-gray-900 text-sm prose prose-sm max-w-none'
                                    dangerouslySetInnerHTML={{
                                        __html: viewProgram.eligibility_criteria
                                    }}
                                />
                            </div>
                        )}
                        {viewProgram.learning_outcomes && (
                            <div>
                                <span className='block font-medium text-gray-500 text-sm mb-1'>
                                    Learning Outcomes
                                </span>
                                <div
                                    className='text-gray-900 text-sm prose prose-sm max-w-none'
                                    dangerouslySetInnerHTML={{
                                        __html: viewProgram.learning_outcomes
                                    }}
                                />
                            </div>
                        )}
                        {viewProgram.syllabus?.length > 0 && (
                            <div>
                                <span className='block font-medium text-gray-500 text-sm mb-2'>
                                    Syllabus
                                </span>
                                <div className='border rounded-lg overflow-hidden'>
                                    <table className='w-full text-sm'>
                                        <thead className='bg-gray-50'>
                                            <tr>
                                                <th className='text-left p-2'>Year</th>
                                                <th className='text-left p-2'>Semester</th>
                                                <th className='text-left p-2'>Course</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewProgram.syllabus.map((s, i) => (
                                                <tr key={i} className='border-t'>
                                                    <td className='p-2'>{s.year}</td>
                                                    <td className='p-2'>{s.semester}</td>
                                                    <td className='p-2'>
                                                        {s.programCourse?.title ?? '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
            {!viewLoading && viewProgram && (
                <div className='flex justify-end gap-2 pt-4 border-t mt-4'>
                    <Button variant='outline' onClick={onClose}>
                        Close
                    </Button>
                </div>
            )}
            </DialogContent>
        </Dialog>
    )
}

export default ViewProgram
