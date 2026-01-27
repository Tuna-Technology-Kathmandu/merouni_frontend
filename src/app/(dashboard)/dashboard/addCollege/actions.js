import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

export async function createCollege(data) {
  const response = await authFetch(
    `${DotenvConfig.NEXT_APP_API_BASE_URL}/college`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    console.log('eeeeee', error)

    throw new Error(error.message || 'Failed to create college')
  }

  return response.json()
}

export const fetchUniversities = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchCourse = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/program${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchAllCourse = async () => {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/program?limit=100`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchAllUniversity = async () => {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?limit=100`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getUniversityBySlug = async (slug) => {
  try {
    console.log('Fetching university details for slug:', slug)
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch university details')
    }
    const data = await response.json()
    console.log('University data received:', data)
    return data
  } catch (error) {
    console.error('Error fetching university details:', error)
    throw error
  }
}
