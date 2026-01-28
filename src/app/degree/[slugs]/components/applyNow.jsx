import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ApplyNow = ({ degree }) => {
  return (
    <div className='container mx-auto px-4 mb-20'>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className='bg-gray-900 rounded-[2rem] p-10 md:p-16 text-center text-white relative overflow-hidden'
      >
        <div className='relative z-10 max-w-2xl mx-auto'>
          <h2 className='text-2xl md:text-3xl font-bold mb-6'>
            Ready to take the next step?
          </h2>
          <p className='text-gray-400 mb-10 text-lg'>
            Apply now for {degree?.title || 'this course'} and start your journey today.
            Our admissions team is ready to guide you through the process.
          </p>

          <motion.a
            href={'#'}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className='inline-flex items-center space-x-3 bg-[#30AD8F] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#28967b] transition-all'
          >
            <span>Apply Now</span>
            <ArrowRight className='w-5 h-5' />
          </motion.a>

          <div className='mt-8 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm text-gray-500'>
            <span>• Fast application</span>
            <span>• Expert guidance</span>
            <span>• Academic support</span>
          </div>
        </div>

        {/* Very subtle background element */}
        <div className='absolute top-0 right-0 w-64 h-64 bg-[#30AD8F]/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl' />
      </motion.div>
    </div>
  )
}

export default ApplyNow
