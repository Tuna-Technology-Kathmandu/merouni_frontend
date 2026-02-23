'use client'
import React, { useState, useEffect } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Globe, MapPin, Phone, Mail, GraduationCap, Info } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { toast } from 'react-toastify'
import { Button } from '@/ui/shadcn/button'

export default function ViewConsultancy({ isOpen, onClose, slug }) {
    const [consultancy, setConsultancy] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && slug) {
            fetchConsultancyDetails()
        } else {
            setConsultancy(null)
        }
    }, [isOpen, slug])

    const fetchConsultancyDetails = async () => {
        setLoading(true)
        try {
            const response = await authFetch(
                `${process.env.baseUrl}/consultancy/${slug}`,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (!response.ok) throw new Error('Failed to fetch details')

            const data = await response.json()
            setConsultancy(data.consultancy)
        } catch (err) {
            toast.error('Failed to load consultancy details')
            onClose()
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-4xl'
        >
            <DialogContent className='max-w-4xl max-h-[90vh] flex flex-col p-0'>
                <DialogHeader className='px-6 py-4 border-b'>
                    <DialogTitle className="text-lg font-semibold text-gray-900">Consultancy Details</DialogTitle>
                    <DialogClose onClick={onClose} />
                </DialogHeader>

                <div className='flex-1 overflow-y-auto p-6 space-y-8'>
                    {loading ? (
                        <div className='flex items-center justify-center py-20'>
                            <div className='animate-pulse text-gray-400 font-medium'>Loading details...</div>
                        </div>
                    ) : consultancy ? (
                        <>
                            {/* Header Section */}
                            <div className='flex flex-col md:flex-row gap-6 items-start'>
                                {consultancy.logo && (
                                    <div className='w-24 h-24 rounded-xl border bg-white p-2 flex items-center justify-center shrink-0'>
                                        <img
                                            src={consultancy.logo}
                                            alt={consultancy.title}
                                            className='w-full h-full object-contain'
                                        />
                                    </div>
                                )}
                                <div className='space-y-2 flex-1'>
                                    <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>
                                        {consultancy.title}
                                    </h2>
                                    <div className='flex flex-wrap gap-4'>
                                        {consultancy.website_url && (
                                            <a
                                                href={consultancy.website_url.startsWith('http') ? consultancy.website_url : `https://${consultancy.website_url}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-[#387cae] hover:underline flex items-center gap-1.5 text-sm font-medium'
                                            >
                                                <Globe className='w-4 h-4' />
                                                Website
                                            </a>
                                        )}
                                        {consultancy.google_map_url && (
                                            <a
                                                href={consultancy.google_map_url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-gray-500 hover:text-gray-900 flex items-center gap-1.5 text-sm font-medium transition-colors'
                                            >
                                                <MapPin className='w-4 h-4' />
                                                Location
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className='px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500'>
                                    {consultancy.pinned === 1 ? 'Pinned' : 'Standard'}
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                {/* Address & Contact */}
                                <div className='space-y-6'>
                                    <div className='space-y-3'>
                                        <h4 className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                            <MapPin className='w-3 h-3' />
                                            Office Address
                                        </h4>
                                        <div className='p-4 bg-gray-50 rounded-xl border text-sm text-gray-700 leading-relaxed font-medium'>
                                            {(() => {
                                                const addr = typeof consultancy.address === 'string' ? JSON.parse(consultancy.address) : consultancy.address || {}
                                                return (
                                                    <div className='space-y-1'>
                                                        {addr.street && <p>{addr.street}</p>}
                                                        <p>{[addr.city, addr.state, addr.zip].filter(Boolean).join(', ')}</p>
                                                    </div>
                                                )
                                            })()}
                                        </div>
                                    </div>

                                    <div className='space-y-3'>
                                        <h4 className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                            <Phone className='w-3 h-3' />
                                            Contact Information
                                        </h4>
                                        <div className='p-4 bg-gray-50 rounded-xl border space-y-2'>
                                            {(() => {
                                                const contacts = typeof consultancy.contact === 'string' ? JSON.parse(consultancy.contact) : consultancy.contact || []
                                                return contacts.filter(Boolean).map((c, i) => (
                                                    <p key={i} className='text-sm text-gray-700 font-medium flex items-center gap-2'>
                                                        <span className='w-1.5 h-1.5 rounded-full bg-[#387cae]' />
                                                        {c}
                                                    </p>
                                                ))
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {/* Destinations & Courses */}
                                <div className='space-y-6'>
                                    <div className='space-y-3'>
                                        <h4 className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                            <Globe className='w-3 h-3' />
                                            Target Countries
                                        </h4>
                                        <div className='flex flex-wrap gap-2'>
                                            {(() => {
                                                const dests = typeof consultancy.destination === 'string' ? JSON.parse(consultancy.destination) : consultancy.destination || []
                                                return dests.map((d, i) => (
                                                    <span key={i} className='px-3 py-1.5 bg-gray-100 border text-gray-700 rounded-lg text-xs font-bold uppercase'>
                                                        {typeof d === 'string' ? d : d.country}
                                                    </span>
                                                ))
                                            })()}
                                        </div>
                                    </div>

                                    <div className='space-y-3'>
                                        <h4 className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                            <GraduationCap className='w-3 h-3' />
                                            Courses Offered
                                        </h4>
                                        <div className='flex flex-wrap gap-2'>
                                            {consultancy.consultancyCourses?.map((course, i) => (
                                                <span key={i} className='px-3 py-1.5 bg-blue-50/50 border border-blue-100 text-[#387cae] rounded-lg text-xs font-bold'>
                                                    {course.title}
                                                </span>
                                            ))}
                                            {(!consultancy.consultancyCourses || consultancy.consultancyCourses.length === 0) && (
                                                <p className='text-xs text-gray-400 italic font-medium'>No courses listed.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className='col-span-1 md:col-span-2 space-y-3'>
                                    <h4 className='text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2'>
                                        <Info className='w-3 h-3' />
                                        About Consultancy
                                    </h4>
                                    <div className='p-6 bg-white rounded-xl border shadow-sm prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-strong:text-gray-900'
                                        dangerouslySetInnerHTML={{ __html: consultancy.description || '<p class="italic text-gray-400">No description available.</p>' }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                <div className='p-4 border-t flex justify-end'>
                    <Button variant='outline' onClick={onClose}>Close Details</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
