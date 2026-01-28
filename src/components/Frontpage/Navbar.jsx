'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import { RiArrowDropDownLine } from 'react-icons/ri'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const moreButtonRef = useRef(null)
  const closeTimeoutRef = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    setIsMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const dropdownRef = useRef(null)

  useEffect(() => {
    const updateDropdownPosition = () => {
      if (moreButtonRef.current) {
        const rect = moreButtonRef.current.getBoundingClientRect()
        const dropdownWidth = 180
        let left = rect.left

        if (typeof window !== 'undefined' && left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 12
        }

        setDropdownPosition({
          top: rect.bottom + 4,
          left: left
        })
      }
    }

    if (isMoreOpen) {
      updateDropdownPosition()
      window.addEventListener('scroll', updateDropdownPosition, true)
      window.addEventListener('resize', updateDropdownPosition)
    }

    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true)
      window.removeEventListener('resize', updateDropdownPosition)
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [isMoreOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMoreOpen &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsMoreOpen(false)
      }
    }

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMoreOpen])

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsMoreOpen(true)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsMoreOpen(false)
    }, 200) // Small delay to allow moving to dropdown
  }

  return (
    <>
      <div
        className={`bg-[#30ad8f] w-full h-12 md:h-11 lg:h-12 pt-[10px] md:pt-2 lg:pt-[10px] hidden md:block transition-all duration-300 ${isScrolled
          ? 'fixed top-[80px] left-0 shadow-lg z-50'
          : 'sticky top-[80px] z-30'
          }`}
        style={{ overflow: 'visible' }}
      >
        <div
          className='flex items-center mx-auto justify-center gap-2 md:gap-2.5 lg:gap-4 xl:gap-6 2xl:gap-8 text-white px-2 md:px-3 lg:px-4 overflow-x-auto hide-scrollbar'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            overflowY: 'visible',
            position: 'relative',
            isolation: 'isolate'
          }}
        >
          <Link
            href='/'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname === '/' || pathname === ''
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname === '/' || pathname === ''
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Home
          </Link>

          <Link
            href='/colleges'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/colleges')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/colleges')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Colleges
          </Link>
          {/* <Link href="/courses" className="hover:text-gray-200 cursor-pointer">
            Courses
          </Link> */}
          <Link
            href='/degree'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/degree')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/degree')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Degrees
          </Link>
          <Link
            href='/admission'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/admission')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/admission')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Admission
          </Link>
          <Link
            href='/scholarship'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/scholarship')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/scholarship')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Scholarship
          </Link>
          <Link
            href='/consultancy'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/consultancy')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/consultancy')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Consultancy
          </Link>
          <Link
            href='/materials'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/materials')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/materials')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Materials
          </Link>
          <Link
            href='/events'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/events')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/events')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Events
          </Link>
          <Link
            href='/blogs'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${pathname?.startsWith('/blogs')
              ? 'font-semibold border-b-2 pb-1'
              : ''
              }`}
            style={
              pathname?.startsWith('/blogs')
                ? { color: '#B5F1F8', borderColor: '#B5F1F8' }
                : {}
            }
          >
            Blogs
          </Link>
          <div
            id='more-menu-container'
            className='relative'
            style={{ position: 'relative', zIndex: 1000 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={moreButtonRef}
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                setIsMoreOpen(!isMoreOpen)
              }}
              className='flex flex-row items-center text-xs md:text-sm lg:text-base whitespace-nowrap hover:text-gray-200 cursor-pointer transition-colors text-white'
            >
              <span>More</span>
              <RiArrowDropDownLine
                className={`w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {isMoreOpen &&
            typeof window !== 'undefined' &&
            createPortal(
              <div
                ref={dropdownRef}
                className='fixed bg-[#30ad8f] rounded-lg shadow-2xl border-2 border-teal-500 min-w-[180px] z-[10000]'
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  display: 'block',
                  visibility: 'visible',
                  opacity: 1
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className='py-1'>
                  <Link
                    href='/exams'
                    onClick={() => setIsMoreOpen(false)}
                    className={`block px-4 py-2.5 text-white hover:bg-teal-600 transition-colors ${pathname?.startsWith('/exams')
                      ? 'font-semibold bg-teal-600'
                      : ''
                      }`}
                  >
                    Exams
                  </Link>
                  <Link
                    href='/schools'
                    onClick={() => setIsMoreOpen(false)}
                    className={`block px-4 py-2.5 text-white hover:bg-teal-600 transition-colors ${pathname?.startsWith('/schools')
                      ? 'font-semibold bg-teal-600'
                      : ''
                      }`}
                  >
                    School
                  </Link>
                  <Link
                    href='/news'
                    onClick={() => setIsMoreOpen(false)}
                    className={`block px-4 py-2.5 text-white hover:bg-teal-600 transition-colors ${pathname?.startsWith('/news')
                      ? 'font-semibold bg-teal-600'
                      : ''
                      }`}
                  >
                    News
                  </Link>

                  <Link
                    href='/universities'
                    onClick={() => setIsMoreOpen(false)}
                    className={`block px-4 py-2.5 text-white hover:bg-teal-600 transition-colors ${pathname?.startsWith('/universities')
                      ? 'font-semibold bg-teal-600'
                      : ''
                      }`}
                  >
                    Universities
                  </Link>
                  <Link
                    href='/career'
                    onClick={() => setIsMoreOpen(false)}
                    className={`block px-4 py-2.5 text-white hover:bg-teal-600 transition-colors ${pathname?.startsWith('/career')
                      ? 'font-semibold bg-teal-600'
                      : ''
                      }`}
                  >
                    Career
                  </Link>
                  <Link
                    href='/contact'
                    onClick={() => setIsMoreOpen(false)}
                    className={`block px-4 py-2.5 text-white hover:bg-teal-600 transition-colors ${pathname?.startsWith('/contact')
                      ? 'font-semibold bg-teal-600'
                      : ''
                      }`}
                  >
                    Contact Us
                  </Link>
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>
    </>
  )
}

export default Navbar
