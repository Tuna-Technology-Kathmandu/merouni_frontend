'use client'

import { destr, safeDestr } from 'destr'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { decodeJwt } from 'jose'
import { PERMISSIONS_VIA_ROLE } from '@/config/authorization.config'
import { DASHBOARD_ROUTE, FORBIDDEN, SIGN_IN } from '@/config/route.config'

function hasAccess(role, pathname) {
  return Object.entries(PERMISSIONS_VIA_ROLE).some(([roleName, paths]) => {
    return role[roleName] && (paths.includes(pathname) || paths.includes('*'))
  })
}

function getFirstAllowedRoute(role) {
  // Find the first route the user has access to
  for (const [roleName, paths] of Object.entries(PERMISSIONS_VIA_ROLE)) {
    if (role[roleName] && paths.length > 0) {
      return paths[0] // Return the first allowed route
    }
  }
  return DASHBOARD_ROUTE // Fallback to dashboard
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
        console.log('Decoded user:', user)
        const role = user?.data?.role ? destr(user?.data?.role) : {}
        console.log('Parsed role:', role)


        // Check if user has access to this route
        if (!hasAccess(role, pathname)) {
          console.log('No access to route:', pathname)
          // Redirect to first allowed route for this user
          const firstAllowedRoute = getFirstAllowedRoute(role)
          router.replace(firstAllowedRoute)
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
          const role = user?.data?.role ? destr(user?.data?.role) : {}
          // Token is valid, redirect to first allowed route
          const firstAllowedRoute = getFirstAllowedRoute(role)
          router.replace(firstAllowedRoute)
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
