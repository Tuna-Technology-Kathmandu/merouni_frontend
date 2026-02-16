// actions.js
import { authFetch } from "../utils/authFetch"


export const fetchScholarships = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams()

    if (filters.q) queryParams.append('q', filters.q)
    if (filters.minAmount) queryParams.append('minAmount', filters.minAmount)
    if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount)
    if (filters.category) queryParams.append('category', filters.category)

    const response = await fetch(
      `${process.env.baseUrl}/scholarship?${queryParams.toString()}`
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
      `${process.env.baseUrl}/category`
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
      `${process.env.baseUrl}/scholarship/detail/${slug}`,
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

// check if already applied for scholarship
export async function checkIfScholarshipApplied(scholarshipId) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/scholarship-application/check/${scholarshipId}`,
      {
        method: 'GET',
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      return { hasApplied: false }
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error checking scholarship application status:', error)
    return { hasApplied: false }
  }
}

export const applyForScholarship = async (scholarshipId, description) => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/scholarship-application/apply`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ scholarshipId, description })
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
