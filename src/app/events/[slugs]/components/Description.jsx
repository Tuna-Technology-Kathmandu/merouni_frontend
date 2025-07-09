import React from 'react'
import DOMPurify from 'dompurify'

const Description = ({ event }) => {
  // Function to wrap tables in a scrollable container
  const processContent = (html) => {
    if (!html) return ''
    const cleanHTML = DOMPurify.sanitize(html)
    return cleanHTML.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  return (
    <div className='ml-4 mt-4 flex flex-col md:flex-row max-w-full md:max-w-[1600px] md:mx-auto items-start'>
      {/* Description Section */}
      <div className='mb-6 w-full md:w-1/2'>
        <h2 className='text-2xl font-bold'>Description</h2>
        <p className='text-base mt-2 leading-8'>{event?.description}</p>

        <div className='prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-slate max-w-full'>
          <div
            dangerouslySetInnerHTML={{ __html: processContent(event?.content) }}
            className='[&_.table-wrapper]:overflow-x-auto 
                      [&_.table-wrapper]:my-4 
                      [&_.table-wrapper]:w-full
                      [&_.table-wrapper]:[scrollbar-width:thin]
                      [&_.table-wrapper]:[scrollbar-color:gray-300_transparent]
                      
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
          />
        </div>
      </div>

      {/* Event Location Section */}
      <div className='mb-6 w-full md:w-1/3 md:ml-auto md:mr-20 flex flex-col'>
        <h2 className='text-2xl font-bold my-6 md:my-0'>Event Location</h2>

        {/* Render map HTML if available */}
        {event?.event_host?.map_url && (
          <div
            className='mt-2 rounded-md w-full h-[300px] md:h-[350px]'
            style={{
              minWidth: '300px',
              maxWidth: '100%',
              overflow: 'hidden'
            }}
            dangerouslySetInnerHTML={{ __html: event.event_host.map_url }}
          />
        )}

        <p className='text-xl font-sm mt-4 text-center'>
          {event?.event_host?.host}
        </p>
      </div>
    </div>
  )
}

export default Description
