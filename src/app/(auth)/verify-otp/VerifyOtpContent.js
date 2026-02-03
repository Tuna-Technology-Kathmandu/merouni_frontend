'use client'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

const VerifyOtpContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const inputRefs = useRef(Array(6).fill(null))

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    const lastFilledIndex = newOtp.findLastIndex((val) => val !== '')
    const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
    inputRefs.current[focusIndex]?.focus()
  }

  const handleResendOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.baseUrl}/auth/resend-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ email })
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success('New OTP sent successfully!')
      } else {
        toast.error(data.message || 'Failed to resend OTP')
      }
    } catch (err) {
      toast.error('Connection error. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.baseUrl}/auth/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ otp: otpString, email })
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success('Successfully verified!')
        router.push('/sign-in')
      } else {
        toast.error(data.message || 'OTP verification failed')
      }
    } catch (err) {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='w-full max-w-md mb-4 text-left font-medium'>
        <Link
          href='/sign-in'
          className='inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#0A6FA7] transition-colors'
        >
          <FaArrowLeft className='w-3 h-3' />
          <span>Back to Login</span>
        </Link>
      </div>

      <div className='max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>
        <div className='mb-8'>
          <h2 className='text-3xl font-extrabold text-gray-900'>
            Verify Email
          </h2>
          <p className='mt-2 text-sm text-gray-500 font-medium'>
            We've sent a 6-digit code to {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='flex gap-3 justify-center'>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className='w-11 h-14 text-center text-xl font-bold border rounded-xl focus:border-[#0A6FA7] focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all'
                required
              />
            ))}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-4 px-6 bg-[#0A6FA7] text-white rounded-xl font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm tracking-wide'
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-500 font-medium'>
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOtp}
              className='font-bold text-[#0A6FA7] hover:underline focus:outline-none'
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtpContent
