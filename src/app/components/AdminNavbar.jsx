'use client'

import { React, useState } from 'react'
import Image from 'next/image'
import { CiPower } from 'react-icons/ci'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { TfiAnnouncement } from 'react-icons/tfi'
import { apiAuth } from '../utils/agentverify'

const AdminNavbar = () => {
  const [loading, setLoading] = useState(false)

  // Get user data from Redux store
  const userData = useSelector((state) => state.user.data)

  // Parse the role JSON string if it exists, otherwise default to an empty object
  let userRoles = {}
  if (userData?.role) {
    try {
      console.log('User Data id:', userData.id)
      userRoles = JSON.parse(userData.role)
    } catch (error) {
      console.error('Error parsing user role:', error)
      userRoles = {}
    }
  }

  const handleAgentVerification = async () => {
    if (!userData?.id) {
      toast.error('User ID not found')
      return
    }

    setLoading(true)
    try {
      const response = await apiAuth(
        `${process.env.baseUrl}${process.env.version}/users/apply-agent`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userData.id })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || 'Failed to send verification request'
        )
      }

      const data = await response.json()
      toast.success(
        data.message || 'Agent verification request sent successfully!'
      )
      console.log('Verification request sent')
    } catch (error) {
      console.error('Error during agent verification:', error)
      toast.error(
        error.message ||
          'Failed to send verification request. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-between p-4'>
      {/* SEARCH BAR */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src='/search.png' alt='' width={14} height={14} />
        <input
          type='text'
          placeholder='Search...'
          className='w-[200px] p-2 bg-transparent outline-none'
        />
      </div>
      {/* ICONS AND USER */}
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <TfiAnnouncement />
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>
            1
          </div>
        </div>
        {/* Only show verification button if user doesn't have agent role */}
        {!userRoles?.agent && (
          <div>
            <button
              type='button'
              className='text-sm text-white font-semibold bg-[#30AD8F] bg-opacity-60 p-3 rounded-lg'
              onClick={handleAgentVerification}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Agent Verification'}
            </button>
          </div>
        )}
        <div className='flex flex-col'>
          <span className='text-xs leading-3 font-medium'>
            {userData ? `${userData.firstName} ${userData.lastName}` : ''}
          </span>
          <span className='text-[10px] text-gray-500 text-right'>
            {Object.entries(userRoles)
              .filter(([_, value]) => value) // Keep only roles set to true
              .map(([role]) => role)
              .join(', ')}
          </span>
        </div>
        <CiPower />
      </div>
    </div>
  )
}

export default AdminNavbar
