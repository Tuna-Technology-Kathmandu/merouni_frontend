'use client'
import { useEffect, useState } from 'react'
import { ImCross } from 'react-icons/im'
import services from '../../app/apiService'

const DisciplineList = () => {
  const [disciplines, setDisciplines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedDiscipline, setSelectedDiscipline] = useState(null)

  useEffect(() => {
    fetchDisciplineList()
  }, [])

  const fetchDisciplineList = async () => {
    try {
      setLoading(true)
      const data = await services.discipline.getAll({ limit: 8 }) // Assuming getAll accepts query params object or string
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
      <div className='bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 md:py-10 relative min-h-[400px] flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 md:py-10 relative min-h-[400px] flex items-center justify-center'>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className='bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 md:py-10 relative'>
      <div className='container mx-auto px-4 sm:px-6 md:px-8'>
        <h1 className='text-xl font-semibold text-gray-800 mt-4 mb-5 md:mt-5 md:mb-6 pb-2 relative inline-block'>
          Field of Study (Discipline)
          <span className='absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#0870A8] to-[#31AD8F]'></span>
        </h1>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5'>
          {disciplines.length > 0 ? (
            disciplines.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  setSelectedDiscipline({
                    title: item?.title || '',
                    description: item?.description || ''
                  })
                }
              >
                <div className='relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300'>
                  <img
                    src={item?.image}
                    alt={item.title || 'Discipline'}
                    className='w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105'
                  />
                  <div className='absolute bottom-0 left-0 right-0 bg-black p-4 bg-opacity-60'>
                    <h2 className='text-lg font-semibold text-white'>
                      {item.title}
                    </h2>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">No disciplines found.</div>
          )}
        </div>
      </div>
      {selectedDiscipline && (
        <div className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-7 md:px-14'>
          <div className='w-full h-auto max-h-[500px] bg-white rounded-md p-4 md:p-10 overflow-y-auto relative animate-fadeIn'>
            <button
              onClick={() => setSelectedDiscipline(null)}
              className='absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none'
              aria-label="Close"
            >
              <ImCross className='text-xl' />
            </button>
            <h1 className='mb-4 font-semibold text-lg md:text-xl pr-8'>
              {selectedDiscipline.title}
            </h1>
            <p className='text-xs sm:text-sm text-gray-600 leading-relaxed'>{selectedDiscipline.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DisciplineList