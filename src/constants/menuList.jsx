import { FaHome } from "react-icons/fa";

// Icons
import { SortAsc } from 'lucide-react';
import { BiLogOut } from 'react-icons/bi';
import { BsCalendarEvent, BsLayers, BsNewspaper } from 'react-icons/bs';
import {
  FaBook,
  FaBriefcase,
  FaBuilding,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaHandshake,
  FaRegUserCircle,
  FaTags,
  FaUniversity
} from 'react-icons/fa';
import { HiOutlineUsers } from 'react-icons/hi';
import { IoSchoolSharp } from 'react-icons/io5';
import { MdBackHand, MdCategory, MdEmojiEvents, MdOutlineDescription, MdOutlinePermMedia, MdQuiz, MdSchool } from 'react-icons/md';
import { RiSettingsLine } from 'react-icons/ri';
import { VscReferences } from 'react-icons/vsc';


export const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: <FaHome className='text-xl' />,
        label: 'Home',
        href: '/dashboard',
        visible: ['admin', 'editor', 'student', 'institution']
      },
      {
        icon: <VscReferences />,
        label: 'Referrals',
        href: '/dashboard/referrals',
        visible: ['admin', 'editor', 'student']
      },
      {
        icon: <MdQuiz className='text-xl' />,
        label: 'Exams',
        href: '/dashboard/exams',
        visible: ['admin', 'editor']
      },
      {
        icon: <MdSchool className='text-xl' />,
        label: 'Scholarship',
        href: '/dashboard/scholarship',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaBuilding className='text-xl' />,
        label: 'Banner',
        href: '/dashboard/banner',
        visible: ['admin', 'editor']
      },
      {
        icon: <FaBriefcase className='text-xl' />,
        label: 'Career',
        href: '/dashboard/career',
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
        icon: <MdOutlinePermMedia className='text-xl' />,
        label: 'Media',
        href: '/dashboard/media',
        visible: ['admin', 'editor']
      },
      {
        icon: <MdOutlineDescription className='text-xl' />,
        label: 'Material',
        href: '/dashboard/material',
        visible: ['admin', 'editor']
      },
      {
        icon: <BsNewspaper className='text-xl' />,
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
        visible: ['institution']
      },
      {
        icon: <IoSchoolSharp className='text-xl' />,
        label: 'Edit College Info',
        href: '/dashboard/edit-college',
        visible: ['institution']
      },
      {
        icon: <HiOutlineUsers className='text-xl' />,
        label: 'Users',
        href: '/dashboard/users',
        visible: ['admin']
      }
    ]
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: <RiSettingsLine className='text-xl' />,
        label: 'Setup',
        href: null, // No direct href, has submenus
        visible: ['admin', 'editor'],
        submenus: [
          {
            icon: <MdCategory className='text-lg' />,
            label: 'Category',
            href: '/dashboard/category',
            visible: ['admin', 'editor']
          },
          {
            icon: <BsLayers className='text-lg' />,
            label: 'Level',
            href: '/dashboard/level',
            visible: ['admin', 'editor']
          },
          {
            icon: <FaChalkboardTeacher className='text-lg' />,
            label: 'Faculty',
            href: '/dashboard/faculty',
            visible: ['admin', 'editor']
          },
          {
            icon: <FaTags className='text-lg' />,
            label: 'Tags',
            href: '/dashboard/tag',
            visible: ['admin', 'editor']
          },
          {
            icon: <FaBook className='text-lg' />,
            label: 'Courses',
            href: '/dashboard/courses',
            visible: ['admin', 'editor']
          },
          {
            icon: <FaGraduationCap className='text-lg' />,
            label: 'Program',
            href: '/dashboard/program',
            visible: ['admin', 'editor']
          },
          {
            icon: <FaUniversity className='text-lg' />,
            label: 'University',
            href: '/dashboard/university',
            visible: ['admin', 'editor']
          }
        ]
      },
      {
        icon: <FaRegUserCircle className='text-xl' />,
        label: 'Update Profile',
        href: '/dashboard/profile',
        visible: ['admin', 'editor', 'agent', 'student', 'institution']
      },
      {
        icon: <BiLogOut className='text-xl' />,
        label: 'Logout',
        href: '/dashboard/logout',
        visible: ['admin', 'editor', 'agent', 'student', 'institution']
      }
    ]
  }
]