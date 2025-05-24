'use server'

export async function getMaterials(search = '') {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/material?search=${search}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Materials')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching news:', error)
    throw error
  }
}
