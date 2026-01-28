import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'

const Fcollege = ({ name, description, image, slug }) => {
  const router = useRouter()

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/colleges/${slug}`)}
      className='group flex flex-col min-h-[320px] bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-80 md:w-96 flex-shrink-0 overflow-hidden cursor-pointer mb-8'
    >
      <div className='relative h-40 overflow-hidden'>
        <img
          src={image || 'https://placehold.co/600x400'}
          alt={name}
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>
        <div className='absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-[10px] font-semibold'>
          <MapPin className='w-3 h-3' />
          <span>{description?.state || 'Nepal'}</span>
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <h3 className='font-bold text-lg text-gray-800 mb-3 group-hover:text-[#0A70A7] transition-colors line-clamp-2 leading-tight'>
          {name}
        </h3>

        <div className='mt-auto flex items-center justify-between pt-5 border-t border-gray-100'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/apply/${slug}`)
            }}
            className='px-6 py-2.5 bg-[#0A70A7] text-white text-[11px] font-bold rounded-xl hover:bg-[#085a86] transition-colors shadow-sm uppercase tracking-wider'
          >
            Apply Now
          </button>
          <div className='flex items-center gap-1.5 text-[#0A70A7] font-bold text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest'>
            <span>View Details</span>
            <ArrowRight className='w-3.5 h-3.5' />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Fcollege
