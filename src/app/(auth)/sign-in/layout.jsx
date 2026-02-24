'use client'
import useAuthGuard from '@/hooks/useAuthGuard'

export default function RootLayout({ children }) {
  const { isBooted } = useAuthGuard()

  return <>{isBooted ? children : ''}</>
}