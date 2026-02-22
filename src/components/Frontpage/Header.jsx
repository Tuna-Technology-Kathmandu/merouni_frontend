'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { IoMenu, IoSearchOutline } from 'react-icons/io5'
import SearchBox from './SearchBox'
import Usericon from './Usericon'

const Header = () => {
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const openSearch = () => setShowSearch(true)
    window.addEventListener('openSearch', openSearch)
    return () => window.removeEventListener('openSearch', openSearch)
  }, [])

  return (
    <>
      {/* Search Box Overlay */}
      {showSearch && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-40'
            onClick={() => setShowSearch(false)}
          />

          {/* SearchBox */}
          <div className='fixed top-0 left-0 w-full z-[9999]'>
            <SearchBox onClose={() => setShowSearch(false)} />
          </div>
        </>
      )}

      {/* Main Header */}
      <div className='sticky top-0 z-50 bg-white'>
        <div className='flex justify-between items-center md:w-[85%] max-w-[1600px] md:mx-auto px-2 md:px-0'>
          {/* Desktop: logo left */}
          <Link href='/' className='flex-shrink-0 hidden md:block'>
            <div className='w-[180px] h-[80px] relative'>
              <Image
                src={'/images/logo.png'}
                alt='Mero UNI logo'
                fill
                className='object-contain'
              />
            </div>
          </Link>

          {/* Mobile: menu (left) + logo + user */}
          <button
            type='button'
            onClick={() => window.dispatchEvent(new CustomEvent('openMobileNav'))}
            className='flex md:hidden p-2 -ml-1 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'
            aria-label='Open menu'
          >
            <IoMenu size={24} />
          </button>

          <div
            className='hidden md:flex flex-1 max-w-[440px] mx-auto cursor-pointer group'
            onClick={() => setShowSearch(true)}
          >
            <div className='w-full flex items-center gap-3 px-5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-400 group-hover:bg-white group-hover:border-[#0A6FA7] group-hover:shadow-sm transition-all duration-200'>
              <IoSearchOutline size={18} className='text-gray-400 group-hover:text-[#0A6FA7] transition-colors' />
              <span className='text-sm font-medium'>Search for colleges, programs...</span>
            </div>
          </div>

          <Link href='/' className='flex md:hidden flex-1 justify-center min-w-0'>
            <div className='w-[160px] h-[72px] relative'>
              <Image
                src={'/images/logo.png'}
                alt='Mero UNI logo'
                fill
                className='object-contain'
              />
            </div>
          </Link>

          <div className='flex md:hidden w-10 shrink-0' aria-hidden />
          <Usericon />
        </div>
      </div>
    </>
  )
}

export default Header
