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

export async function getConsultancyBySlug(slugs) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/consultancy/${slugs}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch consultancy')
    }

    const data = await response.json()
    return data.consultancy || data
  } catch (error) {
    console.error('Error fetching consultancy:', error)
    throw error
  }
}
