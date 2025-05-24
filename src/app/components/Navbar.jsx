'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { IoLogInOutline } from 'react-icons/io5'
import { IoLogOutOutline } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { MdLogout } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { IoMdArrowDropdown } from 'react-icons/io'

// import { cookies } from "next/headers";
// import { getAuthStatus, logout } from "../action";
// import { create } from "../action";

const Navbar = () => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false) // State to toggle menu visibility
  const [isScrolled, setIsScrolled] = useState(false) // State to track scroll position
  const [isLoggenIn, setIsLoggenIn] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 185) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // check login status
  useEffect(() => {
    const checkAuth = async () => {
      // const authStatus = await getAuthStatus();
      setIsLoggenIn(authStatus)
    }
    checkAuth()
  })

  return (
    <div
      className={`${
        isScrolled ? 'fixed top-0 w-full z-10 bg-[#0450A4]' : ' bg-[#0450A4]'
      } mx-auto text-white`}
    >
      {/* Top Navbar Container */}
      <div className='flex justify-between items-center p-4 md:hidden'>
        {/* Logo or Title */}
        <div className='text-2xl font-bold'>Menu</div>

        {/* ☰ Hamburger Menu Icon */}
        <button
          onClick={toggleMenu}
          className='text-white text-3xl focus:outline-none'
        >
          {menuOpen ? 'X' : '☰'}
        </button>
      </div>

      {/* Navigation Links */}
      <div
        className={`${
          menuOpen ? 'flex' : 'hidden'
        } flex-col gap-2 p-4 md:flex md:flex-row md:justify-center md:gap-6 md:p-2`}
      >
        {/* <Link href="/courses" className="hover:bg-[#0362C7] p-2 rounded">
          Courses
        </Link> */}
        <Link href='/colleges' className='hover:bg-[#0362C7] p-2 rounded'>
          Colleges
        </Link>
        <Link href='/degrees' className='hover:bg-[#0362C7] p-2 rounded'>
          Degrees
        </Link>
        <Link href='/exams' className='hover:bg-[#0362C7] p-2 rounded'>
          Exams
        </Link>
        <Link href='/schools' className='hover:bg-[#0362C7] p-2 rounded'>
          Schools
        </Link>
        <Link href='/admissions' className='hover:bg-[#0362C7] p-2 rounded'>
          Admissions
        </Link>
        <Link href='/news' className='hover:bg-[#0362C7] p-2 rounded'>
          News
        </Link>
        <Link href='/blogs' className='hover:bg-[#0362C7] p-2 rounded'>
          Blogs
        </Link>
        <Link href='/skills' className='hover:bg-[#0362C7] p-2 rounded'>
          Skills
        </Link>
        <Link href='/more' className='hover:bg-[#0362C7] p-2 rounded'>
          More
          <IoMdArrowDropdown />
        </Link>

        {/* <Link href="/sampadika" className="hover:bg-[#0362C7] p-2 rounded">
          Sampadika
        </Link> */}
        {/* {isLoggenIn ? (
          <div className="flex flex-row">
            <Link
              href="/account"
              className="flex items-center space-x-4 hover:bg-[#0362C7] p-2 rounded"
            >
              <CgProfile size={20} className="mr-2" />
              Profile
            </Link>
            <button
              type="button"
              className="flex items-center space-x-4 hover:bg-[#0362C7] p-2 rounded"
              onClick={async () => {
                // await logout();
                router.push("/");
              }}
            >
              <MdLogout size={20} className="mr-2" />
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-4 hover:bg-[#0362C7] p-2 rounded"
          >
            <IoLogInOutline size={20} className="" />
            Login
          </Link>
        )} */}
        {/* <Link href="/login" className="flex items-center space-x-4 hover:bg-[#0362C7] p-2 rounded">
        <IoLogInOutline size={20} className="mr-2"/>
        Login
        </Link> */}
      </div>
    </div>
  )
}

export default Navbar
