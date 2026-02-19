import React from 'react'
import { FaUser, FaPhoneAlt, FaBriefcase } from 'react-icons/fa'

const MemberSection = ({ validMembers }) => {
  if (!validMembers || validMembers.length === 0) {
    return null
  }

  return (
    <div className='bg-white rounded-xl border p-6'>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>Our Team</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6'>
        {validMembers.map((member, index) => (
          <div
            key={index}
            className='group bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300'
          >
            {/* Member Name */}
            {member.name?.trim() && (
              <div className='flex items-center gap-4 mb-5 pb-4 border-b border-gray-200'>
                <div className='flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center group-hover:bg-[#30AD8F]/20 transition-colors border border-gray-100'>
                  <FaUser className='w-5 h-5 text-[#30AD8F]' />
                </div>
                <h3 className='text-base font-semibold text-gray-900 leading-tight'>
                  {member.name}
                </h3>
              </div>
            )}

            <div className='space-y-4'>
              {/* Role */}
              {member.role?.trim() && (
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-xl bg-white flex items-center justify-center mt-0.5 border border-gray-100'>
                    <FaBriefcase className='w-3.5 h-3.5 text-gray-400' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 uppercase tracking-wider font-medium'>
                      Role
                    </p>
                    <p className='text-sm text-gray-600 mt-0.5'>
                      {member.role}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Number */}
              {member.contact_number?.trim() && (
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-xl bg-white flex items-center justify-center mt-0.5 border border-gray-100'>
                    <FaPhoneAlt className='w-3.5 h-3.5 text-orange-400' />
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 uppercase tracking-wider font-medium'>
                      Contact
                    </p>
                    <a
                      href={`tel:${member.contact_number}`}
                      className='text-sm text-[#0A6FA7] mt-0.5 block hover:underline transition-all'
                    >
                      {member.contact_number}
                    </a>
                  </div>
                </div>
              )}

              {/* Description */}
              {member.description?.trim() && (
                <div className='pt-2 mt-2 border-t border-gray-200/50'>
                  <p className='text-xs md:text-sm text-gray-500 leading-relaxed italic'>
                    "{member.description}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemberSection
