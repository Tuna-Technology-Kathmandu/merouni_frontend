'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FiChevronRight } from 'react-icons/fi'
import { IoClose, IoMenu, IoSearchOutline } from 'react-icons/io5'
import SearchBox from './SearchBox'
import Usericon from './Usericon'

const Header = () => {
  const [showSearch, setShowSearch] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const menuItems = [
    { title: 'College', href: '/colleges' },
    { title: 'Course', href: '/course' },
    { title: 'Degree', href: '/degree' },
    { title: 'Admission', href: '/admission' },
    { title: 'Scholarship', href: '/scholarship' },
    { title: 'Events', href: '/events' },
    { title: 'Blogs', href: '/blogs' },
    { title: 'Exams', href: '/exams' },
    // {title: " Consultancy,Materials,Events,School,Videos,Universities,Career,Vacancy,Wishlist"}
    { title: 'Consultancy', href: '/events' },
    { title: 'School', href: '/schools' },
    { title: 'Universites', href: '/universities' },
    { title: 'Career', href: '/career' }
  ]

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
          <div className='fixed top-0 left-0 w-full z-50'>
            <SearchBox onClose={() => setShowSearch(false)} />
          </div>
        </>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-[80px] left-0 h-[calc(100vh-80px)] w-full bg-white shadow-lg border-t-2 transform transition-transform duration-300 ease-in-out z-50 ${showSidebar ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Close Button */}
        <div className='flex justify-between items-center px-4 py-4 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800'>Menu</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
            aria-label='Close menu'
          >
            <IoClose size={28} className='text-gray-700' />
          </button>
        </div>

        {/* Menu Items */}
        <nav className='px-4 h-[calc(100%-80px)] overflow-auto'>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className=' py-4  text-gray-700 hover:text-blue-600 border-b border-gray-200 flex flex-row justify-between'
              onClick={() => setShowSidebar(false)}
            >
              <span className='text-lg font-bold'>{item.title}</span>
              <FiChevronRight style={{ color: 'black' }} size={25} />
            </Link>
          ))}
        </nav>

        <div className='flex flex-row justify-between mt-12 ml-4 mr-4'>
          <Link href='/sign-in' className="w-full">
            <button
              type='button'
              className='w-full py-3 bg-[#0A6FA7] text-white rounded-xl font-bold hover:bg-[#085a86] transition-all shadow-md active:scale-[0.98] text-sm uppercase tracking-wide'
              onClick={() => setShowSidebar(false)}
            >
              Login
            </button>
          </Link>
        </div>
      </div>

      {/* Sidebar Backdrop */}
      {showSidebar && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Header */}
      <div className='sticky top-0 z-40 bg-white'>
        <div className='flex justify-between items-center md:w-[85%] max-w-[1600px] md:mx-auto'>
          {/* Left Logo */}
          {/* <Link href="/" className="flex-shrink-0">
          <Image
            src={"/images/logo.png"}
            width={200}
            height={200}
            alt="Mero UNI logo"
            className="hidden md:block"
          />
        </Link> */}
          <Link href='/' className='flex-shrink-0'>
            <div className='hidden md:block w-[180px] h-[80px] relative'>
              <Image
                src={'/images/logo.png'}
                alt='Mero UNI logo'
                fill
                className='object-contain'
              />
            </div>
          </Link>

          {/* Search Box for desktop */}
          <div
            className='bg-white border-2 border-[#0A6FA7] p-2 rounded-lg hidden md:block flex-1 max-w-[400px] mx-auto cursor-pointer'
            onClick={() => setShowSearch(true)}
          >
            <div className='flex items-center'>
              <IoSearchOutline />
              <div className='mx-2'>Search</div>
            </div>
          </div>

          {/*Menu Bar Mobile Show */}
          <div className='block md:hidden px-2 cursor-pointer '>
            <IoMenu onClick={() => setShowSidebar(true)} size={24} />
          </div>

          <Link href='/' className='block md:hidden'>
            <div className=' w-[180px] h-[80px] relative'>
              <Image
                src={'/images/logo.png'}
                alt='Mero UNI logo'
                fill
                className='object-contain'
              />
            </div>
          </Link>
          {/* Search Icon for mobile */}
          <div className='block md:hidden' onClick={() => setShowSearch(true)}>
            <IoSearchOutline />
          </div>

          {/* User Icon */}
          <div className=''>
            <Usericon />
         
          </div>

          {/* Mobile Menu Icon (☰) */}
          {/* <div className="block md:hidden px-2 cursor-pointer ">
          <IoMenu onClick={() => setShowSidebar(true)} size={24} />
        </div> */}
        </div>
      </div>
    </>
  )
}

export default Header
