'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, X } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/colleges', label: 'Colleges' },
  { href: '/degree', label: 'Degrees' },
  { href: '/admission', label: 'Admission' },
  { href: '/scholarship', label: 'Scholarship' },
  { href: '/consultancy', label: 'Consultancy' },
  { href: '/materials', label: 'Materials' },
  { href: '/events', label: 'Events' },
  { href: '/blogs', label: 'Blogs' }
]

const moreLinks = [
  { href: '/exams', label: 'Exams' },
  { href: '/vacancies', label: 'Vacancies' },
  { href: '/schools', label: 'Schools' },
  { href: '/news', label: 'News' },
  { href: '/universities', label: 'Universities' },
  { href: '/career', label: 'Careers at MeroUni' },
  { href: '/watch', label: 'Videos' },
  { href: '/skill-based-courses', label: 'Skill Based Courses' },
  { href: '/contact', label: 'Contact Us' }
]

const allLinks = [...navLinks, ...moreLinks]

const NavLink = ({ href, label, isActive, mobile, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`
      relative transition-colors whitespace-nowrap
      ${mobile
        ? `block py-3.5 px-4 text-base font-medium border-b border-gray-100 last:border-0 ${
            isActive ? 'text-[#0A6FA7] bg-[#0A6FA7]/5' : 'text-gray-700 active:bg-gray-50'
          }`
        : `py-3 px-1 text-sm font-medium ${
            isActive ? 'text-[#0A6FA7]' : 'text-gray-600 hover:text-gray-900'
          }`
      }
    `}
  >
    {label}
    {!mobile && isActive && (
      <span
        className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A6FA7] rounded-full'
        aria-hidden
      />
    )}
  </Link>
)

const Navbar = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const moreButtonRef = useRef(null)
  const dropdownRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  useEffect(() => {
    setIsMoreOpen(false)
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const openMobileNav = () => setIsMobileMenuOpen(true)
    window.addEventListener('openMobileNav', openMobileNav)
    return () => window.removeEventListener('openMobileNav', openMobileNav)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 120)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!isMoreOpen || !moreButtonRef.current) return
    const updatePosition = () => {
      if (moreButtonRef.current) {
        const rect = moreButtonRef.current.getBoundingClientRect()
        const dropdownWidth = 200
        let left = rect.left
        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 16
        }
        setDropdownPosition({ top: rect.bottom + 4, left })
      }
    }
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isMoreOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMoreOpen &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsMoreOpen(false)
      }
    }
    if (isMoreOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMoreOpen])

  const handleMoreEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsMoreOpen(true)
  }

  const handleMoreLeave = () => {
    closeTimeoutRef.current = setTimeout(() => setIsMoreOpen(false), 150)
  }

  const isMoreActive = moreLinks.some(({ href }) => pathname?.startsWith(href))

  const openSearch = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openSearch'))
    }
  }

  const isActive = (href) =>
    (href === '/' && (pathname === '/' || pathname === '')) ||
    (href !== '/' && pathname?.startsWith(href))

  return (
    <>
      <nav
        className={`
          w-full bg-white border-b border-gray-200/80
          transition-all duration-300
          ${isScrolled ? 'fixed top-[80px] left-0 right-0 z-50 shadow-sm' : 'sticky top-[80px] z-30'}
        `}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6'>
          {/* Desktop: horizontal links */}
          <div className='hidden md:flex items-center justify-center gap-1 sm:gap-2 lg:gap-4 xl:gap-6 py-0'>
            {navLinks.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={isActive(href)}
                mobile={false}
              />
            ))}
            <div
              className='relative flex items-center'
              onMouseEnter={handleMoreEnter}
              onMouseLeave={handleMoreLeave}
            >
              <button
                ref={moreButtonRef}
                type='button'
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`
                  flex items-center gap-0.5 py-3 px-1 text-sm font-medium transition-colors whitespace-nowrap
                  ${isMoreActive ? 'text-[#0A6FA7]' : 'text-gray-600 hover:text-gray-900'}
                `}
                aria-expanded={isMoreOpen}
                aria-haspopup='true'
              >
                More
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Mobile: full-width search bar only (menu icon is in header) */}
          <div className='w-full md:hidden px-4 py-3'>
            <button
              type='button'
              onClick={openSearch}
              className='w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50/80 text-left text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-colors'
              aria-label='Open search'
            >
              <Search className='w-5 h-5 text-gray-400 shrink-0' />
              <span className='text-sm'>Search colleges, degrees, programs...</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div
        className={`
          fixed inset-0 z-[100] transition-opacity duration-300 md:hidden
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div
          className='absolute inset-0 bg-black/40'
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden
        />
        <div
          className={`
            absolute top-0 left-0 h-full w-full max-w-sm bg-white shadow-xl
            flex flex-col transition-transform duration-300 ease-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className='flex items-center justify-between px-4 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900'>Menu</h2>
            <button
              type='button'
              onClick={() => setIsMobileMenuOpen(false)}
              className='p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              aria-label='Close menu'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
          <nav className='flex-1 overflow-y-auto py-2'>
            {allLinks.map(({ href, label }) => (
              <NavLink
                key={href}
                href={href}
                label={label}
                isActive={isActive(href)}
                mobile
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop: More dropdown */}
      {isMoreOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            className='fixed z-[10000] min-w-[200px] rounded-xl bg-white shadow-lg border border-gray-100 py-1 hidden md:block'
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
            onMouseEnter={handleMoreEnter}
            onMouseLeave={handleMoreLeave}
          >
            {moreLinks.map(({ href, label }) => {
              const active = pathname?.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMoreOpen(false)}
                  className={`
                    block px-4 py-2.5 text-sm font-medium transition-colors
                    ${
                      active
                        ? 'text-[#0A6FA7] bg-[#0A6FA7]/5'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  {label}
                </Link>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
}

export default Navbar
