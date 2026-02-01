import React from 'react'
import { FaArrowRight, FaGraduationCap } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'

const ApplyNow = ({ college }) => {
  const router = useRouter()

  const handleApplyClick = () => {
    if (college?.slugs) {
      router.push(`/colleges/apply/${college.slugs}`)
    }
  }

  return (
    <div className='relative w-full mb-10 px-4 sm:px-8 md:px-12 lg:px-24 overflow-hidden'>
      <div className='relative bg-gradient-to-br from-[#0870A8] via-[#0A6FA7] to-[#30AD8F] rounded-2xl shadow-2xl overflow-hidden'>
        {/* Decorative background elements */}
        <div className='absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32'></div>
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24'></div>

        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 p-8 md:p-12 lg:p-16'>
          {/* Left side - Text content */}
          <div className='flex-1 text-center md:text-left'>
            <div className='flex items-center justify-center md:justify-start gap-2 mb-4'>
              <FaGraduationCap className='w-6 h-6 md:w-8 md:h-8 text-white' />
              <h3 className='text-lg md:text-xl font-semibold text-white'>
                Ready to Start Your Journey?
              </h3>
            </div>
            <p className='text-sm md:text-base text-white/90 mb-2'>
              Are you ready to take the next step toward your future career?
            </p>
            <p className='text-sm text-white/80'>
              Join thousands of students who have chosen excellence
            </p>
          </div>

          {/* Right side - Action buttons */}
          <div className='flex flex-col sm:flex-row gap-4 items-center'>
            {college?.slugs && (
              <button
                onClick={handleApplyClick}
                className='group bg-white text-[#0870A8] px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 min-w-[160px] justify-center'
              >
                <span>Apply Now</span>
                <FaArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </button>
            )}

            {college?.website_url && (
              <a
                href={college.website_url}
                target='_blank'
                rel='noopener noreferrer'
                className='group bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-medium text-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 flex items-center gap-2 min-w-[160px] justify-center'
              >
                <span>Visit Website</span>
                <FaArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplyNow
