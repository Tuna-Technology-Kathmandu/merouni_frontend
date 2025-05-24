'use client'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const ForgotPasswordForm = ({ onSuccess }) => {
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
        `${process.env.baseUrl}${process.env.version}/auth/forgot-password`,
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
    <div className='max-w-md w-full space-y-6 bg-white p-6 rounded-xl shadow-lg'>
      <h2 className='text-center text-2xl font-bold text-gray-900'>
        Forgot Password
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='email'
          placeholder='Enter your email'
          className='w-full px-4 py-3 border rounded-lg focus:border-blue-500 focus:ring-blue-500'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-blue-300'
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  )
}

export default ForgotPasswordForm
