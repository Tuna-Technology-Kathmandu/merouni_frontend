import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'

const Fcollege = ({ name, description, image, slug }) => {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      onClick={() => router.push(`/colleges/${slug}`)}
      className='group flex flex-col min-h-[340px] bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 w-80 md:w-96 flex-shrink-0 overflow-hidden cursor-pointer mb-8'
    >
      <div className='relative h-44 overflow-hidden'>
        <img
          src={image || 'https://placehold.co/600x400'}
          alt={name}
          className='object-cover w-full h-full group-hover:scale-110 transition-transform duration-500'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60'></div>
        <div className='absolute bottom-4 left-4 flex items-center gap-1.5 text-white text-xs font-medium'>
          <MapPin className='w-3.5 h-3.5' />
          <span>{description?.state || 'Nepal'}</span>
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <h3 className='font-bold text-xl text-gray-900 mb-3 group-hover:text-[#387CAE] transition-colors line-clamp-2 leading-tight'>
          {name}
        </h3>

        <div className='mt-auto flex items-center justify-between pt-4 border-t border-gray-50'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/colleges/apply/${slug}`)
            }}
            className='px-6 py-2.5 bg-[#387CAE] text-white text-sm font-bold rounded-xl hover:bg-[#2d638c] transition-colors shadow-lg shadow-blue-100'
          >
            Apply Now
          </button>
          <div className='flex items-center gap-1.5 text-[#387CAE] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity'>
            <span>Details</span>
            <ArrowRight className='w-4 h-4' />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Fcollege
