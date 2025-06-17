import { useState } from 'react'

const Syllabus = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [syllabus, setSyllabus] = useState([])
  const [subject, setSubject] = useState([])

  useEffect(() => {
    const getCourses = async () => {
      if (!debouncedSearch) {
        setSubject([])
        setShowDropdown(false)
        return
      }

      setLoading(true)
      try {
        const data = await fetchCourse(debouncedSearch)
        setSubject(data)
        setShowDropdown(true)
      } catch (err) {
        console.error('Course fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    getCourses()
  }, [debouncedSearch])

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Syllabus</h2>
        <button
          type='button'
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
        >
          Add Course
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded'>
        <div>
          <label className='block mb-2'>Year</label>
          <input type='number' className='w-full p-2 border rounded' min='1' />
        </div>

        <div>
          <label className='block mb-2'>Semester</label>
          <input type='number' className='w-full p-2 border rounded' min='1' />
        </div>

        <div>
          <label className='block mb-2'>Subject</label>
          <input type='text' className='w-full p-2 border rounded' min='1' />
        </div>

        <button
          type='button'
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
        >
          Remove
        </button>
      </div>
    </div>
  )
}
export default Syllabus
