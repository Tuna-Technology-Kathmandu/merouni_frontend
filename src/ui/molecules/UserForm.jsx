// app/components/UserForm.jsx
'use client'

import { Button } from './Button'
import { useTransition } from 'react'
import { createUser, updateUser } from '../../app/actions/userActions'

export function UserForm({ initialData, onComplete }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        if (initialData) {
          await updateUser(formData)
        } else {
          await createUser(formData)
        }
        onComplete()
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label
          htmlFor='firstName'
          className='block text-sm font-medium text-gray-700'
        >
          First Name
        </label>
        <input
          id='firstName'
          name='firstName'
          defaultValue={initialData?.firstName}
          required
          className='border-2'
        />
      </div>
      <div>
        <label
          htmlFor='lastName'
          className='block text-sm font-medium text-gray-700'
        >
          Last Name
        </label>
        <input
          id='lastName'
          name='lastName'
          defaultValue={initialData?.lastName}
          required
          className='border-2'
        />
      </div>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          Email
        </label>
        <input
          id='email'
          name='email'
          type='email'
          defaultValue={initialData?.email}
          required
          className='border-2'
        />
      </div>
      <div className='flex justify-end space-x-2'>
        <Button type='button' variant='outline' onClick={onComplete}>
          Cancel
        </Button>
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}
