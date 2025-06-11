import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useFormContext } from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { fetchCourse } from './actions'

const CKUni = dynamic(() => import('../component/CKUni'), {
  ssr: false
})

const AdmissionItem = ({
  index,
  remove,
  register,
  setValue,
  getValues,
  initialCourseTitle,
  admissionFields
}) => {
  const [courseSearch, setCourseSearch] = useState(initialCourseTitle || '')
  const [debouncedCourseSearch] = useDebounce(courseSearch, 300)
  const [courses, setCourses] = useState([])
  const [showCourseDrop, setShowCourseDrop] = useState(false)
  const [hasSelectedCourse, setHasSelectedCourse] =
    useState(!!initialCourseTitle)
  const [loadingCourses, setLoadingCourses] = useState(false)

  useEffect(() => {
    if (hasSelectedCourse || courseSearch == '') return

    const fetchCourses = async () => {
      setLoadingCourses(true)
      try {
        const courseList = await fetchCourse(debouncedCourseSearch)
        setCourses(courseList)
        setShowCourseDrop(true)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoadingCourses(false)
      }
    }

    if (debouncedCourseSearch && !hasSelectedCourse) {
      fetchCourses()
    } else {
      setShowCourseDrop(false)
    }
  }, [debouncedCourseSearch, hasSelectedCourse])

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded'>
      <div className='relative'>
        <label className='block mb-2'>Course *</label>
        <input
          type='text'
          className='w-full p-2 border rounded'
          value={courseSearch}
          onChange={(e) => {
            const val = e.target.value
            setCourseSearch(val)
            setHasSelectedCourse(false)

            if (val.trim() === '') {
              setValue(`admissions.${index}.course_id`, '')
            }
          }}
          placeholder='Search Course'
        />

        <input type='hidden' {...register(`admissions.${index}.course_id`)} />

        {loadingCourses ? (
          <div className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md p-2'>
            Loading...
          </div>
        ) : showCourseDrop ? (
          courses.length > 0 ? (
            <ul className='absolute z-10 w-full bg-white border rounded max-h-60 overflow-y-auto shadow-md'>
              {courses.map((course) => (
                <li
                  key={course.id}
                  className='p-2 cursor-pointer hover:bg-gray-100'
                  onClick={() => {
                    setValue(`admissions.${index}.course_id`, Number(course.id))
                    setCourseSearch(course.title)
                    setShowCourseDrop(false)
                    setHasSelectedCourse(true)
                  }}
                >
                  {course.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className='absolute z-10 w-full bg-white border rounded shadow-md p-2 text-gray-500'>
              No courses found.
            </div>
          )
        ) : null}
      </div>

      <div>
        <label className='block mb-2'>Eligibility Criteria</label>
        <input
          {...register(`admissions.${index}.eligibility_criteria`)}
          className='w-full p-2 border rounded'
        />
      </div>

      <div>
        <label className='block mb-2'>Admission Process</label>
        <input
          {...register(`admissions.${index}.admission_process`)}
          className='w-full p-2 border rounded'
        />
      </div>

      <div>
        <label className='block mb-2'>Fee Details</label>
        <input
          {...register(`admissions.${index}.fee_details`)}
          className='w-full p-2 border rounded'
        />
      </div>

      <div className='md:col-span-2'>
        <label className='block mb-2'>Description</label>
        <CKUni
          key={`editor-${index}`}
          id={`editor-description-${index}`}
          initialData={getValues(`admissions.${index}.description`) || ''}
          onChange={(data) => setValue(`admissions.${index}.description`, data)}
        />
      </div>

      <button
        type='button'
        onClick={() => {
          if (admissionFields.length > 1) {
            // Remove the member if there are multiple
            remove(index)
          } else {
            // Clear values but keep the field if it's the last one
            setValue(`admissions.${index}`, {
              course_id: '',
              eligibility_criteria: '',
              admission_process: '',
              fee_details: '',
              description: ''
            })
            setCourseSearch('')
            setHasSelectedCourse(false)
          }
        }}
        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
      >
        {admissionFields.length > 1 ? 'Remove' : 'Clear'}
      </button>
    </div>
  )
}

export default AdmissionItem
