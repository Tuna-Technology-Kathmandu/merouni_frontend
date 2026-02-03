'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFacebook, FaInstagram } from 'react-icons/fa6'
import { TiSocialLinkedinCircular } from 'react-icons/ti'
import { PiXLogoLight } from 'react-icons/pi'
import { ChevronDown } from 'lucide-react'

import { getExams, getColleges } from '@/app/action.js'
import { getSiteConfig } from '@/app/actions/siteConfigActions'

const Footer = () => {
  const [openSections, setOpenSections] = useState({})
  const [socialLinks, setSocialLinks] = useState({})
  const [sections, setSections] = useState({
    Exams: { header: 'Top Exams', list: [] },
    Colleges: { header: 'Colleges', list: [] },
    Resources: { header: 'Resources', list: [] }
  })

  useEffect(() => {
    const fetchFooterData = async () => {
      // 1. Fetch Exams
      try {
        const examsRes = await getExams(5, 1)
        const items = examsRes?.items || examsRes || []
        setSections(prev => ({
          ...prev,
          Exams: {
            ...prev.Exams,
            list: items.slice(0, 5).map(item => ({
              title: item.title || item.name,
              href: `/exams/${item.slugs || item.id}`
            }))
          }
        }))
      } catch (e) {
        console.error('Footer: Error fetching exams:', e)
      }

      // 2. Fetch Colleges
      try {
        const collegesRes = await getColleges(null, null, 5, 1)
        const items = collegesRes?.items || collegesRes || []
        setSections(prev => ({
          ...prev,
          Colleges: {
            ...prev.Colleges,
            list: items.slice(0, 5).map(item => ({
              title: item.name || item.title,
              href: `/colleges/${item.slugs || item.id}`
            }))
          }
        }))
      } catch (e) {
        console.error('Footer: Error fetching colleges:', e)
      }

      // 3. Fetch Resources (Materials)
      try {
        const res = await fetch(`${process.env.baseUrl}/material-category?page=1&limit=5`)
        if (res.ok) {
          const materialsRes = await res.json()
          const items = materialsRes?.items || materialsRes || []
          setSections(prev => ({
            ...prev,
            Resources: {
              ...prev.Resources,
              list: items.slice(0, 5).map(item => ({
                title: item.title || item.name,
                href: `/materials/category/${item.id}`
              }))
            }
          }))
        }
      } catch (e) {
        console.error('Footer: Error fetching materials:', e)
      }

      // 4. Fetch Social Links
      try {
        const socialRes = await getSiteConfig({ types: 'social_facebook,social_instagram,social_linkedin,social_twitter' })
        const socials = {}
        if (socialRes?.items && Array.isArray(socialRes.items)) {
          socialRes.items.forEach(item => {
            socials[item.type] = item.value
          })
          setSocialLinks(socials)
        }
      } catch (e) {
        console.error('Footer: Error fetching social links:', e)
      }
    }
    fetchFooterData()
  }, [])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const linkClass =
    'text-sm text-gray-600 hover:text-[#0A6FA7] transition-colors'
  const headingClass =
    'text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4'

  return (
    <footer className='bg-gray-50 border-t border-gray-200/80'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-12'>
        {/* Links grid - desktop */}
        <div className='hidden md:grid grid-cols-3 gap-8 lg:gap-12 pb-10 border-b border-gray-200/80'>
          {Object.entries(sections).map(([key, section]) => (
            <div key={key}>
              <h3 className={headingClass}>{section.header}</h3>
              <ul className='space-y-2.5'>
                {section.list.map((item, i) => (
                  <li key={i}>
                    <Link href={item.href || '#'} className={linkClass}>
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Links accordion - mobile */}
        <div className='md:hidden space-y-0 pb-6 border-b border-gray-200/80'>
          {Object.entries(sections).map(([key, section], index) => (
            <div
              key={key}
              className='border-b border-gray-200/80 last:border-b-0'
            >
              <button
                type='button'
                onClick={() => toggleSection(index)}
                className='w-full flex items-center justify-between py-4 text-left'
                aria-expanded={openSections[index]}
              >
                <span className={headingClass + ' mb-0'}>{section.header}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                />
              </button>
              {openSections[index] && (
                <ul className='space-y-2 pb-4'>
                  {section.list.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.href || '#'}
                        className={linkClass}
                        onClick={() => setOpenSections({})}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Bottom: logo, socials, legal, copyright */}
        <div className='pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          <div className='flex flex-col sm:flex-row items-center gap-6'>
            <Link href='/' className='shrink-0'>
              <Image
                src='/images/logo.png'
                width={140}
                height={52}
                alt='MeroUni'
                className='object-contain h-10 w-auto'
              />
            </Link>
            <div className='flex items-center gap-4'>
              {socialLinks.social_facebook && (
                <a
                  href={socialLinks.social_facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-500 hover:text-[#0A6FA7] transition-colors p-1'
                  aria-label='Facebook'
                >
                  <FaFacebook className='w-5 h-5' />
                </a>
              )}
              {socialLinks.social_instagram && (
                <a
                  href={socialLinks.social_instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-500 hover:text-[#0A6FA7] transition-colors p-1'
                  aria-label='Instagram'
                >
                  <FaInstagram className='w-5 h-5' />
                </a>
              )}
              {socialLinks.social_linkedin && (
                <a
                  href={socialLinks.social_linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-500 hover:text-[#0A6FA7] transition-colors p-1'
                  aria-label='LinkedIn'
                >
                  <TiSocialLinkedinCircular className='w-6 h-6' />
                </a>
              )}
              {socialLinks.social_twitter && (
                <a
                  href={socialLinks.social_twitter}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-500 hover:text-[#0A6FA7] transition-colors p-1'
                  aria-label='X'
                >
                  <PiXLogoLight className='w-5 h-5' />
                </a>
              )}
            </div>
          </div>
          <div className='flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500'>
            <div className='flex items-center gap-6'>
              <Link
                href='/disclaimer'
                className='hover:text-gray-900 transition-colors'
              >
                Disclaimer
              </Link>
              <Link
                href='/privacy-policy'
                className='hover:text-gray-900 transition-colors'
              >
                Privacy Policy
              </Link>
            </div>
            <span className='text-gray-400'>
              &copy; {new Date().getFullYear()} MeroUni. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}


export default Footer
