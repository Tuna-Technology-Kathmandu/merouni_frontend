'use client'
import { useState } from 'react'

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
    isOpen && (
      <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center'>
        <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm w-full'>
          <h2 className='text-xl font-semibold mb-4'>Edit User</h2>
          <label className='block mb-2'>
            First Name:
            <input
              type='text'
              name='firstName'
              value={editedUser.firstName}
              onChange={handleChange}
              className='border px-2 py-1 w-full'
            />
          </label>
          <label className='block mb-2'>
            Last Name:
            <input
              type='text'
              name='lastName'
              value={editedUser.lastName}
              onChange={handleChange}
              className='border px-2 py-1 w-full'
            />
          </label>
          <label className='block mb-2'>
            Email:
            <input
              type='email'
              name='email'
              value={editedUser.email}
              onChange={handleChange}
              className='border px-2 py-1 w-full'
            />
          </label>
          <div className='flex justify-between mt-4'>
            <button
              onClick={handleSave}
              className='bg-blue-500 text-white px-4 py-2 rounded'
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className='bg-red-500 text-white px-4 py-2 rounded'
            >
              Delete
            </button>
            <button
              onClick={close}
              className='bg-gray-500 text-white px-4 py-2 rounded'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  )
}

export default Modal
