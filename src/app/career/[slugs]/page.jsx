'use client'
import { useEffect, useState } from 'react'
import Footer from '../../../components/Frontpage/Footer'
import Header from '../../../components/Frontpage/Header'
import Navbar from '../../../components/Frontpage/Navbar'
import { getCareer } from '../actions'
import { formatDate } from '@/utils/date.util'

const ShowCareer = ({ params }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const processContent = (html) => {
    if (!html) return ''
    return html.replace(
      /<table([^>]*)>([\s\S]*?)<\/table>/g,
      '<div class="table-wrapper"><table$1>$2</table></div>'
    )
  }

  useEffect(() => {
    const fetchdataDetails = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        const careerData = await getCareer(slugs)
        setData(careerData.item)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchdataDetails()
  }, [params])

  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <main className='container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <Navbar />
        <main className='container mx-auto px-4 py-8 min-h-[60vh]'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <p>Error loading career: {error}</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  if (!data) {
    return (
      <>
        <Header />
        <Navbar />
        <main className='container mx-auto px-4 py-8 min-h-[60vh]'>
          <p>Career not found</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Navbar />
      <main className=''>
        <div className='w-full relative'>
          <img
            src={data.featuredImage || '/images/job.webp'}
            alt={data.title || 'Career'}
            className='w-full h-auto max-h-[456px] max-xl:max-h-[380px] max-sm:max-h-[300px] object-contain block'
          />
          <div className='absolute inset-0 bg-black/50  pointer-events-none' />
        </div>
        <div className='p-12 px-18 max-lg:py-8 w-full max-[868px]:gap-0 max-[868px]:pb-0'>
          <div className=' w-[15rem] min-[433px]:w-[20rem] sm:w-[30rem] lg:w-[50rem] md:w-[40rem] font-bold'>
            <p className='font-bold text-lg sm:text-2xl md:leading-10 '>
              {data?.title ?? ''}
            </p>

            <div className='font-medium text-xs my-3 text-slate-600'>
              {formatDate(data?.createdAt)}
            </div>
          </div>

          {/* description */}
          <h2 className='font-bold text-base sm:text-lg leading-10 mb-4 max-sm:mb-2 text-left mt-6 max-'>
            Description
          </h2>
          <p className='text-gray-800 leading-7 max-md:leading-5 text-justify text-xs md:text-sm lg:text-base'>
            {data?.description ?? ''}
          </p>

          {/* content */}
          <div
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
            dangerouslySetInnerHTML={{ __html: processContent(data?.content) }}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
export default ShowCareer
