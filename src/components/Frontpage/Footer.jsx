'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaInstagram } from 'react-icons/fa6'
import { TiSocialLinkedinCircular } from 'react-icons/ti'
import { PiXLogoLight } from 'react-icons/pi'
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri'
import { getExams, getColleges, getBlogs } from '@/app/action.js'

const Footer = () => {
  const [openSections, setOpenSections] = useState({})
  const [sections, setSections] = useState({
    Exams: {
      header: 'Top Exams',
      list: []
    },
    Colleges: {
      header: 'Colleges',
      list: []
    },
    Resources: {
      header: 'Resources',
      list: []
    }
  })

  React.useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [examsRes, collegesRes, resourcesRes] = await Promise.all([
          getExams(5, 1),
          getColleges(null, null, 5, 1),
          getBlogs(1, '', '')
        ])

        setSections({
          Exams: {
            header: 'Top Exams',
            list: (examsRes?.items || examsRes || []).slice(0, 5).map(item => ({
              title: item.name || item.title,
              href: `/exams/${item.slugs || item.id}`
            }))
          },
          Colleges: {
            header: 'Colleges',
            list: (collegesRes?.items || collegesRes || []).slice(0, 5).map(item => ({
              title: item.name || item.title,
              href: `/college/${item.slugs || item.id}`
            }))
          },
          Resources: {
            header: 'Resources',
            list: (resourcesRes?.items || resourcesRes || []).slice(0, 5).map(item => ({
              title: item.name || item.title,
              href: `/blogs/${item.slugs || item.id}`
            }))
          }
        })
      } catch (error) {
        console.error('Error fetching footer data:', error)
      }
    }
    fetchFooterData()
  }, [])


  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className='shadow-md border-t border-gray-200'>
      <div className='hidden md:block shadow-md'>
        <header className='bg-white text-[#0870A8] shadow-md'>
          <div className='container mx-auto px-4'>
            <div>
              <nav className='flex justify-between items-center py-4'>
                <div className='flex items-center'></div>
              </nav>
            </div>
          </div>
        </header>

        <footer className='bg-white text-[#0870A8] py-10 shadow-lg'>
          <div className='container mx-auto px-4'>
            {/* <!-- Footer Content Section --> */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-10'>
              {/* <!-- Top Exams --> */}

              {Object.entries(sections).map(([key, section], index) => (
                <div key={index}>
                  <h3 className='text-xl font-semibold mb-10 text-[#0870A8]'>
                    {section.header}
                  </h3>
                  <ul className='space-y-3'>
                    {section.list.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.href || '#'}
                          className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors line-clamp-1'
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className='pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mb-10'>
              <div className='flex items-center gap-6 pr-6 border-r border-gray-300'>
                <Image
                  src={'/images/logo.png'}
                  width={200}
                  height={70}
                  alt='Mero UNI logo'
                />
                <div className='hidden md:flex items-center space-x-4'>
                  <a
                    href='https://www.facebook.com/people/MeroUni/61570894206794/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                  >
                    <FaFacebook size={28} />
                  </a>
                  <a
                    href='#'
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                  >
                    <FaInstagram size={28} />
                  </a>
                  <a
                    href='https://www.linkedin.com/company/merouni/?originalSubdomain=np'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                  >
                    <TiSocialLinkedinCircular size={30} />
                  </a>
                  <a
                    href='#'
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                  >
                    <PiXLogoLight size={28} />
                  </a>
                </div>
              </div>
              <div className='flex flex-col md:flex-row items-center gap-4 md:gap-8'>
                <div className='space-x-8'>
                  <Link
                    href={'#'}
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors font-semibold'
                  >
                    Disclaimer
                  </Link>
                  <Link
                    href={'#'}
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors font-semibold'
                  >
                    Privacy Policy
                  </Link>
                </div>
                <div className='flex flex-row items-center justify-center'>
                  <span className='font-semibold text-[#0870A8]'>
                    {' '}
                    &copy; All rights reserved 2025 - {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <>
        <div className='md:hidden flex flex-col justify-center items-center bg-white shadow-md'>
          <header className='text-[#0870A8]'>
            <div className='mx-auto px-4'>
              <nav className='py-4'></nav>
            </div>
          </header>

          <footer className='text-[#0870A8] w-full'>
            <div className='md:hidden space-y-4 w-full px-4'>
              {Object.entries(sections).map(([key, section], index) => (
                <div
                  className='border-b border-gray-300 w-full mt-10'
                  key={index}
                >
                  <details
                    className='pb-4 w-full'
                    open={openSections[index]}
                    onToggle={() => toggleSection(index)}
                  >
                    <summary className='w-full list-none flex justify-between items-center hover:cursor-pointer font-bold text-lg text-[#0870A8]'>
                      {section.header}
                      <span>
                        <button type='button' className='p-2 text-[#0870A8]'>
                          {openSections[index] ? (
                            <RiArrowDropUpLine size={32} />
                          ) : (
                            <RiArrowDropDownLine size={32} />
                          )}
                          {/* <RiArrowDropDownLine size={24} /> */}
                        </button>
                      </span>
                    </summary>
                    <ul>
                      {section.list.map((item, itemIndex) => (
                        <li key={itemIndex} className='mb-2'>
                          <Link
                            href={item.href || '#'}
                            className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}

              <div className='flex flex-col items-center'>
                <div className='mb-8 flex flex-col items-center gap-4 pb-6 border-b border-gray-300 w-full'>
                  <Image
                    src={'/images/logo.png'}
                    width={200}
                    height={70}
                    alt='Mero UNI logo'
                  />
                  <div className='flex items-center space-x-4'>
                    <a
                      href='https://www.facebook.com/people/MeroUni/61570894206794/'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                    >
                      <FaFacebook size={28} />
                    </a>
                    <a
                      href='/'
                      className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                    >
                      <FaInstagram size={28} />
                    </a>
                    <a
                      href='https://www.linkedin.com/company/merouni/?originalSubdomain=np'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                    >
                      <TiSocialLinkedinCircular size={30} />
                    </a>
                    <a
                      href='/'
                      className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors'
                    >
                      <PiXLogoLight size={28} />
                    </a>
                  </div>
                </div>
                <span className='font-semibold mt-4 text-[#0870A8]'>
                  {' '}
                  &copy; Merouni All rights reserved 2025 -{' '}
                  {new Date().getFullYear()}
                </span>

                <div className='space-x-8 mt-8'>
                  <Link
                    href={'/disclaimer'}
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors font-semibold'
                  >
                    Disclaimer
                  </Link>
                  <Link
                    href={'/privacy-policy'}
                    className='text-[#0870A8] hover:text-[#0A6FA7] transition-colors font-semibold'
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </>
    </div>
  )
}

export default Footer
