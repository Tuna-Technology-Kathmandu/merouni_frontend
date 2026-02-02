'use client'

import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const useAdminPermission = () => {
  // Get role from Redux store
  const roleData = useSelector((state) => state.user?.data?.roles || state.user?.data?.role || '{}')

  // Parse and memoize role
  const role = useMemo(() => {
    if (typeof roleData === 'object') return roleData
    try {
      return JSON.parse(roleData)
    } catch {
      return {}
    }
  }, [roleData])

  // Boolean: is user an admin?
  const isAdmin = !!role.admin

  // Guard function: prevents action if not admin
  const requireAdmin = useCallback(
    (
      action,
      fallbackMessage = 'You do not have permission to perform this action.'
    ) => {
      if (!isAdmin) {
        toast.error(fallbackMessage)
        return
      }
      action?.()
    },
    [isAdmin]
  )

  return {
    isAdmin,
    role,
    requireAdmin
  }
}

export default useAdminPermission
