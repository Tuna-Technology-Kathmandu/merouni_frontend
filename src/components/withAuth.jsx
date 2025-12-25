// components/withAuth.js
'use client'
import useAuthGuard from '@/hooks/useAuthGuard'

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const { isBooted } = useAuthGuard()
    return isBooted ? <Component {...props} /> : <></>
  }
}
