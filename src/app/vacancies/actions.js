
export async function getVacancies(page = 1, searchQuery = '') {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      q: searchQuery,
      limit: '15'
    })

    const response = await fetch(
      `${process.env.baseUrl}/vacancy?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch vacancies')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching vacancies:', error)
    throw error
  }
}

export async function getVacancy(slug) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/vacancy/${slug}`,
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
        `Failed to fetch vacancy: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    // Optional: Validate response data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid vacancy data format')
    }

    return data
  } catch (error) {
    console.error(`Error fetching vacancy [slug: ${slug}]:`, error)

    // Re-throw with more context
    throw new Error(
      `Failed to load vacancy: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
