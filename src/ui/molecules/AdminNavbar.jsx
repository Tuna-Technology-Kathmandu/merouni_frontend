'use client'

import { destr } from 'destr'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { apiAuth } from '../../app/utils/agentverify'
import { DotenvConfig } from '../../config/env.config'
import { usePageHeading } from '../../contexts/PageHeadingContext'
import { FaUserCircle, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { removeUser } from '../../app/utils/userSlice'
import { ChevronDown } from 'lucide-react'

const AdminNavbar = () => {
  const { heading, subheading } = usePageHeading()
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()

  // Get user data from Redux store
  let userData = useSelector((state) => state.user.data)

  // Parse the role JSON string if it exists, otherwise default to an empty object
  let userRoles = {}
  if (userData?.role) {
    try {
      const parsedRole =
        typeof userData.role === 'string' ? destr(userData.role) : userData.role
      userRoles = parsedRole && typeof parsedRole === 'object' ? parsedRole : {}
    } catch (error) {
      console.error('Error parsing user role:', error)
      userRoles = {}
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAgentVerification = async () => {
    if (!userData?.id) {
      toast.error('User ID not found')
      return
    }

    setLoading(true)
    try {
      const response = await apiAuth(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/users/apply-agent`,
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

  const handleLogout = async () => {
    setIsDropdownOpen(false)

    // Always clear local storage and redirect, even if API call fails
    const performLogout = () => {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      dispatch(removeUser())
      localStorage.removeItem('access_token')
      localStorage.removeItem('refreshToken')
      localStorage.clear()
      window.location.href = '/sign-in'
    }

    try {
      const response = await fetch(
        `${DotenvConfig.NEXT_APP_API_BASE_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )

      // Handle 400/401/403 gracefully - session might already be invalid
      if (!response.ok && ![400, 401, 403].includes(response.status)) {
        console.warn('Logout API call failed, but proceeding with logout')
      }

      // Always perform logout cleanup
      performLogout()
    } catch (error) {
      // Even if there's an error, still perform logout cleanup
      if (
        !error.message?.includes('400') &&
        !error.message?.includes('401') &&
        !error.message?.includes('403')
      ) {
        console.error('Logout error:', error)
      }
      performLogout()
    }
  }

  return (
    <div className='sticky top-0 z-40 bg-[#F7F8FA] flex items-center justify-between p-4 border-b border-gray-200'>
      {/* HEADING */}
      <div>
        {heading && <h1 className='text-2xl font-bold'>{heading}</h1>}
        {subheading && (
          <p className='text-sm text-gray-500 mt-1'>{subheading}</p>
        )}
      </div>
      {!heading && <div></div>}
      {/* ICONS AND USER */}
      <div className='flex items-center gap-4 justify-end'>
        {/* Only show verification button if user doesn't have agent role */}
        {/* {!userRoles?.agent && (
          <div>
            <button
              type='button'
              className='text-sm text-white font-semibold bg-[#30AD8F] bg-opacity-60 p-3 rounded-lg'
              onClick={handleAgentVerification}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Agent Verification'}
            </button>
          </div> */}
        {/* )} */}
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1'
          >
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow'>
              {userData?.firstName && userData?.lastName ? (
                <span>
                  {userData.firstName.charAt(0).toUpperCase()}
                  {userData.lastName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUserCircle className='w-6 h-6' />
              )}
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-xs leading-3 font-medium text-gray-900'>
                {userData ? `${userData.firstName} ${userData.lastName}` : ''}
              </span>
              <span className='text-[10px] text-gray-500 text-left'>
                {userData?.email ||
                  Object.entries(userRoles)
                    .filter(([_, value]) => value)
                    .map(([role]) => role)
                    .join(', ')}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50'>
              <Link
                href='/dashboard/profile'
                onClick={() => setIsDropdownOpen(false)}
                className='flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
              >
                <FaUser className='w-4 h-4 text-gray-500' />
                <span>View Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className='w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors'
              >
                <FaSignOutAlt className='w-4 h-4' />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminNavbar
