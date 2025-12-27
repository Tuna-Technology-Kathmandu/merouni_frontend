'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { usePathname } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'

export default function UserDropdown() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()

  const user = useSelector((state) => state.user?.data)

  useEffect(() => {
    // Check if user is logged in by checking both Redux state and localStorage
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null
    const hasUser = user !== null && user !== undefined
    setIsLoggedIn(!!(token || hasUser))
  }, [user])

  // Check if we're on the apply page
  const isApplyPage =
    pathname?.includes('/colleges/apply') ||
    pathname?.includes('/schools/apply')

  if (isLoggedIn) {
    return (
      <div className='flex items-center gap-1 sm:gap-2 mx-1 sm:mx-2'>
        <Link href='/dashboard'>
          <button className='flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-[#30ad8f] text-white rounded-lg font-semibold hover:bg-[#2a9d7f] transition-colors text-xs sm:text-sm md:text-base'>
            <span className='hidden sm:inline'>Go to Dashboard</span>
            <span className='sm:hidden'>Dashboard</span>
            <FaArrowRight className='w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0' />
          </button>
        </Link>
      </div>
    )
  }

  // Hide login/signup buttons on apply page when not logged in
  if (isApplyPage) {
    return null
  }

  return (
    <div className='flex items-center gap-1 sm:gap-2 mx-1 sm:mx-2'>
      <Link href='/sign-in'>
        <button className='px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-sm md:text-base'>
          Login
        </button>
      </Link>
      <Link href='/signup'>
        <button className='px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-xs sm:text-sm md:text-base'>
          Sign Up
        </button>
      </Link>
    </div>
  )
}
