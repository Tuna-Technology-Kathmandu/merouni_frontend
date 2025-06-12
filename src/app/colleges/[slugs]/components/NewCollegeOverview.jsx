import React, { useRef } from 'react'
import OverviewSection from './sections/OverviewSection'
import ProgramSection from './sections/ProgramSection'
import MemberSection from './sections/MemberSection'
import GoogleMap from './GoogleMap'
import GallerySection from './sections/GallerySection'

const CollegeOverview = ({ college }) => {
  const overviewRef = useRef(null)
  const programsRef = useRef(null)
  const membersRef = useRef(null)
  const galleryRef = useRef(null)

  const validMembers = (college.collegeMembers || []).filter(
    (member) =>
      member.name?.trim() ||
      member.role?.trim() ||
      member.contact_number?.trim() ||
      member.description?.trim()
  )

  const allSections = [
    {
      name: 'Overview',
      visible: !!(
        college?.description &&
        college?.content &&
        college?.institute_type !== ''
      ),
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
    }
  ]

  const visibleSections = allSections.filter((section) => section.visible)

  const handleScroll = (index) => {
    const target = visibleSections[index].ref.current
    const headerOffset = 83
    const elementPosition = target.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  return (
    <section className='px-[75px] max-md:px-[30px] mb-20 max-md:mb-10 flex justify-between gap-16 max-md:gap-2 w-full max-md:flex-col-reverse max-md:items-between'>
      {/* Sidebar - Only shows visible sections */}
      {visibleSections.length > 0 && (
        <aside className='sticky top-52 h-fit self-start max-md:static max-md:mx-auto'>
          <div className='flex gap-1 max-md:gap-1 mt-20 max-md:mt-9'>
            <div className='w-[4px] bg-[#0A6FA7] h-auto mr-2'></div>
            <p className='font-semibold text-[20px] max-md:text-center tracking-[0.01em] text-black'>
              About
            </p>
          </div>

          <ul className='mt-7 max-md:text-center'>
            {visibleSections.map((section, index) => (
              <li
                key={index}
                onClick={() => handleScroll(index)}
                className='text-base max-[1120px]:text-sm font-medium mb-4 max-lg:mb-2 cursor-pointer hover:underline tracking-[0.01em]'
              >
                {section.name}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Content Area - Only renders visible sections */}
      <div className='flex flex-col justify-start w-2/3 max-lg:w-full gap-14 max-md:w-full mt-20'>
        {visibleSections.map((section, index) => (
          <div key={index} className='min-h-[100px] w-full' ref={section.ref}>
            {section.component}
          </div>
        ))}
      </div>

      {/* Right sidebar (location) - Unchanged */}
      <aside className='sticky top-52 h-fit self-start max-lg:hidden'>
        <div className='mt-20 max-[1144px]:w-[200px] max-[938px]:w-[150px]'>
          <p className='font-semibold text-[20px] max-md:text-center tracking-[0.01em] text-black'>
            Location
          </p>

          <div className='mt-7 w-full h-52 tw:max-[938px]:h-40'>
            <GoogleMap mapUrl={college.google_map_url} />
          </div>

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
