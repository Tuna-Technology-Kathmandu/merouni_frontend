'use client'

import React, { useRef, useState, useEffect } from 'react'
import OverviewSection from './sections/OverviewSection'
import CoursesSection from './sections/CoursesSection'
import DestinationsSection from './sections/DestinationsSection'
import VideoSection from './sections/VideoSection'
import GoogleMap from './GoogleMap'

const parseJsonField = (field) => {
  if (!field) return null
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return field
    }
  }
  return field
}

const ConsultancyOverview = ({ consultancy }) => {
  const overviewRef = useRef(null)
  const coursesRef = useRef(null)
  const destinationsRef = useRef(null)
  const videoRef = useRef(null)
  const [activeSection, setActiveSection] = useState(0)

  const address = parseJsonField(consultancy?.address) || {}
  const hasAddress = !!(
    address?.street ||
    address?.city ||
    address?.state ||
    address?.zip
  )
  const hasMap = !!consultancy?.google_map_url

  const allSections = [
    {
      name: 'Overview',
      visible: !!consultancy?.description,
      ref: overviewRef,
      component: <OverviewSection consultancy={consultancy} />
    },
    {
      name: 'Courses',
      visible: consultancy?.consultancyCourses?.length > 0,
      ref: coursesRef,
      component: <CoursesSection consultancy={consultancy} />
    },
    {
      name: 'Destinations',
      visible: (parseJsonField(consultancy?.destination) || []).length > 0,
      ref: destinationsRef,
      component: <DestinationsSection consultancy={consultancy} />
    },
    {
      name: 'Video',
      visible: !!consultancy?.video_url,
      ref: videoRef,
      component: <VideoSection consultancy={consultancy} />
    }
  ]

  const visibleSections = allSections.filter((s) => s.visible)

  const handleScroll = (index) => {
    const target = visibleSections[index]?.ref?.current
    if (!target) return
    const headerOffset = 100
    const elementPosition = target.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset
    setActiveSection(index)
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }

  useEffect(() => {
    if (visibleSections.length === 0) return
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 120
      for (let i = visibleSections.length - 1; i >= 0; i--) {
        const section = visibleSections[i]
        const el = section.ref?.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const top = rect.top + window.scrollY
          const bottom = top + rect.height
          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(i)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScrollSpy)
    handleScrollSpy()
    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [visibleSections])

  return (
    <section className='px-4 sm:px-8 md:px-12 lg:px-24 mb-20 flex flex-col md:flex-row gap-8 lg:gap-16 w-full items-start'>
      {/* Sidebar - Contents */}
      {visibleSections.length > 0 && (
        <aside className='w-full md:w-48 lg:w-56 md:sticky md:top-32 flex-shrink-0'>
          <div className='hidden md:flex items-center gap-2 mb-6'>
            <div className='w-1 h-5 bg-[#0A6FA7] rounded-full' />
            <p className='text-sm font-medium text-gray-900'>Contents</p>
          </div>
          <ul className='flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar pb-4 md:pb-0 border-b md:border-b-0 border-gray-100'>
            {visibleSections.map((section, index) => (
              <li
                key={section.name}
                onClick={() => handleScroll(index)}
                className={`text-sm font-medium cursor-pointer whitespace-nowrap px-4 py-2 md:px-0 md:py-2.5 transition-all relative group ${
                  activeSection === index
                    ? 'text-[#0A6FA7]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {section.name}
                {activeSection === index && (
                  <span className='absolute bottom-0 left-4 right-4 h-0.5 bg-[#0A6FA7] md:hidden' />
                )}
                {activeSection === index && (
                  <span className='absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-4 bg-[#0A6FA7] rounded-full hidden md:block' />
                )}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Main content */}
      <div className='flex-1 w-full space-y-16 md:space-y-24'>
        {visibleSections.map((section, index) => (
          <div key={section.name} className='scroll-mt-32' ref={section.ref}>
            {section.component}
          </div>
        ))}

        {/* Location block - visible on mobile/tablet only (below main content) */}
        {(hasMap || hasAddress) && (
          <div className='xl:hidden w-full pt-4'>
            <div className='bg-gray-50/30 rounded-3xl p-6 border border-gray-100/50'>
              {hasMap && (
                <div className='mb-6'>
                  <p className='text-sm font-medium text-gray-900 mb-4 flex items-center gap-2'>
                    <span className='w-1 h-4 bg-[#30AD8F] rounded-full' />
                    Location Map
                  </p>
                  <div className='w-full h-44 rounded-2xl overflow-hidden border border-white bg-white'>
                    <GoogleMap mapUrl={consultancy.google_map_url} />
                  </div>
                </div>
              )}
              {hasAddress && (
                <div>
                  <p className='text-sm font-medium text-gray-900 mb-4 flex items-center gap-2'>
                    <span className='w-1 h-4 bg-[#0A6FA7] rounded-full' />
                    Office Address
                  </p>
                  <div className='space-y-3'>
                    <div className='bg-white/80 p-4 rounded-2xl border border-gray-100'>
                      <p className='text-xs text-gray-500 uppercase tracking-wider font-medium mb-1'>
                        Street & City
                      </p>
                      <p className='text-sm text-gray-700 leading-snug'>
                        {[address?.street, address?.city]
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </p>
                      {(address?.state || address?.zip) && (
                        <p className='text-xs text-gray-500 mt-1'>
                          {[address?.state, address?.zip]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar - Map & Address (desktop xl only) */}
      {(hasMap || hasAddress) && (
        <aside className='w-full md:w-64 lg:w-72 md:sticky md:top-32 flex-shrink-0 hidden xl:block'>
          <div className='bg-gray-50/30 rounded-3xl p-6 border border-gray-100/50'>
            {hasMap && (
              <div className='mb-8'>
                <p className='text-sm font-medium text-gray-900 mb-4 flex items-center gap-2'>
                  <span className='w-1 h-4 bg-[#30AD8F] rounded-full' />
                  Location Map
                </p>
                <div className='w-full h-44 rounded-2xl overflow-hidden border border-white bg-white'>
                  <GoogleMap mapUrl={consultancy.google_map_url} />
                </div>
              </div>
            )}
            {hasAddress && (
              <div>
                <p className='text-sm font-medium text-gray-900 mb-4 flex items-center gap-2'>
                  <span className='w-1 h-4 bg-[#0A6FA7] rounded-full' />
                  Office Address
                </p>
                <div className='space-y-3'>
                  <div className='bg-white/80 p-4 rounded-2xl border border-gray-100'>
                    <p className='text-xs text-gray-500 uppercase tracking-wider font-medium mb-1'>
                      Street & City
                    </p>
                    <p className='text-sm text-gray-700 leading-snug'>
                      {[address?.street, address?.city]
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </p>
                    {(address?.state || address?.zip) && (
                      <p className='text-xs text-gray-500 mt-1'>
                        {[address?.state, address?.zip]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </section>
  )
}

export default ConsultancyOverview
