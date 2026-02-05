'use client'
import AdminNavbar from '../../../ui/molecules/AdminNavbar'
import Menu from '../../../ui/molecules/Menu'
import Image from 'next/image'
import Link from 'next/link'
import useAuthGuard from '@/hooks/useAuthGuard'
import { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { destr } from 'destr'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import SearchInput from '../../../ui/molecules/SearchInput'
import { PageHeadingProvider } from '@/contexts/PageHeadingContext'

export default function DashboardLayout({ children }) {
  const { isBooted, isAuthenticated } = useAuthGuard()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Get user role from Redux
  const rawRole = useSelector((state) => state.user?.data?.role)
  const role = useMemo(() => {
    const parsed = typeof rawRole === 'string' ? destr(rawRole) : rawRole || {}
    return parsed
  }, [rawRole])

  const isAdmin = !!role?.admin

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Show loading state while checking authentication
  if (!isBooted) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  // Only show dashboard content if authenticated
  if (!isAuthenticated) {
    return null // Will redirect via useAuthGuard
  }

  return (
    <PageHeadingProvider>
      <div className='min-h-screen bg-[#F7F8FA] flex text-black font-sans'>

        {/* BACKDROP for Mobile */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${!isCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsCollapsed(true)} // Close on click
        />

        {/* SIDEBAR */}
        <div
          className={`
            fixed md:sticky top-0 h-screen bg-white z-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out
            ${isCollapsed
              ? '-translate-x-full md:translate-x-0 md:w-20'
              : 'translate-x-0 md:w-64'
            }
          `}
        >
          {/* Sticky Header - Logo and Search Bar */}
          <div className='flex-shrink-0 bg-white z-10 border-b border-gray-100'>
            <div className='p-4 flex items-center justify-between h-[70px]'>
              <Link
                href='/'
                className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isCollapsed ? 'md:justify-center w-full' : 'justify-start'
                  }`}
              >
                <Image
                  src='/images/logo.png'
                  alt='logo'
                  width={isCollapsed ? 40 : 140}
                  height={isCollapsed ? 40 : 50}
                  className='object-contain transition-all duration-300'
                  priority
                />
              </Link>

              {/* Toggle Button (Desktop & Mobile Close) */}
              <button
                onClick={toggleSidebar}
                className={`
                    absolute -right-3 top-6 
                    hidden md:flex 
                    bg-white border border-gray-200 text-gray-500 hover:text-[#0A6FA7] hover:border-[#0A6FA7]
                    rounded-full p-1.5 shadow-sm z-[100] transition-all duration-200
                  `}
                aria-label='Toggle sidebar'
              >
                {isCollapsed ? (
                  <FaChevronRight className='w-3 h-3' />
                ) : (
                  <FaChevronLeft className='w-3 h-3' />
                )}
              </button>
            </div>

            {/* Search Bar - Only for admin & when Expanded */}
            {isAdmin && !isCollapsed && (
              <div className="px-4 pb-4 animate-in fade-in zoom-in duration-200">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClear={() => setSearchQuery('')}
                  placeholder='Search menus...'
                />
              </div>
            )}
          </div>

          {/* Scrollable Menu */}
          <div className='flex-1 overflow-y-auto sidebar-scrollbar custom-scrollbar'>
            <Menu isCollapsed={isCollapsed} searchQuery={searchQuery} />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className='flex-1 flex flex-col min-w-0 transition-all duration-300'>

          <AdminNavbar onMenuClick={() => setIsCollapsed(false)} />

          {/* Main Content Area */}
          <main className='flex-1 p-4 md:p-6 overflow-y-auto overflow-x-hidden'>
            {children}
          </main>
        </div>
      </div>
    </PageHeadingProvider>
  )
}
