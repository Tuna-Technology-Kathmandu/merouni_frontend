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
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    const hasUser = user !== null && user !== undefined
    setIsLoggedIn(!!(token || hasUser))
  }, [user])

  const isApplyPage = pathname?.includes('/colleges/apply') || pathname?.includes('/schools/apply')

  if (isLoggedIn) {
    return (
      <div className='flex items-center gap-2 mx-2'>
        <Link href='/dashboard'>
          <button className='group flex items-center gap-2 px-5 py-2.5 bg-[#0A6FA7] text-white rounded-xl font-bold hover:bg-[#085a86] transition-all shadow-sm hover:shadow-lg active:scale-[0.98] text-xs sm:text-sm uppercase tracking-widest border border-white/10'>
            <span>Dashboard</span>
            <FaArrowRight className='w-3 h-3 transition-transform group-hover:translate-x-1' />
          </button>
        </Link>
      </div>
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
