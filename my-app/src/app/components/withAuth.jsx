// components/withAuth.js
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter()
    const user = useSelector((state) => state.user)

    useEffect(() => {
      if (!user) {
        router.push('/sign-in')
      }
    }, [user])


    return <Component {...props} />
  }
}