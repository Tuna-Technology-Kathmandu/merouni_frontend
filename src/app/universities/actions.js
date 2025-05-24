// services.js
export const fetchUniversities = async () => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/university`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching universities:', error)
    throw error
  }
}

export const getUniversityBySlug = async (slug) => {
  try {
    console.log('Fetching university details for slug:', slug)
    console.log(
      `${process.env.baseUrl}${process.env.version}/university/${slug}`
    )
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/university/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch university description')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching university details:', error)
    throw error
  }
}
