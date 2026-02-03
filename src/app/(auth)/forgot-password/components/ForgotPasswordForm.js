'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'
import { DotenvConfig } from '../../../../config/env.config'

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email })
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success('Reset link sent to your email!')
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
      } else {
        toast.error(data.message || 'Failed to send reset link.')
      }
    } catch (error) {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center w-full'>
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
            Forgot Password
          </h2>
          <p className='mt-2 text-sm text-gray-500 font-medium'>
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Email</label>
            <input
              type='email'
              placeholder='your@email.com'
              className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3.5 px-6 bg-[#0A6FA7] text-white rounded-xl font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 mt-4 text-sm'
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default ForgotPasswordForm
