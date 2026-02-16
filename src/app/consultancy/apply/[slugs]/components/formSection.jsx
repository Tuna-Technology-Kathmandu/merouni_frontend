'use client'

import ActionCard from '@/ui/molecules/ActionCard'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'
import { Label } from '@/ui/shadcn/label'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle2, Handshake } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaSpinner as FaSpinnerIcon } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { applyToConsultancy } from '../query/applyConsultancy.query'
import { THEME_BLUE } from '@/constants/constants'

const FormSection = ({ consultancy }) => {
  const user = useSelector((state) => state.user?.data)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    consultancy_id: consultancy?.id || 0,
    student_name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
    student_phone_no: user?.phoneNo || '',
    student_email: user?.email || '',
    student_description: ''
  })

  useEffect(() => {
    if (consultancy?.id) {
      setFormData((prev) => ({ ...prev, consultancy_id: consultancy.id }))
    }
    if (user) {
      setFormData((prev) => ({
        ...prev,
        student_name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        student_email: user?.email || '',
        student_phone_no: user?.phoneNo || ''
      }))
    }
  }, [consultancy?.id, user])

  const applyMutation = useMutation({
    mutationFn: applyToConsultancy,
    onSuccess: (data) => {
      setIsSubmitted(true)
      setFormData((prev) => ({
        ...prev,
        student_description: ''
      }))
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong. Please try again.')
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const payload = {
      consultancy_id: formData.consultancy_id,
      student_description: formData.student_description
    }

    applyMutation.mutate({ payload })
  }

  if (isSubmitted) {
    return (
      <ActionCard
        variant='centered'
        icon={<CheckCircle2 className='w-full h-full' />}
        title='Application Submitted!'
        description={
          <>
            Thank you for applying. Your application has been successfully
            submitted to the consultancy. We will get back to you soon.
          </>
        }
      >
        <Link href='/'>
          <Button
            variant='outline'
            className='min-w-[160px] h-12 text-base font-medium'
          >
            Go Home
          </Button>
        </Link>
        <Link href='/dashboard'>
          <Button
            className='min-w-[160px] h-12 text-base font-medium text-white shadow-md transition-all hover:-translate-y-0.5'
            style={{ backgroundColor: THEME_BLUE }}
          >
            Go to Dashboard
          </Button>
        </Link>
      </ActionCard>
    )
  }

  return (
    <div className='w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
      <div
        className='p-8 text-white relative overflow-hidden'
        style={{
          background: `linear-gradient(to right, ${THEME_BLUE}, #2c7a9a)`
        }}
      >
        <div className='relative z-10 text-left'>
          <div className='flex items-center gap-3 mb-2'>
            <Handshake className='w-8 h-8' />
            <h2 className='text-3xl font-bold font-poppins'>
              Apply For Consultation
            </h2>
          </div>
          <p className='text-white/80'>Expert guidance for your career</p>
        </div>
        <div className='absolute -right-8 -bottom-8 opacity-10'>
          <Handshake size={160} />
        </div>
      </div>

      <div className='p-8 md:p-10'>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-2 text-left'>
            <Label htmlFor='student_name'>Full Name</Label>
            <Input
              id='student_name'
              name='student_name'
              value={formData.student_name}
              disabled
              className='bg-gray-50'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2 text-left'>
              <Label htmlFor='student_email'>Email Address</Label>
              <Input
                id='student_email'
                type='email'
                name='student_email'
                value={formData.student_email}
                disabled
                className='bg-gray-50'
              />
            </div>
            <div className='space-y-2 text-left'>
              <Label htmlFor='student_phone_no'>Phone Number</Label>
              <Input
                id='student_phone_no'
                type='tel'
                name='student_phone_no'
                value={formData.student_phone_no}
                disabled
                className='bg-gray-50'
              />
            </div>
          </div>

          <div className='space-y-2 text-left'>
            <Label htmlFor='student_description'>How can we help you? (Optional)</Label>
            <textarea
              id='student_description'
              name='student_description'
              placeholder='Describe your requirements, preferred country, etc.'
              value={formData.student_description}
              onChange={handleChange}
              rows={4}
              className='flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none'
            />
          </div>

          <Button
            type='submit'
            disabled={applyMutation.isPending}
            className='w-full py-6 text-lg font-semibold h-12 text-white transition-all shadow-md active:scale-[0.98]'
            style={{ backgroundColor: THEME_BLUE }}
          >
            {applyMutation.isPending ? (
              <div className='flex items-center gap-2'>
                <FaSpinnerIcon className='animate-spin' />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default FormSection
