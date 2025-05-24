import React, { useState, useEffect, useRef } from 'react'
import { FaUser } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'
import he from 'he'
import GoogleMap from './GoogleMap'
import { BsGlobe2 } from 'react-icons/bs'
import { FaUniversity, FaPhoneAlt } from 'react-icons/fa'

const CollegeOverview = ({ college }) => {
  const middleRef = useRef(null)
  const [activeOption, setActiveOption] = useState('Overview')
  const [inView, setInView] = useState(false)
  const [lastScrollTime, setLastScrollTime] = useState(0) // Track last scroll time

  const options = ['Overview', 'Programs', 'Members', 'Contact', 'Address']

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { threshold: 0.7 }
    )

    if (middleRef.current) {
      observer.observe(middleRef.current)
    }

    return () => {
      if (middleRef.current) {
        observer.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (inView && activeOption !== 'Address' && activeOption !== 'Overview') {
      document.body.style.overflow = 'hidden' // Prevent scrolling
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [inView, activeOption])

  const handleScroll = (event) => {
    if (!inView) return

    const now = Date.now()
    const SCROLL_DELAY = 500

    if (now - lastScrollTime < SCROLL_DELAY) return
    setLastScrollTime(now)

    const currentIndex = options.indexOf(activeOption)

    if (event.deltaY > 0 && currentIndex < options.length - 1) {
      setActiveOption(options[currentIndex + 1])
    } else if (event.deltaY < 0 && currentIndex > 0) {
      setActiveOption(options[currentIndex - 1])
    }
  }

  useEffect(() => {
    window.addEventListener('wheel', handleScroll)

    return () => {
      window.removeEventListener('wheel', handleScroll)
    }
  }, [inView, activeOption, lastScrollTime])

  return (
    <div className=' w-full min-[491px]:px-24 px-7 ' ref={middleRef}>
      <div
        className={`w-full mx-auto bg-white border-2 shadow-md rounded-2xl mb-10 pb-5 overflow-x-visible parent-div`}
      >
        {/* Tabs */}
        <div className='grid grid-cols-5 w-full md:w-full rounded-t-2xl bg-[#D9D9D9]'>
          {options.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveOption(tab)}
              className={`py-3 text-[9px] min-[367px]:text-xs sm:text-sm md:text-base xl:text-lg font-semibold text-center transition-all duration-300 ${
                activeOption === tab
                  ? 'text-[#30AD8F] border-b-2 border-[#30AD8F] bg-white rounded-t-2xl'
                  : 'text-gray-500 bg-[#D9D9D9] rounded-t-2xl'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeOption === 'Overview' && (
          <div className='mt-6 sm:mt-8 px-4 sm:px-8'>
            <h2 className='text-sm md:text-lg lg:text-xl font-bold'>About</h2>
            <p className='text-gray-700 mt-4 leading-7 text-xs md:text-sm lg:text-base'>
              {college.description}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: he.decode(college.content) }}
              className='text-gray-700 mt-4 leading-7 
             [&>iframe]:w-full 
             [&>iframe]:max-w-[calc(100vw-40px)] 
             [&>iframe]:aspect-video 
             [&>iframe]:h-auto
             [&>iframe]:rounded-lg 
             [&>iframe]:mt-4
             [&>iframe]:mx-auto
             [&>iframe]:block
             text-xs md:text-sm lg:text-base
             overflow-x-hidden'
            ></div>

            <h2 className=' font-bold text-sm md:text-lg lg:text-xl mt-6'>
              Institution Type
            </h2>
            <p className='text-gray-700 mt-4 text-xs md:text-sm lg:text-base'>
              {college.institute_type}
            </p>
          </div>
        )}

        {activeOption === 'Programs' && (
          <div className='mt-6 sm:mt-8 px-4 sm:px-8'>
            <h2 className='text-[13px] md:text-[15px] lg:text-[17px] font-bold '>
              {/* OFFERED PROGRAMS - {college.university.fullname} */}
              OFFERED PROGRAMS
            </h2>
            {college.collegeCourses.map((course, index) => (
              <div key={index} className='mt-7'>
                <h2 className='text-[13px] md:text-[15px] lg:text-[17px] mb-1 font-semibold'>
                  {course.program.title}
                </h2>
                <button
                  type='button'
                  className='bg-[#2981B2] text-[11px] md:text-[15px] lg:text-[15px] p-1 px-2 rounded-lg text-white'
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

        {activeOption === 'Members' && (
          <div className='mt-6 sm:mt-8 px-4 sm:px-8'>
            <h2 className='text-sm md:text-lg lg:text-xl font-bold'>Members</h2>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4"> */}
            <div className='grid grid-cols-1 gap-4 mt-4'>
              {college.collegeMembers.map((member, index) => (
                <div className='flex flex-row mb-8' key={index}>
                  <div className='flex flex-col'>
                    <div className='flex flex-row mb-2 gap-2 items-center'>
                      <FaUser />
                      <p className='text-xs md:text-sm lg:text-base'>
                        {member.name}
                      </p>
                    </div>
                    <div className='flex flex-row mb-2 gap-2 items-center'>
                      <img
                        src='/images/Role icon.png'
                        alt='Role Icon'
                        className='w-4'
                      />
                      <p className='text-xs md:text-sm lg:text-base'>
                        {member.role}
                      </p>
                    </div>
                    <div className='flex flex-row mb-2 gap-2 items-center'>
                      <FaUser />
                      <p className='text-xs md:text-sm lg:text-base'>
                        {member.contact_number}
                      </p>
                    </div>
                    <div className='flex flex-row mb-2 gap-2 items-center'>
                      <IoMdMail />
                      <p className='text-xs md:text-sm lg:text-base text-justify '>
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeOption === 'Contact' && (
          <div className='grid-cols-3 max-[670px]:grid-cols-2 grid gap-6 max-[395px]:gap-4 justify-content-center place-items-center mt-6 sm:mt-8 px-4 sm:px-8'>
            <div
              className='bg-[#30AD8F1A] w-[130px] h-[130px] max-[395px]:h-[100px] max-[395px]:w-[100px] hidden 
            rounded-full border-2 overflow-hidden border-[#D9D9D9] shadow-lg max-[670px]:block col-span-2'
            >
              <img
                src={college.college_logo}
                alt='College Logo'
                className='w-full h-full object-cover hover:scale-110 transition-all duration-300'
                loading='lazy'
              />
            </div>
            {/* Left: Contact Details */}
            <div
              className='p-7 max-[395px]:p-3 bg-[#30AD8F1A] h-[150px] max-[670px]:h-[130px]  max-[395px]:h-[100px]  w-full rounded-lg flex 
            hover:scale-105 transition-all duration-300 ease-in-out
            flex-col items-center justify-center shadow-lg '
            >
              <FaPhoneAlt size={25} className='max-[395px]:hidden' />
              <FaPhoneAlt size={19} className='max-[395px]:block hidden' />
              {college.collegeContacts.map((contact, index) => (
                <p
                  key={index}
                  className='mt-2 text-xs md:text-[13px] lg:text-base'
                >
                  {contact.contact_number}
                </p>
              ))}
            </div>
            <div
              className='bg-[#30AD8F1A] w-[200px] h-[200px] 
            max-[916px]:w-[150px] max-[916px]:h-[150px] 
            rounded-full border-2 overflow-hidden border-[#D9D9D9] shadow-lg max-[670px]:hidden'
            >
              <img
                src={college.college_logo}
                alt='College Logo'
                className='w-full h-full object-cover hover:scale-110 transition-all duration-300'
                loading='lazy'
              />
            </div>
            <div
              className='p-7 max-[395px]:p-3 bg-[#30AD8F1A] h-[150px] max-[670px]:h-[130px] max-[395px]:h-[100px] w-full rounded-lg 
            hover:scale-105 transition-all duration-300 ease-in-out
            flex flex-col items-center justify-center shadow-lg'
            >
              <BsGlobe2 size={25} className='max-[395px]:hidden' />
              <BsGlobe2 size={19} className='max-[395px]:block hidden' />
              <a
                href={college.website_url}
                className='underline text-blue-600 mt-2 text-xs md:text-[13px] lg:text-base '
                target='_blank'
                rel='noopener noreferrer'
              >
                {college.website_url || 'N/A'}
              </a>
            </div>
          </div>
        )}

        {activeOption === 'Address' && (
          <div className='flex flex-col items-center sm:flex-row gap-6 mt-6 sm:mt-8 px-4 sm:px-8'>
            <div className='flex flex-col w-full sm:w-1/2'>
              <h2 className='text-sm md:text-lg lg:text-xl font-bold'>
                Address
              </h2>
              <p className='text-xs md:text-sm lg:text-base'>
                {college.collegeAddress.country}
              </p>
              <p className='text-xs md:text-sm lg:text-base'>
                {college.collegeAddress.state}
              </p>
              <p className='text-xs md:text-sm lg:text-base'>
                {college.collegeAddress.city}
              </p>
            </div>
            <div className='sm:w-1/2 w-full bg-slate-200 h-[200px] rounded-lg '>
              <GoogleMap mapUrl={college.google_map_url} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollegeOverview
