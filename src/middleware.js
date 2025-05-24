import { NextResponse } from 'next/server'
import { decodeJwt } from 'jose'
import { PERMISSIONS_VIA_ROLE } from '@/core/config/authorization.config'
import { DASHBOARD_ROUTE, FORBIDDEN, SIGN_IN } from '@/core/config/route.config'

/**
 * CHECK IF USER ROLE HAS PERMISSIONS
 * @param role
 * @param pathname
 * @returns {boolean}
 */
function hasAccess(role, pathname) {
  return Object.entries(PERMISSIONS_VIA_ROLE).some(([roleName, paths]) => {
    return role[roleName] && (paths.includes(pathname) || paths.includes('*'))
  })
}

/**
 *
 * @param request
 * @returns {Promise<NextResponse<unknown>>}
 */
export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  const redirectTo = (path) => NextResponse.redirect(new URL(path, request.url))

  // Redirect logged-in users away from /sign-in
  if (pathname === SIGN_IN && token) {
    return redirectTo(DASHBOARD_ROUTE)
  }

  // Redirect unauthenticated users trying to access /dashboard
  if (!token && pathname.startsWith(DASHBOARD_ROUTE)) {
    return redirectTo(SIGN_IN)
  }

  // Token is present, verify and check access
  if (token) {
    try {
      const user = decodeJwt(token)
      const role = user?.data?.role ? JSON.parse(user.data.role) : {}

      if (!hasAccess(role, pathname)) {
        return redirectTo(FORBIDDEN)
      }

      return NextResponse.next()
    } catch (error) {
      return redirectTo(SIGN_IN)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [`${DASHBOARD_ROUTE}/:path*`, SIGN_IN]
}
