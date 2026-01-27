import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

export const fetchFaculties = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/faculty${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch faculties')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}
