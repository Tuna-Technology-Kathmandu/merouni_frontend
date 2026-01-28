'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { jwtDecode } from 'jwt-decode'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { DotenvConfig } from '../../config/env.config'

const SignInPage = ({ defaultMode = 'login' }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const getDeviceId = () => {
    let deviceId = typeof window !== 'undefined' ? localStorage.getItem('deviceId') : null
    if (!deviceId && typeof window !== 'undefined') {
      deviceId = uuidv4()
      localStorage.setItem('deviceId', deviceId)
    }
    return deviceId
  }

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

  const togglePassword = () => setShowPassword((prev) => !prev)

  const validateForm = () => {
    const newErrors = {}
    if (!isLogin) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
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
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const signInFormMutation = useMutation({
    mutationFn: async () => {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const filteredData = isLogin
        ? {
          email: formData.email,
          password: formData.password,
          deviceName: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
        }
        : {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNo: formData.phoneNo,
          password: formData.password
        }

      const response = await axios.post(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}${endpoint}`,
        filteredData,
        {
          headers: {
            'Content-Type': 'application/json',
            'device-id': getDeviceId()
          }
        }
      )

      if (isLogin) {
        if (!response.data?.accessToken || !response.data?.refreshToken) {
          throw new Error('Authentication tokens missing')
        }
        localStorage.setItem('access_token', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }

      return response.data
    },
    onSuccess: (data) => {
      if (isLogin) {
        try {
          const decodedToken = jwtDecode(data.accessToken)
          dispatch(addUser({ ...decodedToken }))
          toast.success('Login successful!')
          router.push('/dashboard')
        } catch (e) {
          toast.error("Error signing in. Please try again.")
        }
      } else {
        toast.success('Account created! Please verify your email.')
        router.push(`/verify-otp?email=${formData.email}`)
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) signInFormMutation.mutate()
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4'>
      <div className='w-full max-w-md mb-4 text-left'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A6FA7] transition-colors font-medium'
        >
          <FaArrowLeft className='w-3 h-3' />
          <span>Back to homepage</span>
        </Link>
      </div>

      <div className='max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>
        <div className='mb-6'>
          <h2 className='text-3xl font-extrabold text-gray-900'>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className='mt-2 text-sm text-gray-500 font-medium'>
            {isLogin ? 'Welcome back to Mero Uni' : 'Join our academic community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {!isLogin && (
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>First Name</label>
                <input
                  type='text'
                  name='firstName'
                  placeholder='First Name'
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
                />
                {errors.firstName && <p className='text-red-500 text-[10px] ml-1'>{errors.firstName}</p>}
              </div>
              <div className='space-y-1.5'>
                <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Last Name</label>
                <input
                  type='text'
                  name='lastName'
                  placeholder='Last Name'
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
                />
                {errors.lastName && <p className='text-red-500 text-[10px] ml-1'>{errors.lastName}</p>}
              </div>
            </div>
          )}

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Email</label>
            <input
              type='email'
              name='email'
              placeholder='Email Address'
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
            />
            {errors.email && <p className='text-red-500 text-[10px] ml-1'>{errors.email}</p>}
          </div>

          {!isLogin && (
            <div className='space-y-1.5'>
              <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Phone</label>
              <input
                type='tel'
                name='phoneNo'
                placeholder='Phone Number'
                value={formData.phoneNo}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.phoneNo ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
                maxLength={10}
              />
              {errors.phoneNo && <p className='text-red-500 text-[10px] ml-1'>{errors.phoneNo}</p>}
            </div>
          )}

          <div className='space-y-1.5'>
            <div className='flex justify-between items-center ml-1'>
              <label className='text-xs font-bold text-gray-700 uppercase tracking-widest'>Password</label>
              {isLogin && (
                <Link href="/forgot-password" size="sm" className='text-xs font-bold text-[#0A6FA7] hover:underline'>
                  Forgot?
                </Link>
              )}
            </div>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
              />
              <button
                type='button'
                onClick={togglePassword}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className='text-red-500 text-[10px] ml-1'>{errors.password}</p>}
          </div>

          <button
            type='submit'
            disabled={signInFormMutation?.isPending}
            className='w-full py-3.5 px-6 bg-[#0A6FA7] text-white rounded-xl font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-4 text-sm'
          >
            {signInFormMutation?.isPending ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className='mt-8 text-center text-sm font-medium'>
          <span className='text-gray-500'>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className='text-[#0A6FA7] font-bold hover:underline transition-all'
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
