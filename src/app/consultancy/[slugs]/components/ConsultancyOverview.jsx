import React, { useRef } from 'react'
import OverviewSection from './sections/OverviewSection'
import CoursesSection from './sections/CoursesSection'
import DestinationsSection from './sections/DestinationsSection'
import VideoSection from './sections/VideoSection'
import GoogleMap from './GoogleMap'

const ConsultancyOverview = ({ consultancy }) => {
  const overviewRef = useRef(null)
  const coursesRef = useRef(null)
  const destinationsRef = useRef(null)
  const videoRef = useRef(null)

  // Parse JSON fields
  const parseJsonField = (field) => {
    if (!field) return null
    if (typeof field === 'string') {
      try {
        return JSON.parse(field)
      } catch (e) {
        return field
      }
    }
    return field
  }

  const address = parseJsonField(consultancy?.address) || {}

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

      {/* Right sidebar (location and address) */}
      <aside className='sticky top-52 h-fit self-start max-lg:hidden'>
        <div className='mt-20 max-[1144px]:w-[200px] max-[938px]:w-[150px]'>
          {consultancy?.google_map_url && (
            <>
              <p className='font-semibold text-[20px] max-md:text-center tracking-[0.01em] text-black'>
                Location
              </p>

              <div className='mt-7 w-full h-52 tw:max-[938px]:h-40'>
                <GoogleMap mapUrl={consultancy.google_map_url} />
              </div>
            </>
          )}

          {(address?.street ||
            address?.city ||
            address?.state ||
            address?.zip) && (
            <div className='mt-7 w-full h-auto'>
              <div className='text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
                <p className='text-xs md:text-sm lg:text-base font-semibold'>
                  Address
                </p>
                <div className='text-xs md:text-[12px] font-medium lg:text-[14px] mt-2 w-full'>
                  {address?.street && (
                    <span className='ml-1'>{address.street},</span>
                  )}
                  {address?.city && (
                    <span className='ml-1'>{address.city},</span>
                  )}
                  {address?.state && (
                    <span className='ml-1'>{address.state}</span>
                  )}
                  {address?.zip && (
                    <>
                      <br />
                      <span className='ml-1'>{address.zip}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {consultancy?.contact &&
            Array.isArray(consultancy.contact) &&
            consultancy.contact.length > 0 &&
            consultancy.contact.some((c) => c) && (
              <div className='mt-4 w-full h-auto'>
                <div className='text-center shadow-lg h-auto p-2 border border-gray-300 rounded-md hover:scale-105 transition-all duration-300 ease-in-out'>
                  <p className='text-xs md:text-sm lg:text-base font-semibold'>
                    Contact
                  </p>
                  <div className='text-xs md:text-[12px] font-medium lg:text-[14px] mt-2 w-full'>
                    {consultancy.contact.map(
                      (contact, i) =>
                        contact && (
                          <p key={i} className='mt-1'>
                            {contact}
                          </p>
                        )
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </aside>
    </section>
  )
}

export default ConsultancyOverview
