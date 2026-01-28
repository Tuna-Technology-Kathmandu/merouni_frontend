'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'
import { DotenvConfig } from '../../config/env.config'
import Link from 'next/link'

const ResetPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromURL = searchParams.get('email') || ''

  const [formData, setFormData] = useState({
    email: emailFromURL,
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const togglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  useEffect(() => {
    setFormData((prev) => ({ ...prev, email: emailFromURL }))
  }, [emailFromURL])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })

    if (e.target.name === 'confirmPassword') {
      if (e.target.value !== formData.newPassword) {
        setPasswordError('Passwords do not match!')
      } else {
        setPasswordError('')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.otp.length !== 6) {
      toast.error('OTP must be 6 digits')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: formData.email,
            otp: formData.otp,
            new_password: formData.newPassword
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset successfully! You can now sign in.')
        setTimeout(() => {
          router.push('/sign-in')
        }, 3000)
      } else {
        toast.error(data.message || 'Failed to reset password')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4'>
      <div className='w-full max-w-md mb-4 text-left'>
        <Link
          href='/sign-in'
          className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A6FA7] transition-colors font-medium'
        >
          <FaArrowLeft className='w-3 h-3' />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className='max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>
        <div className='mb-6'>
          <h2 className='text-3xl font-extrabold text-gray-900'>
            Reset Password
          </h2>
          <p className='mt-2 text-sm text-gray-500 font-medium'>
            Enter your OTP and new password
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              readOnly
              className='w-full px-4 py-3 border bg-gray-50 rounded-xl focus:outline-none cursor-not-allowed text-sm text-gray-500'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>OTP</label>
            <input
              type='text'
              name='otp'
              value={formData.otp}
              onChange={handleChange}
              required
              maxLength={6}
              placeholder='XXXXXX'
              className='w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm'
            />
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>New Password</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='newPassword'
                placeholder='••••••••'
                value={formData.newPassword}
                onChange={handleChange}
                className='w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm'
              />
              <button
                type='button'
                onClick={togglePassword}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Confirm Password</label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                placeholder='••••••••'
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm ${passwordError ? 'border-red-500 bg-red-50/20' : ''}`}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {passwordError && (
              <p className='text-red-500 text-[10px] ml-1'>{passwordError}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3.5 px-6 bg-[#0A6FA7] text-white rounded-xl font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-4 text-sm'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
