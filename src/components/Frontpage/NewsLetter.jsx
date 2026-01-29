'use client'
import React, { useState } from 'react'
import { FaLocationArrow } from 'react-icons/fa6'
import services from '@/app/apiService'
import { toast } from 'react-toastify'

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.warning('Please enter a valid email.')
      return
    }

    try {
      await services.newsletter.create({ email })
      toast.success('Subscribed successfully!')
      setEmail('')
    } catch (error) {
      console.error('Newsletter error:', error)
      toast.error('Failed to subscribe. Please try again later.')
    }
  }

  return (
    <div className='relative bg-cover bg-center py-20 h-auto flex items-center px-4'>
      {/* Overlay for better readability */}
      <div className='absolute inset-0 bg-[#E0E0E0] bg-opacity-50'></div>

      <div className='relative container mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-48 text-center md:text-left'>
        {/* Left Section */}
        <div>
          <h2 className='text-2xl font-bold md:text-5xl md:font-extrabold mb-2'>
            News Letter
          </h2>
          <p className='font-medium  mt-2'>
            Get the latest exam updates, study resources, and{' '}
            <br className='hidden md:block' />
            expert tips delivered straight to your inbox.
          </p>
        </div>

        {/* Right Section - Input and Button */}
        <form
          onSubmit={handleSubmit}
          className='mt-2 flex flex-row items-center bg-[#eaf4f3] rounded-xl shadow-md w-full md:w-1/2'
        >
          <input
            type='email'
            placeholder='Your Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='flex-grow w-full px-4 py-4 bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none rounded-t-xl md:rounded-t-none md:rounded-l-xl'
          />
          <button
            type='submit'
            className='bg-[#30AD8F] bg-opacity-20 py-6 px-6 rounded-r-xl flex items-center justify-center hover:bg-[#288c74] transition-colors'
          >
            Send
            <span className='ml-2'>
              <FaLocationArrow className='rotate-45 ' />
            </span>
          </button>
        </form>

      </div>
    </div>
  )
}

export default Newsletter
