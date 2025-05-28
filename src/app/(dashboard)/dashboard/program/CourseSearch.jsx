import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { fetchCourse } from './actions'

export default function CourseSearch({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)

  useEffect(() => {
    if (hasSelected) return

    const getCourses = async () => {
      setLoading(true)
      try {
        const data = await fetchCourse(debouncedSearch)
        setCourses(data)
        setShowDropdown(true)
      } catch (err) {
        console.error('Course fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (debouncedSearch !== '') {
      getCourses()
    } else {
      setShowDropdown(false)
    }
  }, [debouncedSearch, hasSelected])

  return (
    <div className='relative'>
      <label className='block mb-2'>Course*</label>
      <input
        type='text'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setHasSelected(false)
        }}
        className='w-full p-2 border rounded'
        placeholder='Search Course'
      />

      {loading && (
        <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2'>
          Loading...
        </div>
      )}

      {showDropdown && courses.length > 0 && (
        <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
          {courses.map((course) => (
            <li
              key={course.id}
              className='p-2 cursor-pointer hover:bg-gray-100'
              onClick={() => {
                onChange(course.id)
                setSearch(course.title)
                setShowDropdown(false)
                setHasSelected(true)
              }}
            >
              {course.title}
            </li>
          ))}
        </ul>
      )}

      {!loading && showDropdown && courses.length === 0 && (
        <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
          No course found.
        </div>
      )}
    </div>
  )
}
