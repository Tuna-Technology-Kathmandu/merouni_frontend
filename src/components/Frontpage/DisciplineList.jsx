'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import services from '../../app/apiService'
import { BookOpen } from 'lucide-react'
import { THEME_BLUE } from '@/constants/constants'

const DisciplineList = () => {
  const router = useRouter()
  const [disciplines, setDisciplines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDisciplineList()
  }, [])

  const fetchDisciplineList = async () => {
    try {
      setLoading(true)
      const data = await services.discipline.getAll({ limit: 8 })
      setDisciplines(data?.items || [])
    } catch (error) {
      console.error('Discipline Fetch Error:', error)
      setError('Failed to load disciplines. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='bg-white py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='bg-gray-100 h-64 rounded-xl animate-pulse'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return null
  }

  return (
    <div className='py-16 bg-white'>
      <div className='container mx-auto px-4 sm:px-6 md:px-8'>
        <div className='mb-10'>
          <h2 className='text-2xl md:text-3xl font-bold text-gray-900'>
            Fields of Study
          </h2>
          <div className='h-1 w-20 mt-2 rounded-full' style={{ backgroundColor: THEME_BLUE }}></div>
          <p className='mt-3 text-gray-600 max-w-2xl text-sm md:text-base'>
            Explore our wide range of disciplines designed to help you specialize and advance your career.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {disciplines.length > 0 ? (
            disciplines.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/disciplines/${item.slug}`)}
                className='group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 transform hover:-translate-y-1'
              >
                <div className='relative aspect-[16/10] overflow-hidden bg-gray-100'>
                  {item.featured_image ? (
                    <img
                      src={item.featured_image}
                      alt={item.title || 'Discipline'}
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-300'>
                      <BookOpen className='w-12 h-12' />
                    </div>
                  )}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300'></div>

                  <div className='absolute bottom-4 left-4 right-4'>
                    <h3 className='text-lg font-bold text-white leading-tight group-hover:text-[#387cae] transition-colors'>
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className='p-4'>
                  <p className='text-sm text-gray-500 line-clamp-2'>
                    {item.description || `${item.title} discipline`}
                  </p>
                  <div className='mt-4 pt-3 border-t border-gray-50 flex items-center justify-between'>
                    <span className='text-xs font-semibold group-hover:underline' style={{ color: THEME_BLUE }}>
                      View Degrees
                    </span>
                    <div className='w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#387cae] transition-colors'>
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className='text-gray-500 font-medium'>No disciplines found available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DisciplineList