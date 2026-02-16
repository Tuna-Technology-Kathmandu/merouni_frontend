'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Info, GraduationCap, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

const UniversityCard = ({ university }) => {
  const router = useRouter()

  const {
    fullname,
    city,
    state,
    slugs,
    featured_img,
    logo,
    type_of_institute
  } = university

  const location = [city, state].filter(Boolean).join(', ')
  const image = featured_img || logo || 'https://placehold.co/600x400?text=University'

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/universities/${slugs}`)}
      className='group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full'
    >
      <div className='relative h-52 overflow-hidden bg-gray-100'>
        <img
          src={image}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
          alt={fullname}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://placehold.co/600x400?text=No+Image'
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

        <div className='absolute top-3 left-3 flex gap-2'>
          <div className='bg-white px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#0A70A7] uppercase tracking-wider shadow-sm'>
            {type_of_institute || 'University'}
          </div>
        </div>

        {location && (
          <div className='absolute bottom-3 left-4 right-4'>
            <div className='flex items-center gap-1 text-white/90 text-xs font-medium'>
              <MapPin className='w-3 h-3 text-blue-400' />
              <span className='line-clamp-1'>{location}</span>
            </div>
          </div>
        )}
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <h3 className='font-bold text-base text-gray-800 mb-4 group-hover:text-[#0A70A7] transition-colors leading-tight line-clamp-2 min-h-[2.5rem]'>
          {fullname}
        </h3>

        <div className='mt-auto pt-5 flex items-center gap-3 border-t border-gray-100'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/universities/${slugs}`)
            }}
            className='flex-1 py-2.5 px-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-[10px] font-bold flex items-center justify-center gap-1.5 uppercase tracking-wider'
          >
            <Info className='w-3.5 h-3.5' />
            Details
          </button>

          {/* 
            Since there's no direct "apply" page for universities in the same way as colleges (maybe),
            or if there is, we can link to it. For now, just keeping "Details" mainly, or linking "Apply" to details too.
            Wait, existing colleges apply goes to `/colleges/apply/${slug}`. 
            I'll assume `/universities/apply/${slug}` doesn't exist or logic is different.
            I'll just link to the university detail page for now, or remove the button. 
            Actually, visually it looks better with two buttons. I'll add "View Courses" or similar?
            Or just keep "Apply Now" and link to same place or a hypothetical apply link.
            I'll link to `${slugs}` for now.
          */}
           <button
             onClick={(e) => {
               e.stopPropagation()
               router.push(`/universities/${slugs}`)
             }}
             className='flex-1 py-2.5 px-3 bg-[#0A70A7] text-white rounded-xl hover:bg-[#085a86] transition-all text-[10px] font-bold flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider'
           >
             <GraduationCap className='w-3.5 h-3.5' />
             View Programs
           </button>
        </div>
      </div>
    </motion.div>
  )
}

export default UniversityCard
