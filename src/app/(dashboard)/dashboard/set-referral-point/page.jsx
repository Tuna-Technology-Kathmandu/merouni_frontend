'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { authFetch } from '@/app/utils/authFetch'
import { toast, ToastContainer } from 'react-toastify'
import { usePageHeading } from '@/contexts/PageHeadingContext'
import { Button } from '@/ui/shadcn/button'

const CONFIG_TYPE_REFERRAL_POINT = 'referral_point'

export default function SetReferralPointPage() {
  const { setHeading } = usePageHeading()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      value: ''
    }
  })

  useEffect(() => {
    setHeading('Set Referral Point')
    fetchReferralPoint()
    return () => setHeading(null)
  }, [setHeading])

  const fetchReferralPoint = async () => {
    setLoading(true)
    try {
      const response = await authFetch(
        `${process.env.baseUrl}/config/${CONFIG_TYPE_REFERRAL_POINT}`
      )
      if (response.ok) {
        const data = await response.json()
        if (data.config?.value != null) {
          setValue('value', data.config.value)
        }
      }
    } catch (err) {
      // 404 is ok – no config yet
      if (err.status !== 404) {
        toast.error('Failed to load current referral point')
      }
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      const response = await authFetch(
        `${process.env.baseUrl}/config`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: CONFIG_TYPE_REFERRAL_POINT,
            value: String(data.value ?? '')
          })
        }
      )
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save')
      }
      toast.success('Referral point saved successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to save referral point')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='p-4 w-full flex items-center justify-center min-h-[200px]'>
        <p className='text-gray-500'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='p-4 w-full max-w-lg'>
      <ToastContainer />
      <p className='text-gray-600 mb-4'>
        Set the referral point awarded to agents when they refer a student.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='block mb-2 font-medium'>
            Referral point (for agent) <span className='text-red-500'>*</span>
          </label>
          <input
            type='number'
            min='0'
            step='1'
            {...register('value', {
              required: 'Referral point is required',
              min: { value: 0, message: 'Must be 0 or greater' }
            })}
            className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='e.g. 10'
          />
          {errors.value && (
            <span className='text-red-500 text-sm'>{errors.value.message}</span>
          )}
        </div>
        <Button type='submit' disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Referral Point'}
        </Button>
      </form>
    </div>
  )
}
