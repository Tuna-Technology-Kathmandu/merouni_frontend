import React from 'react'
import { FaPhoneAlt, FaBriefcase  } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const MembersSection = ({ university }) => {
  const members = Array.isArray(university?.members)
    ? university.members.filter(
        ({ name, role, phone, email }) =>
          name?.trim() || role?.trim() || phone?.trim() || email?.trim()
      )
    : []

  if (members.length === 0) return null

  return (
    <section className="w-full mb-14 max-md:mb-7">
      <div className="p-10 max-md:p-6 px-[75px] max-md:px-[30px]">

        {/* Header */}
        <h2 className="font-bold text-lg md:text-xl mb-8 text-gray-900">
          Members
        </h2>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, idx) => (
            <div
              key={member.id || idx}
              className="group bg-white rounded-xl p-6 shadow-[0px_0px_10px_1px_rgba(0,0,0,0.1)] transition-all duration-300"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full bg-[#30AD8F]/20 flex items-center justify-center
                             text-[#30AD8F] font-bold text-base group-hover:scale-105 transition"
                  aria-label="Member avatar"
                >
                  <FaBriefcase size={24} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base ">
                    {member?.salutation && `${member.salutation}. `}{member?.name || 'Unnamed'}
                  </h3>

                  {member?.role && (
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full
                                     bg-[#30AD8F]/15 text-[#30AD8F] capitalize">
                      {member.role}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-gray-700">
                {member?.phone && (
                  <div className="flex items-center gap-2">
                    <FaPhoneAlt className="text-[#30AD8F]" />
                    <a
                      href={`tel:${member.phone}`}
                      className="hover:underline"
                      aria-label={`Call ${member.name}`}
                    >
                      {member.phone}
                    </a>
                  </div>
                )}

                {member?.email && (
                  <div className="flex items-center gap-2">
                    <MdEmail className="text-[#30AD8F]" />
                    <a
                      href={`mailto:${member.email}`}
                      className="hover:underline break-all"
                      aria-label={`Email ${member.name}`}
                    >
                      {member.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MembersSection
