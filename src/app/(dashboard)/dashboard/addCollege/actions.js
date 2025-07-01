import { authFetch } from '@/app/utils/authFetch'

export async function createCollege(data) {
  const response = await authFetch(
    `${process.env.baseUrl}${process.env.version}/college`,
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
      `${process.env.baseUrl}${process.env.version}/university${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
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
      `${process.env.baseUrl}${process.env.version}/program${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
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
      `${process.env.baseUrl}${process.env.version}/program?limit=999999`
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
      `${process.env.baseUrl}${process.env.version}/university?limit=999999`
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
