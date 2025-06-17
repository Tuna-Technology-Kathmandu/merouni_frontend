'use client'
import { useEffect, useState } from 'react'
import { getCourseBySlug } from '../../actions'
import he from 'he'
import Loader from '@/app/components/Loading'

const SingleSubject = ({ params }) => {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(true)

  const fetchCourseDetails = async (slugs) => {
    try {
      setLoading(true)
      const CourseData = await getCourseBySlug(slugs)
      if (CourseData) {
        setCourse(CourseData)
      } else {
        setError('No data found')
      }
    } catch (error) {
      console.error('Error fetching degree details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourseDetails(params.slugs)
  }, [params.slugs])

  const decodedContent = course?.description
    ? he.decode(course.description)
    : ''
  const syllabusArray = course?.syllabus ? JSON.parse(course.syllabus) : []

  if (loading) {
    return <Loader />
  }
  return (
    <div className='container mx-auto p-6'>
      <h2 className='font-bold text-3xl leading-10 mt-8 text-center'>
        {course?.title}
      </h2>
      <p className='mb-7 mt-4 text-2xl font-semibold text-center'>
        {course?.code}
      </p>
      <div className='flex w-full justify-between'>
        <p> Credits: {course?.credits || 'N/A'}</p>
        <p>-{course?.coursefaculty?.title}</p>
      </div>
      {decodedContent && (
        <div
          dangerouslySetInnerHTML={{ __html: decodedContent }}
          className='text-gray-800 mt-4 leading-7 
            [&>iframe]:w-full 
            [&>iframe]:max-w-[calc(100vw-40px)] 
            [&>iframe]:aspect-video 
            [&>iframe]:h-auto
            [&>iframe]:rounded-lg 
            [&>iframe]:mt-4
            [&>iframe]:mx-auto
            [&>iframe]:block
            [&_table]:w-full
            [&_table]:my-4
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
            [&_h1]:text-2xl
            [&_h1]:font-bold
            [&_h1]:mt-8
            [&_h1]:mb-4
            [&_h2]:text-xl
            [&_h2]:font-bold
            [&_h2]:mt-6
            [&_h2]:mb-3
            text-xs md:text-sm lg:text-base
            overflow-x-hidden
            [&_ol]:list-decimal 
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
      <div className='mt-7'>
        <h2 className='text-lg font-bold'>Syllabus</h2>
        <ul className='list-disc pl-8 my-4 space-y-2'>
          {syllabusArray.map((item, index) => (
            <li key={index} className='pl-2'>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default SingleSubject
