export async function getAdmission(search = '', page = 1) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college/admission?q=${search}&page=${page}&limit=9`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Admission Details')
    }

    const data = await response.json()
    console.log('Admission API Response:', data)

    // Return the full response including pagination data
    return {
      items: data.items || data, // Fallback to data if items doesn't exist
      pagination: data.pagination || {
        currentPage: page,
        totalPages: Math.ceil((data.totalCount || data.length || 0) / 9),
        totalCount: data.totalCount || data.length || 0
      }
    }
  } catch (error) {
    console.error('Error fetching Admission details:', error)
    // Return empty structure on error
    return {
      items: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
      }
    }
  }
}
