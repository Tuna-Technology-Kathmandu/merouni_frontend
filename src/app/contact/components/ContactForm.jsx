'use client'
import { useState } from 'react'
import { toast } from 'react-toastify' // Import toast

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    subject: '',
    message: '',
    status: 'unread'
  })

  const [loading, setLoading] = useState(false)

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log(formData)
      const res = await fetch(
        `${process.env.baseUrl}${process.env.version}/contact-us`,
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
    <form onSubmit={handleSubmit} className='md:col-span-2 space-y-4'>
      <input
        type='text'
        name='fullname'
        value={formData.fullname}
        onChange={handleChange}
        placeholder='Enter Your Fullname'
        className='w-full p-3 rounded-md bg-[#e8f1f4]'
        required
      />
      <input
        type='email'
        name='email'
        value={formData.email}
        onChange={handleChange}
        placeholder='Enter Your Email'
        className='w-full p-3 rounded-md bg-[#e8f1f4]'
        required
      />
      <input
        type='text'
        name='subject'
        value={formData.subject}
        onChange={handleChange}
        placeholder='Enter Subject'
        className='w-full p-3 rounded-md bg-[#e8f1f4]'
        required
      />
      <textarea
        name='message'
        value={formData.message}
        onChange={handleChange}
        placeholder='Message'
        rows='6'
        className='w-full p-3 rounded-md bg-[#e8f1f4]'
        required
      ></textarea>
      <button
        type='submit'
        className='px-8 py-3 bg-[#1a472f] text-white rounded-md hover:bg-opacity-90'
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Submit'}
      </button>
    </form>
  )
}
