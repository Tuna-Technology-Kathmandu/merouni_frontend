'use client'

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { applyToCollege } from '../query/applyCollege.query'

const FormSection = ({ id, college }) => {
  const user = useSelector((state) => state.user?.data)
  const parsedRole =
    typeof user?.role === 'string' ? destr(user.role) || {} : user?.role || {}
  const isStudent = !!parsedRole.student
  const isAgent = !!parsedRole.agent

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check both Redux state and localStorage
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null
    const hasUser = user !== null && user !== undefined
    setIsLoggedIn(!!(token || hasUser))
  }, [user])

  const [formData, setFormData] = useState({
    college_id: college?.id || 0,
    student_name: '',
    student_phone_no: '',
    student_email: '',
    student_description: '',
    course: '' // later change with the backend
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      college_id: college?.id || 0,
      // Pre-fill student info if logged in
      ...(isLoggedIn &&
        user && {
          student_name:
            `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
          student_email: user?.email || '',
          student_phone_no: user?.phoneNo || ''
        })
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    college?.id,
    isLoggedIn,
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.phoneNo
  ])

  const [errors, setErrors] = useState({})
  const [showDrop, setShowDrop] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('select course')

  // TanStack Query mutation for applying to college
  const applyMutation = useMutation({
    mutationFn: applyToCollege,
    onSuccess: (data) => {
      toast.success(data.message || 'College Applied Successfully')
      setFormData({
        college_id: '',
        student_name: '',
        student_phone_no: '',
        student_email: '',
        student_description: '',
        course: ''
      })
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong. Please try again.')
    }
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.student_description.trim()) {
      // description is optional now; no error if empty
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

    const payload = isStudent
      ? {
          student_id: user?.id,
          referral_type: 'self',
          college_id: formData.college_id,
          course_id: formData.course || null,
          description: formData.student_description
        }
      : {
          college_id: formData.college_id,
          student_name: formData.student_name,
          student_phone_no: formData.student_phone_no,
          student_email: formData.student_email,
          student_description: formData.student_description,
          course: formData.course
        }

    applyMutation.mutate({ payload, isStudent })
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

  // If user is an agent, show message to visit dashboard
  if (isLoggedIn && isAgent) {
    return (
      <div className='w-full max-w-3xl bg-white bg-opacity-95 backdrop-blur-sm shadow-lg rounded-lg p-8'>
        <h2 className='text-center text-2xl font-bold mb-6'>
          Apply For College
        </h2>
        <div className='text-center space-y-4'>
          <p className='text-gray-700 text-lg'>Visit Dashboard to apply.</p>
          <div className='flex items-center justify-center gap-4 pt-4'>
            <Link href='/dashboard'>
              <button className='px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
                Go to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // If not logged in, show login/signup buttons
  if (!isLoggedIn) {
    return (
      <div className='w-full max-w-3xl bg-white bg-opacity-95 backdrop-blur-sm shadow-lg rounded-lg p-8'>
        <h2 className='text-center text-2xl font-bold mb-6'>
          Apply For College
        </h2>
        <div className='text-center space-y-4'>
          <p className='text-gray-700 text-lg'>
            Please login or sign up to apply for this college.
          </p>
          <div className='flex items-center justify-center gap-4 pt-4'>
            <Link href='/sign-in'>
              <button className='px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
                Login
              </button>
            </Link>
            <Link href='/signup'>
              <button className='px-6 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors'>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-3xl bg-white bg-opacity-95 backdrop-blur-sm shadow-lg rounded-lg p-8'>
      <h2 className='text-center text-2xl font-bold mb-6'>Apply For College</h2>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            name='student_name'
            placeholder='Student Name'
            value={formData.student_name}
            onChange={handleChange}
            disabled={isLoggedIn}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
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
            disabled={isLoggedIn}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
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
            disabled={isLoggedIn}
            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
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
            <div className='absolute bg-white w-full rounded-lg mt-3 border border-ring-blue-500 overflow-y-auto max-h-[200px] z-10 shadow-lg'>
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
            <p className='text-red-500 text-sm'>{errors.student_description}</p>
          )}
        </div>
        <button
          type='submit'
          disabled={applyMutation.isPending}
          className={`w-full bg-[#011E3F] bg-opacity-80 text-white font-semibold py-2 rounded-lg transition duration-200 ${
            applyMutation.isPending
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#011E3F]'
          }`}
        >
          {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}

export default FormSection
