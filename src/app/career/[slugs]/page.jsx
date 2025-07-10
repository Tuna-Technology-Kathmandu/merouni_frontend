'use client'
import { useEffect, useState } from 'react'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import { getCareer } from '../actions'

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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  useEffect(() => {
    const fetchdataDetails = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        const slugs = resolvedParams.slugs
        const careerData = await getCareer(slugs)
        console.log(careerData)
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

  console.log('data', data.createdAt)

  return (
    <>
      <Header />
      <Navbar />
      <main>
        <div className='w-full h-[250px] sm:h-[400px] md:h-[480px] relative'>
          <img
            src={data.featuredImage || 'https://placehold.co/600x400'}
            alt={data.title || 'data'}
            className='w-full h-full object-cover'
          />

          <div className='absolute bg-black/50 w-full h-full inset-0 '></div>
        </div>
        <div className='p-6'>
          <div className=' w-[15rem] min-[433px]:w-[20rem] sm:w-[30rem] lg:w-[50rem] md:w-[40rem] font-bold'>
            <p className='text-lg leading-1 md:text-3xl lg:text-4xl '>
              {data?.title ?? ''}
            </p>
            <div className='font-medium text-xs lg:text-[16px] my-2'>
              {data?.careerAuthor?.firstName ?? 'Mero'}{' '}
              {data?.careerAuthor?.middleName || ''}{' '}
              {data?.careerAuthor?.lastName ?? 'Uni'}
            </div>
            <div className='font-medium text-xs  my-2 text-slate-600'>
              {formatDate(data?.createdAt)}
            </div>
          </div>

          {/* description */}
          <p className='text-[13px] mt-6 leading-7 max-md:leading-5 md:text-sm lg:text-base text-justify'>
            {data?.description ?? ''}
          </p>

          {/* content */}
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
            dangerouslySetInnerHTML={{ __html: processContent(data?.content) }}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
export default ShowCareer
