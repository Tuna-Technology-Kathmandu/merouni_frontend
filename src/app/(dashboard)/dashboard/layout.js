'use client'
import AdminNavbar from '@/app/components/AdminNavbar'
import Menu from '@/app/components/Menu'
import Image from 'next/image'
import Link from 'next/link'
import useAuthGuard from '@/core/hooks/useAuthGuard'

export default function DashboardLayout({ children }) {
  const { isBooted } = useAuthGuard()

  return (
    <>
      {isBooted ? (
        <div className='h-screen flex text-black'>
          {/* LEFT */}
          <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 overflow-y-scroll thin-scrollbar'>
            <Link
              href='/'
              className='flex items-center justify-center lg:justify-start gap-2'
            >
              <Image
                src='/images/logo.png'
                alt='logo'
                width={100}
                height={100}
              />
              <span className='hidden lg:block font-bold'>Mero UNI</span>
            </Link>
            <Menu />
          </div>
          {/* RIGHT */}
          <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col'>
            <AdminNavbar />
            {children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
