export async function getAdmission(search = '') {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college/admission?q=${search}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    console.log('RESPOnse:', response)

    if (!response.ok) {
      throw new Error('Failed to fetch Admission Details')
    }

    const data = await response.json()
    console.log('Data:', data)
    return data.items
  } catch (error) {
    console.error('Error fetching Admission details:', error)
    throw error
  }
}
