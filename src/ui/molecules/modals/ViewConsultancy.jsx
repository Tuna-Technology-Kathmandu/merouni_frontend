'use client'
import { useState, useEffect } from 'react'
import { Modal } from '@/ui/molecules/Modal'
import { Globe, MapPin } from 'lucide-react'
import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'
import { toast } from 'react-toastify'

export default function ViewConsultancy({ isOpen, onClose, slug }) {
    const [consultancy, setConsultancy] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen && slug) {
            fetchConsultancyDetails()
        } else {
            setConsultancy(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, slug])

    const fetchConsultancyDetails = async () => {
        setLoading(true)
        try {
            const response = await authFetch(
                `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy/${slug}`,
                { headers: { 'Content-Type': 'application/json' } }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch consultancy details')
            }

            const data = await response.json()
            setConsultancy(data.consultancy)
        } catch (err) {
            toast.error(err.message || 'Failed to load consultancy details')
            onClose()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Consultancy Details'
            className='max-w-4xl max-h-[90vh] overflow-y-auto'
        >
            {loading ? (
                <div className='flex items-center justify-center py-8'>
                    <div className='text-gray-500'>Loading...</div>
                </div>
            ) : consultancy ? (
                <div className='space-y-6'>
                    {/* Logo and Basic Info */}
                    <div className='flex items-start gap-4 border-b pb-4'>
                        {consultancy.logo && (
                            <img
                                src={consultancy.logo}
                                alt={consultancy.title}
                                className='w-20 h-20 object-contain rounded-lg border'
                            />
                        )}
                        <div className='flex-1'>
                            <h2 className='text-2xl font-bold text-gray-800'>
                                {consultancy.title}
                            </h2>
                            {consultancy.website_url && (
                                <div className='mt-2'>
                                    <a
                                        href={
                                            consultancy.website_url.startsWith('http')
                                                ? consultancy.website_url
                                                : `https://${consultancy.website_url}`
                                        }
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-blue-600 hover:underline inline-flex items-center gap-1'
                                    >
                                        <Globe className='w-4 h-4' />{' '}
                                        {consultancy.website_url}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    {consultancy.address && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Address</h3>
                            <div className='text-gray-700 space-y-1'>
                                {(() => {
                                    const address =
                                        typeof consultancy.address === 'string'
                                            ? JSON.parse(consultancy.address)
                                            : consultancy.address || {}
                                    return (
                                        <>
                                            {address.street && <p>{address.street}</p>}
                                            <p>
                                                {[address.city, address.state, address.zip]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                            </p>
                                            {consultancy.google_map_url && (
                                                <a
                                                    href={consultancy.google_map_url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-blue-600 hover:underline inline-flex items-center gap-1 mt-2'
                                                >
                                                    <MapPin className='w-4 h-4' /> View on Map
                                                </a>
                                            )}
                                        </>
                                    )
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    {consultancy.contact && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>
                                Contact Information
                            </h3>
                            <div className='space-y-1'>
                                {(() => {
                                    const contacts =
                                        typeof consultancy.contact === 'string'
                                            ? JSON.parse(consultancy.contact)
                                            : Array.isArray(consultancy.contact)
                                                ? consultancy.contact
                                                : []
                                    return contacts.map(
                                        (contact, index) =>
                                            contact && (
                                                <p key={index} className='text-gray-700'>
                                                    {contact}
                                                </p>
                                            )
                                    )
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Destinations */}
                    {consultancy.destination && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Destinations</h3>
                            <div className='flex flex-wrap gap-2'>
                                {(() => {
                                    const destinations =
                                        typeof consultancy.destination === 'string'
                                            ? JSON.parse(consultancy.destination)
                                            : consultancy.destination || []
                                    return destinations.map((dest, index) => (
                                        <span
                                            key={index}
                                            className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                                        >
                                            {typeof dest === 'string'
                                                ? dest
                                                : dest?.country || 'N/A'}
                                        </span>
                                    ))
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Courses/Programs */}
                    {consultancy.consultancyCourses &&
                        consultancy.consultancyCourses.length > 0 && (
                            <div>
                                <h3 className='text-lg font-semibold mb-2'>Courses</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {consultancy.consultancyCourses.map(
                                        (course, index) => (
                                            <span
                                                key={index}
                                                className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                                            >
                                                {course.title || 'N/A'}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Description */}
                    {consultancy.description && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Description</h3>
                            <div
                                className='text-gray-700 prose max-w-none'
                                dangerouslySetInnerHTML={{
                                    __html: consultancy.description
                                }}
                            />
                        </div>
                    )}

                    {/* Status */}
                    <div className='flex gap-4 pt-4 border-t'>
                        <div>
                            <span className='text-sm font-medium text-gray-700'>
                                Pinned:{' '}
                            </span>
                            <span className='text-sm text-gray-600'>
                                {consultancy.pinned === 1 ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    )
}
