'use client'

import { destr } from 'destr'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { apiAuth } from '../../app/utils/agentverify'
import { usePageHeading } from '../../contexts/PageHeadingContext'
import { FaUserCircle, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { removeUser } from '../../app/utils/userSlice'
import { ChevronDown, Search } from 'lucide-react'
import { THEME_BLUE } from "@/constants/constants"
import SearchInput from '../molecules/SearchInput'
import { menuItems } from '@/constants/menuList'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { authFetch } from '@/app/utils/authFetch'

const AdminNavbar = ({ onMenuClick, searchQuery, setSearchQuery }) => {
  const { heading, subheading } = usePageHeading()
  const [loading, setLoading] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const dropdownRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState(searchQuery)

  // Get user data from Redux store for initial state and ID
  let userData = useSelector((state) => state.user.data)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (userData?.id) {
      const getProfile = async () => {
        try {
          const response = await authFetch(`${process.env.baseUrl}/users/profile?id=${userData.id}`)
          const data = await response.json()
          if (data?.user) {
            setProfile(data.user)
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error)
        }
      }
      getProfile()
    }
  }, [userData?.id])

  // Use fetched profile as priority, fallback to selector data
  const currentUser = profile || userData

  // Parse the role JSON string if it exists, otherwise default to an empty object
  let userRoles = {}
  const rawRole = currentUser?.role
  if (rawRole) {
    try {
      const parsedRole = typeof rawRole === 'string' ? destr(rawRole) : rawRole
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

  // Debounce search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, setSearchQuery])

  // Sync local input with global query (e.g. on clear)
  useEffect(() => {
    setInputValue(searchQuery)
  }, [searchQuery])

  const handleAgentVerification = async () => {
    if (!currentUser?.id) {
      toast.error('User ID not found')
      return
    }

    setLoading(true)
    try {
      const response = await apiAuth(
        `${process.env.baseUrl}/users/apply-agent`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: currentUser?.id })
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
      {/* HEADING & MOBILE TOGGLE */}
      <div className='flex items-center gap-3'>
        <button
          onClick={onMenuClick}
          className='md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          {heading && <h1 className='text-xl md:text-2xl font-bold whitespace-nowrap'>{heading}</h1>}
          {subheading && (
            <p className='text-xs md:text-sm text-gray-500 mt-1 whitespace-nowrap'>{subheading}</p>
          )}
        </div>
      </div>

      {/* CENTERED SEARCH WITH SUGGESTIONS */}
      {userRoles?.admin && (
        <div className='hidden lg:flex flex-1 max-w-xl mx-8 relative'>
          <div className='w-full'>
            <SearchInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onClear={() => {
                setInputValue('')
                setSearchQuery('')
              }}
              placeholder='Search menus...'
              className='w-full'
            />
          </div>

          {/* Suggestions Dropdown */}
          {searchQuery.trim() !== '' && (
            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200'>
              <div className='max-h-[70vh] overflow-y-auto p-1.5 custom-scrollbar'>
                {(() => {
                  let totalMatches = 0
                  const itemsToRender = menuItems.map((section) => {
                    const filteredItems = section.items.filter(item => {
                      const hasAccess = item.visible.some(r => userRoles[r])
                      if (!hasAccess) return false

                      const query = searchQuery.toLowerCase().trim()
                      const matchesLabel = item.label.toLowerCase().includes(query)
                      const matchesSubmenu = item.submenus?.some(sub =>
                        sub.label.toLowerCase().includes(query) && sub.visible.some(r => userRoles[r])
                      )
                      return matchesLabel || matchesSubmenu
                    })

                    if (filteredItems.length === 0) return null
                    totalMatches += filteredItems.length

                    return (
                      <div key={section.title || 'Other'}>
                        <div className='px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                          {section.title || 'General'}
                        </div>
                        {filteredItems.map(item => (
                          <div key={item.label}>
                            {item.submenus ? (
                              item.submenus
                                .filter(sub =>
                                  (sub.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.label.toLowerCase().includes(searchQuery.toLowerCase())) &&
                                  sub.visible.some(r => userRoles[r])
                                )
                                .map(sub => (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => {
                                      setSearchQuery('')
                                      setInputValue('')
                                    }}
                                    className='group w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors'
                                  >
                                    <div className='w-8 h-8 flex items-center justify-center text-gray-400 bg-gray-50 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-600'>
                                      {item.icon}
                                    </div>
                                    <div className='flex flex-col items-start'>
                                      <span className='font-medium'>{sub.label}</span>
                                      <span className='text-[10px] text-gray-400'>{item.label}</span>
                                    </div>
                                  </Link>
                                ))
                            ) : (
                              <Link
                                href={item.href}
                                onClick={() => {
                                  setSearchQuery('')
                                  setInputValue('')
                                }}
                                className='group w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors'
                              >
                                <div className='w-8 h-8 flex items-center justify-center text-gray-400 bg-gray-50 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-600'>
                                  {item.icon}
                                </div>
                                <span className='font-medium'>{item.label}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  })

                  if (totalMatches === 0) {
                    return (
                      <div className='py-8 px-4 text-center'>
                        <div className='w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300'>
                          <Search className='w-6 h-6' />
                        </div>
                        <p className='text-sm font-medium text-gray-900'>No menus found</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          No results for "{searchQuery}"
                        </p>
                      </div>
                    )
                  }

                  return itemsToRender
                })()}
              </div>
            </div>
          )}
        </div>
      )}
      {/* ICONS AND USER */}
      <div className='flex items-center gap-4 justify-end'>
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg p-1'
          >
            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow relative overflow-hidden'>
              {currentUser?.profileImageUrl ? (
                <Image
                  src={currentUser.profileImageUrl}
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : currentUser?.firstName && currentUser?.lastName ? (
                <span>
                  {currentUser.firstName.charAt(0).toUpperCase()}
                  {currentUser.lastName.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FaUserCircle className='w-6 h-6' />
              )}
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-xs leading-3 font-medium text-gray-900'>
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''}
              </span>
              <span className='text-[10px] text-gray-500 text-left'>
                {currentUser?.email ||
                  Object.entries(userRoles)
                    .filter(([_, value]) => value)
                    .map(([role]) => role)
                    .join(', ')}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100'>
              <div className='px-1.5'>
                <Link
                  href='/dashboard/profile'
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
                    View Profile
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
    </div>
  )
}

export default AdminNavbar
