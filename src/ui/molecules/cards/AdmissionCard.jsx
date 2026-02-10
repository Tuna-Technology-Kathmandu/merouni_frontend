'use client'
import React from 'react'
import Link from 'next/link'
import { GraduationCap, MapPin, Info, ArrowRight, Building2, Wallet } from 'lucide-react'

const AdmissionCard = ({ admis }) => {
  const college = admis?.collegeAdmissionCollege
  const program = admis?.program
  const collegeImage = college?.featured_img || '/images/logo.png'
  
  return (
    <div
      className='group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer flex flex-col h-full bg-gradient-to-br from-white to-gray-50/30'
    >
      {/* Image Section */}
      <div className='relative aspect-[16/10] overflow-hidden bg-gray-100'>
        <img
          src={collegeImage}
          alt={program?.title || 'Admission'}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
        />
        {/* Overlay Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity' />
        
        {/* Top Badges */}
        <div className='absolute top-3 left-3 flex gap-2'>
          <span className='bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#0A70A7] uppercase tracking-wider shadow-sm'>
            Admission Open
          </span>
        </div>

        {/* Bottom Info on Image */}
        <div className='absolute bottom-3 left-4 right-4'>
           <div className='flex items-center gap-1.5 text-white/90 text-[11px] font-semibold'>
            <Building2 className='w-3.5 h-3.5 text-blue-400' />
            <span className='line-clamp-1'>{college?.name}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className='p-6 flex flex-col flex-1'>
        {/* Program Title */}
        <Link href={`/admission/${admis.id}`}>
          <h3 className='font-bold text-lg text-gray-900 mb-3 group-hover:text-[#0A70A7] transition-colors leading-tight line-clamp-2 min-h-[3.5rem] tracking-tight'>
            {program?.title}
          </h3>
        </Link>

        {/* Brief Details */}
        <div className='space-y-3 mb-6'>
          <div className='flex items-center gap-2.5 text-gray-600'>
            <div className='p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors'>
              <Wallet className='w-3.5 h-3.5 text-gray-500 group-hover:text-[#0A70A7]' />
            </div>
            <span className='text-xs font-semibold line-clamp-1'>
              {admis.fee_details || 'Contact College'}
            </span>
          </div>
          
          <div className='flex items-center gap-2.5 text-gray-600'>
            <div className='p-1.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors'>
              <Info className='w-3.5 h-3.5 text-gray-500 group-hover:text-[#0A70A7]' />
            </div>
            <span className='text-xs font-semibold line-clamp-1'>
              {admis.admission_process || 'Full Process Online'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-auto pt-5 flex items-center gap-2 border-t border-gray-100'>
          <Link
            href={`/admission/${admis.id}`}
            className='flex-1 py-2.5 px-3 bg-[#0A70A7] text-white rounded-xl hover:bg-[#085a86] transition-all text-[11px] font-bold flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider'
          >
            View Details
            <ArrowRight className='w-3.5 h-3.5' />
          </Link>
          
          <Link
            href={`/colleges/${college?.slugs}`}
            className='p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 hover:text-[#0A70A7] transition-all border border-gray-100'
            title="View College"
          >
            <Building2 className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdmissionCard
