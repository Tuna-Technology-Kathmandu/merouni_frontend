'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { removeUser } from '@/app/utils/userSlice'
import { destr } from 'destr'
import ConfirmationDialog from '@/app/(dashboard)/dashboard/addCollege/ConfirmationDialog'

// Icons
import {
  FaHome,
  FaRegUserCircle,
  FaWpforms,
  FaBuilding,
  FaBriefcase,
  FaUniversity,
  FaHandshake,
  FaTags,
  FaChalkboardTeacher,
  FaBook,
  FaGraduationCap
} from 'react-icons/fa'
import { BsNewspaper, BsCalendarEvent, BsLayers, BsBook } from 'react-icons/bs'
import { HiOutlineUsers, HiOutlineAcademicCap } from 'react-icons/hi'
import { MdQuiz, MdSchool } from 'react-icons/md'
import {
  MdCategory,
  MdOutlinePermMedia,
  MdOutlineDescription,
  MdEmojiEvents,
  MdBackHand
} from 'react-icons/md'
import { IoSchoolSharp } from 'react-icons/io5'
import { RiUserSettingsLine, RiSettingsLine } from 'react-icons/ri'
import { BiLogOut } from 'react-icons/bi'
import { TbBrandGoogleAnalytics } from 'react-icons/tb'
import { VscReferences } from 'react-icons/vsc'
import { ChevronDown, ChevronRight, SortAsc } from 'lucide-react'

