export async function getExams(page = 1, search = '') {
  try {
    const baseUrl = `${process.env.baseUrl}${process.env.version}/exam`
    const url = search
      ? `${baseUrl}?q=${encodeURIComponent(search)}&page=${page}&limit=15`
      : `${baseUrl}?page=${page}&limit=15`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch exams')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching exams:', error)
    throw error
  }
}
