import React from 'react'
import { FaRegFaceLaugh } from 'react-icons/fa6'
import { FaRegFaceAngry } from 'react-icons/fa6'
import { FaRegSadCry } from 'react-icons/fa'
import { AiOutlineLike } from 'react-icons/ai'

const Description = ({ news }) => {
  return (
    <>
      <div className='mb-6 full'>
        <div className='text-xl font-bold'>Description</div>
        <div
          className='text-[13px] mt-4 leading-7 max-md:leading-5  md:text-sm lg:text-base '
          dangerouslySetInnerHTML={{ __html: news?.description }}
        />

        <div
          className='text-[13px] md:text-sm lg:text-base mt-4 !leading-7 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-10 [&_li]:mb-1 [&_li]:mt-3 !max-w-none text-black'
          dangerouslySetInnerHTML={{ __html: news?.content }}
        />
      </div>
    </>
  )
}

export default Description

// <div className='md:max-w-[1600px] md:mx-auto flex md:justify-start items-center justify-center mt-4'>
//         <div className='flex flex-row gap-4 md:items-start '>
//           <button type='button' className='p-2  rounded hover:bg-blue-600'>
//             <FaRegFaceLaugh size={25} />
//           </button>
//           <button type='button' className='p-2   rounded hover:bg-red-600'>
//             <FaRegFaceAngry size={25} />
//           </button>
//           <button type='button' className='p-2 rounded hover:bg-yellow-600'>
//             <FaRegSadCry size={25} />
//           </button>
//           <button type='button' className='p-2  hover:bg-green-600'>
//             <AiOutlineLike size={25} />
//           </button>
//         </div>
//         {/* <div className="mx-auto font-bold text-2xl">Share with friends</div> */}
//       </div>
