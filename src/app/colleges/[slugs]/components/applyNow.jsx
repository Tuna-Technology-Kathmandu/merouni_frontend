import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { LogsIcon } from 'lucide-react'

const ApplyNow = ({ college }) => {
  const router = useRouter()

  // const handleApplyClick = () => {
  //     if (college )
  // }
  return (
    <div className='bg-[#30AD8F] bg-opacity-50 w-full min-h-[120px] sm:h-[150px] flex flex-col items-center justify-center mb-10 px-4'>
      <p className='text-sm sm:text-base md:text-xl lg:text-2xl font-semibold m-2 sm:m-4 text-center'>
        Are you ready to take the next step toward your future career?
      </p>
      <div className='flex flex-row items-center bg-[#0A6FA7] text-white rounded-lg px-3 sm:px-4 py-2 cursor-pointer hover:bg-[#0a5f8f] transition-colors'>
        <a
          href={college.website_url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm sm:text-base font-semibold'
        >
          Visit College
        </a>
        <FaArrowRight className='ml-2 w-3 h-3 sm:w-4 sm:h-4' />
      </div>
    </div>
  )
}

export default ApplyNow
