'use client'

import { menuItems } from '@/constants/menuList'
import { DASHBOARD_ROUTE, SIGN_IN } from '@/config/route.config'
import { destr } from 'destr'
import { decodeJwt } from 'jose'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const isRouteAllowed = (path, roleName) => {
  // Flatten all menu items into a single list of allowed paths for the role
  const getAllowedPaths = (items) => {
    let allowed = []
    items.forEach((item) => {
      // If the item is visible to the role
      if (item.visible && item.visible.includes(roleName)) {
        if (item.href) {
          allowed.push(item.href)
        }
        // If it has submenus, check those too
        if (item.submenus && item.submenus.length > 0) {
          allowed = [...allowed, ...getAllowedPaths(item.submenus)]
        }
      }
    })
    return allowed
  }

  const allowedPaths = menuItems.reduce((acc, section) => {
    return [...acc, ...getAllowedPaths(section.items)]
  }, [])
  
  // Add common routes that might not be in the menu but should be allowed if logged in
  allowedPaths.push('/dashboard/profile') 

  // Check if the current path starts with any of the allowed paths
  // Using startsWith to handle dynamic routes or sub-routes not explicitly in menu
  return allowedPaths.some(allowedPath => 
    path === allowedPath || path.startsWith(`${allowedPath}/`)
  )
}

const getFirstAllowedRoute = (roleName) => {
  for (const section of menuItems) {
    for (const item of section.items) {
      if (item.visible && item.visible.includes(roleName)) {
        if (item.href) return item.href
        if (item.submenus && item.submenus.length > 0) {
          for (const sub of item.submenus) {
            if (sub.visible && sub.visible.includes(roleName) && sub.href) {
              return sub.href
            }
          }
        }
      }
    }
  }
  return DASHBOARD_ROUTE
}

export default function useAuthGuard() {
  /**
   * HOOKS
   */
  const router = useRouter()
  const pathname = usePathname()

  /**
   * STATE
   */
  const [isBooted, setIsBooted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /**
   * INITIALIZATION FUNCTION
   * @returns {Promise<void>}
   */
  const init = useCallback(async () => {
    // Check if trying to access dashboard routes
    const isDashboardRoute = pathname.startsWith(DASHBOARD_ROUTE)

    // Get tokens from localStorage
    const token = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refreshToken')

    // If accessing dashboard routes, require authentication
    if (isDashboardRoute) {
      // Check if tokens exist
      if (!token || !refreshToken) {
        // Clear any stale data
        localStorage.removeItem('access_token')
        localStorage.removeItem('refreshToken')
        // Redirect to sign-in immediately
        router.replace(SIGN_IN)
        setIsBooted(true)
        return
      }

      // Validate token
      try {
        const user = decodeJwt(token)
        const roleObj = user?.data?.role ? destr(user?.data?.role) : {}
        
        // Determine the primary role key (e.g., 'admin', 'student')
        // Assuming roleObj has boolean flags like { admin: true } or similar
        const userRole = Object.keys(roleObj).find(key => roleObj[key]) || 'student'

        // Check if user has access to this route
        if (!isRouteAllowed(pathname, userRole)) {
          // Redirect to first allowed route for this user
          const firstAllowed = getFirstAllowedRoute(userRole)
          router.replace(firstAllowed)
          setIsBooted(true)
          return
        }

        // User is authenticated and has access
        setIsAuthenticated(true)
        setIsBooted(true)
      } catch (err) {
        // Token is invalid or expired
        console.error('Token validation error:', err)
        // Clear invalid tokens
        localStorage.removeItem('access_token')
        localStorage.removeItem('refreshToken')
        // Redirect to sign-in
        router.replace(SIGN_IN)
        setIsBooted(true)
      }
    } else {
      // Not a dashboard route, allow access
      // If authenticated and on sign-in page, redirect to their first allowed route
      if (pathname === SIGN_IN && token && refreshToken) {
        try {
          const user = decodeJwt(token)
          const roleObj = user?.data?.role ? destr(user?.data?.role) : {}
          const userRole = Object.keys(roleObj).find(key => roleObj[key]) || 'student'

          // Token is valid, redirect to first allowed route
          const firstAllowed = getFirstAllowedRoute(userRole)
          router.replace(firstAllowed)
          setIsBooted(true)
          return
        } catch (err) {
          // Token is invalid, allow staying on sign-in page
          setIsBooted(true)
        }
      } else {
        setIsBooted(true)
      }
    }
  }, [pathname, router])

  useEffect(() => {
    init()
  }, [init])

  return {
    isBooted,
    isAuthenticated
  }
}
