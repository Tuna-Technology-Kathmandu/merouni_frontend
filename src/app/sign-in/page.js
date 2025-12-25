'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaArrowLeft } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { jwtDecode } from 'jwt-decode'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const SignInPage = ({ defaultMode = 'login' }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId')
    if (!deviceId) {
      deviceId = uuidv4()
      localStorage.setItem('deviceId', deviceId)
    }
    return deviceId
  }

  // Check URL search params or prop to determine if we should show signup mode
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const mode = searchParams.get('mode')
      if (mode === 'signup') return false
      if (mode === 'login') return true
    }
    return defaultMode === 'login'
  })
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    password: ''
  })
  const [errors, setErrors] = useState({})

  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const validateForm = () => {
    const newErrors = {}
    if (!isLogin) {
      if (!formData.firstName.trim())
        newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim())
        newErrors.lastName = 'Last name is required'
      if (!formData.phoneNo.trim()) {
        newErrors.phoneNo = 'Phone number is required'
      } else if (!/^\d{10}$/.test(formData.phoneNo)) {
        newErrors.phoneNo = 'Phone number must be 10 digits'
      }
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
    // Clear the error as the user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * SIGN IN FORM MUTATION
   */
  const signInFormMutation = useMutation({
    mutationFn: async () => {
      const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register'
      const filteredData = isLogin
        ? {
            email: formData.email,
            password: formData.password,
            deviceName: navigator.userAgent
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNo: formData.phoneNo,
            password: formData.password
          }

      const response = await axios.post(
        `${process.env.baseUrl}${endpoint}`,
        filteredData,
        {
          headers: {
            'Content-Type': 'application/json',
            'device-id': getDeviceId()
          },
          withCredentials: true
        }
      )

      // Validate response
      if (isLogin) {
        if (!response.data?.accessToken || !response.data?.refreshToken) {
          throw new Error('Authentication tokens missing in response')
        }

        const { accessToken, refreshToken } = response.data
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
      }

      return response.data
    },
    onSuccess: (data, variables, context) => {
      if (isLogin) {
        const decodedToken = jwtDecode(data.accessToken)
        dispatch(addUser({ ...decodedToken }))
        toast.success('Login successful!')
        router.push('/dashboard')
      } else {
        setFormData({
          firstName: '',
          email: '',
          lastName: '',
          password: '',
          phoneNo: ''
        })
        toast.success('Account created! Please verify your email.')
        router.push(`/verify-otp?email=${formData.email}`)
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Something went wrong. Please try again.'
        toast.error(message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    signInFormMutation.mutate()
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md'>
        <div>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 underline mb-4'
          >
            <FaArrowLeft className='w-3 h-3' />
            <span>Back to homepage</span>
          </Link>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        <form onSubmit={handleSubmit} className='mt-8 space-y-6'>
          {!isLogin && (
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <input
                  type='text'
                  name='firstName'
                  placeholder='First Name'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-blue-500`}
                />
                {errors.firstName && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-blue-500`}
                />
                {errors.lastName && (
                  <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>
                )}
              </div>
            </div>
          )}
          <div>
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-blue-500`}
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
            )}
          </div>
          {!isLogin && (
            <div>
              <input
                type='tel'
                name='phoneNo'
                placeholder='Phone Number'
                value={formData.phoneNo}
                onChange={handleChange}
                className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                  errors.phoneNo ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500`}
                maxLength={10}
              />
              {errors.phoneNo && (
                <p className='text-red-500 text-xs mt-1'>{errors.phoneNo}</p>
              )}
            </div>
          )}
          <div>
            <div className='relative flex flex-row'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-lg w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-blue-500`}
              />
              <button
                type='button'
                onClick={togglePassword}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {errors.password && (
              <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
            )}
            {isLogin && (
              <Link href={`/forgot-password`} className='hover:cursor-pointer '>
                <button type='button' className='text-blue-600 hover:underline'>
                  Forgot Password?
                </button>
              </Link>
            )}
          </div>

          <div>
            <button
              type='submit'
              disabled={signInFormMutation?.isPending}
              className='w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300'
            >
              {signInFormMutation?.isPending
                ? 'Processing...'
                : isLogin
                  ? 'Sign in'
                  : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignInPage
