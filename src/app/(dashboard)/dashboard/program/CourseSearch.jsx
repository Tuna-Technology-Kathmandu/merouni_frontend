import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { fetchCourse } from './actions'

export default function CourseSearch({ value, onChange, title }) {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Set initial title only once on mount
  useEffect(() => {
    if (title && !search) {
      setSearch(title)
    }
  }, [title])

  // Fetch courses based on search
  useEffect(() => {
    const getCourses = async () => {
      if (!debouncedSearch) {
        setCourses([])
        setShowDropdown(false)
        return
      }

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

    getCourses()
  }, [debouncedSearch])

  return (
    <div className='relative'>
      <label className='block mb-2'>Course*</label>
      <input
        type='text'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          // Clear selection if user starts typing something else
          if (value) {
            onChange('')
          }
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
