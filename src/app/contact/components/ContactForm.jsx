'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.baseUrl}/contact-us`,
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
        setIsSuccess(true)
        toast.success('Message sent successfully!')
        setFormData({ fullname: '', email: '', subject: '', message: '' })
        setTimeout(() => setIsSuccess(false), 5000)
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
    <div className='bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm h-full relative overflow-hidden'>
      <AnimatePresence mode='wait'>
        {isSuccess ? (
          <motion.div
            key='success'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='flex flex-col items-center justify-center h-full min-h-[400px] text-center'
          >
            <div className='w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6'>
              <CheckCircle className='w-10 h-10' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>Message Sent!</h3>
            <p className='text-gray-500 max-w-sm'>
              Thanks for reaching out. We've received your message and will get back to you shortly.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className='mt-8 px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key='form'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit}
            className='space-y-5'
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
        )}
      </AnimatePresence>
    </div>
  )
}
