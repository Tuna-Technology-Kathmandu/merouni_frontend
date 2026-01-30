import React from 'react'
import { ArrowRight, School } from 'lucide-react'

const SchoolApplyNow = ({ school }) => {
  if (!school?.website_url) return null

  return (
    <section className='px-4 sm:px-8 md:px-12 lg:px-24 mb-20'>
      <div className='bg-gray-50/50 rounded-3xl p-8 md:p-12 border border-gray-100 flex flex-col items-center text-center gap-8 relative overflow-hidden group'>
        {/* Background accent */}
        <div className='absolute -right-20 -bottom-20 w-64 h-64 bg-[#0A6FA7]/5 rounded-full blur-3xl transition-transform group-hover:scale-110 duration-700'></div>

        <div className='bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-2'>
          <School className='w-8 h-8 text-[#0A6FA7]' />
        </div>

        <div className='max-w-2xl space-y-4 relative z-10'>
          <h2 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight'>
            Are you ready to take the next step toward your future?
          </h2>
          <p className='text-gray-600 font-bold'>
            Explore more about {school.name} and start your journey today.
          </p>
        </div>

        <a
          href={school.website_url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-3 px-8 py-4 bg-[#0A6FA7] text-white rounded-2xl font-bold hover:bg-[#085a86] transition-all shadow-lg active:scale-[0.98] group/btn'
        >
          Visit Official Website
          <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
        </a>
      </div>
    </section>
  )
}

export default SchoolApplyNow
