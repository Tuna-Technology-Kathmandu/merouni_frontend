export async function getConsultancies(page = 1, searchQuery = '') {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/consultancy?page=${page}&sort=desc&q=${searchQuery}&limit=15`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch consultancies')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching consultancies:', error)
    throw error
  }
}
