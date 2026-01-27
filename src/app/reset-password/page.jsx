'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { DotenvConfig } from '../../config/env.config'

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
        }, 4000)
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
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='max-w-md w-full bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold text-center text-gray-800'>
          Reset Password
        </h2>
        <p className='text-sm text-gray-600 text-center mb-4'>
          Enter your OTP and new password.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email (Read-Only) */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              readOnly
              className='w-full px-4 py-2 border bg-gray-200 rounded-lg focus:outline-none cursor-not-allowed'
            />
          </div>

          {/* OTP Input */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              OTP
            </label>
            <input
              type='text'
              name='otp'
              value={formData.otp}
              onChange={handleChange}
              required
              maxLength={6}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
          </div>

          <div className='relative'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name='newPassword'
              placeholder='Password'
              value={formData.newPassword}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
            <button
              type='button'
              onClick={togglePassword}
              className='absolute right-3 top-[45px] transform -translate-y-1/2 text-gray-500'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className='relative'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Retype Password
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              placeholder='Re-enter new password'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-[45px] transform -translate-y-1/2 text-gray-500'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {passwordError && (
            <p className='text-red-500 text-sm'>{passwordError}</p>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className='w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed'
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
