// actions.js

import { DotenvConfig } from '@/config/env.config'

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
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/category`
    )
    if (!response.ok) throw new Error('Failed to fetch categories')
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const getScholarshipBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship/detail/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch scholarship details')
    }
    const data = await response.json()
    return data.scholarship || data
  } catch (error) {
    console.error('Error fetching scholarship details:', error)
    throw error
  }
}

export const applyForScholarship = async (scholarshipId) => {
  try {
    const { authFetch } = await import('../utils/authFetch')
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/scholarship-application/apply`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ scholarshipId })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || data.error || 'Failed to apply for scholarship'
      )
    }

    return data
  } catch (error) {
    console.error('Error applying for scholarship:', error)
    throw error
  }
}
