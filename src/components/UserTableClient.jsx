'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './CreateUserModal'
import { UserForm } from './UserForm'
import { deleteUser } from '../app/actions/userActions'

export function UserTableClient({ users }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Users Management</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <div className='flex'>
            <Plus className='h-5 w-5 mr-2' />
            Add New User
          </div>
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-gray-50 border-b'>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Roles
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {user.firstName} {user.lastName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>{user.email}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {Object.keys(user.roles).map((role) => (
                      <span
                        key={role}
                        className='px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mr-1'
                      >
                        {role}
                      </span>
                    ))}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex space-x-2'>
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={() => {
                          setSelectedUser(user)
                          setIsEditModalOpen(true)
                        }}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => deleteUser(user._id)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title='Create New User'
      >
        <UserForm
          action={'/api/users/create'}
          onComplete={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit User'
      >
        <UserForm
          action={`/api/users/${selectedUser?._id}/edit`}
          initialData={selectedUser}
          onComplete={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
