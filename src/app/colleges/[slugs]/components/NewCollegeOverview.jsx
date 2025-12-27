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
  const bronchureRef = useRef(null)
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

  const hasAddress =
    college?.collegeAddress?.country ||
    college?.collegeAddress?.state ||
    college?.collegeAddress?.city ||
    college?.collegeAddress?.street ||
    college?.collegeAddress?.postal_code
  const hasContact =
    (college?.collegeContacts && college.collegeContacts.length > 0) ||
    college?.website_url

  const allSections = [
    {
      name: 'Overview',
      visible: !!(college?.description || college?.content),
      ref: overviewRef,
      component: <OverviewSection college={college} />
    },

    {
      name: 'Programs',
      visible: college?.collegeCourses?.length !== 0,
      ref: programsRef,
      component: <ProgramSection college={college} />
    },
    {
      name: 'Facility',
      visible: college?.collegeFacility?.length !== 0,
      ref: facilityRef,
      component: <FacilitySection college={college} />
    },
    {
      name: 'Members',
      visible: validMembers.length !== 0,
      ref: membersRef,
      component: <MemberSection validMembers={validMembers} />
    },
    {
      name: 'Gallery',
      visible: college?.collegeGallery?.length !== 0,
      ref: galleryRef,
      component: <GallerySection college={college} />
    },
    {
      name: 'Contact & Address',
      visible: !!(hasAddress || hasContact),
      ref: infoRef,
      component: <InfoSection college={college} />
    }
  ]

  const visibleSections = allSections.filter((section) => section.visible)

  const handleScroll = (index) => {
    const target = visibleSections[index].ref.current
    const headerOffset = 83
    const elementPosition = target.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset

    setActiveSection(index) // Update active section when clicked
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  // Scroll spy effect to highlight active section
  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 200 // Offset for header and some padding

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
    handleScrollSpy() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScrollSpy)
    }
  }, [visibleSections])

  return (
    <section className='px-4 sm:px-6 md:px-8 lg:px-[30px] xl:px-[75px] mb-10 sm:mb-16 md:mb-20 flex justify-between gap-4 sm:gap-8 md:gap-12 lg:gap-16 w-full flex-col md:flex-row md:items-start'>
      {/* Sidebar - Only shows visible sections */}
      {visibleSections.length > 0 && (
        <aside className='h-fit self-start md:sticky md:top-52 md:-ml-4 lg:-ml-8 w-full md:w-auto'>
          <div className='flex gap-1 items-center justify-center md:justify-start mt-4 sm:mt-6 md:mt-9 lg:mt-20'>
            <div className='w-[4px] bg-[#0A6FA7] h-auto '></div>
            <p className='font-semibold text-base sm:text-lg md:text-[20px] text-center md:text-left tracking-[0.01em] text-black'>
              About
            </p>
          </div>

          <ul className='mt-4 sm:mt-6 md:mt-7 flex flex-row md:flex-col gap-3 sm:gap-4 md:gap-0 flex-wrap md:flex-nowrap justify-center md:justify-start overflow-x-auto md:overflow-x-visible pb-2 md:pb-0'>
            {visibleSections.map((section, index) => (
              <li
                key={index}
                onClick={() => handleScroll(index)}
                className={`text-xs sm:text-sm md:text-base lg:text-base font-medium mb-0 md:mb-2 lg:mb-4 cursor-pointer hover:underline tracking-[0.01em] whitespace-nowrap px-2 py-1 md:px-0 md:py-0 transition-colors ${
                  activeSection === index
                    ? 'text-[#30AD8F] font-bold'
                    : 'text-gray-700'
                }`}
              >
                {section.name}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Content Area - Only renders visible sections */}
      <div className='flex flex-col justify-start w-full md:w-2/3 gap-8 sm:gap-10 md:gap-12 lg:gap-14 mt-4 sm:mt-6 md:mt-12 lg:mt-20'>
        {visibleSections.map((section, index) => (
          <div key={index} className='min-h-[100px] w-full' ref={section.ref}>
            {section.component}
          </div>
        ))}
      </div>

      {/* Right sidebar (location) - Unchanged */}
      <aside className='sticky top-52 h-fit self-start max-lg:hidden'>
        <div className='mt-20 max-[1144px]:w-[200px] max-[938px]:w-[150px]'>
          {college?.google_map_url && (
            <>
              <p className='font-semibold text-[20px] max-md:text-center tracking-[0.01em] text-black'>
                Location
              </p>

              <div className='mt-7 w-full h-52 tw:max-[938px]:h-40'>
                <GoogleMap mapUrl={college.google_map_url} />
              </div>
            </>
          )}

          <div className='mt-7 w-full h-52 tw:max-[938px]:h-40'>
            <div className='text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
              <p className='text-xs md:text-sm lg:text-base font-semibold'>
                Address
              </p>
              <div className='text-xs md:text-[12px] font-medium lg:text-[14px] mt-2 w-full'>
                {/* <span>{college?.collegeAddress?.country || ''},</span> */}
                <span className='ml-1'>
                  {college?.collegeAddress?.state || ''},
                </span>
                <span className='ml-1'>
                  {college?.collegeAddress?.city || ''},
                </span>
                <br />
                <span className='ml-1'>
                  {college?.collegeAddress?.street || ''}
                </span>
              </div>
            </div>
            {college?.collegeAddress?.postal_code && (
              <div className='text-center shadow-lg h-auto p-2 mt-4 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
                <p className='text-xs md:text-sm lg:text-base font-semibold'>
                  Postcode
                </p>
                <div className='text-xs md:text-[12px] font-medium lg:text-[14px] mt-2 w-full'>
                  <span>{college?.collegeAddress?.postal_code}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </section>
  )
}

export default CollegeOverview
