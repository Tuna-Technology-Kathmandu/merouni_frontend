import { DotenvConfig } from "@/config/env.config"

export async function getCareers(page = 1, searchQuery = '') {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/career?page=${page}&q=${searchQuery}&limit=15`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch careers')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching careers:', error)
    throw error
  }
}

export async function getCareer(slug) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/career/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        // Optional: Add cache configuration
        cache: 'force-cache' // or 'no-store' for fresh data
      }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch career: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    // Optional: Validate response data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid career data format')
    }

    return data
  } catch (error) {
    console.error(`Error fetching career [slug: ${slug}]:`, error)

    // Re-throw with more context
    throw new Error(
      `Failed to load career: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
