
export const fetchDegrees = async (search = '', page = 1, disciplines = []) => {
  try {
    const url = new URL(`${process.env.baseUrl}/degree`)
    if (search) url.searchParams.append('q', search)
    if (disciplines && disciplines.length > 0) {
      url.searchParams.append('discipline_id', disciplines.join(','))
    }
    url.searchParams.append('page', page)
    url.searchParams.append('limit', 15)

    const response = await fetch(url.toString())
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Failed to fetch degrees')
    return data
  } catch (error) {
    console.error('Error fetching degrees:', error)
    throw error
  }
}

export const fetchFaculties = async () => {
  try {
    const response = await fetch(`${process.env.baseUrl}/faculty`)
    if (!response.ok) throw new Error('Failed to fetch faculties')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching faculties:', error)
    return []
  }
}

export const getPrograms = async (searchQuery = '') => {
  try {
    const queryParams = new URLSearchParams()
    if (searchQuery) queryParams.append('q', searchQuery)
    const url = `${process.env.baseUrl}/program?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('Failed to fetch programs')
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching programs:', error)
    return []
  }
}

export const getDiscipline = async (searchQuery = '') => {
  try {
    const queryParams = new URLSearchParams()
    if (searchQuery) queryParams.append('q', searchQuery)
    const url = `${process.env.baseUrl}/discipline?${queryParams.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('Failed to fetch disciplines')
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching disciplines:', error)
    return []
  }
}

export const fetchLevels = async () => {
  try {
    const response = await fetch(`${process.env.baseUrl}/level`)
    if (!response.ok) throw new Error('Failed to fetch levels')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching levels:', error)
    return []
  }
}

export const getDegreeBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/degree/${encodeURIComponent(slug)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch degree')
    }
    const data = await response.json()
    return data?.item ?? data
  } catch (error) {
    console.error('Error fetching degree:', error)
    throw error
  }
}
export const getCourseBySlug = async (slug) => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/course/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch degree description')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching college details:', error)
    throw error
  }
}
