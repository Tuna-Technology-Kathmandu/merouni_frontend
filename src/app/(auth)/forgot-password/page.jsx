'use client'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const STEP_EMAIL = 'email'
const STEP_OTP = 'otp'
const STEP_RESET = 'reset'
const STEP_SUCCESS = 'success'

const STEPS = [STEP_EMAIL, STEP_OTP, STEP_RESET]
const STEP_LABELS = ['Email', 'Verify OTP', 'New Password']

export default function ForgotPasswordPage() {
    const router = useRouter()

    const [step, setStep] = useState(STEP_EMAIL)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [otpError, setOtpError] = useState('')
    const inputRefs = useRef(Array(6).fill(null))

    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' })
    const [passwordErrors, setPasswordErrors] = useState({})
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)

    const stepIndex = STEPS.indexOf(step)

    useEffect(() => {
        if (step === STEP_OTP) {
            inputRefs.current[0]?.focus()
        }
    }, [step])

    // ── Step 1: Send OTP ────────────────────────────────────────────────────────
    const sendOtpMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.post(
                `${process.env.baseUrl}/auth/forgot-password`,
                { email },
                { headers: { 'Content-Type': 'application/json' } }
            )
            return res.data
        },
        onSuccess: () => {
            toast.success('OTP sent to your email!')
            setStep(STEP_OTP)
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to send OTP. Please try again.')
        }
    })

    const handleSendOtp = (e) => {
        e.preventDefault()
        if (!email.trim()) { setEmailError('Email is required'); return }
        if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Invalid email format'); return }
        setEmailError('')
        sendOtpMutation.mutate()
    }

    // ── Step 2: OTP input ───────────────────────────────────────────────────────
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const next = [...otp]
        next[index] = value
        setOtp(next)
        if (value && index < 5) inputRefs.current[index + 1]?.focus()
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const next = [...otp]
            next[index - 1] = ''
            setOtp(next)
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').slice(0, 6)
        if (!/^\d+$/.test(pasted)) return
        const next = [...otp]
        pasted.split('').forEach((char, i) => { if (i < 6) next[i] = char })
        setOtp(next)
        const lastFilled = next.findLastIndex((v) => v !== '')
        inputRefs.current[Math.min(lastFilled + 1, 5)]?.focus()
    }

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.post(
                `${process.env.baseUrl}/auth/verify-otp`,
                { email, otp: otp.join('') },
                { headers: { 'Content-Type': 'application/json' } }
            )
            return res.data
        },
        onSuccess: () => {
            toast.success('OTP verified!')
            setStep(STEP_RESET)
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Invalid OTP. Please try again.')
        }
    })

    const handleVerifyOtp = (e) => {
        e.preventDefault()
        if (otp.join('').length !== 6) { setOtpError('Please enter the complete 6-digit OTP'); return }
        setOtpError('')
        verifyOtpMutation.mutate()
    }

    const resendOtpMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.post(
                `${process.env.baseUrl}/auth/resend-otp`,
                { email },
                { headers: { 'Content-Type': 'application/json' } }
            )
            return res.data
        },
        onSuccess: () => toast.success('New OTP sent!'),
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to resend OTP.')
        }
    })

    // ── Step 3: Reset Password ──────────────────────────────────────────────────
    const resetPasswordMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.post(
                `${process.env.baseUrl}/auth/reset-password`,
                { email, otp: otp.join(''), new_password: passwords.newPassword },
                { headers: { 'Content-Type': 'application/json' } }
            )
            return res.data
        },
        onSuccess: () => {
            toast.success('Password reset successfully!')
            setStep(STEP_SUCCESS)
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to reset password.')
        }
    })

    const handleResetPassword = (e) => {
        e.preventDefault()
        const errs = {}
        if (!passwords.newPassword) errs.newPassword = 'New password is required'
        else if (passwords.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters'
        if (!passwords.confirmPassword) errs.confirmPassword = 'Please confirm your password'
        else if (passwords.newPassword !== passwords.confirmPassword) errs.confirmPassword = 'Passwords do not match'
        setPasswordErrors(errs)
        if (Object.keys(errs).length > 0) return
        resetPasswordMutation.mutate()
    }

    // ── Header copy per step ────────────────────────────────────────────────────
    const stepMeta = {
        [STEP_EMAIL]: {
            title: 'Forgot Password?',
            subtitle: 'Enter your email and we\'ll send you a reset code.'
        },
        [STEP_OTP]: {
            title: 'Check your email',
            subtitle: `We sent a 6-digit code to ${email}`
        },
        [STEP_RESET]: {
            title: 'Set new password',
            subtitle: 'Your new password must be at least 8 characters.'
        },
        [STEP_SUCCESS]: {
            title: 'Password reset!',
            subtitle: 'You can now sign in with your new password.'
        }
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4'>

            {/* Back link */}
            <div className='w-full max-w-md mb-4 text-left'>
                <Link
                    href='/sign-in'
                    className='inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0A6FA7] transition-colors font-medium'
                >
                    <FaArrowLeft className='w-3 h-3' />
                    <span>Back to Sign In</span>
                </Link>
            </div>

            <div className='max-w-md w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100'>

                {/* Step progress bar */}
                {step !== STEP_SUCCESS && (
                    <div className='flex items-start mb-8'>
                        {STEPS.map((s, i) => (
                            <div key={s} className='flex items-center flex-1'>
                                <div className='flex flex-col items-center gap-1'>
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all
                    ${i < stepIndex
                                            ? 'bg-green-500 text-white'
                                            : i === stepIndex
                                                ? 'bg-[#0A6FA7] text-white ring-4 ring-blue-100'
                                                : 'bg-gray-100 text-gray-400'}`
                                    }>
                                        {i < stepIndex ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-[10px] font-semibold whitespace-nowrap
                    ${i === stepIndex ? 'text-[#0A6FA7]' : i < stepIndex ? 'text-green-500' : 'text-gray-400'}`}>
                                        {STEP_LABELS[i]}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${i < stepIndex ? 'bg-green-400' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Header */}
                <div className='mb-6'>
                    <h2 className='text-3xl font-extrabold text-gray-900'>{stepMeta[step].title}</h2>
                    <p className='mt-2 text-sm text-gray-500 font-medium'>{stepMeta[step].subtitle}</p>
                </div>

                {/* ── Step 1: Email ── */}
                {step === STEP_EMAIL && (
                    <form onSubmit={handleSendOtp} className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Email Address</label>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                                placeholder='you@example.com'
                                className={`w-full px-4 py-3 rounded-md border ${emailError ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
                            />
                            {emailError && <p className='text-red-500 text-[10px] ml-1'>{emailError}</p>}
                        </div>
                        <button
                            type='submit'
                            disabled={sendOtpMutation.isPending}
                            className='w-full py-3.5 px-6 bg-[#0A6FA7] text-white rounded-md font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm'
                        >
                            {sendOtpMutation.isPending ? 'Sending...' : 'Send Reset Code'}
                        </button>
                    </form>
                )}

                {/* ── Step 2: OTP ── */}
                {step === STEP_OTP && (
                    <form onSubmit={handleVerifyOtp} className='space-y-6'>
                        <div className='flex gap-2.5 justify-center'>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type='text'
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={handleOtpPaste}
                                    className='w-11 h-14 text-center text-xl font-bold border rounded-md focus:border-[#0A6FA7] focus:ring-4 focus:ring-blue-50 focus:outline-none transition-all'
                                />
                            ))}
                        </div>
                        {otpError && <p className='text-red-500 text-xs text-center'>{otpError}</p>}
                        <button
                            type='submit'
                            disabled={verifyOtpMutation.isPending}
                            className='w-full py-3.5 px-6 bg-[#0A6FA7] text-white rounded-md font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm'
                        >
                            {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Code'}
                        </button>
                        <p className='text-xs text-center text-gray-500'>
                            Didn&apos;t receive the code?{' '}
                            <button
                                type='button'
                                disabled={resendOtpMutation.isPending}
                                onClick={() => resendOtpMutation.mutate()}
                                className='font-bold text-[#0A6FA7] hover:underline'
                            >
                                {resendOtpMutation.isPending ? 'Resending...' : 'Resend Code'}
                            </button>
                        </p>
                    </form>
                )}

                {/* ── Step 3: New Password ── */}
                {step === STEP_RESET && (
                    <form onSubmit={handleResetPassword} className='space-y-4'>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>New Password</label>
                            <div className='relative'>
                                <input
                                    type={showNewPw ? 'text' : 'password'}
                                    value={passwords.newPassword}
                                    onChange={(e) => { setPasswords(p => ({ ...p, newPassword: e.target.value })); setPasswordErrors(p => ({ ...p, newPassword: '' })) }}
                                    placeholder='••••••••'
                                    className={`w-full px-4 py-3 rounded-md border ${passwordErrors.newPassword ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
                                />
                                <button type='button' onClick={() => setShowNewPw(p => !p)} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                    {showNewPw ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {passwordErrors.newPassword && <p className='text-red-500 text-[10px] ml-1'>{passwordErrors.newPassword}</p>}
                        </div>
                        <div className='space-y-1.5'>
                            <label className='text-xs font-bold text-gray-700 uppercase tracking-widest ml-1'>Confirm Password</label>
                            <div className='relative'>
                                <input
                                    type={showConfirmPw ? 'text' : 'password'}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => { setPasswords(p => ({ ...p, confirmPassword: e.target.value })); setPasswordErrors(p => ({ ...p, confirmPassword: '' })) }}
                                    placeholder='••••••••'
                                    className={`w-full px-4 py-3 rounded-md border ${passwordErrors.confirmPassword ? 'border-red-500 bg-red-50/20' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#0A6FA7] transition-all text-sm`}
                                />
                                <button type='button' onClick={() => setShowConfirmPw(p => !p)} className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                                    {showConfirmPw ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {passwordErrors.confirmPassword && <p className='text-red-500 text-[10px] ml-1'>{passwordErrors.confirmPassword}</p>}
                        </div>
                        <button
                            type='submit'
                            disabled={resetPasswordMutation.isPending}
                            className='w-full py-3.5 px-6 bg-[#0A6FA7] text-white rounded-md font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-sm'
                        >
                            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {/* ── Step 4: Success ── */}
                {step === STEP_SUCCESS && (
                    <div className='flex flex-col items-center text-center space-y-5'>
                        <div className='w-20 h-20 bg-green-50 rounded-full flex items-center justify-center'>
                            <svg className='w-10 h-10 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                            </svg>
                        </div>
                        <p className='text-sm text-gray-500 leading-relaxed'>
                            Your password has been reset successfully. You can now sign in with your new credentials.
                        </p>
                        <button
                            onClick={() => router.push('/sign-in')}
                            className='w-full py-3.5 px-6 bg-[#0A6FA7] text-white rounded-md font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] text-sm'
                        >
                            Back to Sign In
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
