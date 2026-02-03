import { authFetch } from '@/app/utils/authFetch'

export const fetchFaculties = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/faculty${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
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
