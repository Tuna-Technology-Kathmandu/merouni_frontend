import React from 'react'
import { MdLocationOn, MdEmail } from 'react-icons/md'
import { FaPhoneAlt, FaCity, FaPhoneSquareAlt  } from 'react-icons/fa'
import { HiOutlineOfficeBuilding } from 'react-icons/hi'
import { MdPublic } from 'react-icons/md'
import { BsMailbox } from 'react-icons/bs'

const AddressContactCard = ({ university }) => {
  const hasAddress =
    university?.country ||
    university?.state ||
    university?.city ||
    university?.street ||
    university?.postal_code

  const hasContact =
    university?.contact?.phone_number ||
    university?.contact?.email ||
    university?.contact?.faxes ||
    university?.contact?.poboxes

  if (!hasAddress && !hasContact) return null

  return (
    <section className="w-full mb-14 max-md:mb-7">
      <div className=" max-md:p-6 px-[75px] max-md:px-[30px]">

        <h2 className="font-bold text-lg md:text-xl mb-8 text-gray-900">
          Address & Contact
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Address */}
          {hasAddress && (
            <div className='shadow-[0px_0px_10px_2px_rgba(0,0,0,0.2)] rounded-lg p-6'>
              <div className="flex items-center gap-2 mb-4">
                <MdLocationOn className="text-[#30AD8F]" size={22} />
                <h3 className="font-semibold text-base md:text-lg text-gray-800">
                  Address
                </h3>
              </div>

              <div className="space-y-3 text-sm md:text-base text-gray-700">
                {university?.street && (
                  <div className="flex gap-2 items-start">
                    <HiOutlineOfficeBuilding className="mt-0.5 text-[#30AD8F]" />
                    <span>{university.street}</span>
                  </div>
                )}

                {(university?.city || university?.state) && (
                  <div className="flex gap-2 items-start">
                    <FaCity className="mt-0.5 text-[#30AD8F]" />
                    <span>
                      {[university.city, university.state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {(university?.country || university?.postal_code) && (
                  <div className="flex gap-2 items-start">
                    <MdPublic className="mt-0.5 text-[#30AD8F]" />
                    <span>
                      {[university.country, university.postal_code]
                        .filter(Boolean)
                        .join(' - ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact */}
          {hasContact && (
               <div className='shadow-[0px_0px_10px_2px_rgba(0,0,0,0.2)] rounded-lg p-6'>
              <div className="flex items-center gap-2 mb-4">
                <FaPhoneSquareAlt className="text-[#30AD8F]" size={18} />
                <h3 className="font-semibold text-base md:text-lg text-gray-800">
                  Contact
                </h3>
              </div>

              <div className="space-y-3 text-sm md:text-base text-gray-700">
                {university?.contact?.phone_number && (
                  <div className="flex gap-2 items-center">
                    <FaPhoneAlt className="text-[#30AD8F]" />
                    <a
                      href={`tel:${university.contact.phone_number}`}
                      className="hover:underline"
                    >
                      {university.contact.phone_number}
                    </a>
                  </div>
                )}

                {university?.contact?.email && (
                  <div className="flex gap-2 items-center">
                    <MdEmail className="text-[#30AD8F]" />
                    <a
                      href={`mailto:${university.contact.email}`}
                      className="hover:underline break-all"
                    >
                      {university.contact.email}
                    </a>
                  </div>
                )}

                {university?.contact?.faxes && (
                  <div className="flex gap-2 items-center">
                    <BsMailbox className="text-[#30AD8F]" />
                    <span>Fax: {university.contact.faxes}</span>
                  </div>
                )}

                {university?.contact?.poboxes && (
                  <div className="flex gap-2 items-center">
                    <BsMailbox className="text-[#30AD8F]" />
                    <span>P.O. Box: {university.contact.poboxes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

export default AddressContactCard
