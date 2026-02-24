import React from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'
import { Button } from '@/ui/shadcn/button'
import { formatDate } from '@/utils/date.util'
import {
    GraduationCap,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Layers,
    FileText,
    Activity,
    Users,
    Globe
} from 'lucide-react'
import { cn } from '@/app/lib/utils'

const InfoRow = ({ icon: Icon, label, value }) => {
    if (!value) return null
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100/50">
            <div className="w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#387cae] shrink-0">
                <Icon size={18} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-semibold text-gray-700">{value}</span>
            </div>
        </div>
    )
}

const UniversityViewModal = ({ isOpen, onClose, data, loading }) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className='max-w-5xl'
        >
            <DialogHeader className="bg-white border-b border-gray-100 p-6">
                <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="text-[#387cae]" size={24} />
                    University Details
                </DialogTitle>
                <DialogClose onClick={onClose} />
            </DialogHeader>
            <DialogContent className="p-0 bg-white">
                <div className='max-h-[calc(100vh-200px)] overflow-y-auto'>
                    {loading ? (
                        <div className='flex flex-col items-center justify-center py-20 gap-4'>
                            <div className="w-10 h-10 border-4 border-[#387cae]/10 border-t-[#387cae] rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-gray-500">Loading university details...</p>
                        </div>
                    ) : data ? (
                        <div className='p-8 space-y-8'>
                            {/* Header Section */}
                            <div className='flex flex-col md:flex-row gap-6 items-start'>
                                <div className='w-32 h-32 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-3 shrink-0 overflow-hidden shadow-sm'>
                                    {data.logo ? (
                                        <img
                                            src={data.logo}
                                            alt={data.fullname}
                                            className='w-full h-full object-contain'
                                        />
                                    ) : (
                                        <GraduationCap className='w-12 h-12 text-gray-200' />
                                    )}
                                </div>
                                <div className='flex-1 space-y-4'>
                                    <div>
                                        <h2 className='text-3xl font-black text-gray-900 leading-tight'>
                                            {data.fullname}
                                        </h2>
                                        <div className='flex flex-wrap gap-2 mt-3'>
                                            {data.type_of_institute && (
                                                <span className={cn(
                                                    'px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider border',
                                                    data.type_of_institute === 'Public'
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : 'bg-blue-50 text-blue-600 border-blue-100'
                                                )}>
                                                    {data.type_of_institute} Institute
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                                        <InfoRow icon={MapPin} label="Location" value={[data.city, data.state, data.country].filter(Boolean).join(', ')} />
                                        <InfoRow icon={Calendar} label="Established" value={data.date_of_establish ? formatDate(data.date_of_establish) : null} />
                                        <InfoRow icon={Globe} label="Postal Code" value={data.postal_code} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Side - Content & Lists */}
                                <div className="space-y-8">
                                    {/* Description */}
                                    {data.description && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                <FileText size={18} className="text-[#387cae]" />
                                                <h3>About University</h3>
                                            </div>
                                            <div
                                                className='text-gray-600 prose prose-sm max-w-none leading-relaxed'
                                                dangerouslySetInnerHTML={{
                                                    __html: data.description
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Programs */}
                                    {data.programs && data.programs.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                <Activity size={18} className="text-[#387cae]" />
                                                <h3>Available Programs</h3>
                                            </div>
                                            <div className='flex flex-wrap gap-2'>
                                                {data.programs.map((program, index) => (
                                                    <span
                                                        key={index}
                                                        className='px-3 py-1.5 bg-[#387cae]/5 text-[#387cae] rounded-lg text-xs font-bold border border-[#387cae]/10'
                                                    >
                                                        {typeof program === 'string'
                                                            ? program
                                                            : program.program?.title || 'N/A'}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Side - Contact & Members */}
                                <div className="space-y-8">
                                    {/* Contact Info */}
                                    {data.contact && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                <Phone size={18} className="text-[#387cae]" />
                                                <h3>Contact Details</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3">
                                                <InfoRow icon={Mail} label="Email Address" value={data.contact.email} />
                                                <InfoRow icon={Phone} label="Phone Number" value={data.contact.phone_number} />
                                                <InfoRow icon={Globe} label="Fax/PO Box" value={[data.contact.faxes, data.contact.poboxes].filter(Boolean).join(' / ')} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Members */}
                                    {data.members && data.members.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                <Users size={18} className="text-[#387cae]" />
                                                <h3>Key Leadership</h3>
                                            </div>
                                            <div className='space-y-3'>
                                                {data.members.map((member, index) => (
                                                    <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-bold text-[#387cae] uppercase tracking-wider">{member.role}</p>
                                                            <p className="text-sm font-bold text-gray-800">{member.salutation} {member.name}</p>
                                                            <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 font-medium">
                                                                {member.email && <span className="flex items-center gap-1"><Mail size={10} /> {member.email}</span>}
                                                                {member.phone && <span className="flex items-center gap-1"><Phone size={10} /> {member.phone}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-400">No data available</div>
                    )}
                </div>

                <div className='p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3'>
                    <Button
                        onClick={onClose}
                        className="bg-white hover:bg-gray-100 text-gray-700 border-gray-200 font-bold px-8 h-11 rounded-xl shadow-sm transition-all"
                        variant='outline'
                    >
                        Close Details
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UniversityViewModal
