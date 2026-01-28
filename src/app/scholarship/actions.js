// actions.js

import { DotenvConfig } from "@/config/env.config"

export const fetchScholarships = async (search = '') => {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship?q=${search}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching scholarships:', error)
    throw error
  }
}
