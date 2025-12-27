import React from 'react'
import { FaUser, FaPhoneAlt, FaBriefcase } from 'react-icons/fa'

const MemberSection = ({ validMembers }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold mb-4 md:mb-5'>
        Members
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
        {validMembers.map((member, index) => (
          <div
            key={index}
            className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3 md:p-4'
          >
            {/* Member Name */}
            {member.name?.trim() && (
              <div className='flex items-center gap-2 mb-3 pb-2 border-b border-gray-100'>
                <div className='flex-shrink-0 w-8 h-8 rounded-full bg-[#30AD8F] bg-opacity-10 flex items-center justify-center'>
                  <FaUser className='w-4 h-4 text-[#30AD8F]' />
                </div>
                <h3 className='text-sm md:text-base font-semibold text-gray-900'>
                  {member.name}
                </h3>
              </div>
            )}

            <div className='space-y-2'>
              {/* Role */}
              {member.role?.trim() && (
                <div className='flex items-start gap-2'>
                  <FaBriefcase className='w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-[10px] text-gray-500 font-medium uppercase tracking-wide'>
                      Role
                    </p>
                    <p className='text-xs md:text-sm text-gray-700 mt-0.5'>
                      {member.role}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Number */}
              {member.contact_number?.trim() && (
                <div className='flex items-start gap-2'>
                  <FaPhoneAlt className='w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0' />
                  <div>
                    <p className='text-[10px] text-gray-500 font-medium uppercase tracking-wide'>
                      Contact
                    </p>
                    <a
                      href={`tel:${member.contact_number}`}
                      className='text-xs md:text-sm text-[#30AD8F] hover:text-[#258d73] mt-0.5 block transition-colors'
                    >
                      {member.contact_number}
                    </a>
                  </div>
                </div>
              )}

              {/* Description */}
              {member.description?.trim() && (
                <div className='pt-1'>
                  <p className='text-[10px] text-gray-500 font-medium uppercase tracking-wide mb-1'>
                    Description
                  </p>
                  <p className='text-xs md:text-sm text-gray-600 leading-snug'>
                    {member.description}
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
