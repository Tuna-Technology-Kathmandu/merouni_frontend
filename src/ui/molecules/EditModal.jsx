'use client'
import { useState } from 'react'
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from '@/ui/shadcn/dialog'

const Modal = ({ isOpen, close, user, onSave, onDelete }) => {
  const [editedUser, setEditedUser] = useState(user || {})

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedUser({
      ...editedUser,
      [name]: value
    })
  }

  const handleSave = () => {
    onSave(editedUser)
    close() // Close the modal
  }

  const handleDelete = () => {
    onDelete(user._id) // Send the user ID to the onDelete function
    close() // Close the modal
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={close}
      className='max-w-sm'
    >
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
        <DialogClose onClick={close} />
      </DialogHeader>
      <DialogContent>
        <div className='mt-4 space-y-4'>
          <label className='block'>
            <span className='text-sm font-medium'>First Name:</span>
            <input
              type='text'
              name='firstName'
              value={editedUser.firstName}
              onChange={handleChange}
              className='border px-2 py-1 w-full rounded mt-1'
            />
          </label>
          <label className='block'>
            <span className='text-sm font-medium'>Last Name:</span>
            <input
              type='text'
              name='lastName'
              value={editedUser.lastName}
              onChange={handleChange}
              className='border px-2 py-1 w-full rounded mt-1'
            />
          </label>
          <label className='block'>
            <span className='text-sm font-medium'>Email:</span>
            <input
              type='email'
              name='email'
              value={editedUser.email}
              onChange={handleChange}
              className='border px-2 py-1 w-full rounded mt-1'
            />
          </label>
          <div className='flex justify-between mt-6'>
            <button
              onClick={handleSave}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors'
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
            >
              Delete
            </button>
            <button
              onClick={close}
              className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors'
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal
