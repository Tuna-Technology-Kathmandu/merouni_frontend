import React from 'react'
import { FaUser } from 'react-icons/fa'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaHandPointRight } from 'react-icons/fa'

const MemberSection = ({ validMembers }) => {
  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Members</h2>
      <div className='grid grid-cols-2 gap-6 mt-9 max-[1120px]:mt-5 max-[1120px]:grid-cols-1'>
        {validMembers.map((member, index) => (
          <div className='flex flex-row' key={index}>
            <div className='flex flex-col drop-shadow-xl bg-[#30AD8F1A] p-5'>
              {member.name?.trim() && (
                <div className='flex flex-row mb-2 gap-2 items-center'>
                  <FaUser />
                  <p className='text-xs md:text-sm lg:text-base'>
                    {member.name}
                  </p>
                </div>
              )}
              {member.role?.trim() && (
                <div className='flex flex-row mb-2 gap-2 items-center'>
                  <img
                    src='/images/Role icon.png'
                    alt='Role Icon'
                    className='w-4'
                  />
                  <p className='text-xs md:text-sm lg:text-base'>
                    {member.role}
                  </p>
                </div>
              )}
              {member.contact_number?.trim() && (
                <div className='flex flex-row mb-2 gap-2 items-center'>
                  <FaPhoneAlt />
                  <p className='text-xs md:text-sm lg:text-base'>
                    {member.contact_number}
                  </p>
                </div>
              )}
              {member.description?.trim() && (
                <div className='flex flex-row mb-2 gap-2 items-center'>
                  <FaHandPointRight />
                  <p className='text-xs md:text-sm lg:text-sm text-justify'>
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
