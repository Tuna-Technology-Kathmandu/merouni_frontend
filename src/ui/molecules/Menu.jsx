'use client'
import ConfirmationDialog from '@/ui/molecules/ConfirmationDialog'
import { removeUser } from '@/app/utils/userSlice'
import { destr } from 'destr'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { menuItems } from '@/constants/menuList'
import { ChevronDown, ChevronRight } from 'lucide-react'

// --- Helper Components ---

const MenuItem = ({ item, isCollapsed, isActive, onClick }) => {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={isCollapsed ? item.label : ''}
      className={`
        relative flex items-center w-full p-3 my-1
        rounded-xl transition-all duration-200 ease-in-out
        group overflow-hidden
        ${isActive
          ? 'bg-[#0A6FA7]/10 text-[#0A6FA7] font-semibold'
          : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A6FA7]'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <span
        className={`
        flex items-center justify-center transition-colors duration-200
        ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}
        ${isActive ? 'text-[#0A6FA7]' : 'text-gray-400 group-hover:text-[#0A6FA7]'}
      `}
      >
        {item.icon}
      </span>

      {!isCollapsed && (
        <span className='text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
          {item.label}
        </span>
      )}

      {/* Active Indicator Bar (Optional aesthetic touch) */}
      {isActive && !isCollapsed && (
        <div className='absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#0A6FA7] rounded-r-full' />
      )}
    </Link>
  )
}

const SubMenu = ({
  item,
  isCollapsed,
  isExpanded,
  isActive,
  onToggle,
  pathname,
  role
}) => {
  const router = useRouter()

  // Find first accessible submenu for quick navigation
  const firstSubmenu = item.submenus?.find((submenu) =>
    submenu.visible.some((r) => role[r])
  )

  const handleMainClick = () => {
    // For specific parent menus (Referrals, Colleges), navigate to first submenu only when expanding (not collapsing)
    const shouldAutoNavigate =
      (item.label === 'Referrals' ||
        item.label === 'Colleges' ||
        item.label === 'University' ||
        item.label === 'MeroUni') &&
      !isExpanded &&
      firstSubmenu

    // Toggle expand state
    onToggle(item.label)

    // Navigate to first submenu only when expanding (was collapsed, now expanding)
    if (shouldAutoNavigate) {
      router.push(firstSubmenu.href)
    } else if (
      isCollapsed &&
      firstSubmenu &&
      item.label !== 'Referrals' &&
      item.label !== 'Colleges' &&
      item.label !== 'University' &&
      item.label !== 'MeroUni'
    ) {
      // Preserve previous behavior for other menus when collapsed
      router.push(firstSubmenu.href)
    }
  }

  const baseClasses = `
    relative flex items-center w-full p-3 my-1
    rounded-xl transition-all duration-200 ease-in-out
    group cursor-pointer select-none
    ${isActive || isExpanded
      ? 'text-[#0A6FA7] font-semibold'
      : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A6FA7]'
    }
    ${isCollapsed ? 'justify-center' : ''}
  `

  return (
    <div className='flex flex-col'>
      <button
        onClick={handleMainClick}
        title={isCollapsed ? item.label : ''}
        className={baseClasses}
      >
        <span
          className={`
          flex items-center justify-center transition-colors duration-200
          ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'}
          ${isActive || isExpanded ? 'text-[#0A6FA7]' : 'text-gray-400 group-hover:text-[#0A6FA7]'}
        `}
        >
          {item.icon}
        </span>

        {!isCollapsed && (
          <>
            <span className='text-sm flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis'>
              {item.label}
            </span>
            {isExpanded ? (
              <ChevronDown className='w-4 h-4 opacity-70' />
            ) : (
              <ChevronRight className='w-4 h-4 opacity-50' />
            )}
          </>
        )}
      </button>

      {/* Submenu Items */}
      {!isCollapsed && isExpanded && (
        <div className='flex flex-col ml-4 pl-3 border-l-2 border-slate-100 space-y-0.5 mt-1 mb-2 animate-in slide-in-from-top-2 duration-200'>
          {item.submenus.map((submenu) => {
            if (!submenu.visible.some((r) => role[r])) return null

            const isSubActive = pathname === submenu.href

            return (
              <Link
                key={submenu.label}
                href={submenu.href}
                className={`
                  flex items-center w-full py-2 px-3 text-sm rounded-lg transition-colors
                  ${isSubActive
                    ? 'bg-[#0A6FA7]/5 text-[#0A6FA7] font-medium'
                    : 'text-gray-500 hover:text-[#0A6FA7] hover:bg-gray-50'
                  }
                `}
              >
                {/* Optional: Small dot or icon for submenu items */}
                {/* <span className={`w-1.5 h-1.5 rounded-full mr-2 ${isSubActive ? 'bg-[#0A6FA7]' : 'bg-gray-300'}`} /> */}

                <span className='truncate'>{submenu.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- Main Component ---

const Menu = ({ isCollapsed = false }) => {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  // Parse Role
  const role = useSelector((state) => {
    const roleData = state.user?.data?.role
    const parsedRole = typeof roleData === 'string' ? destr(roleData) : roleData
    if (!parsedRole || typeof parsedRole !== 'object') return {}
    return Object.entries(parsedRole).reduce((acc, [key, value]) => {
      acc[key] = value === true || value === 'true'
      return acc
    }, {})
  })

  // Filter Items Logic (Access)
  const filteredMenuItems = useMemo(() => {
    const hasAccess = (item) => item.visible.some((r) => role[r])

    return menuItems
      .map((section) => {
        // Filter items in section
        const items = section.items.filter((item) => {
          // 1. Check Access
          if (!hasAccess(item)) return false

          return true
        })

        return { ...section, items }
      })
      .filter((section) => section.items.length > 0)
  }, [role])

  // State Handlers
  const toggleMenu = (label) => {
    setExpandedMenus((prev) => {
      // Close all other menus, then toggle the clicked one
      const newState = {}
      // Close all menus first
      Object.keys(prev).forEach((key) => {
        newState[key] = false
      })
      // Toggle the clicked menu
      newState[label] = !prev[label]
      return newState
    })
  }

  const closeAllMenus = () => {
    setExpandedMenus({})
  }

  const handleLogoutClick = (e) => {
    e.preventDefault()
    setIsLogoutDialogOpen(true)
  }

  const handleLogoutConfirm = async () => {
    setIsLogoutDialogOpen(false)
    const performLogout = () => {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      dispatch(removeUser())
      localStorage.removeItem('access_token')
      localStorage.removeItem('refreshToken')
      localStorage.clear()
      window.location.href = '/sign-in'
    }

    try {
      await fetch(`${process.env.baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      performLogout()
    } catch (error) {
      console.error('Logout error:', error)
      performLogout()
    }
  }

  // --- Render ---

  return (
    <nav className='w-full px-3 py-4 space-y-6 pb-20'>
      {filteredMenuItems.map((section, idx) => (
        <div key={section.title || idx} className='space-y-1'>
          {!isCollapsed && section.title && (
            <h2 className='px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4'>
              {section.title}
            </h2>
          )}

          <div className='space-y-0.5'>
            {section.items.map((item) => {
              // 1. Logout Special Case
              if (item.href === '/dashboard/logout') {
                return (
                  <div
                    key={item.label}
                    className='mt-8 pt-4 border-t border-gray-100'
                  >
                    <MenuItem
                      item={item}
                      isCollapsed={isCollapsed}
                      isActive={false}
                      onClick={handleLogoutClick}
                    />
                  </div>
                )
              }

              // 2. Submenu Case
              if (item.submenus?.length > 0) {
                const isActive = item.submenus.some(
                  (sub) => pathname === sub.href
                )
                // Auto-expand if active or search matched
                const isExpanded =
                  expandedMenus[item.label] ?? isActive

                return (
                  <SubMenu
                    key={item.label}
                    item={item}
                    role={role}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    isExpanded={isExpanded}
                    isActive={isActive}
                    onToggle={toggleMenu}
                  />
                )
              }

              // 3. Regular Item Case
              const isActive = pathname === item.href
              // Special rename logic from original code? "Applied Colleges"
              const displayLabel =
                item.href === '/dashboard/referrals' &&
                  role.student &&
                  !role.admin
                  ? 'Applied Colleges'
                  : item.label

              return (
                <MenuItem
                  key={item.label}
                  item={{ ...item, label: displayLabel }}
                  isCollapsed={isCollapsed}
                  isActive={isActive}
                  onClick={closeAllMenus}
                />
              )
            })}
          </div>
        </div>
      ))}

      <ConfirmationDialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
        title='Confirm Logout'
        message='Are you sure you want to log out?'
      />
    </nav>
  )
}

export default Menu
