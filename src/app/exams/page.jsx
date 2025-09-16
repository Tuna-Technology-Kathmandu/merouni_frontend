'use client'
import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { getExams } from './actions'
import Header from '../components/Frontpage/Header'
import Navbar from '../components/Frontpage/Navbar'
import Footer from '../components/Frontpage/Footer'
import ExamShimmer from './components/ExamShimmer'
import SingleExam from './components/SingleExam'
import { useDebounce } from 'use-debounce'
import Pagination from '../blogs/components/Pagination'

export default function ExamsPage() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSingle, setShowSingle] = useState(false)
  const [singleExam, setSingleExam] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [isScrolling, setIsScrolling] = useState(false)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  console.log(exams)

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      try {
        const response = await getExams(pagination.currentPage, debouncedSearch)
        setExams(response.items)

        setPagination((prev) => ({
          ...prev,
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalCount: response.pagination.totalCount
        }))
      } catch (err) {
        setError('Failed to load exams')
      } finally {
        setLoading(false)
      }
    }

    fetchExams()
  }, [debouncedSearch, pagination.currentPage])

  console.log(debouncedSearch)

  const handleClick = (id) => {
    let single = exams.filter((items) => {
      return items.id === id
    })
    setSingleExam(single)
    setShowSingle(true)
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
      setIsScrolling(true)
      setPagination((prev) => ({ ...prev, currentPage: page }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  // Reset to page 1 whenever search term changes
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1
    }))
  }, [debouncedSearch])

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
      {!showSingle ? (
        <div className='min-h-screen bg-gradient-to-b from-[#f7fbfc] to-[#e9f3f7] py-12 px-6'>
          <div className='container mx-auto'>
            {/* Title */}
            <div className='text-center mb-12'>
              <h1 className='text-2xl md:text-3xl font-extrabold text-gray-800'>
                Explore the <span className='text-[#0A70A7]'>Exams</span>
              </h1>
              <p className='mt-3 text-gray-600 max-w-2xl mx-auto text-sm'>
                Discover the exams designed to help you enter your academic and
                career goals.
              </p>
            </div>
            {/* Search Bar */}
            <div className='flex justify-center mb-10 md:mb-20 '>
              <div className='relative w-full max-w-lg'>
                <input
                  type='text'
                  placeholder='Search exams...'
                  value={search}
                  className='w-full px-5 py-3 pl-12 rounded-2xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-[#0A70A7] focus:border-[#0A70A7] transition-all'
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className='absolute left-4 top-3.5 h-5 w-5 text-gray-400' />
              </div>
            </div>

            {loading || isScrolling ? (
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
                    className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
                  >
                    <div className='p-6'>
                      {/* Header */}
                      <h2 className='text-2xl font-bold mb-2 text-gray-800'>
                        {exam.title}
                      </h2>

                      {/* University and Level */}
                      <div className='flex flex-wrap gap-2 mb-4'>
                        <span className='bg-blue-100 text-[#2f6f9c] px-3 py-1 rounded-full text-sm font-medium'>
                          {exam.level?.title}
                        </span>
                      </div>

                      {/* {exam.exam_details?.map((ed) => (
                      <div key={ed.id} className='bg-gray-50 p-3 rounded-lg mb-3'>
                        <div className='flex justify-between text-sm text-gray-700 mb-1'>
                          <span>Type:</span>
                          <span>{ed.exam_type}</span>
                        </div>
                        <div className='flex justify-between text-sm text-gray-700 mb-1'>
                          <span>Marks:</span>
                          <span>
                            {ed.pass_marks} / {ed.full_marks}
                          </span>
                        </div>
                        <div className='flex justify-between text-sm text-gray-700 mb-1'>
                          <span>Questions:</span>
                          <span>{ed.number_of_question}</span>
                        </div>
                        <div className='flex justify-between text-sm text-gray-700'>
                          <span>Duration:</span>
                          <span>{ed.duration}</span>
                        </div>
                      </div>
                    ))} */}

                      {/* Application details */}
                      {exam.application_details?.map((ad) => (
                        <div key={ad.id} className='text-sm text-gray-500 mb-3'>
                          <div>
                            <span className='font-medium'>Opening:</span>{' '}
                            {ad.opening_date ?? 'TBD'}
                          </div>
                          <div>
                            <span className='font-medium'>Closing:</span>{' '}
                            {ad.closing_date ?? 'TBD'}
                          </div>
                          <div>
                            <span className='font-medium'>Exam Date:</span>{' '}
                            {ad.exam_date ?? 'TBD'}
                          </div>
                        </div>
                      ))}

                      {/* Past question link */}

                      <button
                        onClick={() => handleClick(exam?.id)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='mt-2 inline-block w-full text-center bg-[#387CAE] hover:bg-[#2f6f9c] text-white px-4 py-2 rounded-lg transition-colors duration-300'
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className='mt-12 flex justify-center'>
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <SingleExam exam={singleExam} />
      )}
      <Footer />
    </>
  )
}
