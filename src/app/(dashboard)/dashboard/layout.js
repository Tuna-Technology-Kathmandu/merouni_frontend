'use client'
import AdminNavbar from '../../../components/AdminNavbar'
import Menu from '../../../components/Menu'
import Image from 'next/image'
import Link from 'next/link'
import useAuthGuard from '@/hooks/useAuthGuard'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { PageHeadingProvider } from '@/contexts/PageHeadingContext'

export default function DashboardLayout({ children }) {
  const { isBooted, isAuthenticated } = useAuthGuard()
  const [isCollapsed, setIsCollapsed] = useState(false)

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
          className={`${
            isCollapsed
              ? 'w-[80px] md:w-[80px] lg:w-[80px] xl:w-[80px]'
              : 'w-[19%] md:w-[13%] lg:w-[22%] xl:w-[20%]'
          } p-4 overflow-y-scroll sidebar-scrollbar transition-all duration-300 relative z-50`}
        >
          <div className='flex items-center justify-center mb-4 '>
            <Link
              href='/'
              className={`flex items-center gap-2 ${
                isCollapsed ? 'justify-center' : 'justify-start'
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
          <Menu isCollapsed={isCollapsed} />
        </div>
        {/* RIGHT */}
        <div
          className={`${
            isCollapsed
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
