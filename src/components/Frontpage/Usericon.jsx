'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'
import { FaUserCircle, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { ChevronDown } from 'lucide-react'
import { removeUser } from '../../app/utils/userSlice'
import { THEME_BLUE } from '@/constants/constants'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'

export default function UserDropdown() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const dropdownRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user?.data)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    const hasUser = user !== null && user !== undefined
    setIsLoggedIn(!!(token || hasUser))
  }, [user])

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

  const handleLogoutClick = () => {
    setIsDropdownOpen(false)
    setIsLogoutDialogOpen(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLogoutDialogOpen(false)

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
        `${process.env.baseUrl}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )

      if (!response.ok && ![400, 401, 403].includes(response.status)) {
        console.warn('Logout API call failed, but proceeding with logout')
      }
      performLogout()
    } catch (error) {
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

  const isApplyPage = pathname?.includes('/colleges/apply') || pathname?.includes('/schools/apply')

  if (isLoggedIn) {
    return (
      <>
        <div className='flex items-center gap-2 mx-2 relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1'
          >
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow'>
              {user?.firstName && user?.lastName ? (
                <span>
                  {user.firstName.charAt(0).toUpperCase()}
                  {user.lastName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUserCircle className='w-6 h-6' />
              )}
            </div>
            <div className='hidden sm:flex flex-col items-start'>
              <span className='text-xs leading-3 font-medium text-gray-900'>
                {user ? `${user.firstName} ${user.lastName}` : ''}
              </span>
              <span className='text-[10px] text-gray-500 text-left max-w-[150px] truncate'>
                {user?.email}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className='absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100'>
              <div className='px-1.5'>
                <div className='sm:hidden px-3 py-2 border-b border-gray-100 mb-1'>
                  <p className='font-medium text-sm text-gray-900'>
                    {user ? `${user.firstName} ${user.lastName}` : ''}
                  </p>
                  <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                </div>

                <Link
                  href='/dashboard'
                  onClick={() => setIsDropdownOpen(false)}
                  className='group flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200'
                  style={{ '--theme-blue': THEME_BLUE }}
                >
                  <FaUser
                    className='w-4 h-4 text-gray-500 group-hover:text-[var(--theme-blue)] transition-colors'
                  />
                  <span
                    className='group-hover:text-[var(--theme-blue)] transition-colors'
                  >
                    Dashboard
                  </span>
                </Link>

                <div className='h-px bg-gray-100 my-1 mx-2'></div>

                <button
                  onClick={handleLogoutClick}
                  className='w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group'
                >
                  <FaSignOutAlt className='w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors' />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
        <ConfirmationDialog
          open={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          onConfirm={handleLogoutConfirm}
          title="Logout Confirmation"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
        />
      </>
    )
  }

  if (isApplyPage) return null

  return (
    <div className='flex items-center gap-3 mx-2'>
      <Link href='/sign-in'>
        <button className='px-6 py-2.5 bg-[#0A6FA7] text-white rounded-xl font-extrabold hover:bg-[#085a86] transition-all shadow-sm hover:shadow-lg active:scale-[0.98] text-xs sm:text-sm uppercase tracking-widest border border-white/10'>
          Login
        </button>
      </Link>
      <Link href='/sign-in?mode=signup'>
        <button className='px-6 py-2.5 bg-white text-[#0A6FA7] border-2 border-[#0A6FA7] rounded-xl font-extrabold hover:bg-blue-50/50 transition-all text-xs sm:text-sm uppercase tracking-widest active:scale-[0.98]'>
          Sign Up
        </button>
      </Link>
    </div>
  )
}
