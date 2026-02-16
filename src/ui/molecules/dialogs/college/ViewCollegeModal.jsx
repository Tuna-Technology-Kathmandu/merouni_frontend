import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from '@/ui/shadcn/dialog'
import { Globe, MapPin } from 'lucide-react'

const ViewCollegeModal = ({
    viewModalOpen,
    handleCloseViewModal,
    loadingView,
    viewCollegeData
}) => {
    return (
        <Dialog
            isOpen={viewModalOpen}
            onClose={handleCloseViewModal}
            className='max-w-7xl'
        >
            <DialogContent className='max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>College Details</DialogTitle>
                    <DialogClose onClick={handleCloseViewModal} />
                </DialogHeader>
                {loadingView ? (
                    <div className='flex items-center justify-center py-8'>
                        <div className='text-gray-500'>Loading...</div>
                    </div>
                ) : viewCollegeData ? (
                    <div className='space-y-6'>
                        {/* Logo and Basic Info */}
                        <div className='flex items-start gap-4 border-b pb-4 mt-4'>
                            {viewCollegeData.college_logo && (
                                <img
                                    src={viewCollegeData.college_logo}
                                    alt={viewCollegeData.name}
                                    className='w-20 h-20 object-contain rounded-lg border'
                                />
                            )}
                            <div className='flex-1'>
                                <h2 className='text-2xl font-bold text-gray-800'>
                                    {viewCollegeData.name}
                                </h2>
                                {viewCollegeData.institute_type && (
                                    <span className='inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800'>
                                        {viewCollegeData.institute_type}
                                    </span>
                                )}
                                {viewCollegeData.website_url && (
                                    <div className='mt-2'>
                                        <a
                                            href={
                                                viewCollegeData.website_url.startsWith('http')
                                                    ? viewCollegeData.website_url
                                                    : `https://${viewCollegeData.website_url}`
                                            }
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-blue-600 hover:underline inline-flex items-center gap-1'
                                        >
                                            <Globe className='w-4 h-4' />{' '}
                                            {viewCollegeData.website_url}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        {viewCollegeData.collegeAddress && (
                            <div>
                                <h3 className='text-lg font-semibold mb-2'>Address</h3>
                                <div className='text-gray-700 space-y-1'>
                                    {viewCollegeData.collegeAddress.street && (
                                        <p>{viewCollegeData.collegeAddress.street}</p>
                                    )}
                                    <p>
                                        {[
                                            viewCollegeData.collegeAddress.city,
                                            viewCollegeData.collegeAddress.state,
                                            viewCollegeData.collegeAddress.country
                                        ]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                    {viewCollegeData.collegeAddress.postal_code && (
                                        <p>
                                            Postal Code:{' '}
                                            {viewCollegeData.collegeAddress.postal_code}
                                        </p>
                                    )}
                                    {viewCollegeData.google_map_url && (
                                        <a
                                            href={viewCollegeData.google_map_url}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                            className='text-blue-600 hover:underline inline-flex items-center gap-1 mt-2'
                                        >
                                            <MapPin className='w-4 h-4' /> View on Map
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contacts */}
                        {viewCollegeData.collegeContacts &&
                            viewCollegeData.collegeContacts.length > 0 && (
                                <div>
                                    <h3 className='text-lg font-semibold mb-2'>
                                        Contact Numbers
                                    </h3>
                                    <div className='space-y-1'>
                                        {viewCollegeData.collegeContacts.map((contact, index) => (
                                            <p key={index} className='text-gray-700'>
                                                {contact.contact_number}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* University */}
                        {viewCollegeData.university && (
                            <div>
                                <h3 className='text-lg font-semibold mb-2'>University</h3>
                                <p className='text-gray-700'>
                                    {viewCollegeData.university.fullname}
                                </p>
                            </div>
                        )}

                        {/* Programs */}
                        {viewCollegeData.collegeCourses &&
                            viewCollegeData.collegeCourses.length > 0 && (
                                <div>
                                    <h3 className='text-lg font-semibold mb-2'>Programs</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {viewCollegeData.collegeCourses.map((course, index) => (
                                            <span
                                                key={index}
                                                className='px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm'
                                            >
                                                {course.program?.title || 'N/A'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Description */}
                        {viewCollegeData.description && (
                            <div>
                                <h3 className='text-lg font-semibold mb-2'>Description</h3>
                                <p className='text-gray-700 whitespace-pre-wrap'>
                                    {viewCollegeData.description}
                                </p>
                            </div>
                        )}

                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

export default ViewCollegeModal
