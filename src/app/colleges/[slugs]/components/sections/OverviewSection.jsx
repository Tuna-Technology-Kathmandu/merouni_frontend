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

  // If no description and no content, return null to avoid empty card
  if (!college?.description && !college?.content) {
    return null
  }

  return (
    <div className='bg-white rounded-xl border p-6'>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>Description</h2>

      {/* Plain description text */}
      {college?.description && (
        <div className=''>
          {/* Mobile view - with truncation */}
          <p className='md:hidden text-gray-600 leading-relaxed text-justify text-sm'>
            {isExpanded ? fullDescription : truncatedDescription}
          </p>

          {/* Desktop view - full description */}
          <p className='hidden md:block text-gray-600 leading-relaxed text-left text-sm md:text-base'>
            {fullDescription}
          </p>

          {/* Read more/less button - only on mobile */}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='md:hidden mt-4 text-[#0A6FA7] hover:text-[#085e8a] font-medium text-sm flex items-center gap-1'
            >
              {isExpanded ? 'Read less ↑' : 'Read more ↓'}
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
          className='text-gray-600 mt-8 leading-relaxed text-justify 
             text-sm md:text-base

             [&>iframe]:w-full 
             [&>iframe]:max-w-[calc(100vw-40px)] 
             [&>iframe]:aspect-video 
             [&>iframe]:h-auto
             [&>iframe]:rounded-2xl 
             [&>iframe]:mt-6
             [&>iframe]:mx-auto
             [&>iframe]:block
             [&>iframe]:shadow-lg

             /* Table wrapper styles */
             [&_.table-wrapper]:overflow-x-auto
             [&_.table-wrapper]:my-6
             [&_.table-wrapper]:w-full
             [&_.table-wrapper]:[scrollbar-width:thin]
             [&_.table-wrapper]:[scrollbar-color:gray-300_transparent]

             /* Table styles */
             [&_table]:min-w-full
             [&_table]:border-collapse
             [&_table]:rounded-xl
             [&_table]:overflow-hidden
             [&_table]:border
             [&_table]:border-gray-100
             [&_th]:bg-gray-50
             [&_th]:p-3
             [&_th]:text-left
             [&_th]:font-semibold
             [&_th]:text-gray-900
             [&_th]:border
             [&_th]:border-gray-200
             [&_td]:p-3
             [&_td]:border
             [&_td]:border-gray-100
             [&_tr:nth-child(even)]:bg-gray-50/50

             /* Heading styles */
             [&_h1]:text-lg
             [&_h1]:font-semibold
             [&_h1]:mt-8
             [&_h1]:mb-4
             [&_h1]:text-gray-900
             [&_h2]:text-base
             [&_h2]:font-semibold
             [&_h2]:mt-6
             [&_h2]:mb-3
             [&_h2]:text-gray-900

             /* List styles */
             [&_ol]:pl-8 
             [&_ol]:my-6
             [&_ol]:space-y-3
             [&_ol]:list-decimal
             [&_ul]:list-disc 
             [&_ul]:pl-8 
             [&_ul]:my-6
             [&_ul]:space-y-3
             [&_li]:pl-2
             max-lg:[&_ol]:text-sm
             max-lg:[&_ul]:text-sm'
        />
      )}
    </div>
  )
}

export default OverviewSection
