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
    <div className='bg-[#30AD8F] bg-opacity-50 w-full h-[150px] flex flex-col items-center justify-center mb-10'>
      <p className='text-lg md:text-2xl font-semibold m-4'>
        Are you ready to take the next step toward your future career?
      </p>
      {/* <div className="flex flex-row items-center bg-[#0A6FA7] text-white rounded-lg p-2 cursor-pointer" onClick={()=> }>

      <button type="button" className="font-semibold">
        Apply Now 
      </button>
        <FaArrowRight className="ml-2"/>
      </div> */}
      <div className='flex flex-row items-center bg-[#0A6FA7] text-white rounded-lg p-2 cursor-pointer'>
        <a href={college.website_url} target='_blank'>
          Visit College
        </a>
        <FaArrowRight className='ml-2' />
      </div>
    </div>
  )
}

export default ApplyNow
