import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/ui/shadcn/dialog'
import { FileText, Mail, Phone, User, Calendar } from 'lucide-react'
import { formatRelativeWithTitle } from '@/utils/date.util'
import { Button } from '@/ui/shadcn/button'

export default function StudentDetailsModal({ isOpen, onClose, student }) {
  if (!student) return null

  const firstName = student.firstName || ''
  const lastName = student.lastName || ''
  const fullName = `${firstName} ${lastName}`.trim() || 'N/A'
  const { label: joinedDate } = formatRelativeWithTitle(student.createdAt)

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogContent className='max-w-md p-0 overflow-hidden bg-white'>
        <DialogHeader className='px-6 py-4 border-b bg-gray-50/50 shrink-0'>
          <div className='flex items-center justify-between w-full'>
            <DialogTitle className='text-lg font-semibold text-gray-900 flex items-center gap-2'>
              <User className='w-5 h-5 text-[#387cae]' />
              Student Details
            </DialogTitle>
            <DialogClose onClick={onClose} />
          </div>
        </DialogHeader>

        <div className='p-6 space-y-6'>
          {/* Profile Header */}
          <div className='flex items-center gap-4'>
            <div className='h-16 w-16 rounded-full bg-[#387cae]/10 flex items-center justify-center border border-[#387cae]/20 text-[#387cae] text-2xl font-bold uppercase shrink-0'>
              {firstName?.[0] || 'U'}
            </div>
            <div>
              <h3 className='text-xl font-bold text-gray-900'>{fullName}</h3>
              <p className='text-sm font-medium text-[#387cae] bg-[#387cae]/10 inline-block px-2.5 py-0.5 rounded-full mt-1'>
                Student
              </p>
            </div>
          </div>

          <div className='bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4'>
            <div className='flex items-center gap-3 text-gray-600'>
              <Mail className='w-4 h-4 text-gray-400 shrink-0' />
              <span className='text-sm font-medium'>{student.email || 'N/A'}</span>
            </div>
            <div className='flex items-center gap-3 text-gray-600'>
              <Phone className='w-4 h-4 text-gray-400 shrink-0' />
              <span className='text-sm font-medium'>{student.phoneNo || 'N/A'}</span>
            </div>
            <div className='flex items-center gap-3 text-gray-600'>
              <Calendar className='w-4 h-4 text-gray-400 shrink-0' />
              <span className='text-sm font-medium'>Joined {joinedDate}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <h4 className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
              <FileText className='w-4 h-4 text-gray-500' />
              Uploaded CV
            </h4>
            {student.cvUrl ? (
              <div className='flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg'>
                <div className='flex items-center gap-3 overflow-hidden'>
                  <div className='p-2 bg-white rounded shadow-sm shrink-0'>
                    <FileText className='w-5 h-5 text-blue-600' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium text-blue-900 truncate'>Resume_Document.pdf</p>
                    <p className='text-xs text-blue-600'>Tap to view file</p>
                  </div>
                </div>
                <Button 
                  onClick={() => window.open(student.cvUrl, '_blank')}
                  className='bg-blue-600 hover:bg-blue-700 text-white shadow-sm shrink-0 ml-4'
                  size='sm'
                >
                  View CV
                </Button>
              </div>
            ) : (
              <div className='p-4 bg-gray-50 border border-gray-200 border-dashed rounded-lg text-center flex flex-col items-center justify-center gap-2'>
                <div className='p-2 bg-white rounded-full shadow-sm'>
                  <FileText className='w-5 h-5 text-gray-400' />
                </div>
                <p className='text-sm font-medium text-gray-500'>No CV uploaded yet</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
