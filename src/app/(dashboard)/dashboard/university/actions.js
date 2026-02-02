import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

export async function getUniversities(page = 1) {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university`,
      {
        cache: 'no-store'
      }
    )
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error('Failed to fetch Universities')
  }
}

export async function createUniversity(data) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    return await response.json()
  } catch (error) {
    throw new Error('Failed to create university')
  }
}

export async function updateUniversity(id, data) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?university_id=${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    )
    return await response.json()
  } catch (error) {
    throw new Error('Failed to update university')
  }
}

export async function deleteUniversity(id) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/university?university_id=${id}`,
      {
        method: 'DELETE'
      }
    )
    return await response.json()
  } catch (error) {
    throw new Error('Failed to delete university')
  }
}

//for level search
export const fetchLevel = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/level${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch level')
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
