'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { RiArrowDropDownLine } from 'react-icons/ri'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div
        className={`bg-[#30ad8f] w-full h-12 pt-[10px] hidden md:block transition-all duration-300 ${
          isScrolled
            ? 'fixed top-[80px] left-0 shadow-lg z-50'
            : 'sticky top-[80px] z-30'
        }`}
      >
        <div className='flex items-center mx-auto justify-center gap-8 md:gap-8 text-white'>
          {isScrolled && (
            <Link href='/' className='hover:text-gray-200 cursor-pointer'>
              Home
            </Link>
          )}

          <Link href='/colleges' className='hover:text-gray-200 cursor-pointer'>
            Colleges
          </Link>
          {/* <Link href="/courses" className="hover:text-gray-200 cursor-pointer">
            Courses
          </Link> */}
          <Link href='/degree' className='hover:text-gray-200 cursor-pointer'>
            Degrees
          </Link>
          <Link
            href='/admission'
            className='hover:text-gray-200 cursor-pointer'
          >
            Admission
          </Link>
          <Link
            href='/scholarship'
            className='hover:text-gray-200 cursor-pointer'
          >
            Scholarship
          </Link>
          <Link
            href='/consultancy'
            className='hover:text-gray-200 cursor-pointer'
          >
            Consultancy
          </Link>
          <Link
            href='/materials'
            className='hover:text-gray-200 cursor-pointer'
          >
            Materials
          </Link>
          <Link href='/events' className='hover:text-gray-200 cursor-pointer'>
            Events
          </Link>
          <Link href='/blogs' className='hover:text-gray-200 cursor-pointer'>
            Blogs
          </Link>
          <div className='relative group'>
            <button type='button' className='flex flex-row items-center'>
              <span>More</span>
              <RiArrowDropDownLine size={20} />
            </button>
            <div
              className='absolute z-40 hidden pt-1 bg-[#30ad8f] group-hover:block'
              style={{ minWidth: '180px' }}
            >
              <Link
                href='/exams'
                className='block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer'
              >
                Exams
              </Link>
              <Link
                href='/schools'
                className='block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer'
              >
                School
              </Link>
              <Link
                href='/universities'
                className='block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer'
              >
                Universities
              </Link>
              <Link
                href='/career'
                className='block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer'
              >
                Career
              </Link>
              {/* <Link
                href='/courses'
                className='block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer'
              >
               Courses
              </Link> */}
              <Link
                href='/contact'
                className='block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer'
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
