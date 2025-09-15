import React from 'react'
import he from 'he'

const OverviewSection = ({ college }) => {
  // Function to wrap tables in a scrollable container
  const processContent = (html) => {
    if (!html) return ''
    return html.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  return (
    <div>
      <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Description</h2>
      <p className='text-gray-800 mt-9 max-[1120px]:mt-5 leading-7 max-md:leading-5 text-xs md:text-sm lg:text-base text-justify'>
        {college?.description}
      </p>
      <div
        dangerouslySetInnerHTML={{
          __html: he.decode(processContent(college?.content))
        }}
        className='text-gray-800 mt-4 leading-7 text-justify 
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

             /* Other styles */
             [&_h1]:text-2xl
             [&_h1]:font-bold
             [&_h1]:mt-8
             [&_h1]:mb-4
             [&_h2]:text-xl
             [&_h2]:font-bold
             [&_h2]:mt-6
             [&_h2]:mb-3
             text-xs md:text-sm lg:text-base
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
      ></div>
    </div>
  )
}

export default OverviewSection
