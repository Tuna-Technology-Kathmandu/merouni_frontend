'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const FormSection = ({ id, college }) => {
  const [formData, setFormData] = useState({
    college_id: college?.id || 0,
    student_name: '',
    student_phone_no: '',
    student_email: '',
    student_description: '',
    course: '' //later change with the backend
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      college_id: college?.id || 0
    }))
  }, [college?.id])

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('select course')

  const validateForm = () => {
    const newErrors = {}

    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Student name is required'
    }

    if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
        formData.student_email
      )
    ) {
      newErrors.student_email = 'Invalid email format'
    }

    if (!/^\d{10}$/.test(formData.student_phone_no)) {
      newErrors.student_phone_no = 'Phone number must be exactly 10 digits'
    }

    if (!formData.student_description.trim()) {
      newErrors.student_description = 'Description is required'
    }
    if (!formData.course) {
      newErrors.course = 'Please select a course'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/referral/self-apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()
      if (response.ok) {
        toast.success(data.message || 'College Applied Successfully')
        setFormData({
          college_id: '',
          student_name: '',
          student_phone_no: '',
          student_email: '',
          student_description: '',
          course: ''
        })
      } else {
        toast.error(data?.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Connection error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const courseOption = React.useMemo(() => {
    if (!college?.collegeCourses) return []

    if (id) {
      const options = college.collegeCourses.filter((item) => item.id == id)
      if (options.length > 0) {
        setSelectedCourse(options[0]?.program?.title)
        setFormData((prev) => ({ ...prev, course: options[0]?.id }))
      }
    }
    return college.collegeCourses
  }, [id, college?.collegeCourses])

  //for drop down selection

  const handleDrop = (courseId, courseTitle) => {
    setShowDrop(false)
    setSelectedCourse(courseTitle)
    setFormData((prev) => ({
      ...prev,
      course: courseId
    }))
  }

  console.log(formData)

  return (
    <div className='flex flex-col items-center bg-[#D9D9D9] bg-opacity-30 p-6'>
      <h2 className='text-center text-3xl font-bold mb-6'>Apply For College</h2>
      <div className='w-full max-w-3xl bg-white shadow-lg rounded-lg p-6'>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <input
              type='text'
              name='student_name'
              placeholder='Student Name'
              value={formData.student_name}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_name && (
              <p className='text-red-500 text-sm'>{errors.student_name}</p>
            )}
          </div>
          <div>
            <input
              type='email'
              name='student_email'
              placeholder='Student Email'
              value={formData.student_email}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_email && (
              <p className='text-red-500 text-sm'>{errors.student_email}</p>
            )}
          </div>
          <div>
            <input
              type='tel'
              name='student_phone_no'
              placeholder='Student Phone Number'
              value={formData.student_phone_no}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_phone_no && (
              <p className='text-red-500 text-sm'>{errors.student_phone_no}</p>
            )}
          </div>
          <div className='relative'>
            <h1
              onClick={() => setShowDrop(!showDrop)}
              className={`${selectedCourse == 'select course' ? 'text-black/40' : 'text-black'} w-full px-4 py-2 border rounded-lg cursor-pointer `}
            >
              {selectedCourse}
            </h1>
            {showDrop && (
              <div className='absolute bg-white w-full rounded-lg mt-3 border border-ring-blue-500 overflow-hidden'>
                {courseOption.map((item, index) => {
                  return (
                    <div
                      onClick={() => handleDrop(item?.id, item?.program?.title)}
                      key={index}
                      className={`w-full hover:bg-slate-100 cursor-pointer py-2 px-4 ${index !== courseOption.length - 1 ? 'border-b-black/50 border-b-[0.4px]' : ''}`}
                    >
                      <p>{item?.program?.title}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div>
            <textarea
              name='student_description'
              placeholder='Enter your description here..'
              value={formData.student_description}
              onChange={handleChange}
              rows={3}
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.student_description && (
              <p className='text-red-500 text-sm'>
                {errors.student_description}
              </p>
            )}
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-[#011E3F] bg-opacity-80 text-white font-semibold py-2 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#011E3F]'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormSection
