import GoogleMap from '@/app/colleges/[slugs]/components/GoogleMap'
import React from 'react'
// import { FaRegFaceLaugh } from 'react-icons/fa6'
// import { FaRegFaceAngry } from 'react-icons/fa6'
// import { FaRegSadCry } from 'react-icons/fa'
// import { AiOutlineLike } from 'react-icons/ai'

const Description = ({ event }) => {
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
      <div className='w-full'>
        <div className='text-xl font-bold'>Description</div>
        <div
          className='text-[13px] mt-4 leading-7 max-md:leading-5 md:text-sm lg:text-base text-justify'
          dangerouslySetInnerHTML={{ __html: event?.description }}
        />

        <div className='text-[13px] my-6 leading-7 max-md:leading-5 md:text-sm grid grid-cols-4 gap-7 max-[569px]:grid-cols-2 '>
          <div className='flex justify-between items-center flex-col gap-1 p-3 bg-green-50 shadow-[0_0_10px_2px_rgba(0,0,0,0.1)] '>
            <p className='font-medium'>Host</p>
            <p>{event?.event_host?.host}</p>
          </div>
          <div className='flex justify-between items-center flex-col gap-1 p-3 bg-green-50 shadow-[0_0_10px_2px_rgba(0,0,0,0.1)]'>
            <p className='font-medium'>Start Date</p>
            <p>{event?.event_host?.start_date}</p>
          </div>
          <div className='flex justify-between items-center flex-col gap-1 p-3 bg-green-50 shadow-[0_0_10px_2px_rgba(0,0,0,0.1)]'>
            <p className='font-medium'>End Date</p>
            <p>{event?.event_host?.end_date}</p>
          </div>
          <div className='flex justify-between items-center flex-col gap-1 p-3 bg-green-50 shadow-[0_0_10px_2px_rgba(0,0,0,0.1)]'>
            <p className='font-medium'>Time</p>
            {new Date(
              `1970-01-01T${event.event_host.time}:00`
            ).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })}
          </div>
        </div>

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
          dangerouslySetInnerHTML={{ __html: processContent(event?.content) }}
        />
      </div>

      {event?.event_host?.map_url && (
        <div className='mt-7 w-full h-52 tw:max-[938px]:h-40 '>
          <h1 className='text-xl font-bold mb-4'>Location</h1>
          <GoogleMap mapUrl={event?.event_host?.map_url} />
        </div>
      )}
    </>
  )
}

export default Description

// import React from 'react'
// import DOMPurify from 'dompurify'

// const Description = ({ event }) => {
//   // Function to wrap tables in a scrollable container
//   const processContent = (html) => {
//     if (!html) return ''
//     const cleanHTML = DOMPurify.sanitize(html)
//     return cleanHTML.replace(
//       /<table([^>]*)>([\s\S]*?)<\/table>/g,
//       '<div class="table-wrapper"><table$1>$2</table></div>'
//     )
//   }

//   return (
//     <div className='ml-4 mt-4 flex flex-col md:flex-row max-w-full md:max-w-[1600px] md:mx-auto items-start'>
//       {/* Description Section */}
//       <div className='mb-6 w-full md:w-1/2'>
//         <h2 className='text-2xl font-bold'>Description</h2>
//         <p className='text-base mt-2 leading-8'>{event?.description}</p>

//         <div className='prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-slate max-w-full'>
//           <div
//             dangerouslySetInnerHTML={{ __html: processContent(event?.content) }}
//             className='[&_.table-wrapper]:overflow-x-auto
//                       [&_.table-wrapper]:my-4
//                       [&_.table-wrapper]:w-full
//                       [&_.table-wrapper]:[scrollbar-width:thin]
//                       [&_.table-wrapper]:[scrollbar-color:gray-300_transparent]

//                       [&_table]:min-w-full
//                       [&_table]:border-collapse
//                       [&_th]:bg-gray-100
//                       [&_th]:p-2
//                       [&_th]:text-left
//                       [&_th]:border
//                       [&_th]:border-gray-300
//                       [&_td]:p-2
//                       [&_td]:border
//                       [&_td]:border-gray-300
//                       [&_tr:nth-child(even)]:bg-gray-50'
//           />
//         </div>
//       </div>

//       {/* Event Location Section */}
//       <div className='mb-6 w-full md:w-1/3 md:ml-auto md:mr-20 flex flex-col'>
//         <h2 className='text-2xl font-bold my-6 md:my-0'>Event Location</h2>

//         {/* Render map HTML if available */}
//         {event?.event_host?.map_url && (
//           <div
//             className='mt-2 rounded-md w-full h-[300px] md:h-[350px]'
//             style={{
//               minWidth: '300px',
//               maxWidth: '100%',
//               overflow: 'hidden'
//             }}
//             dangerouslySetInnerHTML={{ __html: event.event_host.map_url }}
//           />
//         )}

//         <p className='text-xl font-sm mt-4 text-center'>
//           {event?.event_host?.host}
//         </p>
//       </div>
//     </div>
//   )
// }

// export default Description
