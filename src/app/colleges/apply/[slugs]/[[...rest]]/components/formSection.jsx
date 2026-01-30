'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { applyToCollege } from '../query/applyCollege.query'
import { FaSpinner } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

const FormSection = ({ id, college }) => {
  const user = useSelector((state) => state.user?.data)
  const parsedRole =
    typeof user?.role === 'string' ? destr(user.role) || {} : user?.role || {}
  const isStudent = !!parsedRole.student
  const isAgent = !!parsedRole.agent

  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
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
    course: ''
  })

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      college_id: college?.id || 0,
      ...(isLoggedIn &&
        user && {
        student_name:
          `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        student_email: user?.email || '',
        student_phone_no: user?.phoneNo || ''
      })
    }))
  }, [college?.id, isLoggedIn, user])

  const [errors, setErrors] = useState({})

  const applyMutation = useMutation({
    mutationFn: applyToCollege,
    onSuccess: (data) => {
      toast.success(data.message || 'College Applied Successfully')
      setFormData({
        college_id: college?.id || 0,
        student_name: isLoggedIn ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : '',
        student_phone_no: isLoggedIn ? user?.phoneNo || '' : '',
        student_email: isLoggedIn ? user?.email || '' : '',
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
    if (!formData.student_name && !isLoggedIn) newErrors.student_name = 'Name is required'
    if (!formData.student_email && !isLoggedIn) newErrors.student_email = 'Email is required'
    if (!formData.student_phone_no && !isLoggedIn) newErrors.student_phone_no = 'Phone number is required'
    if (!formData.course) newErrors.course = 'Please select a course'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
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

  const courseOptions = useMemo(() => {
    if (!college?.collegeCourses) return []
    if (id) {
      const option = college.collegeCourses.find((item) => String(item.id) === String(id))
      if (option) {
        setFormData((prev) => ({ ...prev, course: option?.id }))
      }
    }
    return college.collegeCourses
  }, [id, college?.collegeCourses])

  if (isLoggedIn && isAgent) {
    return (
      <div className='w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Apply For College</h2>
        <p className='text-gray-600 mb-6'>As an agent, please visit your dashboard to manage applications.</p>
        <Link href='/dashboard'>
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className='w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Apply For College</h2>
        <p className='text-gray-600 mb-6'>Please login or sign up to apply for this college.</p>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
          <Link href='/sign-in' className='w-full sm:w-auto'>
            <Button className='w-full'>Login</Button>
          </Link>
          <Link href='/signup' className='w-full sm:w-auto'>
            <Button variant='outline' className='w-full'>Sign Up</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-2xl bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-10'>
      <h2 className='text-2xl font-bold text-gray-900 mb-8 border-b pb-4'>Apply For College</h2>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <div className='space-y-2'>
          <Label htmlFor='student_name'>Full Name</Label>
          <Input
            id='student_name'
            name='student_name'
            placeholder='Student Name'
            value={formData.student_name}
            onChange={handleChange}
            disabled={isLoggedIn}
            className={errors.student_name ? 'border-red-500' : ''}
          />
          {errors.student_name && <p className='text-red-500 text-xs'>{errors.student_name}</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <Label htmlFor='student_email'>Email Address</Label>
            <Input
              id='student_email'
              type='email'
              name='student_email'
              placeholder='Email Address'
              value={formData.student_email}
              onChange={handleChange}
              disabled={isLoggedIn}
              className={errors.student_email ? 'border-red-500' : ''}
            />
            {errors.student_email && <p className='text-red-500 text-xs'>{errors.student_email}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='student_phone_no'>Phone Number</Label>
            <Input
              id='student_phone_no'
              type='tel'
              name='student_phone_no'
              placeholder='Phone Number'
              value={formData.student_phone_no}
              onChange={handleChange}
              disabled={isLoggedIn}
              className={errors.student_phone_no ? 'border-red-500' : ''}
            />
            {errors.student_phone_no && <p className='text-red-500 text-xs'>{errors.student_phone_no}</p>}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='course'>Select Program</Label>
          <Select
            id='course'
            name='course'
            value={formData.course}
            onChange={(e) => {
              handleChange(e)
              if (errors.course) setErrors(prev => ({ ...prev, course: '' }))
            }}
            className={errors.course ? 'border-red-500' : ''}
          >
            <option value=''>Select a program</option>
            {courseOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item?.program?.title}
              </option>
            ))}
          </Select>
          {errors.course && <p className='text-red-500 text-xs'>{errors.course}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='student_description'>Description (Optional)</Label>
          <textarea
            id='student_description'
            name='student_description'
            placeholder='Additional information...'
            value={formData.student_description}
            onChange={handleChange}
            rows={4}
            className='flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none'
          />
        </div>

        <Button
          type='submit'
          disabled={applyMutation.isPending}
          className='w-full py-6 text-lg font-semibold h-12'
        >
          {applyMutation.isPending ? (
            <div className='flex items-center gap-2'>
              <FaSpinner className='animate-spin' />
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit Application'
          )}
        </Button>
      </form>
    </div>
  )
}

export default FormSection
