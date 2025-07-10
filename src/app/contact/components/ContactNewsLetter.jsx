import { useState } from 'react'
import { useForm } from 'react-hook-form'

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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log('Subscribed:', data.email)
    setIsSuccess(true)
    setIsSubmitting(false)
    reset()

    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <div className='bg-[#6a958f] p-8 rounded-lg text-white'>
      <h3 className='text-2xl font-bold mb-4'>Our Newsletters</h3>

      {isSuccess ? (
        <p className='mb-6 text-center py-2 bg-green-100 text-green-800 rounded'>
          Thank you for subscribing!
        </p>
      ) : (
        <>
          <p className='mb-6'>
            Stay updated! Subscribe to our newsletter for the latest news and
            offers.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type='email'
              placeholder='Email'
              className='w-full p-3 rounded-md bg-white mb-1 text-black'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            {errors.email && (
              <p className='text-red-100 text-sm mb-3'>
                {errors.email.message}
              </p>
            )}

            <button
              type='submit'
              className={`w-full py-3 mt-3 bg-[#1a472f] text-white rounded-md hover:bg-opacity-90 transition flex items-center justify-center ${isSubmitting ? 'opacity-75' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Subscribing...
                </>
              ) : (
                'Subscribe Now'
              )}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
