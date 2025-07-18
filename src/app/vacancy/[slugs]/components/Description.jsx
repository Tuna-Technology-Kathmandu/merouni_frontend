import React from 'react'
// import { FaRegFaceLaugh } from 'react-icons/fa6'
// import { FaRegFaceAngry } from 'react-icons/fa6'
// import { FaRegSadCry } from 'react-icons/fa'
// import { AiOutlineLike } from 'react-icons/ai'

const Description = ({ news }) => {
  // Function to wrap tables in a scrollable container
  const processContent = (html) => {
    if (!html) return ''
    return html.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  return (
    <>
      <div className='mb-6 full'>
        <div className='text-xl font-bold'>Description</div>
        <div
          className='text-[13px] mt-4 leading-7 max-md:leading-5 md:text-sm lg:text-base text-justify'
          dangerouslySetInnerHTML={{ __html: news?.description }}
        />

        <div
          className='text-[13px] md:text-sm text-justify lg:text-base mt-4 !leading-7 
          [&_ul]:list-disc 
          [&_ol]:list-decimal 
          [&_li]:ml-10 
          [&_li]:mb-1 
          [&_li]:mt-1 
          !max-w-none 
          text-black
          
          /* Table wrapper styles */
          [&_.table-wrapper]:overflow-x-auto
          [&_.table-wrapper]:my-4
          [&_.table-wrapper]:w-full
          [&_.table-wrapper]:[scrollbar-width:thin]
          [&_.table-wrapper]:[scrollbar-color:gray-300_transparent]
          
          /* Table styles */
          [&_table]:min-w-full
          [&_table]:border-collapse
          [&_th]:bg-gray-100
          [&_th]:p-2
          [&_th]:text-left
          [&_th]:border
          [&_th]:border-gray-300
          [&_td]:p-2
          [&_td]:border
          [&_td]:border-gray-300
          [&_tr:nth-child(even)]:bg-gray-50'
          dangerouslySetInnerHTML={{ __html: processContent(news?.content) }}
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
