import React from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'

const UniversityViewModal = ({ isOpen, onClose, data, loading }) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-4xl'
        >
            <DialogHeader>
                <DialogTitle>University Details</DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent>
            {loading ? (
                <div className='flex items-center justify-center py-8'>
                    <div className='text-gray-500'>Loading...</div>
                </div>
            ) : data ? (
                <div className='space-y-6 overflow-y-auto p-1'>
                    {/* Logo and Basic Info */}
                    <div className='flex items-start gap-4 border-b pb-4'>
                        {data.featured_image && (
                            <img
                                src={data.featured_image}
                                alt={data.fullname}
                                className='w-20 h-20 object-contain rounded-lg border'
                            />
                        )}
                        <div className='flex-1'>
                            <h2 className='text-2xl font-bold text-gray-800'>
                                {data.fullname}
                            </h2>
                            {data.type_of_institute && (
                                <span className='inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800'>
                                    {data.type_of_institute}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Address */}
                    {(data.city || data.state || data.country) && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Address</h3>
                            <div className='text-gray-700 space-y-1'>
                                {data.street && <p>{data.street}</p>}
                                <p>
                                    {[data.city, data.state, data.country]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                                {data.postal_code && <p>Postal Code: {data.postal_code}</p>}
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    {data.contact && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>
                                Contact Information
                            </h3>
                            <div className='text-gray-700 space-y-1'>
                                {data.contact.phone_number && (
                                    <p>Phone: {data.contact.phone_number}</p>
                                )}
                                {data.contact.email && <p>Email: {data.contact.email}</p>}
                                {data.contact.faxes && <p>Fax: {data.contact.faxes}</p>}
                                {data.contact.poboxes && (
                                    <p>P.O. Box: {data.contact.poboxes}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Date of Establishment */}
                    {data.date_of_establish && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>
                                Date of Establishment
                            </h3>
                            <p className='text-gray-700'>
                                {formatDate(data.date_of_establish)}
                            </p>
                        </div>
                    )}

                    {/* Programs */}
                    {data.programs && data.programs.length > 0 && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Programs</h3>
                            <div className='flex flex-wrap gap-2'>
                                {data.programs.map((program, index) => (
                                    <span
                                        key={index}
                                        className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                                    >
                                        {typeof program === 'string'
                                            ? program
                                            : program.program?.title || 'N/A'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Levels */}
                    {data.levels && data.levels.length > 0 && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Levels</h3>
                            <div className='flex flex-wrap gap-2'>
                                {data.levels.map((level, index) => (
                                    <span
                                        key={index}
                                        className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                                    >
                                        {level}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {data.description && (
                        <div>
                            <h3 className='text-lg font-semibold mb-2'>Description</h3>
                            <div
                                className='text-gray-700 prose max-w-none'
                                dangerouslySetInnerHTML={{
                                    __html: data.description
                                }}
                            />
                        </div>
                    )}
                </div>
            ) : null}
            <div className='sticky bottom-0 bg-white border-t pt-4 pb-2 mt-4 flex justify-end gap-2'>
                <Button
                    onClick={onClose}
                    variant='outline'
                >
                    Close
                </Button>
            </div>
            </DialogContent>
        </Dialog>
    )
}

export default UniversityViewModal
