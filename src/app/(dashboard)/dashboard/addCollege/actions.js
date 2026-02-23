import { authFetch } from '@/app/utils/authFetch'

export async function createCollege(data) {
  const response = await authFetch(
    `${process.env.baseUrl}/college`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  )


  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create college')
  }

  return response.json()
}

export const fetchUniversities = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/university${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchCourse = async (searchQuery = '') => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/program${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchAllCourse = async () => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/program?limit=100`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const fetchAllUniversity = async () => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/university?limit=100`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch universities')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getUniversityBySlug = async (slug) => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/university/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || 'Failed to fetch university details')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching university details:', error)
    throw error
  }
}

export const fetchAllDegrees = async () => {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}/degree?limit=1000`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch degrees')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error(error)
    throw error
  }
}
