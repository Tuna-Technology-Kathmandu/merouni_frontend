import { DotenvConfig } from '@/config/env.config'

export async function getProgramBySlug(slug) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/program/${encodeURIComponent(slug)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      if (response.status === 404) throw new Error('Program not found')
      throw new Error('Failed to fetch program')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching program:', error)
    throw error
  }
}
