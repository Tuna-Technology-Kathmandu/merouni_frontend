import { DotenvConfig } from '../config/env.config'

export async function getCareers(page = 1) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs/?category_title=Vacancy`,
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
    // Return empty structure that matches successful response
    return { items: [] }
  }
}
