import React, { useState, useEffect, useRef } from 'react'
import OverviewSection from './sections/OverviewSection'
import ProgramSection from './sections/ProgramSection'
import MemberSection from './sections/MemberSection'
import ContactSection from './sections/ContactSection'
import AddressSection from './sections/AddressSection'
import FacilitySection from './sections/FacilitySection'
import GoogleMap from './GoogleMap'
import GallerySection from './sections/GallerySection'

const sections = [
  'Overview',
  'Programs',
  'Members',
  'Facility',
  'Contact',
  'Address',
  'Gallery'
]
const CollegeOverview = ({ college }) => {
  const overviewRef = useRef(null)
  const programsRef = useRef(null)
  const membersRef = useRef(null)
  const contactRef = useRef(null)
  const addressRef = useRef(null)
  const facilityRef = useRef(null)
  const galleryRef = useRef(null)

  const sectionRefs = [
    overviewRef,
    programsRef,
    membersRef,
    facilityRef,
    contactRef,
    addressRef,
    galleryRef
  ]
  const handleScroll = (index) => {
    const target = sectionRefs[index].current
    const headerOffset = 83 // Change this based on your fixed header height
    const elementPosition = target.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  return (
    <section className='px-[75px] max-md:px-[30px] mb-20 max-md:mb-10 flex justify-between gap-16 max-md:gap-2 w-full max-md:flex-col-reverse max-md:items-between'>
      {/* Sidebar */}
      <aside className='sticky top-52 h-fit self-start max-md:static max-md:mx-auto'>
        {/* Heading */}
        <div className='flex gap-1 max-md:gap-1 mt-20 max-md:mt-9'>
          <div className='w-[4px] bg-[#0A6FA7] h-auto mr-2'></div>
          <p className='font-semibold text-[20px] max-md:text-center tracking-[0.01em] text-black'>
            About
          </p>
        </div>

        <ul className='mt-7 max-md:text-center'>
          {sections.map((item, index) => (
            <li
              key={index}
              onClick={() => handleScroll(index)}
              className='text-base max-[1120px]:text-sm  font-medium mb-4 max-lg:mb-2 cursor-pointer hover:underline tracking-[0.01em]'
            >
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {/* Content Area */}
      <div className='flex flex-col justify-start w-2/3 max-lg:w-full gap-14  max-md:w-full mt-20'>
        <div className='min-h-[200px] w-full' ref={overviewRef}>
          <OverviewSection college={college} />
        </div>
        <div className='min-h-[200px] w-full' ref={programsRef}>
          <ProgramSection college={college} />
        </div>
        <div className='min-h-[200px] w-full' ref={membersRef}>
          <MemberSection college={college} />
        </div>
        <div className='min-h-[200px] w-full' ref={facilityRef}>
          <FacilitySection college={college} />
        </div>

        <div className='min-h-[200px] w-full' ref={contactRef}>
          <ContactSection college={college} />
        </div>
        <div className='min-h-[200px] w-full' ref={addressRef}>
          <AddressSection college={college} />
        </div>
        <div className='min-h-[200px] w-full' ref={galleryRef}>
          <GallerySection college={college} />
        </div>
      </div>

      <aside className='sticky top-52 h-fit self-start max-lg:hidden'>
        {/* Heading */}
        <div className='mt-20  max-[1144px]:w-[200px] max-[938px]:w-[150px] '>
          <p className='font-semibold text-[20px] max-md:text-center tracking-[0.01em] text-black'>
            Location
          </p>

          <div className='mt-7 w-full h-52 tw:max-[938px]:h-40'>
            <GoogleMap mapUrl={college.google_map_url} />
          </div>
        </div>
      </aside>
    </section>
  )
}

export default CollegeOverview
