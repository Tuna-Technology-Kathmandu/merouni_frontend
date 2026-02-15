'use client'

import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { SearchableSelect } from '@/ui/shadcn/SearchableSelect'
import { useMutation } from '@tanstack/react-query'
import { destr } from 'destr'
import { GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FaSpinner as FaSpinnerIcon } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
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
        student_name: isLoggedIn
          ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
          : '',
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
    if (!formData.student_name && !isLoggedIn)
      newErrors.student_name = 'Name is required'
    if (!formData.student_email && !isLoggedIn)
      newErrors.student_email = 'Email is required'
    if (!formData.student_phone_no && !isLoggedIn)
      newErrors.student_phone_no = 'Phone number is required'
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
      const option = college.collegeCourses.find(
        (item) => String(item.id) === String(id)
      )
      if (option) {
        setFormData((prev) => ({ ...prev, course: option?.id }))
      }
    }
    return college.collegeCourses
  }, [id, college?.collegeCourses])

  if (isLoggedIn && isAgent) {
    return (
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center'>
        <div className='bg-gradient-to-r from-[#30ad8f] to-[#2c9a7f] p-8 text-white relative overflow-hidden mb-6'>
          <div className='relative z-10'>
            <div className='flex items-center justify-center gap-3 mb-2'>
              <GraduationCap className='w-8 h-8' />
              <h2 className='text-3xl font-bold'>Apply For College</h2>
            </div>
            <p className='text-teal-50/80'>
              Manage applications from your dashboard
            </p>
          </div>
          <div className='absolute -right-8 -bottom-8 opacity-10'>
            <GraduationCap size={160} />
          </div>
        </div>
        <div className='p-8 pt-0'>
          <p className='text-gray-600 mb-8'>
            As an agent, please visit your dashboard to manage student
            applications and tracking.
          </p>
          <Link href='/dashboard'>
            <Button className='min-w-[200px] h-12 text-lg font-semibold bg-[#30ad8f] hover:bg-[#2c9a7f] transition-all'>
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center'>
        <div className='bg-gradient-to-r from-[#30ad8f] to-[#2c9a7f] p-8 text-white relative overflow-hidden mb-6'>
          <div className='relative z-10'>
            <div className='flex items-center justify-center gap-3 mb-2'>
              <GraduationCap className='w-8 h-8' />
              <h2 className='text-3xl font-bold'>Apply For College</h2>
            </div>
            <p className='text-teal-50/80'>Login to begin your application</p>
          </div>
          <div className='absolute -right-8 -bottom-8 opacity-10'>
            <GraduationCap size={160} />
          </div>
        </div>
        <div className='p-8 pt-0'>
          <p className='text-gray-600 mb-8'>
            Join our community to apply for top colleges and track your progress
            in real-time.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/sign-in' className='w-full sm:w-auto'>
              <Button className='w-full min-w-[160px] h-12 text-lg font-semibold bg-[#30ad8f] hover:bg-[#2c9a7f] transition-all'>
                Login Now
              </Button>
            </Link>
            <Link href='/sign-in?mode=signup' className='w-full sm:w-auto'>
              <Button
                variant='outline'
                className='w-full min-w-[160px] h-12 text-lg font-semibold border-2 border-[#30ad8f] text-[#30ad8f] hover:bg-[#30ad8f]/10 transition-all'
              >
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
      <div className='bg-gradient-to-r from-[#30ad8f] to-[#2c9a7f] p-8 text-white relative overflow-hidden'>
        <div className='relative z-10 text-left'>
          <div className='flex items-center gap-3 mb-2'>
            <GraduationCap className='w-8 h-8' />
            <h2 className='text-3xl font-bold font-poppins'>
              Apply For College
            </h2>
          </div>
          <p className='text-teal-50/80'>Begin your academic journey today</p>
        </div>
        <div className='absolute -right-8 -bottom-8 opacity-10'>
          <GraduationCap size={160} />
        </div>
      </div>

      <div className='p-8 md:p-10'>
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
            {errors.student_name && (
              <p className='text-red-500 text-xs'>{errors.student_name}</p>
            )}
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
              {errors.student_email && (
                <p className='text-red-500 text-xs'>{errors.student_email}</p>
              )}
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
              {errors.student_phone_no && (
                <p className='text-red-500 text-xs'>
                  {errors.student_phone_no}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-4'>
            <SearchableSelect
              id='course'
              label='Select Program'
              options={courseOptions}
              displayKey={(opt) => opt?.program?.title || 'Unknown Program'}
              value={formData.course}
              onChange={(option) => {
                setFormData((prev) => ({ ...prev, course: option?.id || '' }))
                if (errors.course)
                  setErrors((prev) => ({ ...prev, course: '' }))
              }}
              placeholder='Search and select a program'
              error={errors.course}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='student_description'>Description </Label>
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
            className='w-full py-6 text-lg font-semibold h-12 bg-[#30ad8f] hover:bg-[#2c9a7f] transition-all shadow-md active:scale-[0.98]'
          >
            {applyMutation.isPending ? (
              <div className='flex items-center gap-2'>
                <FaSpinnerIcon className='animate-spin' />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default FormSection
