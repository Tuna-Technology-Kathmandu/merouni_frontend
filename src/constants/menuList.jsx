import { FaHome } from 'react-icons/fa'

// Icons
import { HandCoins, Lightbulb, PlayCircle, Rss, SortAsc } from 'lucide-react'
import { BsCalendarEvent, BsLayers, BsNewspaper } from 'react-icons/bs'
import {
  FaBook,
  FaBriefcase,
  FaBuilding,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaHandshake,
  FaTags,
  FaUniversity,
  FaGlobe
} from 'react-icons/fa'
import { HiOutlineUsers } from 'react-icons/hi'
import { IoSchoolSharp, IoSettingsOutline } from 'react-icons/io5'
import {
  MdBackHand,
  MdCategory,
  MdEmojiEvents,
  MdOutlineDescription,
  MdPermContactCalendar,
  MdQuiz,
  MdSchool
} from 'react-icons/md'
import { VscReferences } from 'react-icons/vsc'

export const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: <FaHome className='text-xl' />,
        label: 'Home',
        href: '/dashboard',
        visible: ['admin', 'editor', 'student', 'institution', 'consultancy']
      },
      {
        icon: <FaGlobe className='text-xl' />,
        label: 'MeroUni',
        href: null,
        visible: ['admin', 'editor'],
        submenus: [
          {
            icon: <MdPermContactCalendar className='text-lg' />,
            label: 'Messages',
            href: '/dashboard/contactus',
            visible: ['admin']
          },
          {
            icon: <FaBriefcase className='text-lg' />,
            label: 'Careers',
            href: '/dashboard/career',
            visible: ['admin', 'editor']
          },
          {
            icon: <PlayCircle className='text-lg' />,
            label: 'Videos',
            href: '/dashboard/videos',
            visible: ['admin', 'editor']
          },
          {
            icon: <FaBuilding className='text-lg' />,
            label: 'Banner',
            href: '/dashboard/banner',
            visible: ['admin', 'editor']
          }
        ]
      },
      {
        icon: <VscReferences />,
        label: 'Referrals',
        href: null,
        visible: ['admin'],
        submenus: [
          {
            icon: <VscReferences />,
            label: 'College Referrals',
            href: '/dashboard/referrals',
            visible: ['admin']
          },
          {
            icon: <FaHandshake />,
            label: 'Consultancy Referrals',
            href: '/dashboard/consultancy-referrals',
            visible: ['admin']
          }
        ]
      },
      {
        icon: <HandCoins className='text-xl' />,
        label: 'Applied Scholarships',
        href: '/dashboard/applied-scholarships',
        visible: ['student']
      },
      {
        icon: <FaHandshake className='text-xl' />,
        label: 'Applied Consultancies',
        href: '/dashboard/applied-consultancies',
        visible: ['student']
      },
      {
        icon: <MdQuiz className='text-xl' />,
        label: 'Exams',
        href: '/dashboard/exams',
        visible: ['admin', 'editor']
      },
      {
        icon: <BsLayers className='text-xl' />,
        label: 'Admission',
        href: '/dashboard/admission',
        visible: ['admin', 'editor']
      },
      {
        icon: <MdSchool className='text-xl' />,
        label: 'Scholarship',
        href: '/dashboard/scholarship',
        visible: ['admin', 'editor']
      },


      {
        icon: <IoSchoolSharp className='text-xl' />,
        label: 'Colleges',
        href: null, // No direct href, has submenus
        visible: ['admin', 'editor'],
        submenus: [
          {
            icon: <IoSchoolSharp className='text-lg' />,
            label: 'Manage Colleges',
            href: '/dashboard/addCollege',
            visible: ['admin', 'editor']
          },
          {
            icon: <MdEmojiEvents className='text-lg' />,
            label: 'College Rankings',
            href: '/dashboard/college-rankings',
            visible: ['admin']
          },
          {
            icon: <SortAsc className='text-lg' />,
            label: 'College Orderings',
            href: '/dashboard/college-orderings',
            visible: ['admin', 'editor']
          }
        ]
      },
      {
        icon: <FaHandshake className='text-xl' />,
        label: 'Consultancy',
        href: '/dashboard/consultancy',
        visible: ['admin', 'editor']
      },
      {
        icon: <BsCalendarEvent className='text-xl' />,
        label: 'Events',
        href: '/dashboard/events',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaBriefcase className='text-xl' />,
        label: 'Vacancies',
        href: '/dashboard/vacancy',
        visible: ['admin', 'editor']
      },


      {
        icon: <MdOutlineDescription className='text-xl' />,
        label: 'Material',
        href: '/dashboard/material',
        visible: ['admin', 'editor']
      },
      {
        icon: <Rss className='text-xl' />,
        label: 'Blogs',
        href: '/dashboard/blogs',
        visible: ['admin', 'editor']
      },
      {
        icon: <BsNewspaper className='text-xl' />,
        label: 'News',
        href: '/dashboard/news',
        visible: ['admin', 'editor']
      },
      {
        icon: <MdBackHand />,
        label: 'Refer Student',
        href: '/dashboard/referStudent',
        visible: ['agent']
      },
      {
        icon: <HiOutlineUsers />,
        label: 'Refered Students',
        href: '/dashboard/referedStudents',
        visible: ['agent']
      },
      {
        icon: <VscReferences />,
        label: 'View Applications',
        href: '/dashboard/applications',
        visible: ['institution', 'consultancy']
      },
      {
        icon: <IoSchoolSharp className='text-xl' />,
        label: 'Edit College Info',
        href: '/dashboard/edit-college',
        visible: ['institution']
      },
      {
        icon: <FaHandshake className='text-xl' />,
        label: 'Edit Consultancy Info',
        href: '/dashboard/consultancy',
        visible: ['consultancy']
      },

      {
        icon: <HiOutlineUsers className='text-xl' />,
        label: 'Users',
        href: '/dashboard/users',
        visible: ['admin']
      },

      {
        icon: <Lightbulb className='text-xl' />,
        label: 'Skill Based Courses',
        href: '/dashboard/skills-based-courses',
        visible: ['admin', 'editor']
      }
    ]
  },
  {
    title: 'SETUP',
    items: [
      {
        icon: <MdCategory className='text-xl' />,
        label: 'Category',
        href: '/dashboard/category',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaChalkboardTeacher className='text-xl' />,
        label: 'Discipline',
        href: '/dashboard/discipline',
        visible: ['admin', 'editor']
      },
      {
        icon: <BsLayers className='text-xl' />,
        label: 'Level',
        href: '/dashboard/level',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaTags className='text-xl' />,
        label: 'Tags',
        href: '/dashboard/tag',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaBook className='text-xl' />,
        label: 'Courses',
        href: '/dashboard/courses',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaGraduationCap className='text-xl' />,
        label: 'Program',
        href: '/dashboard/program',
        visible: ['admin', 'editor']
      },
      {
        icon: <MdSchool className='text-xl' />,
        label: 'Degree',
        href: '/dashboard/degrees',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaUniversity className='text-xl' />,
        label: 'University',
        href: '/dashboard/university',
        visible: ['admin', 'editor']
      },
      // {
      //   icon: <FaChalkboardTeacher className='text-xl' />,
      //   label: 'Faculty',
      //   href: '/dashboard/faculty',
      //   visible: ['admin', 'editor']
      // },
      {
        icon: <HandCoins className='text-xl' />,
        label: 'Set Referral Point',
        href: '/dashboard/set-referral-point',
        visible: ['admin']
      },
      {
        icon: <IoSettingsOutline className='text-xl' />,
        label: 'Site Control',
        href: '/dashboard/site-control',
        visible: ['admin']
      }
    ]
  }
]
