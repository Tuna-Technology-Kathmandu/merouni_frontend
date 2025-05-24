export async function getCareers(page = 1, searchQuery = '') {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/career?page=${page}&q=${searchQuery}`,
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
