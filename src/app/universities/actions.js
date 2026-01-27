// services.js
import { DotenvConfig } from '../../config/env.config'
export const fetchUniversities = async (search = '', page = 1) => {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?q=${search}&page=${page}&limit=15`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching universities:', error)
    throw error
  }
}

export const getUniversityBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch university description')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching university details:', error)
    throw error
  }
}
