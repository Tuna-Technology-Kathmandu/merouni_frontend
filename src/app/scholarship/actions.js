// actions.js

import { DotenvConfig } from "@/config/env.config"

export const fetchScholarships = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    if (filters.q) queryParams.append('q', filters.q)
    if (filters.minAmount) queryParams.append('minAmount', filters.minAmount)
    if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount)
    if (filters.category) queryParams.append('category', filters.category)

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

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/category`)
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
