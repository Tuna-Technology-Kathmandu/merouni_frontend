// actions.js

import { DotenvConfig } from "@/config/env.config"

export const fetchScholarships = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    if (filters.q) queryParams.append('q', filters.q)
    if (filters.minAmount) queryParams.append('minAmount', filters.minAmount)
    if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount)
    if (filters.activeOnly !== undefined) queryParams.append('activeOnly', filters.activeOnly)
    if (filters.applicationDeadline) queryParams.append('applicationDeadline', filters.applicationDeadline)

    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship?${queryParams.toString()}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    throw error
  }
}
