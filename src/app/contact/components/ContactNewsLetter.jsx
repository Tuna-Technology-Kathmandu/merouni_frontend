'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Bell } from 'lucide-react'

export default function ContactNewsletter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSuccess(true)
    setIsSubmitting(false)
    reset()
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <div className='bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 flex flex-col h-full relative overflow-hidden shadow-sm'>
      <div className='relative z-10'>
        <div className='bg-[#30AD8F]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6'>
          <Bell className='w-6 h-6 text-[#30AD8F]' />
        </div>

        <h3 className='text-2xl font-bold text-gray-900 mb-4 tracking-tight'>Newsletter</h3>

        <AnimatePresence mode='wait'>
          {isSuccess ? (
            <motion.div
              key='success'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='flex flex-col items-center justify-center py-8 text-center bg-white rounded-2xl border border-emerald-100 px-4 mt-2'
            >
              <div className='w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='3' d='M5 13l4 4L19 7' />
                </svg>
              </div>
              <p className='font-bold text-gray-900'>Success!</p>
              <p className='text-gray-500 text-sm'>You're on the list.</p>
            </motion.div>
          ) : (
            <motion.div
              key='form'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className='mb-8 text-gray-600 leading-relaxed'>
                Stay updated with the latest news, exams, and scholarship opportunities delivered straight to your inbox.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='relative group'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#30AD8F] transition-colors' />
                  <input
                    type='email'
                    placeholder='your@email.com'
                    className='w-full p-4 pl-12 rounded-xl bg-white text-gray-900 border border-gray-200 outline-none focus:border-[#30AD8F] transition-all placeholder:text-gray-400'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>

                {errors.email && (
                  <p className='text-red-500 text-xs font-medium ml-1'>
                    {errors.email.message}
                  </p>
                )}

                <button
                  type='submit'
                  className='w-full py-4 mt-2 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center disabled:opacity-75'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
