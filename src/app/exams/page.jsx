'use client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { getExams } from './actions'
import Header from '../components/Frontpage/Header'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import ExamShimmer from './components/ExamShimmer'

export default function ExamsPage() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await getExams()
        setExams(response.items)
        setLoading(false)
      } catch (err) {
        setError('Failed to load exams')
        setLoading(false)
      }
    }

    fetchExams()
  }, [])

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        <div className='border-b-2 border-[#0A70A7] w-[45px] mt-8 mb-4 pl-2'>
          <span className='text-2xl font-bold mr-2'>Entrance</span>
          <span className='text-[#0A70A7] text-2xl font-bold'>Exams</span>
        </div>

        {/* Search Bar */}
        <div className='flex justify-end w-full mb-6'>
          <div className='relative w-full max-w-md'>
            <input
              type='text'
              placeholder='Search exams...'
              className='w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
          </div>
        </div>

        {loading ? (
          <div className='min-h-screen flex items-center justify-center'>
            {/* Show shimmer effect while loading */}
            <div className='w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[...Array(6)].map((_, index) => (
                  <ExamShimmer key={index} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {exams.map((exam) => (
              <div
                key={exam.id}
                className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300'
              >
                <div className='p-6'>
                  <h2 className='text-xl font-semibold mb-2'>{exam.title}</h2>
                  <p className='text-gray-600 mb-4'>{exam.description}</p>

                  <div className='space-y-2'>
                    <div className='flex items-center text-sm text-gray-500'>
                      <span className='font-medium mr-2'>Syllabus:</span>
                      <span>{exam.syllabus}</span>
                    </div>

                    <div className='flex items-center text-sm text-gray-500'>
                      <span className='font-medium mr-2'>Created:</span>
                      <span>
                        {new Date(exam.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <a
                    href={exam.pastQuestion}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300'
                  >
                    View Past Questions
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
