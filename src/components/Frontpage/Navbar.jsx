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
        className={`bg-[#30ad8f] w-full h-12 pt-[10px] hidden md:block transition-all duration-300 ${
          isScrolled
            ? 'fixed top-[80px] left-0 shadow-lg z-50'
            : 'sticky top-[80px] z-30'
        }`}
      >
        <div className='flex items-center mx-auto justify-center gap-8 md:gap-8 text-white'>
          <Link
            href='/'
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
            className={`hover:text-gray-200 cursor-pointer transition-colors ${
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
