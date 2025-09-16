import React from 'react'
import { MapPin, BookOpen, Globe } from 'lucide-react'
import Link from 'next/link'

const SingleConsultancy = ({ consultancy }) => {
  window.scrollTo(0, 0)
  let data = consultancy[0]
  console.log(data)

  const destinations = data?.destination ? JSON.parse(data.destination) : []
  const address = data?.address ? JSON.parse(data.address) : {}
  const courses = data?.consultancyCourses || []

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='w-full'>
        <div className='h-[25vh] w-full md:h-[400px] relative'>
          <img
            src={data?.featured_image || 'https://placehold.co/600x400'}
            alt={data?.title || 'Consultancy Image'}
            className='object-cover w-full h-full'
          />
          <div className='absolute w-full h-full inset-0 bg-black/25 z-10'></div>
        </div>

        <div className='flex flex-row bg-[#30AD8F] bg-opacity-5 h-[110px] mb-10 items-center px-[75px] max-md:px-[30px]'>
          <div className=''>
            <h2 className='font-bold text-lg sm:text-2xl md:leading-10'>
              {data?.title || ''}
            </h2>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className='w-full max-w-5xl px-6 pb-10'>
        {/* Address */}
        {address?.street && (
          <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <MapPin className='text-[#30AD8F]' size={20} /> Address
            </h2>
            <p className='text-gray-700'>
              {address.street}, {address.city}, {address.state} {address.zip}
            </p>
          </div>
        )}

        {/* Destinations */}
        {destinations.length > 0 && (
          <div className='bg-white rounded-xl custom-shadow p-6 mb-8'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <Globe className='text-[#30AD8F]' size={20} /> Destinations
            </h2>
            <ul className='list-disc list-inside text-gray-700'>
              {destinations.map((d, i) => (
                <li key={i}>
                  {d.city}, {d.country}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <div className='bg-white rounded-xl custom-shadow p-6'>
            <h2 className='text-lg font-semibold flex items-center gap-2 mb-3'>
              <BookOpen className='text-[#30AD8F]' size={20} /> Courses Offered
            </h2>
            <div className='grid md:grid-cols-2 gap-4'>
              {courses.map((course, i) => (
                <Link
                  href={`/degree/single-subject/${slugify(course.title)}`}
                  key={i}
                  className='border rounded-lg p-4 hover:shadow-md transition'
                >
                  <h3 className='font-bold text-gray-900'>{course.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleConsultancy
