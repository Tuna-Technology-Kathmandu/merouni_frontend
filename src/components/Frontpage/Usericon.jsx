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
      <div className='flex items-center gap-2 mx-2'>
        <Link href='/dashboard'>
          <button className='flex items-center gap-2 px-4 py-2 bg-[#30ad8f] text-white rounded-lg font-semibold hover:bg-[#2a9d7f] transition-colors'>
            Go to Dashboard
            <FaArrowRight className='w-4 h-4' />
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
    <div className='flex items-center gap-2 mx-2'>
      <Link href='/sign-in'>
        <button className='px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
          Login
        </button>
      </Link>
      <Link href='/signup'>
        <button className='px-4 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors'>
          Sign Up
        </button>
      </Link>
    </div>
  )
}
