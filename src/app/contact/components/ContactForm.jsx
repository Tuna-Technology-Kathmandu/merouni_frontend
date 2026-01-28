'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { toast } from 'react-toastify'
import { DotenvConfig } from '@/config/env.config'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/contact-us`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const data = await res.json()

      if (res.ok) {
        toast.success('Message sent successfully!')
        setFormData({ fullname: '', email: '', subject: '', message: '' })
      } else {
        toast.error(data.message || 'Something went wrong!')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className='md:col-span-2 space-y-5 bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm'
    >
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 ml-1'>Full Name</label>
          <input
            type='text'
            name='fullname'
            value={formData.fullname}
            onChange={handleChange}
            placeholder='John Doe'
            className='w-full p-4 rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#30AD8F] outline-none transition-all duration-200'
            required
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 ml-1'>Email Address</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='john@example.com'
            className='w-full p-4 rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#30AD8F] outline-none transition-all duration-200'
            required
          />
        </div>
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-semibold text-gray-700 ml-1'>Subject</label>
        <input
          type='text'
          name='subject'
          value={formData.subject}
          onChange={handleChange}
          placeholder='How can we help you?'
          className='w-full p-4 rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#30AD8F] outline-none transition-all duration-200'
          required
        />
      </div>

      <div className='space-y-2'>
        <label className='text-sm font-semibold text-gray-700 ml-1'>Message</label>
        <textarea
          name='message'
          value={formData.message}
          onChange={handleChange}
          placeholder='Your message here...'
          rows='5'
          className='w-full p-4 rounded-xl bg-gray-50/50 border border-gray-200 focus:bg-white focus:border-[#30AD8F] outline-none transition-all duration-200 resize-none'
          required
        ></textarea>
      </div>

      <div className='pt-2'>
        <button
          type='submit'
          className='w-full md:w-auto px-12 py-4 bg-[#30AD8F] text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-[#28967b] transition-all disabled:opacity-70 active:scale-[0.98]'
          disabled={loading}
        >
          {loading ? (
            <div className='flex items-center space-x-2'>
              <div className='w-5 h-5 border-t-2 border-white rounded-full animate-spin' />
              <span>Sending...</span>
            </div>
          ) : (
            <>
              <span>Send Message</span>
              <Send className='w-5 h-5' />
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
}
