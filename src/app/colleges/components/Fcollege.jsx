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
      className='group flex flex-col min-h-[340px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 w-80 md:w-[22rem] flex-shrink-0 overflow-hidden cursor-pointer border border-gray-100'
    >
      <div className='relative h-48 overflow-hidden'>
        <img
          src={image || 'https://placehold.co/600x400'}
          alt={name}
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-700'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity'></div>
        <div className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0A70A7] shadow-sm'>
          FEATURED
        </div>
        <div className='absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium bg-black/20 backdrop-blur-md px-2 py-1 rounded-md'>
          <MapPin className='w-3.5 h-3.5' />
          <span>{description?.state || 'Nepal'}</span>
        </div>
      </div>

      <div className='p-5 flex flex-col flex-1 relative'>
        <h3 className='font-bold text-lg text-gray-800 mb-2 group-hover:text-[#0A70A7] transition-colors line-clamp-2 leading-snug'>
          {name}
        </h3>

        {/* Decorative line */}
        <div className='w-12 h-0.5 bg-gray-100 mb-4 group-hover:bg-[#0A70A7]/30 transition-colors'></div>

        <div className='mt-auto flex items-center justify-between'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/apply/${slug}`)
            }}
            className='px-5 py-2 bg-gray-50 text-gray-700 hover:bg-[#0A70A7] hover:text-white text-xs font-bold rounded-lg transition-all shadow-sm border border-gray-200 hover:border-[#0A70A7]'
          >
            Apply Now
          </button>

          <div className='flex items-center gap-1 text-gray-400 group-hover:text-[#0A70A7] transition-colors text-xs font-medium'>
            <span>Details</span>
            <ArrowRight className='w-4 h-4 transform group-hover:translate-x-1 transition-transform' />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Fcollege
