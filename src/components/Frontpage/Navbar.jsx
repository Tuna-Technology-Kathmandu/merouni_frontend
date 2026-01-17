'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiArrowDropDownLine } from 'react-icons/ri'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

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
        className={`bg-[#30ad8f] w-full h-12 md:h-11 lg:h-12 pt-[10px] md:pt-2 lg:pt-[10px] hidden md:block transition-all duration-300 ${
          isScrolled
            ? 'fixed top-[80px] left-0 shadow-lg z-50'
            : 'sticky top-[80px] z-30'
        }`}
      >
        <div
          className='flex items-center mx-auto justify-center gap-2 md:gap-2.5 lg:gap-4 xl:gap-6 2xl:gap-8 text-white px-2 md:px-3 lg:px-4 overflow-x-auto hide-scrollbar'
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          <Link
            href='/'
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname === '/' || pathname === ''
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/colleges')
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/degree')
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/admission')
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/scholarship')
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/consultancy')
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/materials')
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/events')
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
            className={`hover:text-gray-200 cursor-pointer transition-colors text-xs md:text-sm lg:text-base whitespace-nowrap ${
              pathname?.startsWith('/blogs')
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
          <div className='relative group'>
            <button
              type='button'
              className='flex flex-row items-center text-xs md:text-sm lg:text-base whitespace-nowrap'
            >
              <span>More</span>
              <RiArrowDropDownLine className='w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5' />
            </button>
            <div
              className='absolute z-40 hidden pt-1 bg-[#30ad8f] group-hover:block'
              style={{ minWidth: '180px' }}
            >
              <Link
                href='/exams'
                className={`block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer transition-colors ${
                  pathname?.startsWith('/exams')
                    ? 'font-semibold bg-opacity-30'
                    : ''
                }`}
                style={
                  pathname?.startsWith('/exams') ? { color: '#B5F1F8' } : {}
                }
              >
                Exams
              </Link>
              <Link
                href='/schools'
                className={`block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer transition-colors ${
                  pathname?.startsWith('/schools')
                    ? 'font-semibold bg-opacity-30'
                    : ''
                }`}
                style={
                  pathname?.startsWith('/schools') ? { color: '#B5F1F8' } : {}
                }
              >
                School
              </Link>
              <Link
                href='/universities'
                className={`block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer transition-colors ${
                  pathname?.startsWith('/universities')
                    ? 'font-semibold bg-opacity-30'
                    : ''
                }`}
                style={
                  pathname?.startsWith('/universities')
                    ? { color: '#B5F1F8' }
                    : {}
                }
              >
                Universities
              </Link>
              <Link
                href='/career'
                className={`block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer transition-colors ${
                  pathname?.startsWith('/career')
                    ? 'font-semibold bg-opacity-30'
                    : ''
                }`}
                style={
                  pathname?.startsWith('/career') ? { color: '#B5F1F8' } : {}
                }
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
                className={`block p-2 hover:text-gray-200 hover:bg-opacity-15 cursor-pointer transition-colors ${
                  pathname?.startsWith('/contact')
                    ? 'font-semibold bg-opacity-30'
                    : ''
                }`}
                style={
                  pathname?.startsWith('/contact') ? { color: '#B5F1F8' } : {}
                }
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