const menuItems = [
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
        visible: ['admin', 'editor']
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

const Menu = ({ isCollapsed = false, searchQuery = '' }) => {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  const role = useSelector((state) => {
    const roleData = state.user?.data?.role
    console.log(roleData, 'roleData')
    const parsedRole = typeof roleData === 'string' ? destr(roleData) : roleData
    if (!parsedRole || typeof parsedRole !== 'object') return {}

    return Object.entries(parsedRole).reduce((acc, [key, value]) => {
      acc[key] = value === true || value === 'true'
      return acc
    }, {})
  })

  const handleLogoutClick = (e) => {
    e.preventDefault()
    setIsLogoutDialogOpen(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLogoutDialogOpen(false)

    // Always clear local storage and redirect, even if API call fails
    const performLogout = () => {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      dispatch(removeUser())
      localStorage.removeItem('access_token')
      localStorage.removeItem('refreshToken')
      router.replace('/sign-in')
    }

    try {
      const response = await fetch(
        `${process.env.baseUrl}${process.env.version}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      )

      // Handle 400/401/403 gracefully - session might already be invalid
      if (!response.ok && ![400, 401, 403].includes(response.status)) {
        console.warn('Logout API call failed, but proceeding with logout')
      }

      // Always perform logout cleanup
      performLogout()
    } catch (error) {
      // Even if there's an error, still perform logout cleanup
      // Don't log errors for expected status codes (400, 401, 403)
      if (
        !error.message?.includes('400') &&
        !error.message?.includes('401') &&
        !error.message?.includes('403')
      ) {
        console.error('Logout error:', error)
      }
      performLogout()
    }
  }

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false)
  }

  // Check if user is admin
  const isAdmin = role.admin

  // Filter menu items based on search query
  const filterMenuItems = (items) => {
    if (!searchQuery.trim()) return items

    const query = searchQuery.toLowerCase()
    return items.filter((item) => {
      const hasAccess = item.visible.some((r) => role[r])
      if (!hasAccess) return false
      // Check main label
      if (item.label.toLowerCase().includes(query)) return true
      // Check submenu labels if they exist
      if (item.submenus) {
        return item.submenus.some((submenu) =>
          submenu.label.toLowerCase().includes(query)
        )
      }
      return false
    })
  }

  const toggleMenu = (menuLabel) => {
    setExpandedMenus((prev) => {
      // Close all other menus and toggle the clicked menu
      const newState = {}
      Object.keys(prev).forEach((key) => {
        newState[key] = false
      })
      newState[menuLabel] = !prev[menuLabel]
      return newState
    })
  }

  // Check if any submenu item is active
  const isSubmenuActive = (item) => {
    if (!item.submenus) return false
    return item.submenus.some((submenu) => {
      const hasSubmenuAccess = submenu.visible.some((r) => role[r])
      return hasSubmenuAccess && pathname === submenu.href
    })
  }

  return (
    <nav className='w-full bg-white'>
      <div className='flex flex-col px-2 py-4 space-y-6'>
        {menuItems.map((menu) => {
          const filteredItems = filterMenuItems(menu.items)

          // Don't render menu section if no items match after filtering
          if (filteredItems.length === 0) return null

          return (
            <div key={menu.title} className='flex flex-col space-y-2'>
              {!isCollapsed && (
                <h2 className='hidden lg:block text-xs font-semibold text-gray-400 px-4'>
                  {menu.title}
                </h2>
              )}
              <div className='flex flex-col space-y-1'>
                {filteredItems.map((item) => {
                  const hasAccess = item.visible.some((r) => role[r])

                  if (!hasAccess) return null

                  // Handle menu items with submenus
                  if (item.submenus && item.submenus.length > 0) {
                    // Use explicitly set state if available, otherwise default to expanded if submenu is active
                    const isExpanded =
                      expandedMenus[item.label] !== undefined
                        ? expandedMenus[item.label]
                        : isSubmenuActive(item)
                    const hasSubmenuAccess = item.submenus.some((submenu) =>
                      submenu.visible.some((r) => role[r])
                    )

                    if (!hasSubmenuAccess) return null

                    const menuItemClasses = `
                      flex items-center w-full p-2 text-gray-600 transition-colors rounded-lg
                      hover:bg-gray-100 hover:text-blue-600
                      ${isSubmenuActive(item) ? 'bg-blue-50 text-blue-600' : ''}
                      group
                      ${isCollapsed ? 'justify-center' : ''}
                      cursor-pointer
                    `

                    // Get the first accessible submenu for navigation
                    const firstSubmenu = item.submenus.find((submenu) =>
                      submenu.visible.some((r) => role[r])
                    )

                    return (
                      <div key={item.label} className='flex flex-col'>
                        <button
                          onClick={() => {
                            toggleMenu(item.label)
                            // Navigate to the first submenu if it exists
                            if (firstSubmenu?.href) {
                              router.push(firstSubmenu.href)
                            }
                          }}
                          className={menuItemClasses}
                          title={isCollapsed ? item.label : ''}
                        >
                          <span className='flex items-center justify-center w-8 h-8 text-gray-500 group-hover:text-blue-600'>
                            {item.icon}
                          </span>
                          {!isCollapsed && (
                            <>
                              <span className='hidden lg:block ml-3 text-sm font-medium flex-1 text-left'>
                                {item.label}
                              </span>
                              {isExpanded ? (
                                <ChevronDown className='w-4 h-4' />
                              ) : (
                                <ChevronRight className='w-4 h-4' />
                              )}
                            </>
                          )}
                        </button>
                        {!isCollapsed && isExpanded && (
                          <div className='ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2'>
                            {item.submenus.map((submenu) => {
                              const hasSubAccess = submenu.visible.some(
                                (r) => role[r]
                              )
                              if (!hasSubAccess) return null

                              const isSubActive = pathname === submenu.href
                              const submenuClasses = `
                                flex items-center w-full p-2 text-gray-600 transition-colors rounded-lg
                                hover:bg-gray-100 hover:text-blue-600
                                ${isSubActive ? 'bg-blue-50 text-blue-600 font-medium' : ''}
                                group
                              `

                              const handleSubmenuClick = () => {
                                // Close all expanded submenus when clicking a submenu item
                                setExpandedMenus({})
                              }

                              return (
                                <Link
                                  key={submenu.label}
                                  href={submenu.href}
                                  onClick={handleSubmenuClick}
                                  className={submenuClasses}
                                >
                                  <span className='flex items-center justify-center w-6 h-6 text-gray-400 group-hover:text-blue-600'>
                                    {submenu.icon}
                                  </span>
                                  <span className='hidden lg:block ml-3 text-sm'>
                                    {submenu.label}
                                  </span>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  }

                  // Handle regular menu items (no submenus)
                  const isActive = pathname === item.href
                  const displayLabel =
                    item.href === '/dashboard/referrals' &&
                    role.student &&
                    !role.admin &&
                    !role['admin']
                      ? 'Applied Colleges'
                      : item.label
                  const itemClasses = `
                  flex items-center w-full p-2 text-gray-600 transition-colors rounded-lg
                  hover:bg-gray-100 hover:text-blue-600
                  ${isActive ? 'bg-blue-50 text-blue-600' : ''}
                  group
                  ${isCollapsed ? 'justify-center' : ''}
                `

                  const handleRegularMenuClick = () => {
                    // Close all expanded submenus when clicking a regular menu item
                    setExpandedMenus({})
                  }

                  if (item.href === '/dashboard/logout') {
                    return (
                      <button
                        key={item.label}
                        onClick={(e) => {
                          handleRegularMenuClick()
                          handleLogoutClick(e)
                        }}
                        className={itemClasses}
                        title={isCollapsed ? item.label : ''}
                      >
                        <span className='flex items-center justify-center w-8 h-8 text-gray-500 group-hover:text-blue-600'>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className='hidden lg:block ml-3 text-sm font-medium'>
                            {item.label}
                          </span>
                        )}
                      </button>
                    )
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleRegularMenuClick}
                      className={itemClasses}
                      title={isCollapsed ? item.label : ''}
                    >
                      <span className='flex items-center justify-center w-8 h-8 text-gray-500 group-hover:text-blue-600'>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className='hidden lg:block ml-3 text-sm font-medium'>
                          {displayLabel}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <ConfirmationDialog
        open={isLogoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title='Confirm Logout'
        message='Are you sure you want to log out?'
      />
    </nav>
  )
}

export default Menu
