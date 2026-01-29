import React, { useRef, useState, useEffect } from 'react'
import OverviewSection from './sections/OverviewSection'
import ProgramSection from './sections/ProgramSection'
import MemberSection from './sections/MemberSection'
import GoogleMap from './GoogleMap'
import GallerySection from './sections/GallerySection'
import FacilitySection from './sections/FacilitySection'
import InfoSection from './sections/InfoSection'

const CollegeOverview = ({ college }) => {
  const overviewRef = useRef(null)
  const programsRef = useRef(null)
  const membersRef = useRef(null)
  const galleryRef = useRef(null)
  const facilityRef = useRef(null)
  const infoRef = useRef(null)
  const [activeSection, setActiveSection] = useState(0)

  const validMembers = (college.collegeMembers || []).filter(
    (member) =>
      member.name?.trim() ||
      member.role?.trim() ||
      member.contact_number?.trim() ||
      member.description?.trim()
  )

  const hasAddress = !!(
    college?.collegeAddress?.country ||
    college?.collegeAddress?.state ||
    college?.collegeAddress?.city ||
    college?.collegeAddress?.street ||
    college?.collegeAddress?.postal_code
  )
  const hasContact =
    (college?.collegeContacts && college.collegeContacts.length > 0) ||
    !!college?.website_url

  const allSections = [
    {
      name: 'Overview',
      visible: !!(college?.description || college?.content),
      ref: overviewRef,
      component: <OverviewSection college={college} />
    },
    {
      name: 'Programs',
      visible: college?.collegeCourses?.length > 0,
      ref: programsRef,
      component: <ProgramSection college={college} />
    },
    {
      name: 'Facility',
      visible: college?.collegeFacility?.length > 0,
      ref: facilityRef,
      component: <FacilitySection college={college} />
    },
    {
      name: 'Members',
      visible: validMembers.length > 0,
      ref: membersRef,
      component: <MemberSection validMembers={validMembers} />
    },
    {
      name: 'Gallery',
      visible: college?.collegeGallery?.length > 0,
      ref: galleryRef,
      component: <GallerySection college={college} />
    },
    {
      name: 'Contact & Address',
      visible: hasAddress || hasContact,
      ref: infoRef,
      component: <InfoSection college={college} />
    }
  ]

  const visibleSections = allSections.filter((section) => section.visible)

  const handleScroll = (index) => {
    const target = visibleSections[index].ref.current
    const headerOffset = 100
    const elementPosition = target.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset

    setActiveSection(index)
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 120

      for (let i = visibleSections.length - 1; i >= 0; i--) {
        const section = visibleSections[i]
        const element = section.ref.current

        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(i)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScrollSpy)
    handleScrollSpy()

    return () => {
      window.removeEventListener('scroll', handleScrollSpy)
    }
  }, [visibleSections])

  return (
    <section className='px-4 sm:px-8 md:px-12 lg:px-24 mb-20 flex flex-col md:flex-row gap-8 lg:gap-16 w-full items-start'>
      {/* Sidebar Navigation */}
      {visibleSections.length > 0 && (
        <aside className='w-full md:w-48 lg:w-56 md:sticky md:top-32 flex-shrink-0'>
          <div className='flex items-center gap-2 mb-6 hidden md:flex'>
            <div className='w-1 h-6 bg-[#0A6FA7] rounded-full'></div>
            <p className='font-bold text-lg text-gray-900'>Contents</p>
          </div>

          <ul className='flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar pb-4 md:pb-0 border-b md:border-b-0 border-gray-100'>
            {visibleSections.map((section, index) => (
              <li
                key={index}
                onClick={() => handleScroll(index)}
                className={`text-sm lg:text-base font-bold cursor-pointer whitespace-nowrap px-4 py-2 md:px-0 md:py-2.5 transition-all relative group ${activeSection === index
                  ? 'text-[#0A6FA7]'
                  : 'text-gray-400 hover:text-gray-700'
                  }`}
              >
                {section.name}
                {activeSection === index && (
                  <span className='absolute bottom-0 left-4 right-4 h-0.5 bg-[#0A6FA7] md:hidden'></span>
                )}
                {activeSection === index && (
                  <span className='absolute left-[-12px] top-1/2 -translate-y-1/2 w-1 h-4 bg-[#0A6FA7] rounded-full hidden md:block'></span>
                )}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Main Content */}
      <div className='flex-1 w-full space-y-16 md:space-y-24'>
        {visibleSections.map((section, index) => (
          <div key={index} className='scroll-mt-32' ref={section.ref}>
            {section.component}
          </div>
        ))}
      </div>

      {/* Right Sidebar - Shortcuts/Location */}
      {(college?.google_map_url || hasAddress) && (
        <aside className='w-full md:w-64 lg:w-72 md:sticky md:top-32 flex-shrink-0 hidden xl:block'>
          <div className='bg-gray-50/30 rounded-3xl p-6 border border-gray-100/50'>
            {college?.google_map_url && (
              <div className='mb-8'>
                <p className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                  <span className='w-1 h-4 bg-[#30AD8F] rounded-full'></span>
                  Location Map
                </p>
                <div className='w-full h-44 rounded-2xl overflow-hidden border border-white bg-white'>
                  <GoogleMap mapUrl={college.google_map_url} />
                </div>
              </div>
            )}

            {hasAddress && (
              <div>
                <p className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                  <span className='w-1 h-4 bg-[#0A6FA7] rounded-full'></span>
                  Office Address
                </p>
                <div className='space-y-3'>
                  <div className='bg-white/80 p-4 rounded-2xl border border-gray-100'>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1'>Street & City</p>
                    <p className='text-sm font-bold text-gray-700 leading-snug'>
                      {college?.collegeAddress?.street ? `${college.collegeAddress.street}, ` : ''}
                      {college?.collegeAddress?.city || ''}
                    </p>
                    {(college?.collegeAddress?.state || college?.collegeAddress?.country) && (
                      <p className='text-[11px] font-medium text-gray-400 mt-1'>
                        {college?.collegeAddress?.state ? `${college.collegeAddress.state}, ` : ''}
                        {college?.collegeAddress?.country || ''}
                      </p>
                    )}
                  </div>

                  {college?.collegeAddress?.postal_code && (
                    <div className='bg-white/80 p-4 rounded-2xl border border-gray-100'>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1'>Postcode</p>
                      <p className='text-sm font-bold text-gray-700'>
                        {college?.collegeAddress?.postal_code}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </section>
  )
}

export default CollegeOverview
