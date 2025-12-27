import React, { useState } from 'react'
import he from 'he'

const OverviewSection = ({ college }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Wrap tables in a scrollable container
  const processContent = (html) => {
    if (!html) return ''
    return html.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  // Truncate description to first 30 words for mobile
  const truncateDescription = (text, wordLimit = 30) => {
    if (!text) return ''
    const words = text.split(' ')
    if (words.length <= wordLimit) return text
    return words.slice(0, wordLimit).join(' ') + '...'
  }

  const fullDescription = college?.description || ''
  const truncatedDescription = truncateDescription(fullDescription, 30)
  const shouldTruncate = fullDescription.split(' ').length > 30

  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Description</h2>

      {/* Plain description text */}
      {college?.description && (
        <div>
          {/* Mobile view - with truncation */}
          <p className='md:hidden text-gray-800 mt-9 max-[1120px]:mt-5 leading-7 max-md:leading-5 text-justify text-xs'>
            {isExpanded ? fullDescription : truncatedDescription}
          </p>

          {/* Desktop view - full description */}
          <p className='hidden md:block text-gray-800 mt-9 max-[1120px]:mt-5 leading-7 text-justify text-sm lg:text-base'>
            {fullDescription}
          </p>

          {/* Read more/less button - only on mobile */}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='md:hidden mt-2 text-blue-600 hover:text-blue-800 font-semibold text-sm underline'
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      {/* Rich HTML content */}
      {college?.content && (
        <div
          dangerouslySetInnerHTML={{
            __html: he.decode(processContent(college.content))
          }}
          className='text-gray-800 mt-4 leading-7 text-justify 
             text-xs md:text-sm lg:text-base

             [&>iframe]:w-full 
             [&>iframe]:max-w-[calc(100vw-40px)] 
             [&>iframe]:aspect-video 
             [&>iframe]:h-auto
             [&>iframe]:rounded-lg 
             [&>iframe]:mt-4
             [&>iframe]:mx-auto
             [&>iframe]:block

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
             [&_tr:nth-child(even)]:bg-gray-50

             /* Heading styles */
             [&_h1]:text-2xl
             [&_h1]:font-bold
             [&_h1]:mt-8
             [&_h1]:mb-4
             [&_h2]:text-xl
             [&_h2]:font-bold
             [&_h2]:mt-6
             [&_h2]:mb-3

             /* List styles */
             [&_ol]:pl-8 
             [&_ol]:my-4
             [&_ol]:space-y-2
             [&_ul]:list-disc 
             [&_ul]:pl-8 
             [&_ul]:my-4
             [&_ul]:space-y-2
             [&_li]:pl-2
             max-lg:[&_ol]:text-sm
             max-lg:[&_ul]:text-sm
             max-lg:[&_ol]:space-y-1
             max-lg:[&_ul]:space-y-1'
        />
      )}
    </div>
  )
}

export default OverviewSection
