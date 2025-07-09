'use client'

import { useSelector } from 'react-redux'
import { useMemo, useCallback } from 'react'
import { toast } from 'react-toastify'

const useAdminPermission = () => {
  // Get role string from Redux store
  const rawRole = useSelector((state) => state.user?.data?.role || '{}')

  // Parse and memoize role
  const role = useMemo(() => {
    try {
      return JSON.parse(rawRole)
    } catch {
      return {}
    }
  }, [rawRole])

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
