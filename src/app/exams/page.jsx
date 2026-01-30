'use client'
import EmptyState from '@/ui/shadcn/EmptyState'
import { FormatDate } from '@/lib/date'
import { Building2, ClipboardCheck, Search, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import Footer from '../../components/Frontpage/Footer'
import Header from '../../components/Frontpage/Header'
import Navbar from '../../components/Frontpage/Navbar'
import Pagination from '../blogs/components/Pagination'
import {
  fetchFaculties,
  fetchLevels,
  fetchUniversities,
  getExams
} from './actions'
import ExamShimmer from './components/ExamShimmer'
import SingleExam from './components/SingleExam'

export default function ExamsPage() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSingle, setShowSingle] = useState(false)
  const [singleExam, setSingleExam] = useState([])

  // Search state
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  // Filter states
  const [faculties, setFaculties] = useState([])
  const [levels, setLevels] = useState([])
  const [universities, setUniversities] = useState([])

  const [selectedType, setSelectedType] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedAffiliation, setSelectedAffiliation] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')

  const [isScrolling, setIsScrolling] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })

  // Fetch filter options on mount
  useEffect(() => {
    const getOptions = async () => {
      try {
        const [facList, levelList, uniList] = await Promise.all([
          fetchFaculties(),
          fetchLevels(),
          fetchUniversities()
        ])
        setFaculties(facList || [])
        setLevels(levelList || [])
        setUniversities(uniList || [])
      } catch (err) {
        console.error('Error fetching filter options:', err)
      }
    }
    getOptions()
  }, [])

  const fetchExams = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getExams(
        pagination.currentPage,
        debouncedSearch,
        selectedType,
        selectedLevel,
        selectedAffiliation,
        selectedFaculty
      )
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
  }, [
    debouncedSearch,
    pagination.currentPage,
    selectedType,
    selectedLevel,
    selectedAffiliation,
    selectedFaculty
  ])

  useEffect(() => {
    fetchExams()
  }, [fetchExams])

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }, [
    debouncedSearch,
    selectedType,
    selectedLevel,
    selectedAffiliation,
    selectedFaculty
  ])

  const handleClick = (id) => {
    let single = exams.find((items) => items.id === id)
    setSingleExam(single ? [single] : [])
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

  const clearFilters = () => {
    setSearch('')
    setSelectedType('')
    setSelectedLevel('')
    setSelectedAffiliation('')
    setSelectedFaculty('')
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='bg-red-50 border border-red-100 text-red-600 px-8 py-4 rounded-[24px] font-bold shadow-sm'>
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
        <div className='min-h-screen bg-gray-50/50 py-12 px-6'>
          <div className='max-w-7xl mx-auto'>
            {/* Title Section */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12'>
              <div>
                <div className='relative inline-block mb-3'>
                  <h1 className='text-3xl md:text-4xl font-extrabold text-gray-900'>
                    Explore <span className='text-[#0A6FA7]'>Exams</span>
                  </h1>
                  <div className='absolute -bottom-2 left-0 w-16 h-1 bg-[#0A6FA7] rounded-full'></div>
                </div>
                <p className='text-gray-500 max-w-xl font-medium mt-2'>
                  Find upcoming entrance and periodic exams tailored to your
                  academic path.
                </p>
              </div>

              {/* Clear All Button */}
              {(search ||
                selectedType ||
                selectedLevel ||
                selectedAffiliation ||
                selectedFaculty) && (
                <button
                  onClick={clearFilters}
                  className='flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 transition-colors'
                >
                  <X className='w-4 h-4' />
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className='bg-white rounded-[32px] p-8 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 mb-12'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6'>
                {/* Search */}
                <div className='lg:col-span-4'>
                  <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                    Search
                  </label>
                  <div className='relative group'>
                    <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#0A6FA7] transition-colors' />
                    <input
                      type='text'
                      placeholder='Search by exam title...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className='w-full px-5 py-3.5 pl-12 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm'
                    />
                  </div>
                </div>

                {/* Exam Type */}
                <div className='lg:col-span-2'>
                  <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className='w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer'
                  >
                    <option value=''>All Types</option>
                    <option value='Written'>Written</option>
                    <option value='Practical'>Practical</option>
                    <option value='Oral'>Oral</option>
                  </select>
                </div>

                {/* Study Level */}
                <div className='lg:col-span-2'>
                  <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className='w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer'
                  >
                    <option value=''>All Levels</option>
                    {levels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Affiliation */}
                <div className='lg:col-span-2'>
                  <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                    Affiliation
                  </label>
                  <select
                    value={selectedAffiliation}
                    onChange={(e) => setSelectedAffiliation(e.target.value)}
                    className='w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer'
                  >
                    <option value=''>All Universities</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.fullname}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discipline */}
                <div className='lg:col-span-2'>
                  <label className='block text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                    Discipline
                  </label>
                  <select
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className='w-full px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50/50 outline-none focus:ring-2 focus:ring-[#0A6FA7]/10 focus:border-[#0A6FA7] focus:bg-white transition-all text-sm font-bold appearance-none cursor-pointer'
                  >
                    <option value=''>All Disciplines</option>
                    {faculties.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Section */}
            {loading || isScrolling ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {[...Array(6)].map((_, index) => (
                  <ExamShimmer key={index} />
                ))}
              </div>
            ) : exams.length === 0 ? (
              <div className='bg-white rounded-[40px] p-20 shadow-[0_2px_15px_rgba(0,0,0,0.01)] border border-gray-100'>
                <EmptyState
                  icon={ClipboardCheck}
                  title='No Exams Found'
                  description={
                    search ||
                    selectedType ||
                    selectedLevel ||
                    selectedAffiliation ||
                    selectedFaculty
                      ? 'No exams match your current filter criteria. Try adjusting your selections.'
                      : 'No exams are currently available at the moment.'
                  }
                  action={
                    search ||
                    selectedType ||
                    selectedLevel ||
                    selectedAffiliation ||
                    selectedFaculty
                      ? {
                          label: 'Clear All Filters',
                          onClick: clearFilters
                        }
                      : null
                  }
                />
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      className='group h-full bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:border-[#0A6FA7]/20 transition-all duration-300 flex flex-col'
                    >
                      <div className='flex items-start justify-between mb-6'>
                        <div className='bg-blue-50 p-4 rounded-2xl group-hover:bg-[#0A6FA7]/10 transition-colors'>
                          <ClipboardCheck className='w-6 h-6 text-[#0A6FA7]' />
                        </div>
                        <div className='flex flex-col items-end gap-2'>
                          {exam.level?.title && (
                            <span className='px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-gray-100'>
                              {exam.level.title}
                            </span>
                          )}
                          {exam.exam_details?.[0]?.exam_type && (
                            <span className='px-3 py-1 bg-[#30AD8F]/10 rounded-full text-[10px] font-bold text-[#30AD8F] uppercase tracking-wider'>
                              {exam.exam_details[0].exam_type}
                            </span>
                          )}
                        </div>
                      </div>

                      <h2 className='text-xl font-bold text-gray-900 mb-4 group-hover:text-[#0A6FA7] transition-colors line-clamp-2 min-h-[3.5rem]'>
                        {exam.title}
                      </h2>

                      {exam.examUniversity?.fullname && (
                        <p className='text-sm text-gray-500 font-bold mb-6 flex items-center gap-2'>
                          <Building2 className='w-4 h-4 text-gray-400' />
                          {exam.examUniversity.fullname}
                        </p>
                      )}

                      <div className='mt-auto space-y-4 pt-6 border-t border-gray-50'>
                        {exam.application_details?.length > 0 ? (
                          <div className='grid grid-cols-2 gap-4'>
                            <div className='flex flex-col'>
                              <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                                Closing Date
                              </span>
                              <span className='text-sm font-bold text-gray-700'>
                                {FormatDate.formatDate(
                                  exam.application_details[0].closing_date
                                ) ?? 'TBD'}
                              </span>
                            </div>
                            <div className='flex flex-col text-right'>
                              <span className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
                                Exam Date
                              </span>
                              <span className='text-sm font-bold text-[#0A6FA7]'>
                                {FormatDate.formatDate(
                                  exam.application_details[0].exam_date
                                ) ?? 'TBD'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className='text-xs font-bold text-gray-400 text-center py-2 bg-gray-50 rounded-xl'>
                            Dates to be announced
                          </p>
                        )}

                        <button
                          onClick={() => handleClick(exam?.id)}
                          className='w-full py-3.5 rounded-2xl bg-[#0A6FA7] hover:bg-[#085e8a] text-white text-sm font-extrabold shadow-md shadow-[#0A6FA7]/20 transition-all hover:scale-[1.02] active:scale-95'
                        >
                          View Exam Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className='mt-16 bg-white py-6 px-10 rounded-[32px] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.01)] flex justify-center'>
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <SingleExam exam={singleExam} />
      )}
      <Footer />
    </>
  )
}
