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
import { Search, X } from 'lucide-react'
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
      <div className='h-screen flex text-black'>
        {/* LEFT */}
        <div
          className={`${isCollapsed
            ? 'w-[80px] md:w-[80px] lg:w-[80px] xl:w-[80px]'
            : 'w-[19%] md:w-[13%] lg:w-[22%] xl:w-[20%]'
            } flex flex-col transition-all duration-300 relative z-50 bg-white`}
        >
          {/* Sticky Header - Logo and Search Bar */}
          <div className='sticky top-0 bg-white z-10 border-b border-gray-200'>
            <div className='p-4 pb-2'>
              <div className='flex items-center justify-center'>
                <Link
                  href='/'
                  className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : 'justify-start'
                    }`}
                >
                  <Image
                    src='/images/logo.png'
                    alt='logo'
                    width={isCollapsed ? 40 : 150}
                    height={isCollapsed ? 40 : 150}
                    className='transition-all duration-300'
                  />
                </Link>
                <button
                  onClick={toggleSidebar}
                  className='absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50 z-[100] transition-all duration-300'
                  aria-label='Toggle sidebar'
                >
                  {isCollapsed ? (
                    <FaChevronRight className='w-4 h-4 text-gray-600' />
                  ) : (
                    <FaChevronLeft className='w-4 h-4 text-gray-600' />
                  )}
                </button>
              </div>
            </div>
            {/* Search Bar - Only for admin */}
            {isAdmin && !isCollapsed && (
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search menus"
                    className="
        w-full rounded-lg
        bg-gray-50
        border border-gray-200
        py-2.5 pl-10 pr-9 text-sm
        text-gray-900 placeholder-gray-400
        outline-none
        transition
        focus:bg-white
        focus:border-[#0A6FA7]
        focus:ring-1 focus:ring-[#0A6FA7]/30
      "
                  />

                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-gray-400 hover:text-gray-600
        "
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

            )}
          </div>
          {/* Scrollable Menu */}
          <div className='flex-1 overflow-y-auto sidebar-scrollbar'>
            <Menu isCollapsed={isCollapsed} searchQuery={searchQuery} />
          </div>
        </div>
        {/* RIGHT */}
        <div
          className={`${isCollapsed
            ? 'w-[calc(100%-80px)] md:w-[calc(100%-80px)] lg:w-[calc(100%-80px)] xl:w-[calc(100%-80px)]'
            : 'w-[81%] md:w-[87%] lg:w-[78%] xl:w-[80%]'
            } bg-[#F7F8FA] overflow-scroll flex flex-col transition-all duration-300`}
        >
          <AdminNavbar />
          {children}
        </div>
      </div>
    </PageHeadingProvider>
  )
}
