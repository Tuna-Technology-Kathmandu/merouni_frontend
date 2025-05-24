'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { decodeJwt } from 'jose'
import { PERMISSIONS_VIA_ROLE } from '@/core/config/authorization.config'
import { DASHBOARD_ROUTE, FORBIDDEN, SIGN_IN } from '@/core/config/route.config'

function hasAccess(role, pathname) {
  return Object.entries(PERMISSIONS_VIA_ROLE).some(([roleName, paths]) => {
    return role[roleName] && (paths.includes(pathname) || paths.includes('*'))
  })
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

  /**
   * INITIALIZATION FUNCTION
   * @returns {Promise<void>}
   */
  const init = useCallback(async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      // If unauthenticated and trying to access protected routes
      if (pathname.startsWith(DASHBOARD_ROUTE)) {
        router.replace(SIGN_IN)
      }
      return
    }

    try {
      const user = decodeJwt(token)
      const role = user?.data?.role ? JSON.parse(user.data.role) : {}

      // Redirect authenticated user away from sign-in
      console.log(pathname, 'pathname')
      if (pathname === SIGN_IN) {
        router.replace(DASHBOARD_ROUTE)
        return
      }

      if (!hasAccess(role, pathname)) {
        router.replace(FORBIDDEN)
      }
    } catch (err) {
      router.replace(SIGN_IN)
    }
  }, [pathname, router])

  useEffect(() => {
    init().finally(() => {
      setIsBooted(true)
    })
  }, [init])

  return {
    isBooted
  }
}
