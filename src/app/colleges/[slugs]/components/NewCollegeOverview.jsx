import React, { useRef, useState, useEffect } from 'react'
import OverviewSection from './sections/OverviewSection'
import ProgramSection from './sections/ProgramSection'
import MemberSection from './sections/MemberSection'
import GoogleMap from './GoogleMap'
import GallerySection from './sections/GallerySection'
import FacilitySection from './sections/FacilitySection'

const CollegeOverview = ({ college }) => {
  const overviewRef = useRef(null)
  const programsRef = useRef(null)
  const membersRef = useRef(null)
  const galleryRef = useRef(null)
  const facilityRef = useRef(null)
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
      visible: college?.facilities?.length > 0,
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
          <div className='hidden md:flex items-center gap-2 mb-6'>
            <div className='w-1 h-5 bg-[#0A6FA7] rounded-full' />
            <p className='text-sm font-medium text-gray-900'>Contents</p>
          </div>

          <ul className='flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar pb-4 md:pb-0 border-b md:border-b-0 border-gray-100'>
            {visibleSections.map((section, index) => (
              <li
                key={index}
                onClick={() => handleScroll(index)}
                className={`text-sm font-medium cursor-pointer whitespace-nowrap px-4 py-2 md:px-0 md:py-2.5 transition-all relative group ${
                  activeSection === index
                    ? 'text-[#0A6FA7]'
                    : 'text-gray-500 hover:text-gray-800'
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
    </section>
  )
}

export default CollegeOverview
