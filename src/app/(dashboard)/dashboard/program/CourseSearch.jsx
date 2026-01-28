import { useEffect, useState, useRef } from 'react'
import { useDebounce } from 'use-debounce'
import { fetchCourse } from './actions'

export default function CourseSearch({
  value,
  onChange,
  title = '',
  placeholder = 'Search Course',
  search,
  setSearch
}) {
  const [debouncedSearch] = useDebounce(search, 300)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const dropdownRef = useRef(null)

  // Set initial state
  useEffect(() => {
    if (title && !search && value) {
      setSearch(title)
      setSelectedCourse({ id: value, title })
    }
  }, [title, value])

  // Fetch courses
  useEffect(() => {
    // Don't search if we've just selected a course or if search is empty
    if (selectedCourse || !debouncedSearch) {
      setCourses([])
      setShowDropdown(false)
      return
    }

    const getCourses = async () => {
      setLoading(true)
      try {
        const data = await fetchCourse(debouncedSearch)
        setCourses(data)
        setShowDropdown(data.length > 0)
      } catch (err) {
        console.error('Course fetch error:', err)
        setCourses([])
        setShowDropdown(false)
      } finally {
        setLoading(false)
      }
    }

    getCourses()
  }, [debouncedSearch, selectedCourse])

  const handleSelect = (course) => {
    onChange(course.id, course.title)
    setSearch(course.title)
    setSelectedCourse(course)
    setCourses([])
    setShowDropdown(false)
  }

  const handleInputChange = (e) => {
    setSearch(e.target.value)
    if (value) {
      onChange('', '')
    }
    // Clear selection when user starts typing
    if (selectedCourse) {
      setSelectedCourse(null)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='relative' ref={dropdownRef}>
      <label className='block mb-2'>
        Course <span className='text-red-500'>*</span>
      </label>
      <input
        type='text'
        value={search}
        onChange={handleInputChange}
        className='w-full p-2 border rounded'
        placeholder={placeholder}
        onFocus={() => {
          if (search.trim() && courses.length > 0 && !selectedCourse) {
            setShowDropdown(true)
          }
        }}
      />

      {showDropdown && (
        <div className='absolute z-10 w-full bg-white border rounded shadow-md'>
          {loading ? (
            <div className='p-2 text-gray-500'>Loading...</div>
          ) : courses.length > 0 ? (
            <ul className='max-h-60 overflow-y-auto'>
              {courses.map((course) => (
                <li
                  key={course.id}
                  className='p-2 cursor-pointer hover:bg-gray-100'
                  onClick={() => handleSelect(course)}
                >
                  {course.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className='p-2 text-gray-500'>
              {debouncedSearch ? 'No courses found' : 'Start typing to search'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
